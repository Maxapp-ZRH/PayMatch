import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/marketing_pages/Button';
import { Container } from '@/components/marketing_pages/Container';
import { TextField } from '@/components/marketing_pages/Fields';
import { NavLinks } from '@/components/marketing_pages/NavLinks';
import { QRCode } from '@/components/ui/QRCode';

function QrCodeBorder(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 96 96" fill="none" aria-hidden="true" {...props}>
      <path
        d="M1 17V9a8 8 0 0 1 8-8h8M95 17V9a8 8 0 0 0-8-8h-8M1 79v8a8 8 0 0 0 8 8h8M95 79v8a8 8 0 0 1-8 8h-8"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-gray-200">
      <Container>
        <div className="flex flex-col items-start justify-between gap-y-12 pt-16 pb-6 lg:flex-row lg:items-center lg:py-16">
          <div>
            <div className="flex items-center text-gray-900">
              <Image
                src="/logo.png"
                alt="PayMatch"
                width={40}
                height={40}
                className="h-10 w-10 flex-none"
              />
              <div className="ml-4">
                <p className="text-base font-semibold">PayMatch</p>
                <p className="mt-1 text-sm">
                  Invoices in sync, payments in check.
                </p>
              </div>
            </div>
            <nav className="mt-11 flex gap-8">
              <NavLinks />
            </nav>
          </div>
          <div className="group relative -mx-4 flex items-center self-stretch p-4 transition-colors hover:bg-gray-100 sm:self-auto sm:rounded-2xl lg:mx-0 lg:self-auto lg:p-6">
            <div className="relative flex h-24 w-24 flex-none items-center justify-center">
              <QrCodeBorder className="absolute inset-0 h-full w-full stroke-gray-300 transition-colors group-hover:stroke-teal-600" />
              <QRCode
                value="https://paymatch.app"
                size={80}
                className="rounded-lg"
                alt="QR Code to PayMatch.app"
              />
            </div>
            <div className="ml-8 lg:w-64">
              <p className="text-base font-semibold text-gray-900">
                <Link href="/register">
                  <span className="absolute inset-0 sm:rounded-2xl" />
                  Start invoicing today
                </Link>
              </p>
              <p className="mt-1 text-sm text-gray-700">
                Create your first Swiss QR-bill invoice in under 2 minutes.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 pb-12">
          {/* Links Section */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
            {/* Company & Support */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Company</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="https://maxappzrh.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Company
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="/brand"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Brand
                  </Link>
                </li>
                <li>
                  <Link
                    href="/downloads"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Downloads
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gdpr"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    GDPR
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Stay Updated
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Get the latest PayMatch updates and invoicing tips delivered to
                your inbox.
              </p>
              <form className="mt-4">
                <div className="flex gap-2">
                  <TextField
                    type="email"
                    aria-label="Email address"
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    className="flex-1 min-w-0"
                  />
                  <Button type="submit" color="cyan" className="flex-none">
                    Subscribe
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 flex flex-col items-center justify-between border-t border-gray-200 pt-8 md:flex-row">
            <p className="text-sm text-gray-500">
              &copy; Copyright {new Date().getFullYear()} PayMatch. All rights
              reserved.
            </p>
            <div className="mt-4 flex items-center space-x-4 md:mt-0">
              <p className="text-sm text-gray-500">
                Developed by{' '}
                <Link
                  href="https://maxappzrh.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gray-700 hover:text-gray-900"
                >
                  Maxapp ZRH
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
