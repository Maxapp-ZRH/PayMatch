/**
 * QR Code Component
 *
 * Generates real QR codes using the qrcode library for accurate QR code generation.
 * Provides proper QR code functionality for mobile installation and sharing.
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import QRCodeLib from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
  alt?: string;
}

export function QRCode({
  value,
  size,
  className = '',
  alt = 'QR Code',
}: QRCodeProps) {
  const [qrDataURL, setQrDataURL] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateQR = async () => {
      try {
        setError(null);
        // Use a high resolution for better quality when scaling
        const qrSize = size || 400;
        const dataURL = await QRCodeLib.toDataURL(value, {
          width: qrSize,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'M',
        });
        setQrDataURL(dataURL);
        setIsLoaded(true);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to generate QR code'
        );
        setIsLoaded(true);
      }
    };

    generateQR();
  }, [value, size]);

  if (!isLoaded) {
    return (
      <div
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={size ? { width: size, height: size } : undefined}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-lg flex items-center justify-center ${className}`}
        style={size ? { width: size, height: size } : undefined}
      >
        <div className="text-center p-4">
          <div className="text-red-600 text-sm font-medium">QR Code Error</div>
          <div className="text-red-500 text-xs mt-1">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${size ? 'inline-block' : 'block'} ${className}`}>
      <Image
        src={qrDataURL}
        alt={alt}
        width={size || 400}
        height={size || 400}
        className="rounded-lg w-full h-full object-cover"
        style={size ? { width: size, height: size } : undefined}
        unoptimized
      />
    </div>
  );
}
