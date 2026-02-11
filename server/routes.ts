import type { Express } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { toSafeUser } from "./auth";
import { signupSchema, loginSchema } from "@shared/schema";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // --- Auth ---
  app.get("/api/auth/me", (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ user: null });
    }
    return res.json({ user: toSafeUser(req.user as import("@shared/schema").User) });
  });

  app.post("/api/auth/signup", async (req, res, next) => {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }
    const { email, password, name } = parsed.data;
    try {
      const existing = await storage.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ error: { email: ["This email is already registered."] } });
      }
      const password_hash = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        email,
        password_hash,
        google_id: null,
        name: name ?? email.split("@")[0],
        avatar_url: null,
      });
      req.login(user, (err) => {
        if (err) return next(err);
        return res.json({ user: toSafeUser(user) });
      });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }
    passport.authenticate("local", (err: unknown, user: Express.User | false, info?: { message?: string }) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password." });
      }
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        return res.json({ user: toSafeUser(user as import("@shared/schema").User) });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy(() => {
        res.json({ ok: true });
      });
    });
  });

  app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/", session: true }),
    (req, res) => {
      res.redirect("/");
    }
  );

  // --- Orders ---
  app.post("/api/orders/from-session", async (req, res, next) => {
    const { session_id } = req.body as { session_id?: string };
    if (!session_id || !stripeSecretKey) {
      return res.status(400).json({ error: "Missing session_id or Stripe not configured." });
    }
    try {
      const stripe = new Stripe(stripeSecretKey);
      const session = await stripe.checkout.sessions.retrieve(session_id, { expand: ["line_items.data.price.product"] });
      if (session.payment_status !== "paid") {
        return res.status(400).json({ error: "Session not paid." });
      }
      const existing = await storage.getOrderBySessionId(session_id);
      if (existing) {
        return res.json({ order: existing });
      }
      const lineItems = session.line_items?.data ?? [];
      const userId = req.isAuthenticated() && req.user ? (req.user as import("@shared/schema").User).id : null;
      const email = (session.customer_email as string) || session.customer_details?.email || "guest@unknown";
      const total = session.amount_total ?? 0;
      const items = lineItems.map((li) => {
        const product = li.price?.product as Stripe.Product | undefined;
        const name = (product?.name as string) ?? li.description ?? "Item";
        const amount = (li.amount_total ?? 0) / 100;
        const price = `$${amount.toFixed(2)}`;
        const image = product?.images?.[0] ?? null;
        return { name, price, image, quantity: li.quantity ?? 1, size: null };
      });
      const order = await storage.createOrder(
        {
          user_id: userId,
          stripe_session_id: session_id,
          email,
          total,
          status: "paid",
          created_at: new Date().toISOString(),
        },
        items
      );
      return res.json({ order });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create order";
      console.error("Order from session error:", err);
      return res.status(500).json({ error: message });
    }
  });

  app.get("/api/orders", async (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: "Not authenticated." });
    }
    const userId = (req.user as import("@shared/schema").User).id;
    const orders = await storage.getOrdersByUserId(userId);
    return res.json({ orders });
  });

  app.get("/api/orders/:id", async (req, res) => {
    const { id } = req.params;
    const sessionId = (req.query.session_id as string) || undefined;
    if (!id) return res.status(400).json({ error: "Missing order id." });
    const order = sessionId
      ? await storage.getOrderBySessionId(sessionId)
      : await storage.getOrderById(id);
    if (!order) return res.status(404).json({ error: "Order not found." });
    if (req.isAuthenticated() && req.user) {
      const userId = (req.user as import("@shared/schema").User).id;
      if (order.user_id !== userId) return res.status(403).json({ error: "Forbidden." });
    } else if (order.user_id) {
      return res.status(401).json({ error: "Not authenticated." });
    }
    return res.json({ order });
  });

  // --- Stripe Checkout ---
  app.post("/api/checkout/session", async (req, res) => {
    if (!stripeSecretKey) {
      return res.status(503).json({
        error: "Checkout is not configured. Set STRIPE_SECRET_KEY.",
      });
    }

    const { items, successUrl, cancelUrl } = req.body as {
      items?: Array<{ name: string; price: string; image: string; quantity: number; size?: string }>;
      successUrl?: string;
      cancelUrl?: string;
    };

    if (!items?.length || !successUrl || !cancelUrl) {
      return res.status(400).json({
        error: "Missing required fields: items, successUrl, cancelUrl",
      });
    }

    const stripe = new Stripe(stripeSecretKey);

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
      const priceNum = parseFloat(String(item.price).replace(/[^0-9.]/g, "")) || 0;
      const unit_amount = Math.round(priceNum * 100);
      const productName = item.size ? `${item.name} (${item.size})` : item.name;
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: productName,
            images: item.image ? [item.image] : undefined,
          },
          unit_amount: unit_amount > 0 ? unit_amount : 100,
        },
        quantity: Math.max(1, Number(item.quantity) || 1),
      };
    });

    const successUrlWithSession = successUrl.includes("{CHECKOUT_SESSION_ID}")
      ? successUrl
      : successUrl + (successUrl.includes("?") ? "&" : "?") + "session_id={CHECKOUT_SESSION_ID}";

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items,
        success_url: successUrlWithSession,
        cancel_url: cancelUrl,
      });

      return res.json({ url: session.url });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Stripe error";
      console.error("Stripe checkout error:", err);
      return res.status(500).json({ error: message });
    }
  });

  return httpServer;
}
