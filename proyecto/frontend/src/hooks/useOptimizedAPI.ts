/**
 * Hook para llamadas API optimizadas
 * Combina debounce, caché y manejo de estado
 */

import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { useDebounce } from './useDebounce';
import { useCache } from './useCache';

interface UseOptimizedAPIOptions {
  debounceMs?: number;
  cacheKey?: string;
  cacheTTL?: number;
  initialData?: any;
}

export function useOptimizedAPI<T>(
  url: string,
  options: UseOptimizedAPIOptions = {}
) {
  const {
    debounceMs = 300,
    cacheKey,
    cacheTTL = 5 * 60 * 1000, // 5 minutos
    initialData = null,
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce del término de búsqueda
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  // Función para hacer la llamada API
  const fetchData = useCallback(async (
    searchParams: string = '',
    config: AxiosRequestConfig = {}
  ) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      const fullUrl = searchParams ? `${url}?${searchParams}` : url;
      
      const response = await axios.get(fullUrl, {
        ...config,
        headers: {
          Authorization: `Bearer ${token}`,
          ...config.headers,
        },
      });

      setData(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 
                          err.response?.data?.message || 
                          'Error al cargar datos';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url]);

  // Función para búsqueda con debounce
  const search = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // Función para refrescar datos
  const refresh = useCallback(() => {
    fetchData(debouncedSearchTerm);
  }, [fetchData, debouncedSearchTerm]);

  // Efecto para búsqueda con debounce
  useEffect(() => {
    if (debouncedSearchTerm !== undefined) {
      const searchParams = debouncedSearchTerm 
        ? `search=${encodeURIComponent(debouncedSearchTerm)}` 
        : '';
      fetchData(searchParams);
    }
  }, [debouncedSearchTerm, fetchData]);

  return {
    data,
    loading,
    error,
    search,
    refresh,
    searchTerm,
    debouncedSearchTerm,
    fetchData,
  };
}

// Hook especializado para listas con paginación
export function useOptimizedList<T>(
  url: string,
  options: UseOptimizedAPIOptions = {}
) {
  const api = useOptimizedAPI<T>(url, options);
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const loadPage = useCallback(async (newPage: number, newLimit?: number) => {
    const pageLimit = newLimit || limit;
    const searchParams = new URLSearchParams({
      page: newPage.toString(),
      limit: pageLimit.toString(),
    });

    if (api.debouncedSearchTerm) {
      searchParams.append('search', api.debouncedSearchTerm);
    }

    setPage(newPage);
    if (newLimit) setLimit(newLimit);

    // Usar la función fetchData del hook api
    return api.fetchData(searchParams.toString());
  }, [api.fetchData, api.debouncedSearchTerm, limit]);

  useEffect(() => {
    loadPage(page);
  }, [loadPage, page]);

  return {
    ...api,
    page,
    limit,
    total,
    setPage,
    setLimit,
    loadPage,
  };
}

export default useOptimizedAPI;
