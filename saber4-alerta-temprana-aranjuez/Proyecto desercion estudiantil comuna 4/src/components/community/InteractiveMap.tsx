import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, GraduationCap, AlertTriangle, Sparkles, Phone, MapPin } from 'lucide-react';
import { STUDENTS, SCHOOLS, riskMeta, type School, type StudentRecord } from '@/data/comuna4';

// Coordenadas georreferenciadas de las principales I.E. en la Comuna 4 (Aranjuez, Medellín)
const SCHOOL_COORDINATES: Record<string, { lat: number; lng: number; address: string; phone: string }> = {
  'ARANJUEZ': { lat: 6.2798, lng: -75.5582, address: 'Cl. 92 # 48-35, Aranjuez', phone: '+57 (604) 211-4050' },
  'BERLÍN': { lat: 6.2845, lng: -75.5521, address: 'Cl. 94 # 45-20, Berlín', phone: '+57 (604) 212-3011' },
  'BRASILIA': { lat: 6.2741, lng: -75.5598, address: 'Cr. 52 # 86-12, Brasilia', phone: '+57 (604) 263-8820' },
  'CAMPO VALDÉS': { lat: 6.2712, lng: -75.5543, address: 'Cl. 84 # 47-10, Campo Valdés', phone: '+57 (604) 211-9080' },
  'MANRIQUE': { lat: 6.2755, lng: -75.5492, address: 'Cr. 44 # 88-15, Manrique', phone: '+57 (604) 213-0044' },
  'MIRANDA': { lat: 6.2810, lng: -75.5620, address: 'Cl. 90 # 51-28, Miranda', phone: '+57 (604) 263-1200' },
  'MORAVIA': { lat: 6.2730, lng: -75.5651, address: 'Cr. 53 # 82-05, Moravia', phone: '+57 (604) 211-1122' },
  'SAN ISIDRO': { lat: 6.2831, lng: -75.5558, address: 'Cl. 95 # 49-14, San Isidro', phone: '+57 (604) 212-7800' },
  'SEVILLA': { lat: 6.2680, lng: -75.5635, address: 'Cl. 73 # 52-18, Sevilla', phone: '+57 (604) 211-5533' },
  'LAS ESMERALDAS': { lat: 6.2780, lng: -75.5510, address: 'Cl. 88 # 45A-12, Las Esmeraldas', phone: '+57 (604) 213-9900' },
};

// Fix default marker icons in leaflet with bundlers
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/images/marker-shadow.png',
});

function coloredIcon(color: string) {
  return L.divIcon({
    className: 'saber4-marker',
    html: `<div style="background:${color};width:22px;height:22px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,0.4)"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 22],
    popupAnchor: [0, -22],
  });
}

export default function InteractiveMap() {
  const [selected, setSelected] = useState<School | null>(null);

  // Carga reactiva de los estudiantes cargados desde el Excel en Analítica
  const [students] = useState<StudentRecord[]>(() => {
    const saved = localStorage.getItem('siad_students_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error leyendo localStorage en InteractiveMap:', e);
      }
    }
    return STUDENTS;
  });

  // Agrupación y cálculo dinámico de colegios a partir del dataset procesado
  const dynamicSchools = useMemo<School[]>(() => {
    const map: Record<string, {
      id: string;
      name: string;
      shortName: string;
      barrio: string;
      total: number;
      critico: number;
      medio: number;
      bajo: number;
      sumAttendance: number;
      lat: number;
      lng: number;
      address: string;
      phone: string;
    }> = {};

    students.forEach((s) => {
      const rawSchool = (s.school || 'I.E. Comuna 4').trim();
      const rawBarrio = (s.barrio || 'ARANJUEZ').trim().toUpperCase();

      if (!map[rawSchool]) {
        const keyMatch = Object.keys(SCHOOL_COORDINATES).find(k => 
          rawSchool.toUpperCase().includes(k) || rawBarrio.includes(k)
        );
        const base = keyMatch ? SCHOOL_COORDINATES[keyMatch] : {
          lat: 6.2775,
          lng: -75.5570,
          address: 'Comuna 4 - Aranjuez, Medellín',
          phone: '+57 (604) 211-0000'
        };

        const offset = (Object.keys(map).length * 0.0016);

        map[rawSchool] = {
          id: `school-dyn-${Object.keys(map).length}`,
          name: rawSchool,
          shortName: rawSchool.replace('Instituto Técnico', 'I.T.').replace('Institución Educativa', 'I.E.'),
          barrio: rawBarrio,
          total: 0,
          critico: 0,
          medio: 0,
          bajo: 0,
          sumAttendance: 0,
          lat: base.lat + (keyMatch ? 0 : offset),
          lng: base.lng + (keyMatch ? 0 : (offset * 0.5)),
          address: base.address,
          phone: base.phone,
        };
      }

      map[rawSchool].total += 1;
      map[rawSchool].sumAttendance += s.attendance;

      if (s.riskLevel === 'critico') map[rawSchool].critico += 1;
      else if (s.riskLevel === 'acompanamiento') map[rawSchool].medio += 1;
      else map[rawSchool].bajo += 1;
    });

    const results = Object.values(map).map((sch) => {
      const avgAttendance = Math.round(sch.sumAttendance / (sch.total || 1));
      const criticoRatio = sch.critico / sch.total;
      const medioRatio = sch.medio / sch.total;

      let riskLevel: 'estable' | 'acompanamiento' | 'critico' = 'estable';
      if (criticoRatio > 0.25) riskLevel = 'critico';
      else if (medioRatio > 0.3 || criticoRatio > 0.1) riskLevel = 'acompanamiento';
      else riskLevel = 'estable';

      return {
        id: sch.id,
        name: sch.name,
        shortName: sch.shortName,
        barrio: sch.barrio,
        lat: sch.lat,
        lng: sch.lng,
        students: sch.total * 32, // Estimación proyectada de matrículas del plantel
        attendance: avgAttendance,
        riskLevel,
        environmentAlert: riskLevel === 'critico' ? 'Alto' : riskLevel === 'acompanamiento' ? 'Medio' : 'Bajo',
        projects: ['Articulación Media SENA', 'Sapiencia C4', 'Retención Escolar SIAD'],
        phone: sch.phone,
      };
    });

    return results.length > 0 ? results : SCHOOLS;
  }, [students]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <SectionHeading
        eyebrow="Territorio"
        title="Mapa Interactivo Comunal"
        subtitle="Explora las instituciones educativas de la Comuna 4. Toca un pin para ver asistencia, nivel de alerta del entorno y proyectos destacados."
      />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-200 bg-white">
          <MapContainer
            center={[6.2785, -75.5575]}
            zoom={14}
            scrollWheelZoom={false}
            style={{ height: '460px', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {dynamicSchools.map((s) => (
              <Marker
                key={s.id}
                position={[s.lat, s.lng]}
                icon={coloredIcon(riskMeta[s.riskLevel].color)}
                eventHandlers={{ click: () => setSelected(s) }}
              >
                <Popup>
                  <button
                    onClick={() => setSelected(s)}
                    style={{ fontWeight: 600, color: '#2563eb' }}
                  >
                    {s.shortName}
                  </button>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Legend / list */}
        <div className="space-y-3">
          <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-4 shadow-sm">
            <h4 className="font-display font-bold text-slate-900 mb-3">Niveles de alerta (4 Semáforos)</h4>
            <ul className="space-y-2.5 text-sm">
              <LegendItem color="#10b981" label="Riesgo Bajo / Estable" desc="Asistencia ≥ 90%" />
              <LegendItem color="#f59e0b" label="Riesgo Medio" desc="Asistencia 80–89%" />
              <LegendItem color="#f97316" label="Riesgo Alto" desc="Monitoreo Prioritario" />
              <LegendItem color="#ef4444" label="Riesgo Crítico" desc="Asistencia < 80%" />
            </ul>
          </div>
          <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-4 shadow-sm max-h-[300px] overflow-auto">
            <h4 className="font-display font-bold text-slate-900 mb-3">Instituciones ({dynamicSchools.length})</h4>
            <ul className="space-y-1.5">
              {dynamicSchools.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => setSelected(s)}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: riskMeta[s.riskLevel].color }} />
                      <span className="text-sm font-medium text-slate-700 truncate">{s.shortName}</span>
                    </span>
                    <span className="text-xs text-slate-400 shrink-0">{s.barrio}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <SchoolModal school={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function LegendItem({ color, label, desc }: { color: string; label: string; desc: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ background: color }} />
      <div>
        <p className="font-semibold text-slate-800">{label}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </li>
  );
}

function SchoolModal({ school, onClose }: { school: School; onClose: () => void }) {
  const meta = riskMeta[school.riskLevel];
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
        exit={{ scale: 0.92, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
      >
        {/* Header */}
        <div className={`relative p-6 ${meta.bg}`}>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${meta.text} bg-white/70`}>
              <span className="w-2 h-2 rounded-full" style={{ background: meta.color }} />
              {meta.label}
            </span>
          </div>
          <h3 className="font-display text-xl font-extrabold text-slate-900 pr-8">{school.name}</h3>
          <p className="text-sm text-slate-600 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> Barrio {school.barrio} · Aranjuez
          </p>
        </div>

        {/* Stats */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <StatBox icon={<Users className="w-4 h-4" />} value={`${school.students}`} label="Estudiantes" />
            <StatBox icon={<GraduationCap className="w-4 h-4" />} value={`${school.attendance}%`} label="Asistencia" />
            <StatBox icon={<AlertTriangle className="w-4 h-4" />} value={`${school.environmentAlert}`} label="Alerta entorno" />
          </div>

          {/* Attendance bar */}
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
              <span>Asistencia Promedio</span>
              <span>{school.attendance}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${school.attendance}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: meta.color }}
              />
            </div>
          </div>

          {/* Projects */}
          <div>
            <p className="flex items-center gap-1.5 text-sm font-bold text-slate-800 mb-2">
              <Sparkles className="w-4 h-4 text-accent-500" /> Proyectos destacados
            </p>
            <div className="flex flex-wrap gap-2">
              {school.projects.map((p) => (
                <span key={p} className="px-3 py-1.5 rounded-full bg-accent-50 text-accent-700 text-xs font-medium ring-1 ring-accent-200">
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-2 text-sm text-slate-600 pt-2 border-t border-slate-100">
            <Phone className="w-4 h-4 text-primary-600" />
            <span>{school.phone}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatBox({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3 text-center">
      <div className="flex justify-center text-slate-400 mb-1">{icon}</div>
      <p className="font-display text-lg font-bold text-slate-900">{value}</p>
      <p className="text-[11px] text-slate-500">{label}</p>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
    >
      <span className="text-xs font-bold uppercase tracking-wider text-primary-600">{eyebrow}</span>
      <h3 className="mt-1.5 font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h3>
      <p className="mt-2 text-slate-600 max-w-2xl">{subtitle}</p>
    </motion.div>
  );
}
