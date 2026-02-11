import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowLeft, Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link, useLocation } from "wouter";
import { PaymentModal } from "@/components/PaymentModal";
import { useState } from "react";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [_, setLocation] = useLocation();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const handleCheckout = () => {
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentOpen(false);
    // In a real app, clear cart and redirect to success
    // items.forEach(item => removeFromCart(item.id));
    setLocation("/");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-12 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold font-syne mb-4 uppercase">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added any gear yet.</p>
        <Link href="/">
          <Button className="bg-primary text-black hover:bg-primary/90 font-bold rounded-none h-12 px-8">
            RETURN TO STORE
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-12">
      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
        price={`$${cartTotal.toFixed(2)}`}
        itemTitle={`Cart Total (${items.length} items)`}
        successMessage="Order confirmed! You will receive an email shortly."
      />

      <div className="container-custom max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-muted-foreground hover:text-white p-0">
              <ArrowLeft className="w-6 h-6 mr-2" />
              BACK TO STORE
            </Button>
          </Link>
        </div>

        <h1 className="text-4xl md:text-6xl font-black font-syne uppercase mb-12">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            {items.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex gap-6 p-4 bg-white/5 border border-white/10"
              >
                <div className="w-24 h-32 bg-secondary flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg uppercase leading-tight">{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    {item.size && (
                      <p className="text-sm text-muted-foreground font-mono mt-1">SIZE: {item.size}</p>
                    )}
                    <p className="text-primary font-bold mt-1">{item.price}</p>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border border-white/20">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2 hover:bg-white/10 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-mono">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-2 hover:bg-white/10 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-white/10 p-6 sticky top-32">
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

              <Link href="/checkout">
                <Button 
                  className="w-full bg-primary text-black hover:bg-primary/90 font-bold rounded-none h-14 text-lg"
                >
                  CHECKOUT
                </Button>
              </Link>
              
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                <Lock className="w-3 h-3" />
                <span>Secure Checkout via Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
