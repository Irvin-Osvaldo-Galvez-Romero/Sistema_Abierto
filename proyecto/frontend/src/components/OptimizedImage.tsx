/**
 * Componente de Imagen Optimizada
 * Lazy loading, placeholder y optimización automática
 */

import React, { useState, useRef, useEffect } from 'react';
import { Box, Skeleton, CircularProgress } from '@mui/material';
import { optimizeImage } from '../utils/performance';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  placeholder?: 'skeleton' | 'spinner' | 'blur';
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  placeholder = 'skeleton',
  className,
  style,
  onLoad,
  onError,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Optimizar URL de la imagen
  const optimizedSrc = optimizeImage(src, width, height);

  // Intersection Observer para lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    onError?.();
  };

  const renderPlaceholder = () => {
    switch (placeholder) {
      case 'spinner':
        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: width || '100%',
              height: height || 200,
              backgroundColor: '#f5f5f5',
            }}
          >
            <CircularProgress size={40} sx={{ color: '#008000' }} />
          </Box>
        );
      case 'blur':
        return (
          <Box
            sx={{
              width: width || '100%',
              height: height || 200,
              backgroundColor: '#f0f0f0',
              backgroundImage: `
                linear-gradient(45deg, transparent 40%, rgba(0,128,0,0.1) 50%, transparent 60%),
                linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)
              `,
              backgroundSize: '200% 200%, 100% 100%',
              animation: 'shimmer 2s infinite',
              '@keyframes shimmer': {
                '0%': {
                  backgroundPosition: '-200% 0, 0 0',
                },
                '100%': {
                  backgroundPosition: '200% 0, 0 0',
                },
              },
            }}
          />
        );
      default: // skeleton
        return (
          <Skeleton
            variant="rectangular"
            width={width || '100%'}
            height={height || 200}
            animation="wave"
          />
        );
    }
  };

  if (error) {
    return (
      <Box
        ref={imgRef}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: width || '100%',
          height: height || 200,
          backgroundColor: '#f5f5f5',
          border: '2px dashed #ccc',
          color: '#666',
          ...style,
        }}
        className={className}
      >
        Error al cargar imagen
      </Box>
    );
  }

  return (
    <Box
      ref={imgRef}
      sx={{
        position: 'relative',
        width: width || '100%',
        height: height || 'auto',
        overflow: 'hidden',
        ...style,
      }}
      className={className}
    >
      {!loaded && renderPlaceholder()}
      
      {inView && (
        <img
          src={optimizedSrc}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
    </Box>
  );
};

export default OptimizedImage;
