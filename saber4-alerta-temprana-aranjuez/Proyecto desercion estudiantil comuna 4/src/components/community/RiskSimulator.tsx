import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, BookOpen, CalendarCheck, ArrowRight, CheckCircle2, Phone, HeartHandshake, ShieldAlert } from 'lucide-react';
import { SectionHeading } from './InteractiveMap';

export type FourLevelRisk = 'bajo' | 'medio' | 'alto' | 'critico';

const riskMeta: Record<FourLevelRisk, { label: string; color: string; bg: string; text: string }> = {
  bajo: {
    label: 'Riesgo Bajo / Estable',
    color: '#10b981',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
  },
  medio: {
    label: 'Riesgo Medio',
    color: '#f59e0b',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
  },
  alto: {
    label: 'Riesgo Alto',
    color: '#f97316',
    bg: 'bg-orange-50',
    text: 'text-orange-800',
  },
  critico: {
    label: 'Riesgo Crítico',
    color: '#ef4444',
    bg: 'bg-red-50',
    text: 'text-red-800',
  },
};

function computeRisk(attendance: number, grade: number): FourLevelRisk {
  const score = attendance * 0.6 + (grade / 5) * 100 * 0.4;
  if (score >= 80) return 'bajo';
  if (score >= 65) return 'medio';
  if (score >= 50) return 'alto';
  return 'critico';
}

const routes: Record<FourLevelRisk, { title: string; steps: { icon: React.ReactNode; text: string }[] }> = {
  bajo: {
    title: 'Ruta de Mantenimiento',
    steps: [
      { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Seguimiento mensual de asistencia y notas' },
      { icon: <HeartHandshake className="w-4 h-4" />, text: 'Reconocimiento al estudiante por su compromiso' },
      { icon: <BookOpen className="w-4 h-4" />, text: 'Invitación a proyectos de liderazgo y robótica' },
    ],
  },
  medio: {
    title: 'Ruta de Acompañamiento Preventivo',
    steps: [
      { icon: <Phone className="w-4 h-4" />, text: 'Llamada de verificación de asistencia por dirección' },
      { icon: <HeartHandshake className="w-4 h-4" />, text: 'Tutoría académica en materias críticas' },
      { icon: <BookOpen className="w-4 h-4" />, text: 'Taller de hábitos de estudio con orientación' },
    ],
  },
  alto: {
    title: 'Ruta de Intervención Prioritaria',
    steps: [
      { icon: <Phone className="w-4 h-4" />, text: 'Citación presencial a acudiente en 48 horas' },
      { icon: <HeartHandshake className="w-4 h-4" />, text: 'Evaluación del entorno psicosocial con la dupla' },
      { icon: <BookOpen className="w-4 h-4" />, text: 'Plan de nivelación intensivo e individualizado' },
    ],
  },
  critico: {
    title: 'Ruta de Intervención Crítica e Inmediata',
    steps: [
      { icon: <ShieldAlert className="w-4 h-4" />, text: 'Notificación urgente al acudiente (SMS/WhatsApp)' },
      { icon: <HeartHandshake className="w-4 h-4" />, text: 'Visita domiciliaria del equipo psicosocial SIAD' },
      { icon: <ArrowRight className="w-4 h-4" />, text: 'Articulación comunitaria de retención escolar' },
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

  return (
    <section className="bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <SectionHeading
          eyebrow="Demostración"
          title="Simulador de Riesgo Interactivo"
          subtitle="Ajusta la asistencia y el promedio académico de un estudiante ficticio y observa cómo el termómetro de alerta activa distintas rutas de apoyo en el colegio."
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controles */}
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

            {/* Termómetro de 4 colores corregido */}
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

              {/* Barra alineada: De Rojo (Crítico) en 0% a Verde (Estable) en 100% */}
              <div className="relative h-8 rounded-full overflow-hidden flex ring-1 ring-slate-200">
                <div className="w-1/4 bg-red-500 h-full" title="Riesgo Crítico" />
                <div className="w-1/4 bg-orange-500 h-full" title="Riesgo Alto" />
                <div className="w-1/4 bg-amber-500 h-full" title="Riesgo Medio" />
                <div className="w-1/4 bg-emerald-500 h-full" title="Estable / Bajo" />

                {/* Indicador blanco en posición según el puntaje */}
                <motion.div
                  className="absolute top-0 bottom-0 w-2 bg-white rounded-full shadow-lg ring-2 ring-slate-900"
                  animate={{ left: `${Math.min(96, Math.max(4, score))}%` }}
                  transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                  style={{ transform: 'translateX(-50%)' }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-1 px-1">
                <span>Riesgo Crítico</span>
                <span>Riesgo Alto</span>
                <span>Riesgo Medio</span>
                <span>Estable</span>
              </div>

              <p className="mt-3 text-center text-sm text-slate-500">
                Índice de estabilidad: <span className="font-bold text-slate-800">{score}/100</span>
              </p>
            </div>
          </div>

          {/* Ruta Activa */}
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
                SIAD Aranjuez cruza asistencia, promedio y señales del entorno para activar la ruta correcta en el momento oportuno — antes de que un joven abandone el aula.
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
