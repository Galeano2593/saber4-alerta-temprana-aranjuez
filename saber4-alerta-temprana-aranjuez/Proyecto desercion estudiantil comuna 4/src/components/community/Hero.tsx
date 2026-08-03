import { motion } from 'framer-motion';
import { Users, Building2, ShieldCheck, TrendingUp } from 'lucide-react';
import { METRICS } from '@/data/comuna4';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950" />
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #10b981 0, transparent 45%), radial-gradient(circle at 80% 70%, #3b82f6 0, transparent 45%)' }} />
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/20 text-accent-300 text-xs font-semibold ring-1 ring-accent-400/30 mb-5">
            <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
            Comuna 4 · Aranjuez, Medellín
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
            Saber4: Tecnología e Inteligencia de Datos al Servicio de la Educación en{' '}
            <span className="bg-gradient-to-r from-accent-400 to-accent-300 bg-clip-text text-transparent">Aranjuez</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-primary-100 leading-relaxed max-w-2xl">
            Una red de alerta temprana que previene la deserción escolar y conecta a los jóvenes de la Comuna 4 con la educación superior, las carreras técnicas y las oportunidades de empleo.
          </p>
        </motion.div>

        {/* Metrics */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <MetricCard
            icon={<Users className="w-6 h-6" />}
            value={METRICS.studentsMonitored.toLocaleString('es-CO')}
            label="Estudiantes monitoreados"
            delay={0.1}
            accent="accent"
          />
          <MetricCard
            icon={<Building2 className="w-6 h-6" />}
            value={`${METRICS.institutions}`}
            label="Instituciones Educativas de la Comuna 4"
            delay={0.2}
            accent="blue"
          />
          <MetricCard
            icon={<ShieldCheck className="w-6 h-6" />}
            value={`${METRICS.alertsAttended}%`}
            label="Alertas Atendidas"
            delay={0.3}
            accent="accent"
            trend={<TrendingUp className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Wave divider */}
      <div className="relative">
        <svg viewBox="0 0 1440 80" className="w-full h-[40px] sm:h-[60px] block" preserveAspectRatio="none">
          <path d="M0,40 C240,80 480,0 720,30 C960,60 1200,10 1440,40 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

function MetricCard({
  icon,
  value,
  label,
  delay,
  accent,
  trend,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  delay: number;
  accent: 'accent' | 'blue';
  trend?: React.ReactNode;
}) {
  const ring = accent === 'accent' ? 'ring-accent-400/30 text-accent-300' : 'ring-primary-400/30 text-primary-300';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-5 ring-1 ring-white/15 hover:ring-white/30 transition-all"
    >
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl bg-white/10 ring-1 ${ring} flex items-center justify-center`}>
          {icon}
        </div>
        {trend && <span className="text-accent-300 flex items-center gap-1 text-xs font-semibold">{trend} +3%</span>}
      </div>
      <p className="mt-4 font-display text-3xl sm:text-4xl font-extrabold text-white tabular-nums">{value}</p>
      <p className="mt-1 text-sm text-primary-100/80">{label}</p>
    </motion.div>
  );
}
