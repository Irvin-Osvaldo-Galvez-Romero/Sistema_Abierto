/**
 * Servicio de Modelo Dual
 */

import api from './api.service';
import { EstatusPruebaModeloDual, TipoPruebaModeloDual, TipoIngresoModeloDual, EstatusEstudianteModeloDual } from '../types/modelo-dual.types';

const resource = '/modelo-dual';

const ModeloDualService = {
  /**
   * Subir prueba psicológica (estudiante)
   */
  async subirPrueba(payload: {
    tipoPrueba: TipoPruebaModeloDual;
    nombrePrueba: string;
    descripcion?: string;
    fechaAplicacion?: string;
    fechaVencimiento?: string;
    resultado?: string;
    puntuacion?: number;
    interpretacion?: string;
    recomendaciones?: string;
    archivo: File;
  }) {
    const formData = new FormData();
    formData.append('tipoPrueba', payload.tipoPrueba);
    formData.append('nombrePrueba', payload.nombrePrueba);
    if (payload.descripcion) formData.append('descripcion', payload.descripcion);
    if (payload.fechaAplicacion) formData.append('fechaAplicacion', payload.fechaAplicacion);
    if (payload.fechaVencimiento) formData.append('fechaVencimiento', payload.fechaVencimiento);
    if (payload.resultado) formData.append('resultado', payload.resultado);
    if (payload.puntuacion !== undefined) formData.append('puntuacion', String(payload.puntuacion));
    if (payload.interpretacion) formData.append('interpretacion', payload.interpretacion);
    if (payload.recomendaciones) formData.append('recomendaciones', payload.recomendaciones);
    formData.append('archivo', payload.archivo);

    const response = await api.post(resource, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.data;
  },

  /**
   * Obtener pruebas del estudiante
   */
  async obtenerMisPruebas() {
    const response = await api.get(`${resource}/mis`);
    return response.data.data;
  },

  /**
   * Listar pruebas para administrador
   */
  async listar(estatus?: EstatusPruebaModeloDual, tipoPrueba?: TipoPruebaModeloDual) {
    const params: any = {};
    if (estatus) params.estatus = estatus;
    if (tipoPrueba) params.tipoPrueba = tipoPrueba;

    const response = await api.get(resource, { params });
    return response.data.data;
  },

  /**
   * Revisar prueba (validar/rechazar)
   */
  async revisarPrueba(params: {
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
   * Descargar archivo asociado
   */
  async descargarArchivo(id: string, tipo: 'original' | 'validado') {
    const response = await api.get(`${resource}/${id}/archivo`, {
      params: { tipo },
      responseType: 'blob',
    });
    return response;
  },

  /**
   * Obtener formatos disponibles
   */
  async obtenerFormatos() {
    const response = await api.get(`${resource}/formatos`);
    return response.data.data;
  },

  /**
   * Crear formato (admin)
   */
  async crearFormato(payload: {
    nombre: string;
    descripcion?: string;
    tipo: string;
    urlDescarga?: string;
    qrCode?: string;
    orden?: number;
    archivo?: File;
  }) {
    const formData = new FormData();
    formData.append('nombre', payload.nombre);
    if (payload.descripcion) formData.append('descripcion', payload.descripcion);
    formData.append('tipo', payload.tipo);
    if (payload.urlDescarga) formData.append('urlDescarga', payload.urlDescarga);
    if (payload.qrCode) formData.append('qrCode', payload.qrCode);
    if (payload.orden) formData.append('orden', String(payload.orden));
    if (payload.archivo) formData.append('archivo', payload.archivo);

    const response = await api.post(`${resource}/formatos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  /**
   * Obtener convenios
   */
  async obtenerConvenios(vigentes: boolean = true) {
    const response = await api.get(`${resource}/convenios`, {
      params: { vigentes },
    });
    return response.data.data;
  },

  /**
   * Crear convenio (admin)
   */
  async crearConvenio(payload: {
    nombreEmpresa: string;
    razonSocial?: string;
    contacto?: string;
    email?: string;
    telefono?: string;
    direccion?: string;
    sector?: string;
    fechaInicio?: string;
    fechaFin?: string;
    descripcion?: string;
    condiciones?: string;
    urlConvenio?: string;
    qrCode?: string;
  }) {
    const response = await api.post(`${resource}/convenios`, payload);
    return response.data.data;
  },

  /**
   * Inscribir estudiante al Modelo Dual
   */
  async inscribirEstudiante(payload: {
    tipoIngreso: TipoIngresoModeloDual;
    periodo: string;
    convenioId?: string;
  }) {
    const response = await api.post(`${resource}/inscribir`, payload);
    return response.data.data;
  },

  /**
   * Obtener proceso del estudiante
   */
  async obtenerMiProceso() {
    const response = await api.get(`${resource}/mi-proceso`);
    return response.data.data;
  },

  /**
   * Listar estudiantes del Modelo Dual (admin)
   */
  async listarEstudiantes(estatus?: EstatusEstudianteModeloDual, periodo?: string) {
    const params: any = {};
    if (estatus) params.estatus = estatus;
    if (periodo) params.periodo = periodo;

    const response = await api.get(`${resource}/estudiantes`, { params });
    return response.data.data;
  },
};

export default ModeloDualService;

