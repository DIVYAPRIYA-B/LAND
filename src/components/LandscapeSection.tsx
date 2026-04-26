import { motion, useInView } from 'motion/react';
import { useRef, useEffect } from 'react';
import { Landscape } from '../constants';
import { LivingBeingCard } from './LivingBeingCard';
import { ChevronDown } from 'lucide-react';

interface LandscapeSectionProps {
  landscape: Landscape;
  isLast: boolean;
  onVisible: (id: string) => void;
}

export const LandscapeSection = ({ landscape, isLast, onVisible }: LandscapeSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      onVisible(landscape.id);
    }
  }, [isInView, landscape.id, onVisible]);

  return (
    <section 
      ref={ref}
      id={landscape.id}
      className="relative h-screen w-full snap-start overflow-hidden flex flex-col justify-center items-center px-6 md:px-24"
    >
      {/* Background Image with Atmospheric Layers */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ 
          backgroundImage: `url(${landscape.bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        initial={{ scale: 1.1, filter: 'brightness(0.4)' }}
        whileInView={{ scale: 1, filter: 'brightness(0.6)' }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-[#050705]/40" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#050705] via-transparent to-transparent" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center md:items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mb-12 max-w-4xl text-center md:text-left"
        >
          <h2 className="text-xs md:text-sm uppercase tracking-[0.6em] font-bold mb-6 flex items-center justify-center md:justify-start gap-3" style={{ color: landscape.accentColor }}>
            <span className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: landscape.accentColor }}></span>
            Active Biosphere
          </h2>
          <h1 className="text-7xl md:text-[10rem] font-serif italic text-white leading-[0.8] tracking-tighter mb-10 drop-shadow-2xl">
            {landscape.name}
          </h1>
          <p className="max-w-xl text-white/60 text-base md:text-lg leading-relaxed tracking-wide font-light md:ml-2">
            {landscape.description}
          </p>
        </motion.div>

        {/* Living Beings Horizontal/Flex Loop */}
        <div className="flex flex-wrap md:flex-nowrap gap-6 mt-8 w-full justify-center md:justify-start overflow-x-auto no-scrollbar pb-10">
          {landscape.beings.map((being, index) => (
            <LivingBeingCard key={being.name} being={being} index={index} />
          ))}
        </div>
      </div>

      {/* Navigation Prompt */}
      {!isLast && (
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-white">Scroll</span>
          <ChevronDown className="text-white" size={16} />
        </motion.div>
      )}
    </section>
  );
};
