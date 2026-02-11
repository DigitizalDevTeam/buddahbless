import { motion } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { addToCart } = useCart();

  const tracks = [
    { 
      title: "SAME SOLDIER", 
      features: "HUNXHO, SKOOLY", 
      duration: "3:45",
      src: "/see-the-world.mp3"
    },
    { title: "OWE ME", features: "KODAK BLACK", duration: "3:45", src: "/see-the-world.mp3" },
    { title: "FROM THE TRAP", features: "SKOOLY, UFO TOON", duration: "3:45", src: "/see-the-world.mp3" },
    { title: "I FEEL GOOD", features: "41, KYLE RICHH, JENN CARTER, TATA", duration: "3:45", src: "/see-the-world.mp3" },
    { 
      title: "SEE THE WORLD", 
      features: "BIG SEAN, BOSSMAN DLOW, 2 CHAINZ", 
      duration: "3:45", 
      src: "/see-the-world.mp3"
    },
    { title: "SISTA WIVES", features: "2 CHAINZ, LIL YACHTY", duration: "3:45", src: "/see-the-world.mp3" },
    { title: "TOXIC", features: "KODAK BLACK, FREDO BANG", duration: "3:45", src: "/see-the-world.mp3" },
    { title: "ON ARRIVAL", features: "TRE LOADED", duration: "3:45", src: "/see-the-world.mp3" },
    { title: "SCARED AF", features: "UFO TOON", duration: "3:45", src: "/see-the-world.mp3" },
    { title: "GUINEA PIG", features: "SMOKEPURPP", duration: "3:45", src: "/see-the-world.mp3" },
    { title: "CAN'T PRETEND", features: "TRINIDAD JAMES", duration: "3:45", src: "/see-the-world.mp3" },
    { title: "ALL SHE GOT", features: "SKOOLY", duration: "3:45", src: "/see-the-world.mp3" },
    { title: "BUYERS (OUTRO)", features: "BUDDAH BLESS", duration: "3:45", src: "/see-the-world.mp3" }
  ];

  const [currentTrackIndex, setCurrentTrackIndex] = useState(4); // Default to See The World (index 4)

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playTrack = (index: number) => {
    if (tracks[index].src) {
      if (index === currentTrackIndex && isPlaying) {
        handlePlayPause();
      } else {
        setCurrentTrackIndex(index);
        setIsPlaying(true);
        // Wait for render update then play
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          }
        }, 0);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      
      // Stop after 20 seconds
      if (audioRef.current.currentTime >= 20) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
        setIsPlaying(false);
      }
    }
  };

  const handleAddToCart = () => {
    addToCart({
      name: "BLESS THE STREETS (FULL ALBUM)",
      price: "$10.00",
      image: "/album-cover-new.jpg"
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
    }
    // Cleanup on unmount
    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.pause();
      }
    };
  }, []);


  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <section id="music" className="py-24 bg-background border-t border-white/5">
      <audio ref={audioRef} src={tracks[currentTrackIndex].src} />
      
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Album Art */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="aspect-square relative overflow-hidden bg-secondary rounded-none border border-white/10 shadow-2xl shadow-primary/10">
              <img 
                src="/album-cover-new.jpg" 
                alt="The Streets Album Cover" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Texture overlay */}
              <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" />
            </div>
            {/* Decoration */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-primary/50 -z-10" />
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-primary z-20" />
          </motion.div>

          {/* Player Controls */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-syne)]">
                NEW RELEASE
              </h2>
              <p className="text-xl text-primary font-medium tracking-widest uppercase">Buddah Bless The Streets</p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-white/5 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white uppercase">{tracks[currentTrackIndex].title}</h3>
                  <p className="text-sm text-muted-foreground">Buddah Bless</p>
                </div>
                <div className="flex items-center gap-4">
                  <SkipBack className="w-6 h-6 text-muted-foreground hover:text-white cursor-pointer transition-colors" />
                  <button 
                    onClick={handlePlayPause}
                    className="w-14 h-14 bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                  </button>
                  <SkipForward className="w-6 h-6 text-muted-foreground hover:text-white cursor-pointer transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <Slider 
                  value={[currentTime]} 
                  max={20} 
                  step={0.1} 
                  className="w-full" 
                  onValueChange={(value) => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = value[0];
                      setCurrentTime(value[0]);
                    }
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>0:20 (PREVIEW)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-1">
                {tracks.map((track, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center justify-between py-3 px-2 hover:bg-white/5 transition-colors cursor-pointer group ${i === currentTrackIndex ? 'bg-white/5' : ''}`}
                    onClick={() => track.src && playTrack(i)}
                  >
                    <div className="flex items-center gap-4">
                      {track.src ? (
                        <div className="w-8 h-8 flex items-center justify-center relative">
                           {/* Number that shows normally */}
                           <span className={`text-xs font-mono font-bold transition-opacity absolute ${isPlaying && currentTrackIndex === i ? 'opacity-0' : 'group-hover:opacity-0 opacity-100'} text-primary`}>
                             {String(i + 1).padStart(2, '0')}
                           </span>
                           {/* Play icon that shows on hover or when playing */}
                           <div className={`transition-opacity absolute ${isPlaying && currentTrackIndex === i ? 'opacity-100' : 'group-hover:opacity-100 opacity-0'} text-primary`}>
                             {isPlaying && currentTrackIndex === i ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                           </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground font-mono w-8 text-center group-hover:text-primary">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      )}
                      
                      <div className="flex flex-col">
                        <span className={`font-medium text-sm transition-colors uppercase ${i === currentTrackIndex ? 'text-white' : 'text-muted-foreground group-hover:text-white'}`}>
                          {track.title}
                        </span>
                        {track.features && (
                          <span className="text-[10px] text-muted-foreground font-mono mt-0.5 uppercase">{track.features}</span>
                        )}
                        {track.src && i === currentTrackIndex && (
                          <span className="text-[10px] text-primary tracking-wider font-mono mt-0.5">PREVIEW (20S)</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground font-mono">
                        {track.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                className={`flex-1 font-bold rounded-none h-12 border-none text-lg transition-all ${isAdded ? 'bg-primary text-black hover:bg-primary' : 'bg-white text-black hover:bg-gray-200'}`}
                onClick={handleAddToCart}
              >
                {isAdded ? (
                  <span className="flex items-center gap-2">
                    <Check className="w-5 h-5" /> ADDED TO CART
                  </span>
                ) : (
                  "BUY FULL ALBUM $10.00"
                )}
              </Button>
              <Button variant="outline" className="flex-1 border-white/20 hover:bg-white/10 text-white font-bold rounded-none h-12">
                STREAM ON SPOTIFY
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}