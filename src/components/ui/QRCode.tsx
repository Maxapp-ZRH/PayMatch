'use client';

import { useEffect, useRef } from 'react';
import QRCodeLib from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
  alt?: string;
}

export function QRCode({
  value,
  size = 96,
  className = '',
  alt = 'QR Code',
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCodeLib.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      }).catch((error) => {
        console.error('QR Code generation failed:', error);
      });
    }
  }, [value, size]);

  return (
    <canvas ref={canvasRef} className={className} aria-label={alt} role="img" />
  );
}
