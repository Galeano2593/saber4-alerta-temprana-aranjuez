import Hero from './Hero';
import InteractiveMap from './InteractiveMap';
import RiskSimulator from './RiskSimulator';
import OrientaIAChat from './OrientaIAChat';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function CommunityView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Hero />
      <InteractiveMap />
      <RiskSimulator />
      <OrientaIAChat />
      <Footer />
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-white">Saber4</span>
          </div>
          <p className="text-sm text-slate-400 text-center sm:text-right">
            Red de Alerta Temprana y Futuro Educativo · Comuna 4 Aranjuez, Medellín
          </p>
        </div>
      </div>
    </footer>
  );
}
