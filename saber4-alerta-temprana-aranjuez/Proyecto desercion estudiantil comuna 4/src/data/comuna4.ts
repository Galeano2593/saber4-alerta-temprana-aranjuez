export type RiskLevel = 'estable' | 'acompanamiento' | 'critico';

// MML: Definición de las 4 dimensiones de riesgo según el Árbol del Problema
export interface RiskBreakdown {
  academico: number;  // 0-100%
  economico: number;  // 0-100%
  personal: number;   // 0-100%
  familiar: number;   // 0-100%
}

export interface School {
  id: string;
  name: string;
  shortName: string;
  lat: number;
  lng: number;
  barrio: string;
  students: number;
  attendance: number; // %
  avgGrade: number; // 0-5
  riskLevel: RiskLevel;
  environmentAlert: number; // 0-100
  projects: string[];
  phone: string;
}

export interface StudentRecord {
  id: string;
  name: string;
  grade: '9°' | '10°' | '11°'; // MML: Delimitado estrictamente a grados 9.º, 10.º y 11.º
  school: string;
  barrio: string;
  attendance: number;
  avgGrade: number;
  riskLevel: RiskLevel;
  riskBreakdown: RiskBreakdown; // MML: Detalle por dimensión de riesgo
  guardian: string;
  guardianPhone: string;
  lastAlert: string;
}

export const BARRIOS_COMUNA4 = [
  'Aranjuez',
  'Berlín',
  'Campo Valdés No. 1',
  'Campo Valdés No. 2',
  'El Brasil',
  'La Piñuela',
  'Las Esmeraldas',
  'Los Álamos',
  'Moravia',
  'Palermo',
  'San Isidro',
  'San Pedro',
  'Sevilla',
  'San José del Cima No. 1',
  'Universidad (Sector)',
] as const;

export const SCHOOLS: School[] = [
  {
    id: 'gilberto-alzate',
    name: 'I.E. Gilberto Alzate Avendaño',
    shortName: 'Gilberto Alzate',
    lat: 6.2758,
    lng: -75.5592,
    barrio: 'Aranjuez',
    students: 142,
    attendance: 92,
    avgGrade: 3.8,
    riskLevel: 'estable',
    environmentAlert: 28,
    projects: ['Club de Robótica', 'Escuela de Música Llanera', 'Huerta Escolar'],
    phone: '(604) 259 12 34',
  },
  {
    id: 'ie-aranjuez',
    name: 'I.E. Aranjuez',
    shortName: 'I.E. Aranjuez',
    lat: 6.2812,
    lng: -75.5561,
    barrio: 'Aranjuez',
    students: 118,
    attendance: 84,
    avgGrade: 3.2,
    riskLevel: 'acompanamiento',
    environmentAlert: 52,
    projects: ['Programa de Lectura', 'Grupo de Danza Folclórica', 'Orientación Vocacional'],
    phone: '(604) 259 56 78',
  },
  {
    id: 'ie-berlin',
    name: 'I.E. Berlín',
    shortName: 'I.E. Berlín',
    lat: 6.2848,
    lng: -75.5541,
    barrio: 'Berlín',
    students: 97,
    attendance: 90,
    avgGrade: 3.6,
    riskLevel: 'estable',
    environmentAlert: 33,
    projects: ['Banda de Música', 'Fútbol Formativo', 'Medio Ambiente Escolar'],
    phone: '(604) 259 77 88',
  },
  {
    id: 'ie-campo-valdes-1',
    name: 'I.E. Campo Valdés No. 1',
    shortName: 'Campo Valdés No. 1',
    lat: 6.2865,
    lng: -75.5682,
    barrio: 'Campo Valdés No. 1',
    students: 123,
    attendance: 81,
    avgGrade: 3.1,
    riskLevel: 'critico',
    environmentAlert: 61,
    projects: ['Prevención del Ausentismo', 'Escuela de Padres', 'Vínculos Comunitarios'],
    phone: '(604) 259 22 33',
  },
  {
    id: 'ie-campo-valdes-2',
    name: 'I.E. Campo Valdés No. 2',
    shortName: 'Campo Valdés No. 2',
    lat: 6.2891,
    lng: -75.5658,
    barrio: 'Campo Valdés No. 2',
    students: 104,
    attendance: 86,
    avgGrade: 3.3,
    riskLevel: 'acompanamiento',
    environmentAlert: 45,
    projects: ['Refuerzo Escolar', 'Jornadas Deportivas', 'Apoyo Nutricional'],
    phone: '(604) 259 44 55',
  },
  {
    id: 'ie-el-brasil',
    name: 'Sede El Brasil',
    shortName: 'El Brasil',
    lat: 6.2735,
    lng: -75.5512,
    barrio: 'El Brasil',
    students: 78,
    attendance: 88,
    avgGrade: 3.4,
    riskLevel: 'acompanamiento',
    environmentAlert: 44,
    projects: ['Círculo de Lectura', 'Taller de Artes', 'Escuela de Valores'],
    phone: '(604) 259 66 77',
  },
  {
    id: 'ie-la-pinuela',
    name: 'Sede La Piñuela',
    shortName: 'La Piñuela',
    lat: 6.2685,
    lng: -75.5578,
    barrio: 'La Piñuela',
    students: 69,
    attendance: 74,
    avgGrade: 2.8,
    riskLevel: 'critico',
    environmentAlert: 66,
    projects: ['Intervención Psicosocial', 'Alfabetización Digital', 'Vínculos Familiares'],
    phone: '(604) 259 11 22',
  },
  {
    id: 'ie-las-esmeraldas',
    name: 'Sede Las Esmeraldas',
    shortName: 'Las Esmeraldas',
    lat: 6.2825,
    lng: -75.5498,
    barrio: 'Las Esmeraldas',
    students: 82,
    attendance: 91,
    avgGrade: 3.7,
    riskLevel: 'estable',
    environmentAlert: 30,
    projects: ['Coro Infantil', 'Ciencias Naturales', 'Liderazgo Estudiantil'],
    phone: '(604) 259 88 99',
  },
  {
    id: 'ie-los-alamos',
    name: 'Sede Los Álamos',
    shortName: 'Los Álamos',
    lat: 6.2798,
    lng: -75.5645,
    barrio: 'Los Álamos',
    students: 91,
    attendance: 85,
    avgGrade: 3.2,
    riskLevel: 'acompanamiento',
    environmentAlert: 49,
    projects: ['Club de Ciencias', 'Educación Ambiental', 'Orientación Vocacional'],
    phone: '(604) 259 33 11',
  },
  {
    id: 'ie-moravia',
    name: 'Sede Moravia',
    shortName: 'Moravia',
    lat: 6.2702,
    lng: -75.5672,
    barrio: 'Moravia',
    students: 113,
    attendance: 79,
    avgGrade: 3.0,
    riskLevel: 'critico',
    environmentAlert: 63,
    projects: ['Memoria Cultural del Barrio', 'Mediación Escolar', 'Apoyo a la Primera Infancia'],
    phone: '(604) 259 55 44',
  },
  {
    id: 'ie-palermo',
    name: 'Sede Palermo',
    shortName: 'Palermo',
    lat: 6.2752,
    lng: -75.5701,
    barrio: 'Palermo',
    students: 87,
    attendance: 89,
    avgGrade: 3.5,
    riskLevel: 'estable',
    environmentAlert: 35,
    projects: ['Taller de Teatro', 'Fútbol Femenino', 'Biblioteca Escolar'],
    phone: '(604) 259 77 66',
  },
  {
    id: 'ie-san-isidro',
    name: 'Sede San Isidro',
    shortName: 'San Isidro',
    lat: 6.2738,
    lng: -75.5655,
    barrio: 'San Isidro',
    students: 76,
    attendance: 83,
    avgGrade: 3.1,
    riskLevel: 'acompanamiento',
    environmentAlert: 50,
    projects: ['Huerta Comunitaria', 'Refuerzo Matemático', 'Escuela de Padres'],
    phone: '(604) 259 22 11',
  },
  {
    id: 'cipa',
    name: 'CIPA - Centro de Innovación Pedagógica Aranjuez',
    shortName: 'CIPA',
    lat: 6.2775,
    lng: -75.5618,
    barrio: 'San Pedro',
    students: 86,
    attendance: 88,
    avgGrade: 3.5,
    riskLevel: 'acompanamiento',
    environmentAlert: 41,
    projects: ['Laboratorio Digital', 'Artes Plásticas', 'Liderazgo Juvenil'],
    phone: '(604) 259 90 12',
  },
  {
    id: 'ie-sevilla',
    name: 'I.E. Sevilla',
    shortName: 'I.E. Sevilla',
    lat: 6.2712,
    lng: -75.5635,
    barrio: 'Sevilla',
    students: 134,
    attendance: 76,
    avgGrade: 2.9,
    riskLevel: 'critico',
    environmentAlert: 68,
    projects: ['Reforzamiento Matemático', 'Mediación Escolar', 'Apoyo Psicosocial'],
    phone: '(604) 259 33 45',
  },
  {
    id: 'ie-cima-1',
    name: 'Sede San José del Cima No. 1',
    shortName: 'San José del Cima No. 1',
    lat: 6.2678,
    lng: -75.5589,
    barrio: 'San José del Cima No. 1',
    students: 64,
    attendance: 82,
    avgGrade: 3.0,
    riskLevel: 'acompanamiento',
    environmentAlert: 47,
    projects: ['Educación para la Paz', 'Taller de Manualidades', 'Apoyo Nutricional'],
    phone: '(604) 259 44 22',
  },
  {
    id: 'ie-universidad',
    name: 'Sede Universidad (Sector)',
    shortName: 'Universidad (Sector)',
    lat: 6.2689,
    lng: -75.5535,
    barrio: 'Universidad (Sector)',
    students: 95,
    attendance: 93,
    avgGrade: 3.9,
    riskLevel: 'estable',
    environmentAlert: 25,
    projects: ['Pre-ICFES', 'Visitas Universitarias', 'Club de Debate'],
    phone: '(604) 259 66 33',
  },
];

// Estudiantes ajustados a grados 9.º, 10.º y 11.º con desglose de riesgo (MML)
export const STUDENTS: StudentRecord[] = [
  // Aranjuez
  { id: 's1', name: 'Juan David López', grade: '11°', school: 'I.E. Aranjuez', barrio: 'Aranjuez', attendance: 88, avgGrade: 3.5, riskLevel: 'acompanamiento', riskBreakdown: { academico: 40, economico: 60, personal: 20, familiar: 30 }, guardian: 'Carlos López', guardianPhone: '+57 301 555 0145', lastAlert: 'Hace 5 días' },
  { id: 's2', name: 'Santiago Quintero', grade: '11°', school: 'I.E. Gilberto Alzate Avendaño', barrio: 'Aranjuez', attendance: 93, avgGrade: 4.0, riskLevel: 'estable', riskBreakdown: { academico: 10, economico: 15, personal: 10, familiar: 10 }, guardian: 'Rocío Quintero', guardianPhone: '+57 315 555 0199', lastAlert: 'Sin alertas' },
  { id: 's3', name: 'Isabella Cardona', grade: '9°', school: 'I.E. Aranjuez', barrio: 'Aranjuez', attendance: 91, avgGrade: 3.7, riskLevel: 'estable', riskBreakdown: { academico: 15, economico: 20, personal: 10, familiar: 15 }, guardian: 'Andrés Cardona', guardianPhone: '+57 310 555 0110', lastAlert: 'Sin alertas' },
  // Berlín
  { id: 's4', name: 'Sara Camila Gómez', grade: '9°', school: 'I.E. Berlín', barrio: 'Berlín', attendance: 95, avgGrade: 4.1, riskLevel: 'estable', riskBreakdown: { academico: 10, economico: 10, personal: 5, familiar: 10 }, guardian: 'Adriana Gómez', guardianPhone: '+57 311 555 0188', lastAlert: 'Sin alertas' },
  { id: 's5', name: 'Manuela Toro', grade: '11°', school: 'I.E. Berlín', barrio: 'Berlín', attendance: 96, avgGrade: 4.3, riskLevel: 'estable', riskBreakdown: { academico: 5, economico: 10, personal: 5, familiar: 5 }, guardian: 'Esteban Toro', guardianPhone: '+57 316 555 0133', lastAlert: 'Sin alertas' },
  // Campo Valdés No. 1
  { id: 's6', name: 'Sebastián Mazo', grade: '10°', school: 'I.E. Campo Valdés No. 1', barrio: 'Campo Valdés No. 1', attendance: 71, avgGrade: 2.8, riskLevel: 'critico', riskBreakdown: { academico: 80, economico: 75, personal: 60, familiar: 70 }, guardian: 'Jhon Mazo', guardianPhone: '+57 320 555 0123', lastAlert: 'Hace 1 día' },
  { id: 's7', name: 'Mateo Ríos', grade: '10°', school: 'I.E. Campo Valdés No. 1', barrio: 'Campo Valdés No. 1', attendance: 68, avgGrade: 2.6, riskLevel: 'critico', riskBreakdown: { academico: 85, economico: 80, personal: 55, familiar: 65 }, guardian: 'Gloria Ríos', guardianPhone: '+57 301 555 0177', lastAlert: 'Hace 6 horas' },
  // Campo Valdés No. 2
  { id: 's8', name: 'Andrés Felipe Gallo', grade: '9°', school: 'I.E. Campo Valdés No. 2', barrio: 'Campo Valdés No. 2', attendance: 84, avgGrade: 3.2, riskLevel: 'acompanamiento', riskBreakdown: { academico: 45, economico: 50, personal: 30, familiar: 40 }, guardian: 'Liliana Gallo', guardianPhone: '+57 312 555 0100', lastAlert: 'Hace 3 días' },
  { id: 's9', name: 'Camila Ospina', grade: '9°', school: 'I.E. Campo Valdés No. 2', barrio: 'Campo Valdés No. 2', attendance: 90, avgGrade: 3.6, riskLevel: 'estable', riskBreakdown: { academico: 20, economico: 25, personal: 15, familiar: 20 }, guardian: 'Diana Ospina', guardianPhone: '+57 313 555 0201', lastAlert: 'Sin alertas' },
  // El Brasil
  { id: 's10', name: 'Tomás Agudelo', grade: '9°', school: 'Sede El Brasil', barrio: 'El Brasil', attendance: 87, avgGrade: 3.3, riskLevel: 'acompanamiento', riskBreakdown: { academico: 35, economico: 40, personal: 25, familiar: 35 }, guardian: 'Marlen Agudelo', guardianPhone: '+57 314 555 0202', lastAlert: 'Hace 2 días' },
  { id: 's11', name: 'Valentina Mesa', grade: '10°', school: 'Sede El Brasil', barrio: 'El Brasil', attendance: 92, avgGrade: 3.8, riskLevel: 'estable', riskBreakdown: { academico: 15, economico: 20, personal: 10, familiar: 15 }, guardian: 'Patricia Mesa', guardianPhone: '+57 311 555 0203', lastAlert: 'Sin alertas' },
  // La Piñuela
  { id: 's12', name: 'María José Restrepo', grade: '9°', school: 'Sede La Piñuela', barrio: 'La Piñuela', attendance: 64, avgGrade: 2.4, riskLevel: 'critico', riskBreakdown: { academico: 90, economico: 85, personal: 70, familiar: 80 }, guardian: 'Luz Mery Restrepo', guardianPhone: '+57 300 555 0102', lastAlert: 'Hace 2 días' },
  { id: 's13', name: 'Julián Andrés Pérez', grade: '10°', school: 'Sede La Piñuela', barrio: 'La Piñuela', attendance: 73, avgGrade: 2.7, riskLevel: 'critico', riskBreakdown: { academico: 75, economico: 70, personal: 65, familiar: 75 }, guardian: 'Beatriz Pérez', guardianPhone: '+57 318 555 0204', lastAlert: 'Hace 1 día' },
  // Las Esmeraldas
  { id: 's14', name: 'Sara Nichole Vargas', grade: '9°', school: 'Sede Las Esmeraldas', barrio: 'Las Esmeraldas', attendance: 94, avgGrade: 4.0, riskLevel: 'estable', riskBreakdown: { academico: 10, economico: 15, personal: 10, familiar: 10 }, guardian: 'Óscar Vargas', guardianPhone: '+57 315 555 0205', lastAlert: 'Sin alertas' },
  { id: 's15', name: 'Daniel Quintero', grade: '11°', school: 'Sede Las Esmeraldas', barrio: 'Las Esmeraldas', attendance: 89, avgGrade: 3.4, riskLevel: 'acompanamiento', riskBreakdown: { academico: 30, economico: 45, personal: 20, familiar: 35 }, guardian: 'Luz Quintero', guardianPhone: '+57 316 555 0206', lastAlert: 'Hace 4 días' },
  // Los Álamos
  { id: 's16', name: 'Daniela Zapata', grade: '9°', school: 'Sede Los Álamos', barrio: 'Los Álamos', attendance: 79, avgGrade: 3.0, riskLevel: 'acompanamiento', riskBreakdown: { academico: 50, economico: 55, personal: 40, familiar: 45 }, guardian: 'Fabián Zapata', guardianPhone: '+57 318 555 0144', lastAlert: 'Hace 4 días' },
  { id: 's17', name: 'Nicolás Ramírez', grade: '10°', school: 'Sede Los Álamos', barrio: 'Los Álamos', attendance: 85, avgGrade: 3.3, riskLevel: 'acompanamiento', riskBreakdown: { academico: 40, economico: 40, personal: 30, familiar: 35 }, guardian: 'Claudia Ramírez', guardianPhone: '+57 310 555 0207', lastAlert: 'Hace 2 días' },
  // Moravia
  { id: 's18', name: 'Samuel Pulgarín', grade: '9°', school: 'Sede Moravia', barrio: 'Moravia', attendance: 83, avgGrade: 3.1, riskLevel: 'acompanamiento', riskBreakdown: { academico: 45, economico: 50, personal: 35, familiar: 40 }, guardian: 'Marta Pulgarín', guardianPhone: '+57 314 555 0156', lastAlert: 'Hace 1 día' },
  { id: 's19', name: 'Stefany Giraldo', grade: '10°', school: 'Sede Moravia', barrio: 'Moravia', attendance: 70, avgGrade: 2.5, riskLevel: 'critico', riskBreakdown: { academico: 85, economico: 80, personal: 70, familiar: 75 }, guardian: 'Héctor Giraldo', guardianPhone: '+57 311 555 0208', lastAlert: 'Hace 3 horas' },
  // Palermo
  { id: 's20', name: 'David Alejandro Ruiz', grade: '9°', school: 'Sede Palermo', barrio: 'Palermo', attendance: 90, avgGrade: 3.6, riskLevel: 'estable', riskBreakdown: { academico: 20, economico: 20, personal: 15, familiar: 15 }, guardian: 'Gloria Ruiz', guardianPhone: '+57 312 555 0209', lastAlert: 'Sin alertas' },
  { id: 's21', name: 'Mariana López', grade: '10°', school: 'Sede Palermo', barrio: 'Palermo', attendance: 86, avgGrade: 3.2, riskLevel: 'acompanamiento', riskBreakdown: { academico: 40, economico: 45, personal: 30, familiar: 35 }, guardian: 'Jorge López', guardianPhone: '+57 313 555 0210', lastAlert: 'Hace 5 días' },
  // San Isidro
  { id: 's22', name: 'Juan José Mora', grade: '10°', school: 'Sede San Isidro', barrio: 'San Isidro', attendance: 82, avgGrade: 3.0, riskLevel: 'acompanamiento', riskBreakdown: { academico: 45, economico: 50, personal: 35, familiar: 40 }, guardian: 'Sandra Mora', guardianPhone: '+57 314 555 0211', lastAlert: 'Hace 1 día' },
  { id: 's23', name: 'Lucía Fernanda Toro', grade: '9°', school: 'Sede San Isidro', barrio: 'San Isidro', attendance: 76, avgGrade: 2.8, riskLevel: 'critico', riskBreakdown: { academico: 75, economico: 70, personal: 60, familiar: 65 }, guardian: 'Álvaro Toro', guardianPhone: '+57 316 555 0212', lastAlert: 'Hace 2 días' },
  // San Pedro
  { id: 's24', name: 'Valentina Mesa', grade: '9°', school: 'CIPA', barrio: 'San Pedro', attendance: 86, avgGrade: 3.3, riskLevel: 'acompanamiento', riskBreakdown: { academico: 35, economico: 40, personal: 30, familiar: 35 }, guardian: 'Patricia Mesa', guardianPhone: '+57 313 555 0167', lastAlert: 'Hace 3 días' },
  { id: 's25', name: 'Samuel Pulgarín', grade: '11°', school: 'CIPA', barrio: 'San Pedro', attendance: 83, avgGrade: 3.1, riskLevel: 'acompanamiento', riskBreakdown: { academico: 40, economico: 45, personal: 30, familiar: 40 }, guardian: 'Marta Pulgarín', guardianPhone: '+57 314 555 0156', lastAlert: 'Hace 1 día' },
  // Sevilla
  { id: 's26', name: 'Daniela Zapata', grade: '9°', school: 'I.E. Sevilla', barrio: 'Sevilla', attendance: 79, avgGrade: 3.0, riskLevel: 'acompanamiento', riskBreakdown: { academico: 50, economico: 55, personal: 40, familiar: 45 }, guardian: 'Fabián Zapata', guardianPhone: '+57 318 555 0144', lastAlert: 'Hace 4 días' },
  { id: 's27', name: 'María José Restrepo', grade: '11°', school: 'I.E. Sevilla', barrio: 'Sevilla', attendance: 64, avgGrade: 2.4, riskLevel: 'critico', riskBreakdown: { academico: 90, economico: 85, personal: 70, familiar: 80 }, guardian: 'Luz Mery Restrepo', guardianPhone: '+57 300 555 0102', lastAlert: 'Hace 2 días' },
  // San José del Cima No. 1
  { id: 's28', name: 'Kevin Andrés Saldarriaga', grade: '9°', school: 'Sede San José del Cima No. 1', barrio: 'San José del Cima No. 1', attendance: 81, avgGrade: 3.0, riskLevel: 'acompanamiento', riskBreakdown: { academico: 45, economico: 50, personal: 35, familiar: 40 }, guardian: 'Miriam Saldarriaga', guardianPhone: '+57 311 555 0213', lastAlert: 'Hace 3 días' },
  { id: 's29', name: 'Sara Milena Cano', grade: '10°', school: 'Sede San José del Cima No. 1', barrio: 'San José del Cima No. 1', attendance: 72, avgGrade: 2.6, riskLevel: 'critico', riskBreakdown: { academico: 80, economico: 75, personal: 65, familiar: 70 }, guardian: 'Roberto Cano', guardianPhone: '+57 318 555 0214', lastAlert: 'Hace 1 día' },
  // Universidad (Sector)
  { id: 's30', name: 'Mateo Gómez', grade: '11°', school: 'Sede Universidad (Sector)', barrio: 'Universidad (Sector)', attendance: 95, avgGrade: 4.2, riskLevel: 'estable', riskBreakdown: { academico: 10, economico: 15, personal: 5, familiar: 10 }, guardian: 'Liliana Gómez', guardianPhone: '+57 315 555 0215', lastAlert: 'Sin alertas' },
  { id: 's31', name: 'Paula Andrea Henao', grade: '9°', school: 'Sede Universidad (Sector)', barrio: 'Universidad (Sector)', attendance: 88, avgGrade: 3.5, riskLevel: 'acompanamiento', riskBreakdown: { academico: 35, economico: 40, personal: 25, familiar: 30 }, guardian: 'Jairo Henao', guardianPhone: '+57 316 555 0216', lastAlert: 'Hace 6 días' },
];

export const METRICS = {
  studentsMonitored: 1240,
  institutions: 14,
  alertsAttended: 85,
};

// Tendencia mensual
export const MONTHLY_TREND = [
  { month: 'Mar', asistencia: 82, alertas: 38, atendidas: 30 },
  { month: 'Abr', asistencia: 84, alertas: 35, atendidas: 31 },
  { month: 'May', asistencia: 86, alertas: 32, atendidas: 29 },
  { month: 'Jun', asistencia: 85, alertas: 40, atendidas: 33 },
  { month: 'Jul', asistencia: 87, alertas: 36, atendidas: 32 },
  { month: 'Ago', asistencia: 88, alertas: 30, atendidas: 27 },
];

export const RISK_BY_BARRIO = [
  { barrio: 'Aranjuez', estable: 58, acompanamiento: 30, critico: 12 },
  { barrio: 'Berlín', estable: 62, acompanamiento: 28, critico: 10 },
  { barrio: 'Campo Valdés No. 1', estable: 41, acompanamiento: 32, critico: 27 },
  { barrio: 'Campo Valdés No. 2', estable: 49, acompanamiento: 35, critico: 16 },
  { barrio: 'El Brasil', estable: 54, acompanamiento: 33, critico: 13 },
  { barrio: 'La Piñuela', estable: 36, acompanamiento: 34, critico: 30 },
  { barrio: 'Las Esmeraldas', estable: 64, acompanamiento: 27, critico: 9 },
  { barrio: 'Los Álamos', estable: 50, acompanamiento: 34, critico: 16 },
  { barrio: 'Moravia', estable: 39, acompanamiento: 33, critico: 28 },
  { barrio: 'Palermo', estable: 57, acompanamiento: 30, critico: 13 },
  { barrio: 'San Isidro', estable: 47, acompanamiento: 35, critico: 18 },
  { barrio: 'San Pedro', estable: 51, acompanamiento: 33, critico: 16 },
  { barrio: 'Sevilla', estable: 38, acompanamiento: 34, critico: 28 },
  { barrio: 'San José del Cima No. 1', estable: 44, acompanamiento: 36, critico: 20 },
  { barrio: 'Universidad (Sector)', estable: 66, acompanamiento: 26, critico: 8 },
];

export const riskMeta: Record<RiskLevel, { label: string; color: string; bg: string; text: string; ring: string }> = {
  estable: { label: 'Estable', color: '#10b981', bg: 'bg-success-100', text: 'text-success-700', ring: 'ring-success-500' },
  acompanamiento: { label: 'Acompañamiento', color: '#f59e0b', bg: 'bg-warning-100', text: 'text-warning-700', ring: 'ring-warning-500' },
  critico: { label: 'Riesgo Crítico', color: '#ef4444', bg: 'bg-error-100', text: 'text-error-700', ring: 'ring-error-500' },
};
