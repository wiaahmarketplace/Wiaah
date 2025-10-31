import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Sidebar } from '@/components/sidebar';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/lib/cart-context';
import { LanguageProvider } from '@/lib/i18n/language-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wiaah - Discover Amazing Images',
  description: 'Explore and discover stunning images from around the world',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <CartProvider>
            <div className="flex min-h-screen overflow-x-hidden">
              <Sidebar />
              <div className="flex-1 ml-56 overflow-x-hidden">
                <main className="bg-gray-50">{children}</main>
              </div>
            </div>
            <Toaster />
            <SonnerToaster />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
