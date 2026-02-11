import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  price: string;
  itemTitle: string;
  successMessage?: string;
}

export function PaymentModal({ isOpen, onClose, onSuccess, price, itemTitle, successMessage = "Your download will start shortly." }: PaymentModalProps) {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setStep('success');
      // Simulate confirmation
      setTimeout(() => {
        onSuccess();
        setStep('form'); // Reset for next time
      }, 1500);
    }, 2000);
  };
  
  const handleApplePay = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
        setStep('form');
      }, 1500);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-black border-white/10 text-white">
        {step === 'form' && (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-syne uppercase">Secure Checkout</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Purchase <span className="text-white font-medium">{itemTitle}</span>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <Button 
                type="button" 
                onClick={handleApplePay}
                className="w-full bg-white text-black hover:bg-gray-200 font-bold h-12 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 384 512" fill="currentColor">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5c0 39.3 8.1 85.1 28.8 112.5 19.6 27.6 42.4 48.4 68.6 48.4 24 0 33.1-17.8 61.1-17.8 28 0 34.6 17.8 61.5 17.8 24.3 0 45.4-19.7 65.5-45.9 14.1-19.7 23.4-45.7 24.4-47.2-12.2-7.3-37.1-27.1-35.2-72.6zM248.1 76.9c11.6-18.3 22-47.4 13.4-76.9-38.1 4.2-74.3 23-95.2 47.9-10.3 12.2-22.7 33.6-17.9 61.3 43.1 3.5 73.6-15.8 99.7-32.3z"/>
                </svg>
                Apple Pay
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black px-2 text-muted-foreground">Or pay with card</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" className="bg-white/5 border-white/10 text-white" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="card">Card Information</Label>
                  <Input id="card" placeholder="0000 0000 0000 0000" className="bg-white/5 border-white/10 text-white" required />
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="MM/YY" className="bg-white/5 border-white/10 text-white" required />
                    <Input placeholder="CVC" className="bg-white/5 border-white/10 text-white" required />
                  </div>
                </div>
                <DialogFooter className="mt-2">
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-none h-12">
                    PAY {price}
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">Processing Payment...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <p className="text-lg font-medium">Payment Successful!</p>
            <p className="text-sm text-muted-foreground">{successMessage}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
