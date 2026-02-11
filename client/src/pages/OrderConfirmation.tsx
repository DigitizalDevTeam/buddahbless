import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

type OrderItem = { name: string; price: string; image: string | null; quantity: number; size: string | null };
type Order = {
  id: string;
  email: string;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
};

export default function OrderConfirmation() {
  const { clearCart } = useCart();
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const sessionId = params.get("session_id");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(!!sessionId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    fetch("/api/orders/from-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.order) setOrder(data.order);
        else setError(data.error || "Could not load order.");
      })
      .catch(() => {
        if (!cancelled) setError("Network error.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-12 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading your order…</p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-12 flex flex-col items-center justify-center text-center px-4">
        <p className="text-destructive mb-6">{error}</p>
        <Link href="/">
          <Button className="bg-primary text-black hover:bg-primary/90 font-bold rounded-none h-12 px-8">
            BACK TO STORE
          </Button>
        </Link>
      </div>
    );
  }

  const totalDollars = order ? (order.total / 100).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-background pt-32 pb-12">
      <div className="container-custom max-w-2xl">
        <div className="flex justify-center mb-8">
          <div className="rounded-full bg-primary/20 p-6">
            <CheckCircle2 className="w-20 h-20 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-black font-syne uppercase mb-2 text-center">
          Thank you for your order
        </h1>
        <p className="text-muted-foreground text-lg text-center mb-10">
          Your payment was successful. You’ll receive an email confirmation shortly.
        </p>

        {order && (
          <div className="bg-white/5 border border-white/10 p-6 mb-8">
            <p className="text-xs text-muted-foreground font-mono mb-4">
              Order #{order.id.slice(0, 8)} · {new Date(order.created_at).toLocaleDateString()}
            </p>
            <ul className="space-y-3 mb-6">
              {order.items.map((item, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-primary font-medium">{item.price}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-bold text-lg border-t border-white/10 pt-4">
              <span>Total</span>
              <span>${totalDollars}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-primary text-black hover:bg-primary/90 font-bold rounded-none h-12 px-8">
              BACK TO STORE
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/orders">
            <Button variant="outline" className="border-white/20 rounded-none h-12 px-8">
              MY ORDERS
            </Button>
          </Link>
          <Link href="/merch">
            <Button variant="outline" className="border-white/20 rounded-none h-12 px-8">
              BROWSE MORE MERCH
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
