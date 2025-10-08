/**
 * Utilidades de Performance
 * Optimización de imágenes y assets
 */

// Función para optimizar imágenes
export const optimizeImage = (src: string, width?: number, height?: number): string => {
  // Si es una imagen externa, usar servicios de optimización
  if (src.startsWith('http')) {
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    params.append('q', '80'); // Calidad 80%
    params.append('f', 'auto'); // Formato automático
    
    return `${src}?${params.toString()}`;
  }
  
  return src;
};

// Función para precargar imágenes críticas
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Función para precargar múltiples imágenes
export const preloadImages = async (sources: string[]): Promise<void> => {
  const promises = sources.map(preloadImage);
  await Promise.all(promises);
};

// Función para lazy loading de imágenes
export const createLazyImageObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void
): IntersectionObserver => {
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
  });
};

// Función para medir performance
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

// Función para debounce genérico
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Función para throttle genérico
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Función para crear un worker para tareas pesadas
export const createWorker = (workerFunction: Function): Worker => {
  const blob = new Blob([`(${workerFunction.toString()})()`], {
    type: 'application/javascript',
  });
  
  return new Worker(URL.createObjectURL(blob));
};

// Función para comprimir datos
export const compressData = async (data: any): Promise<string> => {
  const stream = new CompressionStream('gzip');
  const writer = stream.writable.getWriter();
  const reader = stream.readable.getReader();
  
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  
  // Escribir datos
  await writer.write(encoder.encode(JSON.stringify(data)));
  await writer.close();
  
  // Leer datos comprimidos
  const chunks = [];
  let done = false;
  
  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      chunks.push(value);
    }
  }
  
  const uint8Array = new Uint8Array(chunks.flat());
  return btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
};

// Función para descomprimir datos
export const decompressData = async (compressedData: string): Promise<any> => {
  const stream = new DecompressionStream('gzip');
  const writer = stream.writable.getWriter();
  const reader = stream.readable.getReader();
  
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  
  // Escribir datos comprimidos
  const binaryString = atob(compressedData);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  await writer.write(bytes);
  await writer.close();
  
  // Leer datos descomprimidos
  const chunks = [];
  let done = false;
  
  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      chunks.push(value);
    }
  }
  
  const uint8Array = new Uint8Array(chunks.flat());
  return JSON.parse(decoder.decode(uint8Array));
};
