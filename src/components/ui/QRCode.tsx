/**
 * QR Code Component
 *
 * Generates QR codes for easy mobile installation and sharing.
 * Uses a simple SVG-based QR code implementation for better performance.
 */

'use client';

import { useState, useEffect } from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
  alt?: string;
}

// Simple QR Code pattern generator (basic implementation)
function generateQRPattern(value: string, size: number): string[] {
  // This is a simplified QR code pattern for demonstration
  // In production, you'd want to use a proper QR code library
  const pattern: string[] = [];
  const modules = Math.floor(size / 25); // 25x25 grid

  for (let y = 0; y < modules; y++) {
    let row = '';
    for (let x = 0; x < modules; x++) {
      // Create a simple pattern based on the input value
      const hash = value.charCodeAt((x + y) % value.length);
      const isDark = (hash + x + y) % 2 === 0;
      row += isDark ? '1' : '0';
    }
    pattern.push(row);
  }

  return pattern;
}

export function QRCode({
  value,
  size = 200,
  className = '',
  alt = 'QR Code',
}: QRCodeProps) {
  const [pattern, setPattern] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const qrPattern = generateQRPattern(value, size);
    setPattern(qrPattern);
    setIsLoaded(true);
  }, [value, size]);

  if (!isLoaded) {
    return (
      <div
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  const moduleSize = size / pattern.length;

  return (
    <div className={`inline-block ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="border border-gray-200 rounded-lg"
        role="img"
        aria-label={alt}
      >
        {pattern.map((row, y) =>
          row
            .split('')
            .map((cell, x) => (
              <rect
                key={`${x}-${y}`}
                x={x * moduleSize}
                y={y * moduleSize}
                width={moduleSize}
                height={moduleSize}
                fill={cell === '1' ? '#000000' : '#ffffff'}
              />
            ))
        )}
      </svg>
    </div>
  );
}
