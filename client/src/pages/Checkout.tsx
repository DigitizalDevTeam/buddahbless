import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Mail } from "lucide-react";

export default function Checkout() {
  const [email, setEmail] = useState("");
  const [_, setLocation] = useLocation();

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Logic to proceed to actual payment steps would go here
      // For now, maybe just show a success or go to a payment step?
      // The user asked for "this page", which is the entry point.
      // I'll assume clicking this would go to a "Shipping" or "Payment" step
      // For the mockup, I'll show an alert or just stay here.
      // Or maybe I can simulate the flow.
      // Let's just log it for now.
      console.log("Proceeding with email:", email);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Simple Header */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-12">
        <Link href="/cart">
          <Button variant="ghost" className="text-muted-foreground hover:text-white p-0">
            <ArrowLeft className="w-5 h-5 mr-2" />
            BACK
          </Button>
        </Link>
        <Link href="/">
          <a className="text-xl font-bold font-[family-name:var(--font-syne)] tracking-tighter">
            BUDDAH<span className="text-primary">BLESS</span>
          </a>
        </Link>
        <div className="w-16" /> {/* Spacer for centering */}
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-full max-w-md space-y-8 text-center">
          <h1 className="text-3xl md:text-4xl font-thin font-[family-name:var(--font-syne)] tracking-wide uppercase leading-tight">
            SIGN IN OR CHECK OUT AS A GUEST
          </h1>

          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full h-14 bg-white text-black border-white hover:bg-gray-200 hover:text-black font-bold rounded-none text-base relative group"
            >
              {/* Fake Google Logo */}
              <span className="absolute left-6 font-bold text-lg text-blue-500 group-hover:text-blue-600">G</span>
              CONTINUE WITH GOOGLE
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full h-14 bg-white text-black border-white hover:bg-gray-200 hover:text-black font-bold rounded-none text-base relative"
            >
              {/* Fake Apple Logo */}
              <svg className="w-5 h-5 absolute left-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74s2.57-.9 3.87-.75c.52.01 2.52.17 3.65 1.77-3.21 1.95-2.6 6.72 1.4 8.21-.92 1.98-2.21 4.14-3.99 3.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.16 2.29-2.05 4.34-3.74 4.25z"/>
              </svg>
              CONTINUE WITH APPLE
            </Button>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-background px-4 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-[family-name:var(--font-syne)] uppercase tracking-wide">
              CONTINUE WITH EMAIL
            </h2>
            
            <p className="text-sm text-muted-foreground leading-relaxed px-4">
              If you already have an account, you will be asked to sign in. If not, you can continue as a guest and choose to register after checkout.
            </p>

            <form onSubmit={handleProceed} className="space-y-6">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email*"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 bg-transparent border-white/20 rounded-none px-4 text-lg focus:border-primary/50 text-center placeholder:text-muted-foreground/50"
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={!email}
                className={`w-full h-14 font-bold rounded-none text-base tracking-widest transition-all ${
                  email 
                    ? 'bg-primary text-black hover:bg-primary/90' 
                    : 'bg-white/10 text-white/30 cursor-not-allowed hover:bg-white/10'
                }`}
              >
                PROCEED TO CHECKOUT
              </Button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Simple Footer */}
      <footer className="py-8 text-center text-xs text-white/20 uppercase tracking-widest">
        © 2024 Buddah Bless This Beat
      </footer>
    </div>
  );
}
