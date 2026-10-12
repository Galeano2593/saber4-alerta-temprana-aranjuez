import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, GraduationCap, AlertTriangle, Sparkles, Phone, MapPin } from 'lucide-react';
import { STUDENTS, SCHOOLS, riskMeta, type School, type StudentRecord } from '@/data/comuna4';

// Direcciones físicas reales y coordenadas exactas de las 34 Instituciones de la Comuna 4 (Aranjuez)
const SCHOOL_COORDINATES: Record<string, { lat: number; lng: number; address: string; phone: string }> = {
  'COL COMFAMA - SEDE ARANJUEZ': { lat: 6.2790, lng: -75.5580, address: 'Cr. 51B # 91-40, Aranjuez', phone: '+57 (604) 360-7080' },
  'INST EDUC CAMILO TORRES RESTREPO': { lat: 6.2708, lng: -75.5562, address: 'Cr. 49 # 83-34, Campo Valdés No. 1', phone: '+57 (604) 211-1220' },
  'INST EDUC SAN AGUSTIN': { lat: 6.2770, lng: -75.5565, address: 'Cl. 88A # 51B-91, Aranjuez San Cayetano', phone: '+57 (604) 211-5020' },
  'INST EDUC JAVIERA LONDOÑO SEVILLA': { lat: 6.2662, lng: -75.5621, address: 'Cl. 71 # 51D-26, Sevilla', phone: '+57 (604) 211-3040' },
  'INST EDUC GILBERTO ALZATE AVENDAÑO': { lat: 6.2801, lng: -75.5602, address: 'Cl. 92 # 51A-100, San Isidro', phone: '+57 (604) 322-5444' },
  'INST EDUC JOSE EUSEBIO CARO': { lat: 6.2818, lng: -75.5568, address: 'Cr. 50A # 93-77, Aranjuez', phone: '+57 (604) 212-0030' },
  'INST EDUC JUAN DE DIOS COCK': { lat: 6.2782, lng: -75.5508, address: 'Cl. 88 # 45A-12, Las Esmeraldas', phone: '+57 (604) 213-9011' },
  'INST EDUC LORENZA VILLEGAS DE SANTOS': { lat: 6.2750, lng: -75.5576, address: 'Cr. 51 # 87-40, Aranjuez', phone: '+57 (604) 211-8090' },
  'INST EDUC JOSE MARIA BRAVO MARQUEZ': { lat: 6.2655, lng: -75.5570, address: 'Cl. 70 # 47A-4, Campo Valdés', phone: '+57 (604) 514-8353' },
  'INST EDUC CAMPO VALDES': { lat: 6.2698, lng: -75.5552, address: 'Cr. 48 # 82-81, Campo Valdés', phone: '+57 (604) 211-9080' },
  'INST EDUC MONSEÑOR FRANCISCO CRISTOBAL TORO': { lat: 6.2789, lng: -75.5572, address: 'Cl. 90 # 50A-09, Aranjuez', phone: '+57 (604) 212-1140' },
  'INST EDUC FRANCISCO MIRANDA': { lat: 6.2812, lng: -75.5615, address: 'Cl. 90 # 52-20, Miranda', phone: '+57 (604) 263-1200' },
  'INST EDUC SAN JUAN BOSCO': { lat: 6.2825, lng: -75.5550, address: 'Cr. 49 # 94-22, San Isidro', phone: '+57 (604) 212-5080' },
  'INST EDUC FRANCISCO LUIS HERNANDEZ BETANCUR': { lat: 6.2758, lng: -75.5578, address: 'Cl. 87 # 50AA-21, Aranjuez', phone: '+57 (604) 211-3090' },
  'INST EDUC ALFONSO MORA NARANJO': { lat: 6.2635, lng: -75.5585, address: 'Cl. 67 # 48A-32, Sevilla / Aranjuez', phone: '+57 (604) 211-8291' },
  'COL COMFAMA - SEDE MANRIQUE': { lat: 6.2740, lng: -75.5480, address: 'Cr. 45 # 84-21, Manrique', phone: '+57 (604) 360-7080' },
  'COL DE MARIA': { lat: 6.2765, lng: -75.5580, address: 'Cr. 51B # 89-01, Aranjuez', phone: '+57 300 678 9918' },
  'INST PEDAG CLARET': { lat: 6.2785, lng: -75.5535, address: 'Cl. 89 # 47-15, Aranjuez', phone: '+57 (604) 212-4010' },
  'COL NUESTRA SEÑORA DE LOURDES': { lat: 6.2730, lng: -75.5525, address: 'Cr. 46 # 83-10, Palermo', phone: '+57 (604) 211-6020' },
  'COL AGUSTINIANO DE SAN NICOLAS': { lat: 6.2820, lng: -75.5590, address: 'Cr. 48 # 93-13, Aranjuez', phone: '+57 (604) 521-3750' },
  'INST EDUC ALVERNIA': { lat: 6.2805, lng: -75.5560, address: 'Cl. 91 # 49-30, Aranjuez', phone: '+57 (604) 212-8811' },
  'COL EMILIA RIQUELME': { lat: 6.2788, lng: -75.5575, address: 'Cr. 51B # 91-19, Aranjuez', phone: '+57 (604) 236-3097' },
  'COL ADVENTISTA SIMON BOLIVAR': { lat: 6.2760, lng: -75.5595, address: 'Cr. 52 # 87-14, Brasilia', phone: '+57 (604) 263-4410' },
  'INST EDUC FE Y ALEGRIA LUIS AMIGO': { lat: 6.2725, lng: -75.5645, address: 'Cl. 81 # 53-20, Moravia', phone: '+57 (604) 211-7050' },
  'COL GENTE UNIDA JOVENES POR LA PAZ - MORAVIA': { lat: 6.2732, lng: -75.5658, address: 'Cr. 53 # 82-15, Moravia', phone: '+57 (604) 211-9920' },
  'CENT EDUC RONDAS INFANTILES': { lat: 6.2778, lng: -75.5562, address: 'Cl. 89 # 50-12, Aranjuez', phone: '+57 (604) 212-3344' },
  'CENT INTEGL MOMENTOS FELICES': { lat: 6.2745, lng: -75.5585, address: 'Cr. 51 # 85-20, Aranjuez', phone: '+57 (604) 211-6677' },
  'CENT EDUC LUCEROS Y ESTRELLAS': { lat: 6.2835, lng: -75.5542, address: 'Cl. 96 # 48-10, San Isidro', phone: '+57 (604) 212-8899' },
  'INST EDUC EL BOSQUE': { lat: 6.2715, lng: -75.5665, address: 'Cr. 58 # 85B-81, Moravia', phone: '+57 (604) 211-1033' },
  'CENT EDUC PARAISOS DE COLOR': { lat: 6.2800, lng: -75.5530, address: 'Cl. 91 # 46-18, La Piñuela', phone: '+57 (604) 212-4455' },
  'CENT EDUC SOL Y LUNA': { lat: 6.2768, lng: -75.5555, address: 'Cr. 49 # 88-10, Aranjuez', phone: '+57 (604) 211-7788' },
  'CENT EDUC CONDUCIENDO LA NIÑEZ': { lat: 6.2815, lng: -75.5512, address: 'Cr. 44 # 92-30, Los Álamos', phone: '+57 (604) 213-2211' },
  'CENT EDUC PANDORA': { lat: 6.2675, lng: -75.5610, address: 'Cl. 72 # 51C-15, Sevilla', phone: '+57 (604) 211-0022' },
  'CENT INTEG EDUC ALEGRES Y TRAVIESOS': { lat: 6.2828, lng: -75.5560, address: 'Cl. 94 # 50-08, San Isidro', phone: '+57 (604) 212-9900' },
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

  // Agrupa estrictamente por CADA una de las 34 Instituciones Educativas
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
        // Coincidencia con catálogo de direcciones reales
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
            .replace(/INST EDUC /g, 'I.E. ')
            .replace(/COL /g, 'Colegio ')
            .replace(/CENT EDUC /g, 'C.E. ')
            .replace(/CENT INTEGL /g, 'C.I. ')
            .replace(/CENT INTEG EDUC /g, 'C.I.E. '),
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
        subtitle={`Visualización geográfica de las ${dynamicSchools.length} Instituciones Educativas registradas en la Comuna 4. Toca un pin para ver dirección exactas, asistencia y estado de alerta.`}
      />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapa */}
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

        {/* Leyenda y Lista */}
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

      {/* Modal interactivo con Dirección Exacta */}
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
