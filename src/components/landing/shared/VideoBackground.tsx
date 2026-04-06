import { useEffect, useRef, useState, useCallback } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

interface VideoBackgroundProps {
  videoSrc: string;
  posterSrc: string;
  overlayOpacity?: number;
  className?: string;
}

const FALLBACK_GRADIENT =
  'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)';

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isMobile;
}

export function VideoBackground({
  videoSrc,
  posterSrc,
  overlayOpacity = 0.6,
  className = '',
}: VideoBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const isInView = useInView(containerRef, { once: true, margin: '200px' });
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const showVideo = isInView && !isMobile && !prefersReducedMotion && !videoFailed;

  const handleError = useCallback(() => {
    setVideoFailed(true);
  }, []);

  const handleCanPlay = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  useEffect(() => {
    if (!showVideo || !videoRef.current) return;
    videoRef.current.play().catch(() => {
      setVideoFailed(true);
    });
  }, [showVideo]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Poster / fallback layer -- always present */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${posterSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Gradient fallback when poster is also missing */}
      {!videoLoaded && (
        <div
          className="absolute inset-0"
          style={{ background: FALLBACK_GRADIENT }}
        />
      )}

      {/* Video layer -- only rendered on desktop with no reduced motion */}
      {showVideo && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={posterSrc}
          onError={handleError}
          onCanPlay={handleCanPlay}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: videoLoaded ? 1 : 0, transition: 'opacity 0.8s ease' }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
}
