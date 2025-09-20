# Swiss QR-Bill Integration Documentation

## Overview

PayMatch integrates with the `swissqrbill` library to generate compliant Swiss QR-bill invoices. This library handles the complex Swiss QR-bill specifications and generates PDF invoices that meet Swiss banking standards.

## Library Information

- **Package**: `swissqrbill` v4.2.0
- **Dependencies**: `pdfkit` for PDF generation
- **License**: MIT
- **Support**: German, English, Italian, French invoices
- **Output**: PDF files and SVG graphics

## Installation

```bash
npm install swissqrbill pdfkit
```

## Import Patterns

### Server-Side (Node.js/Edge Functions)

```typescript
import { createWriteStream } from 'node:fs';
import PDFDocument from 'pdfkit';
import { SwissQRBill } from 'swissqrbill/pdf';
```

### Client-Side (Browser)

```typescript
import { SwissQRBill } from 'swissqrbill/svg';
```

## Core Data Structure

### Swiss QR-Bill Data Object

```typescript
interface SwissQRBillData {
  amount: number; // Invoice amount (e.g., 1994.75)
  currency: 'CHF' | 'EUR'; // Supported currencies
  creditor: {
    account: string; // IBAN format: "CH44 3199 9123 0008 8901 2"
    address: string; // Street name
    buildingNumber: number; // House number
    city: string; // City name
    country: 'CH' | 'DE' | 'FR' | 'IT'; // Country code
    name: string; // Company/person name
    zip: number; // Postal code
  };
  debtor: {
    address: string; // Client street name
    buildingNumber: number; // Client house number
    city: string; // Client city
    country: 'CH' | 'DE' | 'FR' | 'IT'; // Client country
    name: string; // Client name
    zip: number; // Client postal code
  };
  reference: string; // Payment reference (QR-IBAN format)
  additionalInformation?: string; // Optional additional info
  message?: string; // Optional message to debtor
}
```

## Basic Usage Examples

### 1. Simple QR-Bill PDF Generation

```typescript
// src/lib/swiss-qr-bill/simple-pdf.ts
import { createWriteStream } from 'node:fs';
import PDFDocument from 'pdfkit';
import { SwissQRBill } from 'swissqrbill/pdf';

export async function generateSimpleQRBill(
  data: SwissQRBillData
): Promise<Buffer> {
  const pdf = new PDFDocument({ size: 'A4' });
  const qrBill = new SwissQRBill(data);

  // Attach QR-bill to PDF
  qrBill.attachTo(pdf);

  // Convert to buffer
  const chunks: Buffer[] = [];
  pdf.on('data', (chunk) => chunks.push(chunk));

  return new Promise((resolve, reject) => {
    pdf.on('end', () => resolve(Buffer.concat(chunks)));
    pdf.on('error', reject);
    pdf.end();
  });
}
```

### 2. Complete Invoice with Custom Content

```typescript
// src/lib/swiss-qr-bill/complete-invoice.ts
import PDFDocument from 'pdfkit';
import { SwissQRBill } from 'swissqrbill/pdf';

export async function generateCompleteInvoice(
  invoiceData: InvoiceData,
  qrBillData: SwissQRBillData
): Promise<Buffer> {
  const pdf = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
  });

  // Add custom invoice content
  addInvoiceHeader(pdf, invoiceData);
  addInvoiceDetails(pdf, invoiceData);
  addInvoiceItems(pdf, invoiceData);
  addInvoiceFooter(pdf, invoiceData);

  // Add Swiss QR-bill at the bottom
  const qrBill = new SwissQRBill(qrBillData);
  qrBill.attachTo(pdf);

  return convertToBuffer(pdf);
}

function addInvoiceHeader(pdf: PDFDocument, data: InvoiceData) {
  // Company logo and details
  pdf.fontSize(20).text(data.company.name, 50, 50);
  pdf.fontSize(12).text(data.company.address, 50, 80);
  pdf.text(`${data.company.zip} ${data.company.city}`, 50, 95);

  // Invoice title and number
  pdf.fontSize(24).text('INVOICE', 400, 50);
  pdf.fontSize(12).text(`Invoice #${data.invoiceNumber}`, 400, 80);
  pdf.text(`Date: ${data.date}`, 400, 95);
}

function addInvoiceDetails(pdf: PDFDocument, data: InvoiceData) {
  // Bill to section
  pdf.fontSize(14).text('Bill To:', 50, 150);
  pdf.fontSize(12).text(data.client.name, 50, 170);
  pdf.text(data.client.address, 50, 185);
  pdf.text(`${data.client.zip} ${data.client.city}`, 50, 200);
}

function addInvoiceItems(pdf: PDFDocument, data: InvoiceData) {
  let yPosition = 250;

  // Table header
  pdf.fontSize(12).text('Description', 50, yPosition);
  pdf.text('Quantity', 300, yPosition);
  pdf.text('Rate', 400, yPosition);
  pdf.text('Amount', 500, yPosition);

  yPosition += 20;

  // Invoice items
  data.items.forEach((item) => {
    pdf.text(item.description, 50, yPosition);
    pdf.text(item.quantity.toString(), 300, yPosition);
    pdf.text(formatCurrency(item.rate), 400, yPosition);
    pdf.text(formatCurrency(item.amount), 500, yPosition);
    yPosition += 20;
  });

  // Total
  yPosition += 10;
  pdf.fontSize(14).text(`Total: ${formatCurrency(data.total)}`, 400, yPosition);
}

function addInvoiceFooter(pdf: PDFDocument, data: InvoiceData) {
  const yPosition = 600;

  pdf.fontSize(10).text('Payment Terms:', 50, yPosition);
  pdf.text(data.paymentTerms, 50, yPosition + 15);

  pdf.text('Thank you for your business!', 50, yPosition + 40);
}

function convertToBuffer(pdf: PDFDocument): Promise<Buffer> {
  const chunks: Buffer[] = [];
  pdf.on('data', (chunk) => chunks.push(chunk));

  return new Promise((resolve, reject) => {
    pdf.on('end', () => resolve(Buffer.concat(chunks)));
    pdf.on('error', reject);
    pdf.end();
  });
}
```

### 3. SVG QR-Bill for Web Display

```typescript
// src/lib/swiss-qr-bill/svg-generator.ts
import { SwissQRBill } from "swissqrbill/svg";

export function generateQRBillSVG(data: SwissQRBillData): string {
  const qrBill = new SwissQRBill(data);
  return qrBill.element.outerHTML;
}

// Usage in React component
export function QRBillPreview({ data }: { data: SwissQRBillData }) {
  const svgContent = generateQRBillSVG(data);

  return (
    <div
      className="qr-bill-preview"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
```

## Integration with PayMatch Features

### 1. Stripe Integration

```typescript
// src/lib/swiss-qr-bill/stripe-integration.ts
import { SwissQRBill } from 'swissqrbill/pdf';
import type { Invoice } from '@/types/database';

export function createQRBillFromStripeInvoice(
  stripeInvoice: any,
  clientData: any
) {
  return {
    amount: stripeInvoice.amount_due / 100, // Convert from cents
    currency: stripeInvoice.currency.toUpperCase(),
    creditor: {
      account: process.env.COMPANY_IBAN!,
      address: process.env.COMPANY_ADDRESS!,
      buildingNumber: parseInt(process.env.COMPANY_BUILDING_NUMBER!),
      city: process.env.COMPANY_CITY!,
      country: 'CH',
      name: process.env.COMPANY_NAME!,
      zip: parseInt(process.env.COMPANY_ZIP!),
    },
    debtor: {
      address: clientData.address,
      buildingNumber: clientData.buildingNumber,
      city: clientData.city,
      country: clientData.country,
      name: clientData.name,
      zip: clientData.zip,
    },
    reference: generatePaymentReference(stripeInvoice.id),
    additionalInformation: `Invoice #${stripeInvoice.number}`,
    message: 'Thank you for your business!',
  };
}

function generatePaymentReference(stripeInvoiceId: string): string {
  // Generate Swiss QR-IBAN compatible reference
  // Format: 21 00000 00003 13947 14300 09017
  const prefix = '21';
  const middle = '00000';
  const suffix = stripeInvoiceId
    .replace(/\D/g, '')
    .slice(-15)
    .padStart(15, '0');

  return `${prefix} ${middle} ${suffix.slice(0, 5)} ${suffix.slice(5, 10)} ${suffix.slice(10, 15)}`;
}
```

### 2. Multi-Language Support

```typescript
// src/lib/swiss-qr-bill/multi-language.ts
import { SwissQRBill } from 'swissqrbill/pdf';

export function generateLocalizedQRBill(
  data: SwissQRBillData,
  language: 'de' | 'en' | 'it' | 'fr'
) {
  const options = {
    language,
    size: 'A4',
    // Additional language-specific options
  };

  return new SwissQRBill(data, options);
}

// Language-specific invoice templates
export const INVOICE_TEMPLATES = {
  de: {
    title: 'RECHNUNG',
    billTo: 'Rechnung an:',
    description: 'Beschreibung',
    quantity: 'Menge',
    rate: 'Preis',
    amount: 'Betrag',
    total: 'Gesamtbetrag',
    paymentTerms: 'Zahlungsbedingungen',
    thankYou: 'Vielen Dank für Ihr Vertrauen!',
  },
  fr: {
    title: 'FACTURE',
    billTo: 'Facturé à:',
    description: 'Description',
    quantity: 'Quantité',
    rate: 'Prix',
    amount: 'Montant',
    total: 'Montant total',
    paymentTerms: 'Conditions de paiement',
    thankYou: 'Merci pour votre confiance!',
  },
  it: {
    title: 'FATTURA',
    billTo: 'Fatturato a:',
    description: 'Descrizione',
    quantity: 'Quantità',
    rate: 'Prezzo',
    amount: 'Importo',
    total: 'Importo totale',
    paymentTerms: 'Termini di pagamento',
    thankYou: 'Grazie per la vostra fiducia!',
  },
  en: {
    title: 'INVOICE',
    billTo: 'Bill To:',
    description: 'Description',
    quantity: 'Quantity',
    rate: 'Rate',
    amount: 'Amount',
    total: 'Total',
    paymentTerms: 'Payment Terms',
    thankYou: 'Thank you for your business!',
  },
};
```

### 3. Validation and Error Handling

```typescript
// src/lib/swiss-qr-bill/validation.ts
import { z } from 'zod';

export const swissQRBillSchema = z.object({
  amount: z.number().positive().max(999999999.99),
  currency: z.enum(['CHF', 'EUR']),
  creditor: z.object({
    account: z
      .string()
      .regex(/^CH[0-9]{2}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}\s[0-9]$/),
    address: z.string().min(1).max(70),
    buildingNumber: z.number().int().positive(),
    city: z.string().min(1).max(35),
    country: z.enum(['CH', 'DE', 'FR', 'IT']),
    name: z.string().min(1).max(70),
    zip: z.number().int().positive().max(9999),
  }),
  debtor: z.object({
    address: z.string().min(1).max(70),
    buildingNumber: z.number().int().positive(),
    city: z.string().min(1).max(35),
    country: z.enum(['CH', 'DE', 'FR', 'IT']),
    name: z.string().min(1).max(70),
    zip: z.number().int().positive().max(9999),
  }),
  reference: z
    .string()
    .regex(/^21\s[0-9]{5}\s[0-9]{5}\s[0-9]{5}\s[0-9]{5}\s[0-9]{5}$/),
  additionalInformation: z.string().max(140).optional(),
  message: z.string().max(140).optional(),
});

export function validateQRBillData(data: unknown) {
  try {
    return swissQRBillSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `QR-bill validation failed: ${error.errors.map((e) => e.message).join(', ')}`
      );
    }
    throw error;
  }
}
```

## Server Actions Integration

```typescript
// src/server/actions/invoices.ts
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { generateCompleteInvoice } from '@/lib/swiss-qr-bill/complete-invoice';
import { validateQRBillData } from '@/lib/swiss-qr-bill/validation';

export async function generateInvoicePDF(invoiceId: string) {
  const supabase = createSupabaseServerClient();

  // Get invoice data from database
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select(
      `
      *,
      client:clients(*),
      company:companies(*)
    `
    )
    .eq('id', invoiceId)
    .single();

  if (error || !invoice) {
    throw new Error('Invoice not found');
  }

  // Prepare QR-bill data
  const qrBillData = {
    amount: invoice.amount / 100, // Convert from cents
    currency: invoice.currency,
    creditor: {
      account: invoice.company.iban,
      address: invoice.company.address,
      buildingNumber: invoice.company.building_number,
      city: invoice.company.city,
      country: invoice.company.country,
      name: invoice.company.name,
      zip: invoice.company.zip,
    },
    debtor: {
      address: invoice.client.address,
      buildingNumber: invoice.client.building_number,
      city: invoice.client.city,
      country: invoice.client.country,
      name: invoice.client.name,
      zip: invoice.client.zip,
    },
    reference: invoice.payment_reference,
    additionalInformation: `Invoice #${invoice.invoice_number}`,
    message: 'Thank you for your business!',
  };

  // Validate data
  const validatedData = validateQRBillData(qrBillData);

  // Generate PDF
  const pdfBuffer = await generateCompleteInvoice(invoice, validatedData);

  return pdfBuffer;
}
```

## Environment Variables

Add these to your `.env.local`:

```bash
# Company information for QR-bill generation
COMPANY_NAME="Your Company Name"
COMPANY_IBAN="CH44 3199 9123 0008 8901 2"
COMPANY_ADDRESS="Your Street"
COMPANY_BUILDING_NUMBER="123"
COMPANY_CITY="Your City"
COMPANY_ZIP="1234"
```

## Error Handling

```typescript
// src/lib/swiss-qr-bill/error-handling.ts
export class SwissQRBillError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'SwissQRBillError';
  }
}

export function handleQRBillError(error: unknown): SwissQRBillError {
  if (error instanceof SwissQRBillError) {
    return error;
  }

  if (error instanceof Error) {
    return new SwissQRBillError(
      `QR-bill generation failed: ${error.message}`,
      'GENERATION_ERROR',
      { originalError: error.message }
    );
  }

  return new SwissQRBillError(
    'Unknown error occurred during QR-bill generation',
    'UNKNOWN_ERROR',
    { originalError: error }
  );
}
```

## Testing

```typescript
// src/lib/swiss-qr-bill/__tests__/qr-bill.test.ts
import { describe, it, expect } from 'vitest';
import { generateSimpleQRBill } from '../simple-pdf';
import { validateQRBillData } from '../validation';

describe('Swiss QR-Bill', () => {
  const validQRBillData = {
    amount: 1994.75,
    currency: 'CHF' as const,
    creditor: {
      account: 'CH44 3199 9123 0008 8901 2',
      address: 'Musterstrasse',
      buildingNumber: 7,
      city: 'Musterstadt',
      country: 'CH' as const,
      name: 'Test Company',
      zip: 1234,
    },
    debtor: {
      address: 'Client Street',
      buildingNumber: 1,
      city: 'Client City',
      country: 'CH' as const,
      name: 'Test Client',
      zip: 5678,
    },
    reference: '21 00000 00003 13947 14300 09017',
  };

  it('should validate QR-bill data correctly', () => {
    expect(() => validateQRBillData(validQRBillData)).not.toThrow();
  });

  it('should generate PDF buffer', async () => {
    const pdfBuffer = await generateSimpleQRBill(validQRBillData);
    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(0);
  });
});
```

## Best Practices

1. **Always validate data** before generating QR-bills
2. **Use proper error handling** for PDF generation failures
3. **Cache generated PDFs** for better performance
4. **Test with real Swiss bank data** for compliance
5. **Use TypeScript** for type safety with QR-bill data
6. **Implement proper logging** for debugging generation issues
7. **Follow Swiss QR-bill specifications** exactly for compliance

## Compliance Notes

- QR-bills are mandatory in Switzerland since October 1st, 2022
- All generated QR-bills must comply with Swiss banking standards
- Test with real Swiss bank accounts for validation
- Ensure proper IBAN format and reference number generation
- Support all required languages (DE, FR, IT, EN) for Swiss market
