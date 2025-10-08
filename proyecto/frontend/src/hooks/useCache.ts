/**
 * Hook personalizado para caché de datos
 * Evita llamadas repetitivas a la API
 */

import { useState, useEffect, useRef } from 'react';

interface CacheOptions {
  ttl?: number; // Time to live en milisegundos
  key: string;
}

interface CacheData<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheManager {
  private cache = new Map<string, CacheData<any>>();

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  has(key: string): boolean {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return false;
    }

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

const cacheManager = new CacheManager();

export function useCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: CacheOptions = { key }
): {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  clearCache: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchData = async () => {
    // Verificar caché primero
    const cachedData = cacheManager.get<T>(key);
    if (cachedData) {
      setData(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      
      if (mountedRef.current) {
        setData(result);
        // Guardar en caché
        cacheManager.set(key, result, options.ttl || 5 * 60 * 1000);
      }
    } catch (err: any) {
      if (mountedRef.current) {
        setError(err.message || 'Error al cargar datos');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const refetch = () => {
    cacheManager.clear(key);
    fetchData();
  };

  const clearCache = () => {
    cacheManager.clear(key);
    setData(null);
  };

  useEffect(() => {
    fetchData();

    return () => {
      mountedRef.current = false;
    };
  }, [key]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
  };
}

export default useCache;
