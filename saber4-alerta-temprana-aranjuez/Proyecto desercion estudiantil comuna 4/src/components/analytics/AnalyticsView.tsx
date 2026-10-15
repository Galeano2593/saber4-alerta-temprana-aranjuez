import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import {
  UploadCloud, FileSpreadsheet, Filter, Bell, Search, CheckCircle2,
  TrendingUp, AlertTriangle, Users, X, BookOpen, GraduationCap, ShieldAlert,
  Download, School, RotateCcw, ChevronLeft, ChevronRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';
import {
  STUDENTS, riskMeta,
  type StudentRecord, type RiskLevel,
} from '@/data/comuna4';

const ITEMS_PER_PAGE = 15;

// 🏙️ Lista Oficial de los 14 Barrios de la Comuna 4 (Aranjuez)
const OFFICIAL_BARRIOS_C4 = [
  'ARANJUEZ',
  'BERLÍN',
  'SAN ISIDRO',
  'PALERMO',
  'LOS ÁLAMOS',
  'MORAVIA',
  'SEVILLA',
  'SAN PEDRO',
  'MANRIQUE CENTRAL N.º 1',
  'LAS ESMERALDAS',
  'LA PIÑUELA',
  'BRASILIA',
  'MIRANDA',
  'CAMPO VALDÉS N.º 1',
];

export default function AnalyticsView() {
  // Inicialización persistente leyendo desde localStorage si existe
  const [students, setStudents] = useState<StudentRecord[]>(() => {
    const saved = localStorage.getItem('siad_students_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error leyendo localStorage:', e);
      }
    }
    return STUDENTS;
  });

  const [loadedFileName, setLoadedFileName] = useState<string | null>(() => {
    return localStorage.getItem('siad_file_name');
  });

  const [schoolFilter, setSchoolFilter] = useState<string>('todos');
  const [barrioFilter, setBarrioFilter] = useState<string>('todos');
  const [riskFilter, setRiskFilter] = useState<string>('todos');
  const [gradeFilter, setGradeFilter] = useState<string>('todos');
  const [search, setSearch] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [notifyingId, setNotifyingId] = useState<string | null>(null);
  const [notifiedIds, setNotifiedIds] = useState<Set<string>>(new Set());

  // Estado para la Paginación
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extrae dinámicamente los colegios presentes en los datos
  const dynamicSchools = useMemo(() => {
    const schoolsSet = new Set<string>();
    students.forEach((s) => {
      if (s.school) {
        schoolsSet.add(s.school.trim());
      }
    });
    return Array.from(schoolsSet).sort();
  }, [students]);

  // Asegura la lista oficial de barrios de la Comuna 4 fusionada con datos existentes
  const dynamicBarrios = useMemo(() => {
    const barriosSet = new Set<string>(OFFICIAL_BARRIOS_C4);
    students.forEach((s) => {
      if (s.barrio) {
        barriosSet.add(s.barrio.trim().toUpperCase());
      }
    });
    return Array.from(barriosSet).sort();
  }, [students]);

  const normalizeText = (text: string) => {
    return text.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // Registros filtrados dinámicamente
  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (schoolFilter !== 'todos') {
        if (normalizeText(s.school || '') !== normalizeText(schoolFilter)) return false;
      }
      if (barrioFilter !== 'todos') {
        if (normalizeText(s.barrio || '') !== normalizeText(barrioFilter)) return false;
      }
      if (gradeFilter !== 'todos' && s.grade !== gradeFilter) return false;

      if (search) {
        const normSearch = normalizeText(search);
        const normName = normalizeText(s.name || '');
        const normSchool = normalizeText(s.school || '');
        if (!normName.includes(normSearch) && !normSchool.includes(normSearch)) return false;
      }

      if (riskFilter !== 'todos') {
        if (riskFilter === 'bajo' && s.riskLevel !== 'estable') return false;
        if (riskFilter === 'medio' && s.riskLevel !== 'acompanamiento') return false;
        if (riskFilter === 'critico' && s.riskLevel !== 'critico') return false;
        if (riskFilter === 'alto' && s.riskLevel !== 'critico') return false;
      }
      return true;
    });
  }, [students, schoolFilter, barrioFilter, riskFilter, gradeFilter, search]);

  // Reiniciar a la página 1 cuando cambia cualquier filtro o búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [schoolFilter, barrioFilter, riskFilter, gradeFilter, search, students]);

  // Cálculo de Paginación
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  // Identifica si hay algún filtro activo
  const hasActiveFilters = useMemo(() => {
    return (
      schoolFilter !== 'todos' ||
      barrioFilter !== 'todos' ||
      riskFilter !== 'todos' ||
      gradeFilter !== 'todos' ||
      search.trim() !== ''
    );
  }, [schoolFilter, barrioFilter, riskFilter, gradeFilter, search]);

  const clearAllFilters = () => {
    setSchoolFilter('todos');
    setBarrioFilter('todos');
    setRiskFilter('todos');
    setGradeFilter('todos');
    setSearch('');
  };

  const counts = useMemo(() => {
    const c = { bajo: 0, medio: 0, alto: 0, critico: 0 };
    students.forEach((s) => {
      if (s.riskLevel === 'critico') c.critico += 1;
      else if (s.riskLevel === 'acompanamiento') c.medio += 1;
      else c.bajo += 1;
    });
    return c;
  }, [students]);

  // 📊 GRÁFICO 1: Análisis por dimensiones
  const riskDimensionsData = useMemo(() => {
    const total = filtered.length || 1;
    let acad = 0, econ = 0, pers = 0, fam = 0;

    filtered.forEach((s) => {
      if (s.riskBreakdown) {
        acad += s.riskBreakdown.academico;
        econ += s.riskBreakdown.economico;
        pers += s.riskBreakdown.personal;
        fam += s.riskBreakdown.familiar;
      } else {
        acad += s.riskLevel === 'critico' ? 80 : s.riskLevel === 'acompanamiento' ? 45 : 15;
        econ += s.riskLevel === 'critico' ? 75 : s.riskLevel === 'acompanamiento' ? 50 : 20;
        pers += s.riskLevel === 'critico' ? 60 : s.riskLevel === 'acompanamiento' ? 30 : 10;
        fam += s.riskLevel === 'critico' ? 70 : s.riskLevel === 'acompanamiento' ? 35 : 15;
      }
    });

    return [
      { dimension: 'Académico', nivel: Math.round(acad / total) },
      { dimension: 'Económico', nivel: Math.round(econ / total) },
      { dimension: 'Familiar', nivel: Math.round(fam / total) },
      { dimension: 'Personal', nivel: Math.round(pers / total) },
    ];
  }, [filtered]);

  // 📈 GRÁFICO 2: Tendencia mensual
  const dynamicMonthlyTrend = useMemo(() => {
    const total = filtered.length || 1;
    const avgAttendance = Math.round(filtered.reduce((acc, s) => acc + s.attendance, 0) / total);
    const criticalCount = filtered.filter((s) => s.riskLevel === 'critico' || s.riskLevel === 'acompanamiento').length;
    const alertRate = Math.min(60, Math.max(10, Math.round((criticalCount / total) * 100)));

    const months = ['Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'];
    return months.map((m, idx) => {
      const variation = (idx % 2 === 0 ? 1 : -1) * (idx * 0.8);
      const asist = Math.min(100, Math.max(60, Math.round(avgAttendance + variation)));
      const alertas = Math.max(5, Math.round(alertRate - variation * 0.5));
      const atendidas = Math.max(2, Math.round(alertas * 0.85));

      return { month: m, asistencia: asist, alertas, atendidas };
    });
  }, [filtered]);

  // 🏙️ GRÁFICO 3: Distribución por barrio (Con mapa oficial de Comuna 4)
  const dynamicRiskByBarrio = useMemo(() => {
    const barrioMap: Record<string, { estable: number; acompanamiento: number; critico: number }> = {};

    students.forEach((s) => {
      const b = (s.barrio || 'ARANJUEZ').trim().toUpperCase();
      if (!barrioMap[b]) {
        barrioMap[b] = { estable: 0, acompanamiento: 0, critico: 0 };
      }

      if (s.riskLevel === 'critico') barrioMap[b].critico += 1;
      else if (s.riskLevel === 'acompanamiento') barrioMap[b].acompanamiento += 1;
      else barrioMap[b].estable += 1;
    });

    return Object.keys(barrioMap).map((b) => ({
      barrio: b.length > 14 ? b.substring(0, 12) + '…' : b,
      estable: barrioMap[b].estable,
      acompanamiento: barrioMap[b].acompanamiento,
      critico: barrioMap[b].critico,
    }));
  }, [students]);

  // 🎓 GRÁFICO 4: Distribución de Riesgo según Grado Académico
  const riskByGradeData = useMemo(() => {
    const gradeMap: Record<string, { estable: number; acompanamiento: number; critico: number }> = {
      '9°': { estable: 0, acompanamiento: 0, critico: 0 },
      '10°': { estable: 0, acompanamiento: 0, critico: 0 },
      '11°': { estable: 0, acompanamiento: 0, critico: 0 },
    };

    filtered.forEach((s) => {
      const g = s.grade || '10°';
      if (!gradeMap[g]) {
        gradeMap[g] = { estable: 0, acompanamiento: 0, critico: 0 };
      }

      if (s.riskLevel === 'critico') gradeMap[g].critico += 1;
      else if (s.riskLevel === 'acompanamiento') gradeMap[g].acompanamiento += 1;
      else gradeMap[g].estable += 1;
    });

    return [
      { grado: 'Grado 9.º', ...gradeMap['9°'] },
      { grado: 'Grado 10.º', ...gradeMap['10°'] },
      { grado: 'Grado 11.º', ...gradeMap['11°'] },
    ];
  }, [filtered]);

  const getRecommendedRoute = (student: StudentRecord) => {
    if (student.riskLevel === 'critico') {
      return { label: 'Ruta Psicosocial / Permanencia', icon: ShieldAlert, color: 'text-error-700 bg-error-50 border-error-200' };
    }
    if (student.grade === '11°' || student.grade === '10°') {
      return { label: 'Ruta Sapiencia / Educación Superior', icon: GraduationCap, color: 'text-primary-700 bg-primary-50 border-primary-200' };
    }
    return { label: 'Ruta SENA / Articulación Media', icon: BookOpen, color: 'text-warning-700 bg-warning-50 border-warning-200' };
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Estudiante/Institución', 'Grado', 'Colegio', 'Barrio', 'Asistencia (%)', 'Promedio', 'Nivel de Riesgo', 'Ruta Recomendada', 'Acudiente', 'Teléfono Acudiente'];

    const rows = filtered.map((s) => {
      const route = getRecommendedRoute(s);
      return [
        s.id,
        `"${s.name}"`,
        `"${s.grade}"`,
        `"${s.school}"`,
        `"${s.barrio}"`,
        s.attendance,
        s.avgGrade.toString().replace('.', ','),
        `"${riskMeta[s.riskLevel].label}"`,
        `"${route.label}"`,
        `"${s.guardian}"`,
        `"${s.guardianPhone}"`,
      ];
    });

    const csvContent = 'sep=;\n' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
    const encoder = new TextEncoder();
    const csvBytes = encoder.encode(csvContent);
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);

    const blob = new Blob([bom, csvBytes], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `Reporte_SIAD_Aranjuez_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const notify = (id: string) => {
    setNotifyingId(id);
    setTimeout(() => {
      setNotifyingId(null);
      setNotifiedIds((prev) => new Set(prev).add(id));
    }, 2000);
  };

  // Procesamiento de Excel/CSV
  const processExcelFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.Sheets['01_matriz_maestra_detalle'] ? '01_matriz_maestra_detalle' : workbook.SheetNames[0];
        const rawMatrix: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (rawMatrix.length > 0) {
          const parsedStudents: StudentRecord[] = rawMatrix.map((row, idx) => {
            const nameVal = row.Estudiante || row.estudiante || row.nombre_institucion_due || row.establecimiento_educativo || `Estudiante #${idx + 1}`;
            const genderTag = row.sexo ? ` (${row.sexo === 'hombres' ? 'Masc.' : row.sexo === 'mujeres' ? 'Fem.' : row.sexo})` : '';
            const fullName = `${nameVal}${genderTag}`;

            const rawAttendance = row['Asistencia (%)'] || row.asistencia || row.Asistencia;
            let calculatedAttendance = 90;
            if (rawAttendance !== undefined) {
              calculatedAttendance = parseFloat(rawAttendance.toString().replace('%', '').replace(',', '.').trim()) || 90;
            }

            const rawProm = row.Promedio || row.promedio || row.Puntaje || row.punt_global_promedio;
            let avgGradeVal = 3.5;
            if (rawProm !== undefined && rawProm !== null) {
              const cleanPromStr = rawProm.toString().replace(',', '.').trim();
              const parsedP = parseFloat(cleanPromStr);
              if (!isNaN(parsedP)) {
                avgGradeVal = parsedP > 10 ? parseFloat((parsedP / 10).toFixed(1)) : parseFloat(parsedP.toFixed(1));
              }
            }

            const rawRisk = (row['Nivel de Riesgo'] || row.nivel_riesgo || row.riesgo || '').toString().trim().toLowerCase();
            let riskLevel: RiskLevel = 'estable';

            if (rawRisk.includes('critico') || rawRisk.includes('crítico') || rawRisk.includes('alto') || avgGradeVal < 2.8 || calculatedAttendance < 70) {
              riskLevel = 'critico';
            } else if (rawRisk.includes('medio') || rawRisk.includes('acompañamiento') || rawRisk.includes('acompaniamiento') || avgGradeVal < 3.5 || calculatedAttendance < 85) {
              riskLevel = 'acompanamiento';
            } else {
              riskLevel = 'estable';
            }

            const rawBarrio = (row.Barrio || row.barrio || 'ARANJUEZ').toString().trim().toUpperCase();
            const schoolVal = row.Colegio || row.colegio || row.establecimiento_educativo || 'I.E. Comuna 4';
            const gradeVal = row.Grado || row.grado ? `${(row.Grado || row.grado).toString().replace('°', '')}°` : '10°';

            return {
              id: row.ID || row.id || `colab-${idx}`,
              name: fullName,
              grade: gradeVal,
              school: schoolVal,
              barrio: rawBarrio,
              attendance: calculatedAttendance,
              avgGrade: avgGradeVal,
              riskLevel: riskLevel,
              guardian: row.Acudiente || row.acudiente || 'Coordinación Pedagógica',
              guardianPhone: row['Teléfono Acudiente'] || row.telefono_acudiente || row.telefono || '+57 300 000 0000',
              lastAlert: `IRTE: ${row.irte_c4 ? parseFloat(row.irte_c4).toFixed(1) : '35.0'}/100`,
              riskBreakdown: {
                academico: Math.round(row.riesgo_reprobacion || (riskLevel === 'critico' ? 80 : avgGradeVal < 3.5 ? 45 : 15)),
                economico: Math.round(row.riesgo_matricula || (riskLevel === 'critico' ? 75 : 25)),
                personal: Math.round(row.riesgo_saber11 || (riskLevel === 'critico' ? 60 : 20)),
                familiar: Math.round(row.riesgo_desercion || (riskLevel === 'critico' ? 70 : 15)),
              }
            };
          });

          setStudents(parsedStudents);
          setLoadedFileName(file.name);

          localStorage.setItem('siad_students_data', JSON.stringify(parsedStudents));
          localStorage.setItem('siad_file_name', file.name);

          setUploadOpen(false);
        }
      } catch (err) {
        console.error('Error procesando el archivo:', err);
        alert('Error al leer el archivo. Asegúrate de cargar un archivo CSV o Excel válido.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      {/* Encabezado */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600">SIAD ARANJUEZ — Comuna 4</span>
          <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Panel de Control y Analítica Predictiva
          </h2>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Monitoreo multidimensional para la identificación oportuna del riesgo de deserción escolar (IRTE C4) en los grados 9.º, 10.º y 11.º.
          </p>
          {loadedFileName && (
            <p className="mt-1 text-xs font-medium text-emerald-600 flex items-center gap-1">
              ✓ Datos cargados desde: <strong>{loadedFileName}</strong>
            </p>
          )}
        </div>
        <div className="text-xs text-slate-400 border border-slate-200 rounded-lg p-2 bg-slate-50">
          🔒 <span className="font-semibold text-slate-600">Protección de Datos:</span> Ley 1581 de 2012 (Habeas Data)
        </div>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard icon={<Users className="w-5 h-5" />} label="Registros Monitoreados" value={`${students.length}`} accent="primary" />
        <KpiCard icon={<CheckCircle2 className="w-5 h-5" />} label="Riesgo Bajo / Estable" value={`${counts.bajo}`} accent="success" />
        <KpiCard icon={<AlertTriangle className="w-5 h-5" />} label="Acompañamiento" value={`${counts.medio}`} accent="warning" />
        <KpiCard icon={<TrendingUp className="w-5 h-5" />} label="Riesgo Crítico" value={`${counts.critico}`} accent="error" />
      </div>

      {/* Gráficas Recharts Sincronizadas (Cuadrícula 2x2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Análisis del Riesgo por Dimensiones (%)">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={riskDimensionsData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} unit="%" />
              <YAxis dataKey="dimension" type="category" tick={{ fontSize: 12, fill: '#64748b' }} width={80} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(val) => [`${val}%`, 'Nivel de Riesgo']} />
              <Bar dataKey="nivel" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Tendencia mensual: asistencia vs alertas">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={dynamicMonthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

        {/* Gráfica Ajustada: Distribución por Barrio */}
        <ChartCard title="Distribución por barrio (Comuna 4)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dynamicRiskByBarrio} margin={{ top: 10, right: 10, left: -20, bottom: 45 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="barrio"
                tick={{ fontSize: 10, fill: '#64748b' }}
                angle={-30}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="estable" stackId="a" fill="#10b981" name="Bajo" />
              <Bar dataKey="acompanamiento" stackId="a" fill="#f59e0b" name="Medio" />
              <Bar dataKey="critico" stackId="a" fill="#ef4444" name="Alto/Crítico" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Gráfica Nivel de Riesgo por Grado Académico */}
        <ChartCard title="Nivel de Riesgo por Grado Académico (9.º - 11.º)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={riskByGradeData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="grado" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="estable" fill="#10b981" name="Riesgo Bajo / Estable" radius={[4, 4, 0, 0]} />
              <Bar dataKey="acompanamiento" fill="#f59e0b" name="Acompañamiento" radius={[4, 4, 0, 0]} />
              <Bar dataKey="critico" fill="#ef4444" name="Riesgo Crítico" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-sm p-5 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre o I.E.…"
                className="pl-9 pr-3 py-2 rounded-lg bg-slate-100 text-sm outline-none focus:ring-2 ring-primary-500 w-44"
              />
            </div>

            {/* Filtro de Colegios */}
            <FilterSelect
              icon={<School className="w-4 h-4" />}
              value={schoolFilter}
              onChange={setSchoolFilter}
              options={[
                { value: 'todos', label: 'Todos los colegios' },
                ...dynamicSchools.map((s) => ({ value: s, label: s }))
              ]}
            />

            <FilterSelect
              icon={<BookOpen className="w-4 h-4" />}
              value={gradeFilter}
              onChange={setGradeFilter}
              options={[
                { value: 'todos', label: 'Todos los grados (9°-11°)' },
                { value: '9°', label: 'Grado 9.º' },
                { value: '10°', label: 'Grado 10.º' },
                { value: '11°', label: 'Grado 11.º' },
              ]}
            />

            <FilterSelect
              icon={<Filter className="w-4 h-4" />}
              value={barrioFilter}
              onChange={setBarrioFilter}
              options={[
                { value: 'todos', label: 'Todos los barrios' },
                ...dynamicBarrios.map((b) => ({ value: b, label: b }))
              ]}
            />

            <FilterSelect
              icon={<AlertTriangle className="w-4 h-4" />}
              value={riskFilter}
              onChange={setRiskFilter}
              options={[
                { value: 'todos', label: 'Todos los niveles' },
                { value: 'bajo', label: 'Riesgo Bajo' },
                { value: 'medio', label: 'Riesgo Medio' },
                { value: 'alto', label: 'Riesgo Alto' },
                { value: 'critico', label: 'Riesgo Crítico' },
              ]}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold border border-slate-200 shadow-sm transition-all"
            >
              <Download className="w-4 h-4 text-slate-600" />
              Exportar CSV
            </button>

            <button
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold shadow-md shadow-primary-500/30 hover:scale-[1.02] transition-transform"
            >
              <UploadCloud className="w-4 h-4" />
              Cargar Excel / CSV
            </button>
          </div>
        </div>
      </div>

      {/* Indicador de Filtros Activos */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="bg-primary-50/80 border border-primary-200/80 rounded-xl px-4 py-2.5 mb-6 flex items-center justify-between text-xs sm:text-sm text-primary-900"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold flex items-center gap-1.5 text-primary-700">
                <Filter className="w-3.5 h-3.5" />
                Filtros activos:
              </span>
              <span>
                Mostrando <strong className="font-extrabold text-primary-800">{filtered.length}</strong> de <strong>{students.length}</strong> registros
              </span>
              <span className="text-primary-300">|</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {schoolFilter !== 'todos' && (
                  <span className="bg-white/80 border border-primary-200 px-2 py-0.5 rounded-md font-medium text-primary-800">
                    Colegio: {schoolFilter}
                  </span>
                )}
                {gradeFilter !== 'todos' && (
                  <span className="bg-white/80 border border-primary-200 px-2 py-0.5 rounded-md font-medium text-primary-800">
                    Grado: {gradeFilter}
                  </span>
                )}
                {barrioFilter !== 'todos' && (
                  <span className="bg-white/80 border border-primary-200 px-2 py-0.5 rounded-md font-medium text-primary-800">
                    Barrio: {barrioFilter}
                  </span>
                )}
                {riskFilter !== 'todos' && (
                  <span className="bg-white/80 border border-primary-200 px-2 py-0.5 rounded-md font-medium text-primary-800 uppercase">
                    Riesgo: {riskFilter}
                  </span>
                )}
                {search.trim() !== '' && (
                  <span className="bg-white/80 border border-primary-200 px-2 py-0.5 rounded-md font-medium text-primary-800">
                    Búsqueda: "{search}"
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={clearAllFilters}
              className="ml-3 inline-flex items-center gap-1 text-xs font-bold text-primary-700 hover:text-primary-900 hover:underline shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Limpiar filtros
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabla Principal */}
      <div className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 font-semibold">Estudiante / Registro</th>
                <th className="px-4 py-3 font-semibold">Grado</th>
                <th className="px-4 py-3 font-semibold">Colegio</th>
                <th className="px-4 py-3 font-semibold">Barrio</th>
                <th className="px-4 py-3 font-semibold">Asistencia</th>
                <th className="px-4 py-3 font-semibold">Promedio</th>
                <th className="px-4 py-3 font-semibold">Riesgo IRTE C4</th>
                <th className="px-4 py-3 font-semibold">Ruta Recomendada (MML)</th>
                <th className="px-4 py-3 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.map((s) => {
                const meta = riskMeta[s.riskLevel];
                const notified = notifiedIds.has(s.id);
                const route = getRecommendedRoute(s);
                const RouteIcon = route.icon;

                return (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{s.name}</td>
                    <td className="px-4 py-3 font-semibold text-primary-700">{s.grade}</td>
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
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${route.color}`}>
                        <RouteIcon className="w-3.5 h-3.5" />
                        {route.label}
                      </span>
                    </td>
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
            <div className="py-12 text-center text-slate-400 text-sm">No hay registros que coincidan con los filtros.</div>
          )}
        </div>

        {/* Barra de Paginación */}
        {filtered.length > 0 && (
          <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <div>
              Mostrando del{' '}
              <strong className="font-semibold text-slate-800">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </strong>{' '}
              al{' '}
              <strong className="font-semibold text-slate-800">
                {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
              </strong>{' '}
              de <strong className="font-semibold text-slate-800">{filtered.length}</strong> estudiantes
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>

              <span className="px-3 py-1.5 font-bold text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm">
                Página {currentPage} de {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Carga */}
      {uploadOpen && (
        <UploadModal
          onClose={() => setUploadOpen(false)}
          onFileSelect={processExcelFile}
          fileInputRef={fileInputRef}
        />
      )}
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
        className="pl-9 pr-8 py-2 rounded-lg bg-slate-100 text-sm font-medium text-slate-700 outline-none focus:ring-2 ring-primary-500 appearance-none cursor-pointer max-w-[200px] truncate"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function UploadModal({
  onClose, onFileSelect, fileInputRef
}: {
  onClose: () => void;
  onFileSelect: (file: File) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}) {
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

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
          <h3 className="font-display text-lg font-extrabold text-slate-900">Cargar Archivo de Estudiantes</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".xlsx, .xls, .csv"
          className="hidden"
        />

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-primary-500 bg-primary-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100/80'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-3">
            <FileSpreadsheet className="w-7 h-7" />
          </div>
          <p className="text-sm font-semibold text-slate-700">Haz clic o arrastra tu archivo Excel o CSV</p>
          <p className="text-xs text-slate-400 mt-1">Soporta .xlsx, .xls y .csv</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
