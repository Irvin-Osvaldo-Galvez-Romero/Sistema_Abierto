export type EstatusCreditoComplementario =
  | 'PENDIENTE'
  | 'EN_REVISION'
  | 'VALIDADO'
  | 'RECHAZADO';

export type TipoCreditoComplementario =
  | 'ACTIVIDADES_EXTRACURRICULARES'
  | 'CURSOS'
  | 'TUTORIAS'
  | 'ACTIVIDADES_CULTURALES';

export interface CreditoArchivoInfo {
  ruta: string | null;
  mimeType: string | null;
  tamano: number | null;
}

export interface ArchivoCreditoAdicional {
  id: string;
  horas: number | null;
  rutaArchivo: string;
  nombreOriginal: string | null;
  createdAt: string;
}

export interface CreditoComplementario {
  id: string;
  numero: number;
  tipo: TipoCreditoComplementario;
  titulo: string;
  descripcion: string;
  horasCurso?: number | null;
  horasTotales?: number | null;
  estatus: EstatusCreditoComplementario;
  motivoRechazo?: string | null;
  observaciones?: string | null;
  archivoOriginal: string;
  archivoCombinado?: string | null; // PDF combinado (solo para administradores, CURSOS con múltiples archivos)
  archivoValidacionGenerada?: string | null;
  archivoValidado?: string | null;
  mimeTypeOriginal: string;
  tamanoOriginal: number;
  mimeTypeValidado?: string | null;
  tamanoValidado?: number | null;
  fechaEnvio: string;
  fechaRevision?: string | null;
  revisadoPorId?: string | null;
  archivosAdicionales?: ArchivoCreditoAdicional[];
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
    } | null;
  };
}


