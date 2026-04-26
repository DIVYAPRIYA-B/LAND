import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LANDSCAPES, Landscape } from './constants';
import { LandscapeSection } from './components/LandscapeSection';
import { Volume2, VolumeX, Compass, Map as MapIcon } from 'lucide-react';

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [activeLandscapeId, setActiveLandscapeId] = useState<string>(LANDSCAPES[0].id);
  const [isMuted, setIsMuted] = useState(false);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const activeLandscape = LANDSCAPES.find(l => l.id === activeLandscapeId) || LANDSCAPES[0];

  useEffect(() => {
    if (!isStarted) return;

    // Initialize audio elements if they don't exist
    LANDSCAPES.forEach(l => {
      if (!audioRefs.current[l.id]) {
        const audio = new Audio(l.audioUrl);
        audio.loop = true;
        audio.volume = 0;
        audio.preload = 'auto';
        audioRefs.current[l.id] = audio;
      }
    });

    // Cross-fade logic
    const syncAudio = () => {
      Object.keys(audioRefs.current).forEach((id) => {
        const audio = audioRefs.current[id];
        if (!audio) return;
        
        const isTarget = id === activeLandscapeId && !isMuted;
        
        if (isTarget) {
          if (audio.paused) {
            audio.play().catch(() => {
              // Standard browser policy catch
            });
          }
          // Responsive Fade In
          if (audio.volume < 0.5) {
            audio.volume = Math.min(0.5, audio.volume + 0.05);
          }
        } else {
          // Responsive Fade Out
          if (audio.volume > 0.02) {
            audio.volume = Math.max(0, audio.volume - 0.05);
          } else if (!audio.paused) {
            audio.pause();
          }
        }
      });
    };

    const interval = setInterval(syncAudio, 100);
    return () => clearInterval(interval);
  }, [activeLandscapeId, isStarted, isMuted]);

  const handleStart = () => {
    setIsStarted(true);
  };

  return (
    <main className="relative h-screen w-full bg-[#050705] flex overflow-hidden font-sans select-none">
      {/* Left Navigation Rail */}
      <AnimatePresence>
        {isStarted && (
          <motion.div 
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            className="w-20 h-full bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-12 gap-8 z-50 shrink-0"
          >
            <div className="text-[10px] uppercase tracking-[0.3em] opacity-40 vertical-rl mb-4 font-bold text-white whitespace-nowrap">
              Landscape Index
            </div>
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto no-scrollbar py-4 px-2">
              {LANDSCAPES.map((l, index) => (
                <button
                  key={l.id}
                  onClick={() => {
                    const el = document.getElementById(l.id);
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-10 h-14 rounded-lg flex items-center justify-center transition-all group relative ${
                    activeLandscapeId === l.id 
                      ? 'bg-white/10 border-2 border-white' 
                      : 'bg-white/5 border border-white/10 opacity-40 hover:opacity-100'
                  }`}
                  style={{ 
                    borderColor: activeLandscapeId === l.id ? l.accentColor : undefined,
                    backgroundColor: activeLandscapeId === l.id ? `${l.accentColor}22` : undefined
                  }}
                >
                  <span 
                    className="text-[10px] font-mono"
                    style={{ color: activeLandscapeId === l.id ? l.accentColor : 'white' }}
                  >
                    0{index + 1}
                  </span>
                  {activeLandscapeId === l.id && (
                    <motion.div 
                      layoutId="rail-active-glow"
                      className="absolute inset-0 rounded-lg blur-md -z-10"
                      style={{ backgroundColor: l.accentColor }}
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
              <Compass size={18} className={isStarted ? 'animate-pulse' : ''} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 relative overflow-hidden">
        {/* UI Overlay - Persistent */}
        <AnimatePresence>
          {isStarted && (
            <>
              {/* Top Navigation Bar */}
              <motion.div 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute top-0 left-0 w-full p-10 flex justify-between items-center z-50 pointer-events-none"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-md rotate-45 transition-colors duration-1000"
                    style={{ backgroundColor: activeLandscape.accentColor }}
                  ></div>
                  <span className="text-sm tracking-[0.2em] font-bold text-white uppercase">Echo Explorer</span>
                </div>
                <div className="flex gap-8 pointer-events-auto items-center">
                  <span className="text-[10px] tracking-[0.2em] text-white/60 cursor-pointer hover:text-white hidden md:block">ECOSYSTEMS</span>
                  <span className="text-[10px] tracking-[0.2em] text-white/60 cursor-pointer hover:text-white hidden md:block">RESEARCH</span>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10">
                    <div className="w-1 h-1 rounded-full bg-green-400 animate-ping"></div>
                    <span className="text-[10px] tracking-[0.2em] text-white font-bold">LIVE SYNC</span>
                  </div>
                </div>
              </motion.div>

              {/* Bottom Audio/Nav Widget */}
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute bottom-10 right-10 z-50 flex flex-col items-end gap-4 pointer-events-auto"
              >
                <div className="p-6 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl w-72 shadow-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${activeLandscape.accentColor}22` }}
                    >
                      <div className="flex gap-1 items-end h-3">
                        <motion.div 
                          animate={{ height: [8, 12, 4, 10] }} 
                          transition={{ duration: 0.5, repeat: Infinity }} 
                          className="w-0.5" 
                          style={{ backgroundColor: activeLandscape.accentColor }}
                        />
                        <motion.div 
                          animate={{ height: [12, 4, 10, 8] }} 
                          transition={{ duration: 0.6, repeat: Infinity }} 
                          className="w-0.5" 
                          style={{ backgroundColor: activeLandscape.accentColor }}
                        />
                        <motion.div 
                          animate={{ height: [4, 10, 8, 12] }} 
                          transition={{ duration: 0.7, repeat: Infinity }} 
                          className="w-0.5" 
                          style={{ backgroundColor: activeLandscape.accentColor }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/40">Now Playing</p>
                      <p className="text-xs font-semibold text-white truncate w-40">
                        {activeLandscape.name} Ambience
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((LANDSCAPES.findIndex(l => l.id === activeLandscapeId) + 1) / LANDSCAPES.length) * 100}%` }}
                      style={{ backgroundColor: activeLandscape.accentColor }}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all text-white group"
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="group-hover:animate-pulse" />}
                  </button>
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all text-white">
                    <span className="text-[10px] font-bold">INFO</span>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Start Screen Overlay */}
        <AnimatePresence>
          {!isStarted && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1 }}
              className="fixed inset-0 z-[100] bg-[#050705] flex flex-col items-center justify-center p-12 text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md"
              >
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 rotate-45">
                  <MapIcon className="text-white -rotate-45" size={32} />
                </div>
                <h2 className="text-5xl font-serif italic text-white mb-6 tracking-tight">Echoes of Nature</h2>
                <p className="text-white/40 mb-12 leading-relaxed text-sm tracking-wide">
                  A multi-sensory expedition into Earth's most precious biomes. 
                  Synchronized soundscapes activated upon entry.
                </p>
                <button 
                  onClick={handleStart}
                  className="group relative px-12 py-5 bg-[#e0e7e0] text-[#050705] font-bold rounded-full overflow-hidden hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(224,231,224,0.2)]"
                >
                  <span className="relative z-10 uppercase tracking-[0.2em] text-[10px]">Initialize Exploration</span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vertical Reel Content */}
        {isStarted && (
          <div 
            className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth no-scrollbar"
          >
            {LANDSCAPES.map((landscape, index) => (
              <LandscapeSection 
                key={landscape.id}
                landscape={landscape}
                isLast={index === LANDSCAPES.length - 1}
                onVisible={setActiveLandscapeId}
              />
            ))}
          </div>
        )}

        {/* Scene Transitions Preview (Right Edge) */}
        <div className="absolute top-0 right-0 w-8 h-full flex flex-col justify-center items-center gap-2 z-10 pointer-events-none">
          {LANDSCAPES.map((l) => (
            <motion.div 
              key={`dot-${l.id}`}
              className="w-1 rounded-full transition-all duration-500"
              animate={{ 
                height: activeLandscapeId === l.id ? 24 : 4,
                backgroundColor: activeLandscapeId === l.id ? l.accentColor : 'rgba(255,255,255,0.1)'
              }}
            />
          ))}
        </div>

        {/* Atmosphere Noise Overlay */}
        <div className="fixed inset-0 pointer-events-none z-40 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
      </div>
    </main>
  );
}
