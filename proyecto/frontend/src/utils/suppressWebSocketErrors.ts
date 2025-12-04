/**
 * Utilidad para suprimir errores de WebSocket del webpack-dev-server
 * Esto evita que aparezcan errores molestos en la consola durante el desarrollo
 */

export const suppressWebSocketErrors = () => {
  if (process.env.NODE_ENV !== 'development') {
    return; // Solo en desarrollo
  }

  // Interceptar console.error para filtrar errores de WebSocket
  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    
    // Filtrar errores relacionados con WebSocket del dev server
    if (
      message.includes('WebSocket') ||
      message.includes('ws://') ||
      message.includes('WebSocketClient') ||
      message.includes('Failed to load resource: the server responded with a status of')
    ) {
      // Verificar si es específicamente un error de WebSocket del dev server
      const isWebSocketError = 
        message.includes('ws://localhost:3000') ||
        message.includes('WebSocket connection to') ||
        args.some(arg => 
          typeof arg === 'string' && 
          (arg.includes('WebSocketClient') || arg.includes('ws://'))
        );
      
      if (isWebSocketError) {
        return; // No mostrar este error
      }
    }
    
    originalError.apply(console, args);
  };

  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    
    // Filtrar warnings de WebSocket
    if (
      message.includes('WebSocket') ||
      message.includes('ws://') ||
      message.includes('WebSocketClient')
    ) {
      return; // No mostrar este warning
    }
    
    originalWarn.apply(console, args);
  };

  // También interceptar errores no capturados relacionados con WebSocket
  window.addEventListener('error', (event) => {
    if (
      event.message?.includes('WebSocket') ||
      event.message?.includes('ws://') ||
      event.filename?.includes('WebSocketClient')
    ) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, true);
};

