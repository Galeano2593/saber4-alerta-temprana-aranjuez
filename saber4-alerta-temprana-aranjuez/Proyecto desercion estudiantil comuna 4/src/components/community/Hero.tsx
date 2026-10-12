import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, ShieldCheck, TrendingUp, MapPin } from 'lucide-react';
import { STUDENTS, type StudentRecord } from '@/data/comuna4';

export default function Hero() {
  // Carga dinámica desde localStorage (los datos guardados desde AnalyticsView)
  const [students] = useState<StudentRecord[]>(() => {
    const saved = localStorage.getItem('siad_students_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error leyendo localStorage en Hero:', e);
      }
    }
    return STUDENTS;
  });

  // Métricas calculadas en tiempo real a partir del Excel de Colab
  const metrics = useMemo(() => {
    const totalStudents = students.length;

    // Conteo de Instituciones Educativas únicas
    const schoolsSet = new Set<string>();
    students.forEach((s) => {
      if (s.school) schoolsSet.add(s.school.trim());
    });
    const totalSchools = schoolsSet.size || 14;

    // Porcentaje de atención / estabilidad preventiva
    const establesCount = students.filter(
      (s) => s.riskLevel === 'estable' || s.riskLevel === 'acompanamiento'
    ).length;
    const attendedPercentage = totalStudents > 0 
      ? Math.round((establesCount / totalStudents) * 100) 
      : 85;

    return {
      totalStudents,
      totalSchools,
      attendedPercentage,
    };
  }, [students]);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 text-white px-4 sm:px-6 lg:px-8 py-12">
      {/* Fondo con malla sutil */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Badge Comuna 4 */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <MapPin className="w-3.5 h-3.5" />
          Comuna 4 - Aranjuez, Medellín
        </div>

        {/* Título Principal */}
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl leading-[1.15]">
          SIAD ARANJUEZ: <span className="text-white">Tecnología e Inteligencia de Datos</span> al Servicio de la Educación en <span className="text-emerald-400">Aranjuez</span>
        </h1>

        <p className="mt-6 text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
          Una red de alerta temprana que previene la deserción escolar y conecta a los jóvenes de la Comuna 4 con la educación superior, las carreras técnicas y las oportunidades de empleo.
        </p>

        {/* Tarjetas de Métricas Sincronizadas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Tarjeta 1: Estudiantes Monitoreados */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-md hover:bg-white/10 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <p className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
              {metrics.totalStudents.toLocaleString()}
            </p>
            <p className="text-sm font-medium text-slate-300 mt-2">
              Estudiantes / Registros monitoreados
            </p>
          </motion.div>

          {/* Tarjeta 2: Instituciones Educativas */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-md hover:bg-white/10 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
              <Building2 className="w-6 h-6" />
            </div>
            <p className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
              {metrics.totalSchools}
            </p>
            <p className="text-sm font-medium text-slate-300 mt-2">
              Instituciones Educativas de la Comuna 4
            </p>
          </motion.div>

          {/* Tarjeta 3: Alertas Atendidas */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-md hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" /> +3%
              </span>
            </div>
            <p className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
              {metrics.attendedPercentage}%
            </p>
            <p className="text-sm font-medium text-slate-300 mt-2">
              Alertas Atendidas y Monitoreadas
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
