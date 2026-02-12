import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Lock } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

export default function Checkout() {
  const { items, cartTotal } = useCart();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Customer fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !phone || !address || !city || !postalCode || !country) {
      toast.error("Please fill all fields.");
      return;
    }

    const origin = window.location.origin;
    const payload = {
      items: items.map((item) => ({
        name: item.name,
        price: item.price,
        image: item.image.startsWith("http") ? item.image : `${origin}${item.image.startsWith("/") ? "" : "/"}${item.image}`,
        quantity: item.quantity,
        size: item.size,
      })),
      successUrl: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/cart`,
      customer: { name, email, phone, address, city, postalCode, country },
    };

    setIsRedirecting(true);
    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        toast.error(data.error || "Checkout failed");
        setIsRedirecting(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      toast.error("Network error. Try again.");
      setIsRedirecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-12">
        <Link href="/cart">
          <Button variant="ghost" className="text-muted-foreground hover:text-white p-0">
            <ArrowLeft className="w-5 h-5 mr-2" />
            BACK
          </Button>
        </Link>
        <Link href="/">
          <a className="text-xl font-bold tracking-tighter font-[family-name:var(--font-syne)]">
            BUDDAH<span className="text-primary">BLESS</span>
          </a>
        </Link>
        <div className="w-16" />
      </header>

      {/* Main */}
      <div className="p-6 max-w-4xl mx-auto ">
        <h1 className="text-4xl md:text-6xl font-black font-syne uppercase my-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Customer Form */}
          <div className="lg:col-span-2 bg-card p-8 border border-white/10 rounded-md space-y-6">
            <p className="text-sm text-muted-foreground leading-relaxed text-center lg:text-left">
              Fill in your details to complete your order.
            </p>

            <form className="space-y-4" onSubmit={handleStripeCheckout}>
              <Input
                type="text"
                placeholder="Full Name*"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                type="email"
                placeholder="Email*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="tel"
                placeholder="Phone Number*"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="Address*"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="City*"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="Postal Code*"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="Country*"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />

              <Button
                type="submit"
                className="cursor-pointer w-full h-14 font-bold text-base tracking-widest bg-primary text-black hover:bg-primary/90"
                disabled={isRedirecting}
              >
                {isRedirecting ? "Redirecting..." : "Proceed to Checkout"}
              </Button>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            
            <div className="bg-card border border-white/10 p-6 sticky top-0">
                <h3 className="font-bold text-xl uppercase mb-6 font-syne">Order Summary</h3>
                
                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>CALCULATED AT NEXT STEP</span>
                  </div>
                  <div className="h-px bg-white/10 my-4" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                  <Lock className="w-3 h-3" />
                  <span>Secure Checkout via Stripe</span>
                </div>
              </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-white/20 uppercase tracking-widest">
        © 2024 Buddah Bless This Beat
      </footer>
    </div>
  );
}
