import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, GraduationCap, AlertTriangle, Sparkles, Phone, MapPin, Search, Building2 } from 'lucide-react';
import { STUDENTS, SCHOOLS, riskMeta, type School, type StudentRecord } from '@/data/comuna4';

const OFFICIAL_ADDRESSES: Record<string, string> = {
  'col comfama - sede aranjuez': 'CR 51 B 91 95, Aranjuez',
  'inst educ camilo torres restrepo': 'CR 49 83 34, Campo Valdés',
  'inst educ san agustin': 'CL 88 A 51 B 91, Aranjuez',
  'inst educ javiera londoño sevilla': 'CL 71 51 D 26, Sevilla',
  'inst educ gilberto alzate avendaño': 'CL 92 51 A 100, San Isidro',
  'inst educ jose eusebio caro': 'CR 50 A 93 77, San Isidro',
  'inst educ juan de dios cock': 'CL 88 45 70, Las Esmeraldas',
  'inst educ lorenza villegas de santos': 'CR 51 87 40, Aranjuez',
  'inst educ jose maria bravo marquez': 'CL 70 47 A 04, Manrique',
  'inst educ campo valdes': 'CL 83 47 33, Campo Valdés',
  'inst educ monseñor francisco cristobal toro': 'CR 50 D 90 49, Aranjuez',
  'inst educ francisco miranda': 'CR 51 C 79 56, Miranda',
  'inst educ san juan bosco': 'CL 82 50 C 10, Miranda',
  'inst educ francisco luis hernandez betancur': 'CL 87 50 AA 21, Aranjuez',
  'inst educ alfonso mora naranjo': 'CR 48 A 77 68, Campo Valdés',
  'col comfama - sede manrique': 'CR 45 78 61, Manrique',
  'col de maria': 'CR 51 B 89 01, Aranjuez',
  'inst pedag claret': 'CR 46 72 43, Manrique',
  'col nuestra señora de lourdes': 'CL 82 50 BB 30, Brasilia',
  'col agustiniano de san nicolas': 'CR 48 93 13, Berlín',
  'inst educ alvernia': 'CL 82 C 50 C 126, Miranda',
  'col emilia riquelme': 'CR 51 B 91 19, Aranjuez',
  'col adventista simon bolivar': 'CR 51 D 71 105, Sevilla',
  'inst educ fe y alegria luis amigo': 'CR 58 84 40, Moravia',
  'col gente unida jovenes por la paz - moravia': 'CR 58 85 B 25, Moravia',
  'cent educ rondas infantiles': 'CL 91 50 54, San Isidro',
  'cent integl momentos felices': 'CL 72 A 48 A 69, Brasilia',
  'cent educ luceros y estrellas': 'CR 47 72 A 4 IN 201, Manrique',
  'inst educ el bosque': 'CR 58 85 B 81, Moravia',
  'cent educ paraisos de color': 'CR 52 73 298, Campo Valdés',
  'cent educ sol y luna': 'CR 53 95 64, Aranjuez',
  'cent educ conduciendo la niñez': 'CR 50 A 91 24, Aranjuez',
  'cent educ pandora': 'CR 49 A 94 75, Aranjuez',
  'cent integ educ alegres y traviesos': 'CL 79 49 11, Campo Valdés',
};

function cleanText(txt: string) {
  return txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

export default function InteractiveMap() {
  const [selected, setSelected] = useState<School | null>(null);
  const [search, setSearch] = useState('');

  const [students] = useState<StudentRecord[]>(() => {
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
      address: string;
      phone: string;
    }> = {};

    students.forEach((s) => {
      const rawSchool = (s.school || s.name || 'I.E. Comuna 4').trim();
      const rawBarrio = (s.barrio || 'ARANJUEZ').trim().toUpperCase();
      const cleanSchoolName = cleanText(rawSchool);

      if (!map[rawSchool]) {
        const matchedKey = Object.keys(OFFICIAL_ADDRESSES).find(k => 
          cleanSchoolName.includes(k) || k.includes(cleanSchoolName)
        );

        const officialAddr = matchedKey ? OFFICIAL_ADDRESSES[matchedKey] : `Barrio ${rawBarrio}, Aranjuez`;
        const count = Object.keys(map).length;

        map[rawSchool] = {
          id: `school-ie-${count + 1}`,
          name: rawSchool,
          shortName: rawSchool,
          barrio: rawBarrio,
          total: 0,
          critico: 0,
          medio: 0,
          bajo: 0,
          sumAttendance: 0,
          address: officialAddr,
          phone: '+57 (604) 211-0000',
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
        lat: 0,
        lng: 0,
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

  const filteredSchools = useMemo(() => {
    if (!search) return dynamicSchools;
    const term = cleanText(search);
    return dynamicSchools.filter(s => 
      cleanText(s.name).includes(term) || cleanText(s.barrio).includes(term) || cleanText((s as { address?: string }).address || '').includes(term)
    );
  }, [dynamicSchools, search]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600">TERRITORIO</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
            Directorio Territorial de Instituciones
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Monitoreo y direcciones oficiales de las {dynamicSchools.length} Instituciones Educativas de la Comuna 4.
          </p>
        </div>

        {/* Buscador de colegios */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por colegio o dirección..."
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl ring-1 ring-slate-200 text-sm outline-none focus:ring-2 ring-primary-500 shadow-sm"
          />
        </div>
      </div>

      {/* Grid de Tarjetas de Instituciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSchools.map((s) => {
          const meta = riskMeta[s.riskLevel];
          return (
            <motion.div
              key={s.id}
              whileHover={{ y: -3 }}
              onClick={() => setSelected(s)}
              className="bg-white rounded-2xl p-5 ring-1 ring-slate-200 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    <Building2 className="w-3.5 h-3.5 text-primary-600" />
                    {s.barrio}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${meta.bg} ${meta.text}`}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
                    {meta.label}
                  </span>
                </div>

                <h3 className="font-display font-bold text-slate-900 text-base leading-snug line-clamp-2">
                  {s.name}
                </h3>

                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{(s as { address?: string }).address}</span>
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Asistencia Promedio: <strong className="text-slate-800">{s.attendance}%</strong></span>
                <span className="text-primary-600 font-semibold hover:underline">Ver detalles →</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal interactivo con Detalles */}
      <AnimatePresence>
        {selected && (
          <SchoolModal school={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function SchoolModal({ school, onClose }: { school: School; onClose: () => void }) {
  const meta = riskMeta[school.riskLevel];
  const fullAddress = (school as { address?: string }).address || `Barrio ${school.barrio}, Aranjuez`;

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
