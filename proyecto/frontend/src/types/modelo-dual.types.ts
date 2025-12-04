export type EstatusPruebaModeloDual =
  | 'PENDIENTE'
  | 'EN_REVISION'
  | 'APROBADA'
  | 'RECHAZADA'
  | 'VENCIDA';

export type TipoPruebaModeloDual =
  | 'PSICOLOGICA'
  | 'APTITUDES'
  | 'PERSONALIDAD'
  | 'INTERESES_VOCACIONALES'
  | 'ORIENTACION_PROFESIONAL'
  | 'OTRA';

export type TipoFormatoModeloDual =
  | 'SOLICITUD_ADMISION'
  | 'RENOVACION'
  | 'CONVENIO'
  | 'CARTA_COMPROMISO'
  | 'FORMATO_EMPRESA'
  | 'OTRO';

export type TipoIngresoModeloDual = 'NUEVO_INGRESO' | 'RENOVACION';

export type EstatusEstudianteModeloDual =
  | 'EN_PROCESO'
  | 'DOCUMENTOS_PENDIENTES'
  | 'PRUEBAS_PENDIENTES'
  | 'CONVENIO_PENDIENTE'
  | 'APROBADO'
  | 'RECHAZADO'
  | 'FINALIZADO';

export interface PruebaModeloDual {
  id: string;
  estudianteId: string;
  tipoPrueba: TipoPruebaModeloDual;
  nombrePrueba: string;
  descripcion?: string | null;
  fechaAplicacion?: string | null;
  fechaVencimiento?: string | null;
  resultado?: string | null;
  puntuacion?: number | null;
  interpretacion?: string | null;
  recomendaciones?: string | null;
  archivoOriginal: string;
  mimeTypeOriginal: string;
  tamanoOriginal: number;
  hashOriginal?: string | null;
  estatus: EstatusPruebaModeloDual;
  revisadoPorId?: string | null;
  fechaRevision?: string | null;
  observaciones?: string | null;
  motivoRechazo?: string | null;
  archivoValidado?: string | null;
  mimeTypeValidado?: string | null;
  tamanoValidado?: number | null;
  hashValidado?: string | null;
  createdAt: string;
  updatedAt: string;
  estudiante?: {
    id: string;
    matricula: string;
    usuario: {
      nombre: string;
      apellidoPaterno: string | null;
      apellidoMaterno: string | null;
      email: string;
    };
    carrera?: {
      nombre: string;
      clave: string;
    } | null;
  };
  revisadoPor?: {
    nombre: string;
    apellidoPaterno: string | null;
    apellidoMaterno: string | null;
  } | null;
}

export interface FormatoModeloDual {
  id: string;
  nombre: string;
  descripcion?: string | null;
  tipo: TipoFormatoModeloDual;
  urlDescarga?: string | null;
  qrCode?: string | null;
  archivoLocal?: string | null;
  mimeType?: string | null;
  tamano?: number | null;
  activo: boolean;
  orden: number;
  createdAt: string;
  updatedAt: string;
  creadoPor?: {
    nombre: string;
    apellidoPaterno: string | null;
    apellidoMaterno: string | null;
  } | null;
}

export interface ConvenioModeloDual {
  id: string;
  nombreEmpresa: string;
  razonSocial?: string | null;
  contacto?: string | null;
  email?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  sector?: string | null;
  vigente: boolean;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  descripcion?: string | null;
  condiciones?: string | null;
  urlConvenio?: string | null;
  qrCode?: string | null;
  createdAt: string;
  updatedAt: string;
  creadoPor?: {
    nombre: string;
    apellidoPaterno: string | null;
    apellidoMaterno: string | null;
  } | null;
  estudiantes?: EstudianteModeloDual[];
}

export interface EstudianteModeloDual {
  id: string;
  estudianteId: string;
  convenioId?: string | null;
  tipoIngreso: TipoIngresoModeloDual;
  periodo: string;
  estatus: EstatusEstudianteModeloDual;
  solicitudSubida: boolean;
  solicitudAprobada: boolean;
  convenioFirmado: boolean;
  cartaCompromiso: boolean;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  observaciones?: string | null;
  createdAt: string;
  updatedAt: string;
  estudiante?: {
    id: string;
    matricula: string;
    usuario: {
      nombre: string;
      apellidoPaterno: string | null;
      apellidoMaterno: string | null;
      email: string;
    };
    carrera?: {
      nombre: string;
      clave: string;
    } | null;
  };
  convenio?: ConvenioModeloDual | null;
  pruebas?: PruebaModeloDual[];
}

