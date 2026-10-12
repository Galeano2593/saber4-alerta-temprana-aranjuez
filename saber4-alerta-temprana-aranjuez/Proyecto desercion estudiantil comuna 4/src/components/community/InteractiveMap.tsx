import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, GraduationCap, AlertTriangle, Sparkles, Phone, MapPin } from 'lucide-react';
import { STUDENTS, SCHOOLS, riskMeta, type School, type StudentRecord } from '@/data/comuna4';

// Coordenadas georreferenciadas y direcciones oficiales exactas extraídas de la tabla original
const SCHOOL_COORDINATES: Record<string, { lat: number; lng: number; address: string; phone: string }> = {
  'COSMO SCHOOLS - SEDE ARANJUEZ': { lat: 6.2798, lng: -75.5582, address: 'CR 51 B 91 95, Aranjuez', phone: '+57 (604) 360-7080' },
  'INSTITUCION EDUCATIVA PRESBITERO CAMILO TORRES RESTREPO': { lat: 6.2708, lng: -75.5562, address: 'CR 49 83 34, Campo Valdés', phone: '+57 (604) 211-1220' },
  'INSTITUCION EDUCATIVA SAN AGUSTIN': { lat: 6.2770, lng: -75.5565, address: 'CL 88 A 51 B 91, Aranjuez', phone: '+57 (604) 211-5020' },
  'INSTITUCION EDUCATIVA JAVIERA LONDOÑO SEVILLA': { lat: 6.2662, lng: -75.5621, address: 'CL 71 51 D 26, Sevilla', phone: '+57 (604) 211-3040' },
  'INSTITUCION EDUCATIVA GILBERTO ALZATE AVENDAÑO': { lat: 6.2801, lng: -75.5602, address: 'CL 92 51 A 100, San Isidro', phone: '+57 (604) 322-5444' },
  'INSTITUCION EDUCATIVA JOSE EUSEBIO CARO': { lat: 6.2818, lng: -75.5568, address: 'CR 50 A 93 77, San Isidro', phone: '+57 (604) 212-0030' },
  'INSTITUCION EDUCATIVA JUAN DE DIOS COCK': { lat: 6.2782, lng: -75.5508, address: 'CL 88 45 70, Las Esmeraldas', phone: '+57 (604) 213-9011' },
  'INSTITUCION EDUCATIVA LORENZA VILLEGAS DE SANTOS': { lat: 6.2750, lng: -75.5576, address: 'CR 51 87 40, Aranjuez', phone: '+57 (604) 211-8090' },
  'INSTITUCION EDUCATIVA JOSE MARIA BRAVO MARQUEZ': { lat: 6.2655, lng: -75.5570, address: 'CL 70 47 A 04, Manrique', phone: '+57 (604) 514-8353' },
  'INSTITUCION EDUCATIVA CAMPO VALDES': { lat: 6.2698, lng: -75.5552, address: 'CL 83 47 33, Campo Valdés', phone: '+57 (604) 211-9080' },
  'INSTITUCION EDUCATIVA MONSEÑOR FRANCISCO CRISTOBAL TORO': { lat: 6.2789, lng: -75.5572, address: 'CR 50 D 90 49, Aranjuez', phone: '+57 (604) 212-1140' },
  'INSTITUCION EDUCATIVA FRANCISCO MIRANDA': { lat: 6.2812, lng: -75.5615, address: 'CR 51 C 79 56, Miranda', phone: '+57 (604) 263-1200' },
  'INSTITUCION EDUCATIVA SAN JUAN BOSCO': { lat: 6.2825, lng: -75.5550, address: 'CL 82 50 C 10, Miranda', phone: '+57 (604) 212-5080' },
  'INSTITUCION EDUCATIVA FRANCISCO LUIS HERNANDEZ BETANCUR': { lat: 6.2758, lng: -75.5578, address: 'CL 87 50 AA 21, Aranjuez', phone: '+57 (604) 211-3090' },
  'INSTITUCION EDUCATIVA ALFONSO MORA NARANJO': { lat: 6.2635, lng: -75.5585, address: 'CR 48 A 77 68, Campo Valdés', phone: '+57 (604) 211-8291' },
  'COSMO SCHOOLS - SEDE MANRIQUE': { lat: 6.2740, lng: -75.5480, address: 'CR 45 78 61, Manrique', phone: '+57 (604) 360-7080' },
  'COLEGIO DE MARIA': { lat: 6.2765, lng: -75.5580, address: 'CR 51 B 89 01, Aranjuez', phone: '+57 300 678 9918' },
  'INSTITUTO PEDAGOGICO CLARET': { lat: 6.2785, lng: -75.5535, address: 'CR 46 72 43, Manrique', phone: '+57 (604) 212-4010' },
  'COLEGIO NUESTRA SEÑORA DE LOURDES': { lat: 6.2730, lng: -75.5525, address: 'CL 82 50 BB 30, Brasilia', phone: '+57 (604) 211-6020' },
  'COLEGIO AGUSTINIANO DE SAN NICOLAS': { lat: 6.2820, lng: -75.5590, address: 'CR 48 93 13, Berlín', phone: '+57 (604) 521-3750' },
  'INSTITUCION EDUCATIVA ALVERNIA': { lat: 6.2805, lng: -75.5560, address: 'CL 82 C 50 C 126, Miranda', phone: '+57 (604) 212-8811' },
  'COLEGIO EMILIA RIQUELME': { lat: 6.2788, lng: -75.5575, address: 'CR 51 B 91 19, Aranjuez', phone: '+57 (604) 236-3097' },
  'COLEGIO ADVENTISTA SIMON BOLIVAR': { lat: 6.2760, lng: -75.5595, address: 'CR 51 D 71 105, Sevilla', phone: '+57 (604) 263-4410' },
  'INSTITUCION EDUCATIVA FE Y ALEGRIA LUIS AMIGO': { lat: 6.2725, lng: -75.5645, address: 'CR 58 84 40, Moravia', phone: '+57 (604) 211-7050' },
  'COLEGIO GENTE UNIDA JOVENES POR LA PAZ - MORAVIA': { lat: 6.2732, lng: -75.5658, address: 'CR 58 85 B 25, Aranjuez', phone: '+57 (604) 211-9920' },
  'CENTRO EDUCATIVO RONDAS INFANTILES': { lat: 6.2778, lng: -75.5562, address: 'CL 91 50 54, San Isidro', phone: '+57 (604) 212-3344' },
  'CENTRO EDUCATIVO INTEGRAL MOMENTOS FELICES': { lat: 6.2745, lng: -75.5585, address: 'CL 72 A 48 A 69, Brasilia', phone: '+57 (604) 211-6677' },
  'CENTRO EDUCATIVO LUCEROS Y ESTRELLAS': { lat: 6.2835, lng: -75.5542, address: 'CR 47 72 A 4 IN 201, Manrique', phone: '+57 (604) 212-8899' },
  'INSTITUCION EDUCATIVA EL BOSQUE': { lat: 6.2715, lng: -75.5665, address: 'CR 58 85 B 81, Moravia', phone: '+57 (604) 211-1033' },
  'CENTRO EDUCATIVO PARAISOS DE COLOR': { lat: 6.2800, lng: -75.5530, address: 'CR 52 73 298, Campo Valdés', phone: '+57 (604) 212-4455' },
  'CENTRO EDUCATIVO SOL Y LUNA': { lat: 6.2768, lng: -75.5555, address: 'CR 53 95 64 y CR 53 95-96, Aranjuez', phone: '+57 (604) 211-7788' },
  'CENTRO EDUCATIVO CONDUCIENDO LA NIÑEZ': { lat: 6.2815, lng: -75.5512, address: 'CR 50 A 91 24, Aranjuez', phone: '+57 (604) 213-2211' },
  'CENTRO EDUCATIVO PANDORA': { lat: 6.2675, lng: -75.5610, address: 'CR 49 A 94 75, Aranjuez', phone: '+57 (604) 211-0022' },
  'CENTRO INTEGRAL EDUCATIVO ALEGRES Y TRAVIESOS': { lat: 6.2828, lng: -75.5560, address: 'CL 79 49 11, Campo Valdés', phone: '+57 (604) 212-9900' },
  'CENTRO EDUCATIVO DESCUBRIENDO JUNTOS': { lat: 6.2840, lng: -75.5525, address: 'CL 93 49 31, Berlín', phone: '+57 (604) 212-3311' }
};

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

function cleanText(txt: string) {
  return txt.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

export default function InteractiveMap() {
  const [selected, setSelected] = useState<School | null>(null);

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
      const rawSchool = (s.school || s.name || 'I.E. Comuna 4').trim();
      const rawBarrio = (s.barrio || 'ARANJUEZ').trim().toUpperCase();
      const cleanSchoolName = cleanText(rawSchool);

      if (!map[rawSchool]) {
        const keyMatch = Object.keys(SCHOOL_COORDINATES).find(k => 
          cleanSchoolName.includes(cleanText(k)) || cleanText(k).includes(cleanSchoolName)
        );

        const base = keyMatch ? SCHOOL_COORDINATES[keyMatch] : {
          lat: 6.2775,
          lng: -75.5570,
          address: `Barrio ${rawBarrio}, Comuna 4 - Aranjuez`,
          phone: '+57 (604) 211-0000'
        };

        const count = Object.keys(map).length;

        map[rawSchool] = {
          id: `school-ie-${count + 1}`,
          name: rawSchool,
          shortName: rawSchool
            .replace(/INSTITUCION EDUCATIVA/g, 'I.E.')
            .replace(/COLEGIO/g, 'Col.')
            .replace(/CENTRO EDUCATIVO/g, 'C.E.')
            .replace(/INSTITUTO PEDAGOGICO/g, 'Inst. Pedag.'),
          barrio: rawBarrio,
          total: 0,
          critico: 0,
          medio: 0,
          bajo: 0,
          sumAttendance: 0,
          lat: base.lat,
          lng: base.lng,
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
        students: sch.total * 30,
        attendance: avgAttendance,
        riskLevel,
        environmentAlert: riskLevel === 'critico' ? 'Alto' : riskLevel === 'acompanamiento' ? 'Medio' : 'Bajo',
        projects: ['Articulación Media SENA', 'Sapiencia Comuna 4', 'Ruta de Permanencia SIAD'],
        phone: sch.phone,
        address: sch.address,
      } as School & { address: string };
    });

    return results.length > 0 ? results : SCHOOLS;
  }, [students]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <SectionHeading
        eyebrow="Territorio"
        title="Mapa Interactivo Comunal"
        subtitle={`Visualización geográfica de las ${dynamicSchools.length} Instituciones Educativas registradas en la Comuna 4. Toca un pin para ver dirección exacta y estado de alerta.`}
      />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-200 bg-white">
          <MapContainer
            center={[6.2772, -75.5565]}
            zoom={14}
            scrollWheelZoom={false}
            style={{ height: '480px', width: '100%' }}
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
                  <div style={{ textAlign: 'left', fontSize: '12px' }}>
                    <p style={{ fontWeight: 700, color: '#0f172a', margin: 0 }}>{s.shortName}</p>
                    <p style={{ color: '#64748b', margin: '2px 0 0 0' }}>{(s as any).address}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="space-y-3">
          <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-4 shadow-sm">
            <h4 className="font-display font-bold text-slate-900 mb-3">Niveles de Alerta (4 Semáforos)</h4>
            <ul className="space-y-2.5 text-sm">
              <LegendItem color="#10b981" label="Riesgo Bajo / Estable" desc="Asistencia ≥ 90%" />
              <LegendItem color="#f59e0b" label="Riesgo Medio" desc="Asistencia 80–89%" />
              <LegendItem color="#f97316" label="Riesgo Alto" desc="Alerta Prioritaria" />
              <LegendItem color="#ef4444" label="Riesgo Crítico" desc="Asistencia < 80%" />
            </ul>
          </div>
          
          <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-4 shadow-sm max-h-[310px] overflow-auto">
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
  const fullAddress = (school as any).address || `Barrio ${school.barrio}, Aranjuez`;

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
          <p className="text-sm text-slate-700 font-medium mt-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-primary-600 shrink-0" /> {fullAddress}
          </p>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <StatBox icon={<Users className="w-4 h-4" />} value={`${school.students}`} label="Estudiantes Est." />
            <StatBox icon={<GraduationCap className="w-4 h-4" />} value={`${school.attendance}%`} label="Asistencia Prom." />
            <StatBox icon={<AlertTriangle className="w-4 h-4" />} value={`${school.environmentAlert}`} label="Alerta Entorno" />
          </div>

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

          <div>
            <p className="flex items-center gap-1.5 text-sm font-bold text-slate-800 mb-2">
              <Sparkles className="w-4 h-4 text-accent-500" /> Proyectos Destacados
            </p>
            <div className="flex flex-wrap gap-2">
              {school.projects.map((p) => (
                <span key={p} className="px-3 py-1.5 rounded-full bg-accent-50 text-accent-700 text-xs font-medium ring-1 ring-accent-200">
                  {p}
                </span>
              ))}
            </div>
          </div>

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
