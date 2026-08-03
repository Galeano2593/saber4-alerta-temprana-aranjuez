import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, BookOpen, CalendarCheck, ArrowRight, CheckCircle2, Phone, HeartHandshake } from 'lucide-react';
import { SectionHeading } from './InteractiveMap';
import { riskMeta, type RiskLevel } from '@/data/comuna4';

function computeRisk(attendance: number, grade: number): RiskLevel {
  const score = attendance * 0.6 + (grade / 5) * 100 * 0.4;
  if (score >= 70) return 'estable';
  if (score >= 40) return 'acompanamiento';
  return 'critico';
}

const routes: Record<RiskLevel, { title: string; steps: { icon: React.ReactNode; text: string }[] }> = {
  estable: {
    title: 'Ruta de Mantenimiento',
    steps: [
      { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Seguimiento mensual de asistencia y notas' },
      { icon: <HeartHandshake className="w-4 h-4" />, text: 'Reconocimiento al estudiante por su compromiso' },
      { icon: <BookOpen className="w-4 h-4" />, text: 'Invitación a proyectos de liderazgo y robótica' },
    ],
  },
  acompanamiento: {
    title: 'Ruta de Acompañamiento',
    steps: [
      { icon: <Phone className="w-4 h-4" />, text: 'Llamada al acudiente en 48 horas' },
      { icon: <HeartHandshake className="w-4 h-4" />, text: 'Diálogo con orientación escolar' },
      { icon: <BookOpen className="w-4 h-4" />, text: 'Plan de reforzamiento en áreas críticas' },
    ],
  },
  critico: {
    title: 'Ruta de Intervención Crítica',
    steps: [
      { icon: <Phone className="w-4 h-4" />, text: 'Notificación inmediata al acudiente (SMS/WhatsApp)' },
      { icon: <HeartHandshake className="w-4 h-4" />, text: 'Visita domiciliaria del equipo psicosocial' },
      { icon: <ArrowRight className="w-4 h-4" />, text: 'Remisión a programa de prevención de deserción' },
    ],
  },
};

export default function RiskSimulator() {
  const [attendance, setAttendance] = useState(85);
  const [grade, setGrade] = useState(3.2);

  const risk = useMemo(() => computeRisk(attendance, grade), [attendance, grade]);
  const meta = riskMeta[risk];
  const route = routes[risk];
  const score = Math.round(attendance * 0.6 + (grade / 5) * 100 * 0.4);
  const fillPct = Math.min(100, Math.max(0, score));

  return (
    <section className="bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <SectionHeading
          eyebrow="Demostración"
          title="Simulador de Riesgo Interactivo"
          subtitle="Ajusta la asistencia y el promedio académico de un estudiante ficticio y observa cómo el termómetro de alerta activa distintas rutas de apoyo en el colegio."
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="space-y-8">
              <SliderControl
                icon={<CalendarCheck className="w-5 h-5" />}
                label="Asistencia"
                value={attendance}
                min={40}
                max={100}
                suffix="%"
                color={meta.color}
                onChange={setAttendance}
              />
              <SliderControl
                icon={<BookOpen className="w-5 h-5" />}
                label="Promedio académico"
                value={grade}
                min={1}
                max={5}
                step={0.1}
                suffix="/5"
                color={meta.color}
                onChange={setGrade}
              />
            </div>

            {/* Thermometer */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Thermometer className="w-5 h-5" style={{ color: meta.color }} />
                  Termómetro de Alerta
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${meta.bg} ${meta.text}`} style={{ color: meta.color }}>
                  {meta.label}
                </span>
              </div>
              <div className="relative h-8 rounded-full overflow-hidden bg-gradient-to-r from-success-500 via-warning-500 to-error-500">
                {/* Zone dividers at 30% and 60% (inverted: 100-70=30, 100-40=60) */}
                <div className="absolute top-0 bottom-0 w-px bg-white/40" style={{ left: '30%' }} />
                <div className="absolute top-0 bottom-0 w-px bg-white/40" style={{ left: '60%' }} />
                <motion.div
                  className="absolute top-0 bottom-0 w-1.5 bg-white rounded-full shadow-lg ring-2 ring-slate-900/20"
                  animate={{ left: `${100 - fillPct}%` }}
                  transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                  style={{ transform: 'translateX(-50%)' }}
                />
                <div className="absolute inset-0 flex items-center justify-between px-3 text-[10px] font-bold text-white/90 pointer-events-none">
                  <span>Estable</span><span>Acompañamiento</span><span>Crítico</span>
                </div>
              </div>
              <p className="mt-3 text-center text-sm text-slate-500">
                Índice de estabilidad: <span className="font-bold text-slate-800">{score}/100</span>
              </p>
            </div>
          </div>

          {/* Route */}
          <motion.div
            key={risk}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className={`rounded-2xl ring-1 p-6 sm:p-8 shadow-sm ${meta.bg}`}
          >
            <span className={`text-xs font-bold uppercase tracking-wider ${meta.text}`} style={{ color: meta.color }}>
              {meta.label}
            </span>
            <h4 className="mt-1 font-display text-2xl font-extrabold text-slate-900">{route.title}</h4>
            <p className="mt-1 text-sm text-slate-600">
              El colegio activaría las siguientes acciones de apoyo para este estudiante:
            </p>

            <ol className="mt-6 space-y-3">
              {route.steps.map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i + 0.1 }}
                  className="flex items-start gap-3 bg-white/70 rounded-xl p-3.5"
                >
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white" style={{ background: meta.color }}>
                    {step.icon}
                  </span>
                  <p className="text-sm font-medium text-slate-700 pt-1">{step.text}</p>
                </motion.li>
              ))}
            </ol>

            <div className="mt-6 p-4 rounded-xl bg-white/60">
              <p className="text-xs text-slate-500">
                Saber4 cruza asistencia, promedio y señales del entorno para activar la ruta correcta en el momento oportuno — antes de que un joven abandone el aula.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SliderControl({
  icon,
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  color,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix: string;
  color: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <span className="text-slate-400">{icon}</span>
          {label}
        </span>
        <span className="font-display text-xl font-bold text-slate-900 tabular-nums">
          {value.toFixed(step < 1 ? 1 : 0)}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ color, background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, #e2e8f0 ${((value - min) / (max - min)) * 100}%, #e2e8f0 100%)` }}
        className="w-full"
      />
      <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
        <span>{min}{suffix}</span>
        <span>{max}{suffix}</span>
      </div>
    </div>
  );
}
