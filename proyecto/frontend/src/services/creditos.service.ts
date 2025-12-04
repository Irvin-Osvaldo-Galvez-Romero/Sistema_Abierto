/**
 * Servicio de Créditos Complementarios
 */

import api from './api.service';
import { EstatusCreditoComplementario } from '../types/creditos.types';

const resource = '/creditos';

const CreditosService = {
  /**
   * Subir crédito (estudiante)
   */
  async subirCredito(payload: {
    numero?: number; // Para actualizar créditos rechazados
    tipo: 'ACTIVIDADES_EXTRACURRICULARES' | 'CURSOS' | 'TUTORIAS' | 'ACTIVIDADES_CULTURALES';
    titulo: string;
    descripcion: string;
    horasCurso?: number;
    archivo: File;
  }) {
    const formData = new FormData();
    if (payload.numero) {
      formData.append('numero', String(payload.numero));
    }
    formData.append('tipo', payload.tipo);
    formData.append('titulo', payload.titulo);
    formData.append('descripcion', payload.descripcion);
    if (payload.horasCurso) {
      formData.append('horasCurso', String(payload.horasCurso));
    }
    formData.append('archivo', payload.archivo);

    const response = await api.post(resource, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.data;
  },

  /**
   * Obtener créditos del estudiante
   */
  async obtenerMisCreditos() {
    const response = await api.get(`${resource}/mis`);
    return response.data.data;
  },

  /**
   * Listar créditos para administrador
   */
  async listar(estatus?: EstatusCreditoComplementario) {
    const response = await api.get(resource, {
      params: estatus ? { estatus } : undefined,
    });
    return response.data.data;
  },

  /**
   * Generar constancia para todos los créditos de un estudiante
   */
  async generarConstancia(estudianteId: string, fechaEmision?: string) {
    const response = await api.post(`${resource}/estudiante/${estudianteId}/generar-acta`, {
      fechaEmision,
    });
    return response.data.data;
  },

  /**
   * Revisar crédito (validar/rechazar)
   */
  async revisarCredito(params: {
    id: string;
    aprobado: boolean;
    motivoRechazo?: string;
    observaciones?: string;
    archivoFirmado?: File;
  }) {
    const formData = new FormData();
    formData.append('aprobado', String(params.aprobado));
    if (params.motivoRechazo) formData.append('motivoRechazo', params.motivoRechazo);
    if (params.observaciones) formData.append('observaciones', params.observaciones);
    if (params.archivoFirmado) {
      formData.append('archivo', params.archivoFirmado);
    }

    const response = await api.patch(`${resource}/${params.id}/revision`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  /**
   * Agregar archivo adicional a un crédito existente (para cursos)
   */
  async agregarArchivoAdicional(creditoId: string, horasCurso: number, archivo: File) {
    const formData = new FormData();
    formData.append('horasCurso', String(horasCurso));
    formData.append('archivo', archivo);

    const response = await api.post(`${resource}/${creditoId}/archivo-adicional`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.data;
  },

  /**
   * Descargar archivo asociado
   */
  async descargarArchivo(id: string, tipo: 'original' | 'generado' | 'firmado') {
    const response = await api.get(`${resource}/${id}/archivo`, {
      params: { tipo },
      responseType: 'blob',
    });
    return response;
  },
};

export default CreditosService;

