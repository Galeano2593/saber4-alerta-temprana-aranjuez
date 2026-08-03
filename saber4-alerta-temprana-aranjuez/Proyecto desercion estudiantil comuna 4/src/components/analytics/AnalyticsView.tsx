import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  UploadCloud, FileSpreadsheet, Filter, Bell, Search, CheckCircle2,
  TrendingUp, AlertTriangle, Users, X,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell,
} from 'recharts';
import {
  STUDENTS, BARRIOS_COMUNA4, riskMeta, MONTHLY_TREND, RISK_BY_BARRIO,
  type StudentRecord, type RiskLevel,
} from '@/data/comuna4';

export default function AnalyticsView() {
  const [students, setStudents] = useState<StudentRecord[]>(STUDENTS);
  const [barrioFilter, setBarrioFilter] = useState<string>('todos');
  const [riskFilter, setRiskFilter] = useState<string>('todos');
  const [search, setSearch] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [notifyingId, setNotifyingId] = useState<string | null>(null);
  const [notifiedIds, setNotifiedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (barrioFilter !== 'todos' && s.barrio !== barrioFilter) return false;
      if (riskFilter !== 'todos' && s.riskLevel !== riskFilter) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [students, barrioFilter, riskFilter, search]);

  const counts = useMemo(() => {
    const c: Record<RiskLevel, number> = { estable: 0, acompanamiento: 0, critico: 0 };
    students.forEach((s) => (c[s.riskLevel] += 1));
    return c;
  }, [students]);

  const pieData = [
    { name: 'Estable', value: counts.estable, color: riskMeta.estable.color },
    { name: 'Acompañamiento', value: counts.acompanamiento, color: riskMeta.acompanamiento.color },
    { name: 'Crítico', value: counts.critico, color: riskMeta.critico.color },
  ];

  const notify = (id: string) => {
    setNotifyingId(id);
    setTimeout(() => {
      setNotifyingId(null);
      setNotifiedIds((prev) => new Set(prev).add(id));
    }, 2000);
  };

  const simulateUpload = () => {
    setUploadOpen(false);
    // Add a couple of demo rows to show "ingested" data
    const extra: StudentRecord[] = [
      { id: `u${Date.now()}-1`, name: 'Laura Vásquez', grade: '8°', school: 'Sede La Piñuela', barrio: 'La Piñuela', attendance: 72, avgGrade: 2.7, riskLevel: 'critico', guardian: 'Óscar Vásquez', guardianPhone: '+57 300 555 0211', lastAlert: 'Importado' },
      { id: `u${Date.now()}-2`, name: 'Kevin Ospina', grade: '10°', school: 'Sede Universidad (Sector)', barrio: 'Universidad (Sector)', attendance: 89, avgGrade: 3.4, riskLevel: 'acompanamiento', guardian: 'Nancy Ospina', guardianPhone: '+57 311 555 0222', lastAlert: 'Importado' },
      { id: `u${Date.now()}-3`, name: 'Diana Restrepo', grade: '9°', school: 'Sede Moravia', barrio: 'Moravia', attendance: 77, avgGrade: 2.9, riskLevel: 'critico', guardian: 'Fernando Restrepo', guardianPhone: '+57 312 555 0230', lastAlert: 'Importado' },
    ];
    setStudents((s) => [...extra, ...s]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      {/* Heading */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-primary-600">Gestión</span>
        <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Panel de Control Docente
        </h2>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Carga planillas de seguimiento, filtra por barrio y nivel de riesgo, y notifica a los acudientes de los estudiantes que necesitan acompañamiento.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard icon={<Users className="w-5 h-5" />} label="Estudiantes" value={`${students.length}`} accent="primary" />
        <KpiCard icon={<CheckCircle2 className="w-5 h-5" />} label="Estables" value={`${counts.estable}`} accent="success" />
        <KpiCard icon={<AlertTriangle className="w-5 h-5" />} label="Acompañamiento" value={`${counts.acompanamiento}`} accent="warning" />
        <KpiCard icon={<TrendingUp className="w-5 h-5" />} label="Críticos" value={`${counts.critico}`} accent="error" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Tendencia mensual: asistencia vs alertas">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={MONTHLY_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="asistencia" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} name="Asistencia %" />
              <Line type="monotone" dataKey="alertas" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} name="Alertas" />
              <Line type="monotone" dataKey="atendidas" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} name="Atendidas" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Distribución de riesgo por barrio">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={RISK_BY_BARRIO} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="barrio" tick={{ fontSize: 10, fill: '#64748b' }} angle={-35} textAnchor="end" height={70} interval={0} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="estable" stackId="a" fill="#10b981" name="Estable" radius={[0, 0, 0, 0]} />
              <Bar dataKey="acompanamiento" stackId="a" fill="#f59e0b" name="Acompañamiento" />
              <Bar dataKey="critico" stackId="a" fill="#ef4444" name="Crítico" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Upload + filters bar */}
      <div className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-sm p-5 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar estudiante…"
                className="pl-9 pr-3 py-2 rounded-lg bg-slate-100 text-sm outline-none focus:ring-2 ring-primary-500 w-48"
              />
            </div>
            {/* Barrio filter */}
            <FilterSelect
              icon={<Filter className="w-4 h-4" />}
              value={barrioFilter}
              onChange={setBarrioFilter}
              options={[{ value: 'todos', label: 'Todos los barrios' }, ...BARRIOS_COMUNA4.map((b) => ({ value: b, label: b }))]}
            />
            {/* Risk filter */}
            <FilterSelect
              icon={<AlertTriangle className="w-4 h-4" />}
              value={riskFilter}
              onChange={setRiskFilter}
              options={[
                { value: 'todos', label: 'Todos los niveles' },
                { value: 'estable', label: 'Estable' },
                { value: 'acompanamiento', label: 'Acompañamiento' },
                { value: 'critico', label: 'Riesgo Crítico' },
              ]}
            />
          </div>

          <button
            onClick={() => setUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold shadow-md shadow-primary-500/30 hover:scale-[1.02] transition-transform"
          >
            <UploadCloud className="w-4 h-4" />
            Cargar planilla
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 font-semibold">Estudiante</th>
                <th className="px-4 py-3 font-semibold">Grado</th>
                <th className="px-4 py-3 font-semibold">Colegio</th>
                <th className="px-4 py-3 font-semibold">Barrio</th>
                <th className="px-4 py-3 font-semibold">Asistencia</th>
                <th className="px-4 py-3 font-semibold">Promedio</th>
                <th className="px-4 py-3 font-semibold">Riesgo</th>
                <th className="px-4 py-3 font-semibold">Última alerta</th>
                <th className="px-4 py-3 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => {
                const meta = riskMeta[s.riskLevel];
                const notified = notifiedIds.has(s.id);
                return (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{s.name}</td>
                    <td className="px-4 py-3 text-slate-600">{s.grade}</td>
                    <td className="px-4 py-3 text-slate-600">{s.school}</td>
                    <td className="px-4 py-3 text-slate-600">{s.barrio}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${s.attendance < 80 ? 'text-error-600' : s.attendance < 90 ? 'text-warning-600' : 'text-success-600'}`}>
                        {s.attendance}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 tabular-nums">{s.avgGrade.toFixed(1)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${meta.bg} ${meta.text}`}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{s.lastAlert}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => notify(s.id)}
                        disabled={notified || notifyingId === s.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          notified
                            ? 'bg-success-100 text-success-700'
                            : notifyingId === s.id
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
                        }`}
                      >
                        {notified ? (
                          <><CheckCircle2 className="w-3.5 h-3.5" /> Notificado</>
                        ) : notifyingId === s.id ? (
                          <><span className="w-3.5 h-3.5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /> Enviando…</>
                        ) : (
                          <><Bell className="w-3.5 h-3.5" /> Notificar acudiente</>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">No hay estudiantes que coincidan con los filtros.</div>
          )}
        </div>
      </div>

      {/* Upload modal */}
      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} onUpload={simulateUpload} />}
    </motion.div>
  );
}

function KpiCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: 'primary' | 'success' | 'warning' | 'error' }) {
  const colors = {
    primary: 'text-primary-600 bg-primary-50',
    success: 'text-success-600 bg-success-50',
    warning: 'text-warning-600 bg-warning-50',
    error: 'text-error-600 bg-error-50',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-sm p-5"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[accent]}`}>{icon}</div>
      <p className="mt-3 font-display text-2xl font-extrabold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </motion.div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-sm p-5">
      <h4 className="font-display font-bold text-slate-900 mb-4">{title}</h4>
      {children}
    </div>
  );
}

function FilterSelect({
  icon, value, onChange, options,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 text-slate-400 pointer-events-none">{icon}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-8 py-2 rounded-lg bg-slate-100 text-sm font-medium text-slate-700 outline-none focus:ring-2 ring-primary-500 appearance-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function UploadModal({ onClose, onUpload }: { onClose: () => void; onUpload: () => void }) {
  const [dragOver, setDragOver] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-extrabold text-slate-900">Cargar planilla</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
            dragOver ? 'border-primary-500 bg-primary-50' : 'border-slate-300 bg-slate-50'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-3">
            <FileSpreadsheet className="w-7 h-7" />
          </div>
          <p className="text-sm font-semibold text-slate-700">Arrastra tu archivo Excel o CSV</p>
          <p className="text-xs text-slate-400 mt-1">Formatos soportados: .xlsx, .csv</p>
        </div>

        <button
          onClick={onUpload}
          className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold shadow-md hover:scale-[1.01] transition-transform"
        >
          Simular carga de datos
        </button>
        <p className="mt-3 text-center text-xs text-slate-400">
          Esta es una demostración: se agregarán filas de ejemplo a la tabla.
        </p>
      </motion.div>
    </motion.div>
  );
}
