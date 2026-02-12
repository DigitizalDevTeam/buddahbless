import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Package } from "lucide-react";

type OrderItem = { name: string; price: string; image: string | null; quantity: number; size: string | null };
type Order = {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/orders", { credentials: "include" })
      .then((res) => {
        if (res.status === 401) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (data.orders) setOrders(data.orders);
        else setError(data.error || "Failed to load orders.");
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load orders.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-12 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading orders…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-12 flex flex-col items-center justify-center text-center px-4">
        <p className="text-destructive mb-6">{error}</p>
        <Link href="/">
          <Button variant="outline" className="rounded-none h-12 px-8">
            BACK TO STORE
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-12">
      <div className="container-custom max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-muted-foreground hover:text-white p-0">
              <ArrowLeft className="w-6 h-6 mr-2" />
              BACK
            </Button>
          </Link>
        </div>
        <h1 className="text-4xl md:text-5xl font-black font-syne uppercase mb-10">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16 border border-white/10 bg-white/5">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg mb-6">You haven’t placed any orders yet.</p>
            <Link href="/merch">
              <Button className="bg-primary text-black hover:bg-primary/90 font-bold rounded-none h-12 px-8">
                BROWSE MERCH
              </Button>
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => {
              const totalDollars = (order.total / 100).toFixed(2);
              const date = new Date(order.created_at).toLocaleDateString(undefined, {
                dateStyle: "medium",
              });
              return (
                <li key={order.id}>
                  <Link href={`/orders/${order.id}`}>
                    <a className="block p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="font-mono text-sm text-muted-foreground">
                            #{order.id.slice(0, 8)} · {date}
                          </p>
                          <p className="font-bold text-primary mt-1">${totalDollars}</p>
                        </div>
                        <span className="text-sm uppercase tracking-wider text-muted-foreground">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </p>
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export function OrderDetail() {
  const [, params] = useRoute("/orders/:id");
  const id = params?.id;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    fetch(`/api/orders/${id}`, { credentials: "include" })
      .then((res) => {
        if (res.status === 404 || res.status === 403) throw new Error("Order not found");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (data.order) setOrder(data.order);
        else setError("Failed to load order.");
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load order.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!id) return null;
  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-12 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }
  if (error || !order) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-12 flex flex-col items-center justify-center text-center px-4">
        <p className="text-destructive mb-6">{error || "Order not found."}</p>
        <Link href="/orders">
          <Button variant="outline" className="rounded-none h-12 px-8">
            BACK TO MY ORDERS
          </Button>
        </Link>
      </div>
    );
  }

  const totalDollars = (order.total / 100).toFixed(2);

  return (
    <div className="min-h-screen bg-background pt-32 pb-12">
      <div className="container-custom max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/orders">
            <Button variant="ghost" className="text-muted-foreground hover:text-white p-0">
              <ArrowLeft className="w-6 h-6 mr-2" />
              MY ORDERS
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-black font-syne uppercase mb-6">
          Order #{order.id.slice(0, 8)}
        </h1>
        <p className="text-muted-foreground mb-8">
          {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: "long" })} ·{" "}
          {order.status}
        </p>

        <p className="text-muted-foreground mb-4">Name: {order.name}</p>
        <p className="text-muted-foreground mb-4">Email: {order.email}</p>
        <p className="text-muted-foreground mb-4">Phone: {order.phone}</p>
        <p className="text-muted-foreground mb-4">Address: {order.address} · {order.city} · {order.postalCode} · {order.country}</p>
        <div className="bg-white/5 border border-white/10 p-6 mb-8">
          <ul className="space-y-4 mb-6">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  {item.size && (
                    <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <span className="text-primary font-medium shrink-0">{item.price}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-bold text-lg border-t border-white/10 pt-4">
            <span>Total</span>
            <span>${totalDollars}</span>
          </div>
        </div>

        <Link href="/orders">
          <Button variant="outline" className="rounded-none h-12 px-8">
            BACK TO MY ORDERS
          </Button>
        </Link>
      </div>
    </div>
  );
}
