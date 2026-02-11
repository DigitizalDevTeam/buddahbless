import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link } from "wouter";

interface ProductProps {
  image: string;
  name: string;
  price: string;
  tag?: string;
  hasSizes?: boolean;
}

export function ProductCard({ image, name, price, tag, hasSizes }: ProductProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) return;
    
    addToCart({
      name,
      price,
      image,
      size: selectedSize || undefined
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.div 
      className="group relative"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="aspect-[4/5] bg-secondary/50 overflow-hidden relative border border-white/5">
        {tag && (
          <Badge className="absolute top-4 left-4 z-10 bg-primary text-black hover:bg-primary font-bold rounded-none border-none">
            {tag}
          </Badge>
        )}
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button 
            className="bg-white text-black hover:bg-gray-200 rounded-none font-bold tracking-wider"
            onClick={handleAddToCart}
            disabled={hasSizes && !selectedSize}
          >
            {isAdded ? "ADDED" : "ADD TO CART"}
          </Button>
        </div>
      </div>
      
      <div className="pt-4 space-y-3">
        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
          {name}
        </h3>

        {hasSizes ? (
          <Select onValueChange={(size) => {
            setSelectedSize(size);
            // Optional: Automatically add to cart when size selected?
            // For now, user just asked for the dropdown to BE the button interface
            // Let's make selecting a size trigger the add to cart logic immediately or enable a second click?
            // "it's should show drop down box for size this should not be two different buttons"
            // Implementation: The main button IS the trigger. When you select, it updates state.
            // Let's modify the flow:
            // 1. User sees "$80.00" button
            // 2. Click -> Opens dropdown
            // 3. Select Size -> Adds to cart immediately
            addToCart({
              name,
              price,
              image,
              size: size
            });
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
          }}>
            <SelectTrigger className={`w-full border-white/20 text-white hover:bg-primary hover:text-black hover:border-primary font-bold rounded-none h-10 transition-all ${isAdded ? 'bg-primary text-black border-primary' : ''}`}>
               <div className="flex items-center justify-center w-full">
                {isAdded ? (
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" /> ADDED
                    </span>
                  ) : (
                    <span>{price}</span>
                  )}
               </div>
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10 text-white rounded-none">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <SelectItem key={size} value={size} className="focus:bg-primary focus:text-black cursor-pointer">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Button 
            variant="outline" 
            className={`w-full border-white/20 text-white hover:bg-primary hover:text-black hover:border-primary font-bold rounded-none h-10 transition-all ${isAdded ? 'bg-primary text-black border-primary' : ''}`}
            onClick={handleAddToCart}
          >
            {isAdded ? (
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" /> ADDED
              </span>
            ) : (
              price
            )}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export function MerchGrid() {
  const { cartCount } = useCart();

  const products = [
    {
      name: "BLESSED OVERSIZED TEE",
      price: "$80.00",
      image: "/merch-shirt-new.png",
      tag: "NEW DROP",
      hasSizes: true
    },
    {
      name: "BLESSED SNAPBACK",
      price: "$45.00",
      image: "/merch-hat.jpg",
      tag: "NEW DROP"
    }
  ];

  return (
    <section id="merch" className="py-24 bg-background relative">
      {/* Floating Cart Indicator */}
      {cartCount > 0 && (
        <div className="fixed top-24 right-4 z-50 animate-in fade-in slide-in-from-right duration-300">
          <Link href="/cart">
            <Button className="bg-primary text-black hover:bg-primary/90 font-bold rounded-none shadow-lg shadow-primary/20 gap-2 h-12 px-6">
              <ShoppingCart className="w-5 h-5" />
              CART ({cartCount})
            </Button>
          </Link>
        </div>
      )}

      <div className="container-custom">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black font-[family-name:var(--font-syne)] uppercase break-words">
              The Collection
            </h2>
            <div className="h-1 w-24 bg-primary mt-4" />
          </div>
          <Button variant="link" className="text-white hover:text-primary font-bold hidden md:block">
            VIEW ALL PRODUCTS
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product, i) => (
            <ProductCard 
              key={i} 
              {...product} 
            />
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
          <Button variant="outline" className="w-full border-white/20 text-white h-12 rounded-none">
            VIEW ALL PRODUCTS
          </Button>
        </div>
      </div>
    </section>
  );
}
