import { Button } from "@/components/ui/button";

export function TourDates() {
  return (
    <section id="tour" className="py-24 bg-black relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <div className="flex flex-col items-center justify-center mb-16 gap-6 text-center">
          <div>
            <span className="text-primary font-mono text-sm tracking-[0.2em] uppercase mb-2 block">
              Catch the Vibe Live
            </span>
            <h2 className="text-5xl md:text-7xl font-black font-[family-name:var(--font-syne)] uppercase text-white leading-none mb-6">
              Bless The Streets<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">Tour</span>
            </h2>
          </div>
          
          <div className="py-12 px-6 border border-white/10 bg-white/5 backdrop-blur-sm w-full max-w-2xl">
            <h3 className="text-4xl md:text-6xl font-black font-[family-name:var(--font-syne)] text-white uppercase tracking-tighter mb-4">
              COMING SOON
            </h3>
            <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest mb-8">
              Sign up to be the first to know when tickets drop
            </p>
            
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-none h-12 px-8 font-bold tracking-wider">
              NOTIFY ME
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
