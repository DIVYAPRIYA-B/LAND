import { motion } from 'motion/react';
import { LivingBeing } from '../constants';
import { Leaf, PawPrint, Bird, Info } from 'lucide-react';

interface LivingBeingCardProps {
  being: LivingBeing;
  index: number;
}

export const LivingBeingCard = ({ being, index }: LivingBeingCardProps) => {
  const getIcon = () => {
    switch (being.type) {
      case 'plant': return <Leaf size={18} />;
      case 'bird': return <Bird size={18} />;
      default: return <PawPrint size={18} />;
    }
  };

  const getTypeName = () => {
    switch (being.type) {
      case 'plant': return 'Flora';
      case 'bird': return 'Aves';
      default: return 'Fauna';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.12)' }}
      className="w-56 h-72 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden group cursor-pointer transition-all shrink-0 flex flex-col"
    >
      {/* Entity Image */}
      <div className="h-32 w-full relative overflow-hidden">
        <img 
          src={being.image} 
          alt={being.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3 w-8 h-8 bg-black/40 backdrop-blur-md rounded-lg flex items-center justify-center text-white/70">
          {getIcon()}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 justify-end">
        <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-1 group-hover:text-white/60 transition-colors font-bold">
          {getTypeName()}
        </h3>
        <p className="text-xl font-bold text-white leading-tight mb-2 group-hover:text-amber-200 transition-colors">
          {being.name}
        </p>
        
        <p className="text-xs text-white/40 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
          {being.description}
        </p>
      </div>

      {/* Info Icon Corner */}
      <div className="absolute top-36 right-4 opacity-0 group-hover:opacity-100 transition-all">
        <Info size={12} className="text-white/20" />
      </div>
    </motion.div>
  );
};
