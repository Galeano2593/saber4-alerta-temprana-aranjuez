import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, GraduationCap, AlertTriangle, Sparkles, Phone, MapPin } from 'lucide-react';
import { SCHOOLS, riskMeta, type School } from '@/data/comuna4';

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
            center={[6.2800, -75.5600]}
            zoom={14}
            scrollWheelZoom={false}
            style={{ height: '460px', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {SCHOOLS.map((s) => (
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
            <h4 className="font-display font-bold text-slate-900 mb-3">Niveles de alerta</h4>
            <ul className="space-y-2.5 text-sm">
              <LegendItem color="#10b981" label="Estable" desc="Asistencia ≥ 90%" />
              <LegendItem color="#f59e0b" label="Acompañamiento" desc="Asistencia 80–89%" />
              <LegendItem color="#ef4444" label="Riesgo Crítico" desc="Asistencia < 80%" />
            </ul>
          </div>
          <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-4 shadow-sm max-h-[300px] overflow-auto">
            <h4 className="font-display font-bold text-slate-900 mb-3">Instituciones</h4>
            <ul className="space-y-1.5">
              {SCHOOLS.map((s) => (
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
              <span>Asistencia</span>
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
