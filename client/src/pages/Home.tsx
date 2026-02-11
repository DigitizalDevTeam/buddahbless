import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { MerchGrid } from "@/components/MerchGrid";
import { MusicPlayer } from "@/components/MusicPlayer";
import { TourDates } from "@/components/TourDates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram, Twitter, Youtube, Music, Cloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    // Attempt to play sound on mount
    const playAudio = async () => {
      if (audioRef.current && !hasPlayed) {
        try {
          await audioRef.current.play();
          setHasPlayed(true);
        } catch (error) {
          // Autoplay was prevented
          console.log("Autoplay prevented, waiting for user interaction");
        }
      }
    };

    playAudio();

    // Fallback: play on first click if autoplay failed
    const handleInteraction = () => {
      if (audioRef.current && !hasPlayed) {
        audioRef.current.play().catch(e => console.error(e));
        setHasPlayed(true);
      }
    };

    window.addEventListener('click', handleInteraction);
    return () => window.removeEventListener('click', handleInteraction);
  }, [hasPlayed]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-black">
      <audio ref={audioRef} src="/buddah-tag.mp3" preload="auto" />
      <Navigation />
      
      <main>
        <Hero />
        <MusicPlayer />
        <TourDates />
        
        {/* Newsletter / Footer Section */}
        <section className="py-24 border-t border-white/5 bg-secondary/20 relative z-20">
          <div className="container-custom max-w-2xl text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-black font-[family-name:var(--font-syne)] uppercase">
              Join the Movement
            </h2>
            <p className="text-muted-foreground">
              Sign up for exclusive drops, beat releases, and tour dates.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
              <Input 
                placeholder="ENTER YOUR EMAIL" 
                className="h-14 bg-background border-white/10 rounded-none text-lg px-6 focus:border-primary/50"
              />
              <Button type="submit" className="h-14 px-8 bg-primary text-black font-bold hover:bg-primary/90 rounded-none text-lg tracking-wider">
                SUBSCRIBE
              </Button>
            </form>
            
            <div className="pt-12 flex flex-wrap items-center justify-center gap-8 md:gap-12">
              <a 
                href="https://www.instagram.com/buddahblessthisbeat/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 hover:text-primary transition-colors cursor-pointer"
              >
                <div className="p-4 bg-white/5 rounded-full group-hover:bg-primary group-hover:text-black transition-colors">
                  <Instagram className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono tracking-widest uppercase opacity-60 group-hover:opacity-100">Instagram</span>
              </a>

              <a 
                href="https://twitter.com/buddahbless_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 hover:text-primary transition-colors cursor-pointer"
              >
                <div className="p-4 bg-white/5 rounded-full group-hover:bg-primary group-hover:text-black transition-colors">
                  <Twitter className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono tracking-widest uppercase opacity-60 group-hover:opacity-100">Twitter</span>
              </a>

              <a 
                href="https://youtube.com/@realbuddahbless?si=iiflAw6mqNRNgxWs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 hover:text-primary transition-colors cursor-pointer"
              >
                <div className="p-4 bg-white/5 rounded-full group-hover:bg-primary group-hover:text-black transition-colors">
                  <Youtube className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono tracking-widest uppercase opacity-60 group-hover:opacity-100">Youtube</span>
              </a>
            </div>
            
            <div className="pt-8 text-xs text-white/20">
              © 2024 BUDDAH BLESS THIS BEAT. ALL RIGHTS RESERVED.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
