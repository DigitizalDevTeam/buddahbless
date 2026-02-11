import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-end md:items-center">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-bg.jpg" 
          alt="Buddah Bless The Streets" 
          className="w-full h-full object-cover object-left md:object-center"
        />
        {/* Gradient: Transparent on left to show the sign, Dark on right for text */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/40 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
      </div>

      <div className="container-custom relative z-10 w-full flex justify-end pb-24 md:pb-0">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 max-w-xl text-right md:pr-12"
        >
          <div className="flex flex-col md:flex-row items-end justify-end gap-4">
            <span className="inline-block px-4 py-1.5 border border-primary bg-primary/20 text-primary text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-sm shadow-[0_0_15px_rgba(255,0,0,0.5)]">
              Friday 13th Drop
            </span>
            <span className="inline-block px-4 py-1.5 border border-white/20 bg-black/50 text-white text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-sm">
              Bless The Streets
            </span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black font-[family-name:var(--font-syne)] tracking-tighter leading-[0.9] text-white drop-shadow-2xl">
            OFFICIAL<br />
            <span className="text-primary text-glow">MERCH</span>
          </h1>

          <p className="text-white text-lg md:text-xl font-bold ml-auto max-w-md drop-shadow-xl text-shadow-sm">
            Get the exclusive "Bless The Streets" collection. Limited merch available now.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-end">
            <Link href="/merch">
              <Button 
                size="lg" 
                className="bg-primary text-white hover:bg-primary/80 font-bold px-8 h-14 text-base rounded-none tracking-wider border-2 border-primary shadow-[0_0_20px_rgba(255,0,0,0.4)]"
              >
                SHOP COLLECTION
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/30 text-white hover:bg-white hover:text-black font-bold px-8 h-14 text-base rounded-none tracking-wider bg-black/50 backdrop-blur-sm"
              onClick={() => document.getElementById('music')?.scrollIntoView({ behavior: 'smooth' })}
            >
              LISTEN
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-[10px] tracking-widest uppercase text-white/50">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-primary to-transparent" />
      </motion.div>
    </section>
  );
}
