import { motion } from 'framer-motion';
import { GraduationCap, LayoutGrid, BarChart3, MapPin } from 'lucide-react';

export type ViewMode = 'comunidad' | 'analitica';

interface HeaderProps {
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
}

export default function Header({ view, onViewChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-[1000] bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 leading-tight truncate">
                Saber<span className="text-primary-600">4</span>
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 leading-tight truncate">
                Red de Alerta Temprana · Comuna 4 Aranjuez
              </p>
            </div>
          </div>

          {/* View switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <SwitchButton
              active={view === 'comunidad'}
              onClick={() => onViewChange('comunidad')}
              icon={<LayoutGrid className="w-4 h-4" />}
              label="Comunidad"
            />
            <SwitchButton
              active={view === 'analitica'}
              onClick={() => onViewChange('analitica')}
              icon={<BarChart3 className="w-4 h-4" />}
              label="Analítica / Docente"
            />
          </div>

          {/* Location badge */}
          <div className="hidden md:flex items-center gap-1.5 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
            <MapPin className="w-4 h-4 text-primary-600" />
            <span className="font-medium">Medellín</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function SwitchButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
        active ? 'text-white' : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      {active && (
        <motion.div
          layoutId="view-pill"
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 shadow-md shadow-primary-500/30"
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </span>
    </button>
  );
}
