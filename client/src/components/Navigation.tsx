import { Link } from "wouter";
import { ShoppingBag, Music, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { LoginModal } from "./LoginModal";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount } = useCart();
  const { isLoggedIn } = useAuth();

  const navItems = [
    { label: "MERCH", href: "/merch" },
    ...(isLoggedIn ? [{ label: "MY ORDERS", href: "/orders" }] : []),
    { label: "MUSIC", href: "/#music" },
    { label: "TOUR", href: "/#tour" },
    { label: "CONTACT", href: "/#" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="container-custom flex items-center justify-between h-20">
        <div className="flex-1">
          <Link href="/" className="text-2xl font-bold font-[family-name:var(--font-syne)] tracking-tighter hover:text-primary transition-colors">
            BUDDAH<span className="text-primary">BLESS</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link 
              key={item.label} 
              href={item.href}
              className="text-sm font-medium tracking-widest hover:text-primary transition-colors font-[family-name:var(--font-syne)]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex-1 flex justify-end items-center gap-4">
          <div className="hidden md:block">
            <LoginModal />
          </div>
          
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-black text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
          
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background border-l border-white/10 w-full sm:max-w-md">
                <div className="flex flex-col gap-8 mt-20 items-center">
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-3xl font-bold font-[family-name:var(--font-syne)] hover:text-primary transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                  <div className="mt-4">
                    <LoginModal />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
