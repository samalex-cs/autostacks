import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'AutoStack - Premium Car Marketplace',
    template: '%s | AutoStack',
  },
  description:
    'Discover your perfect car at AutoStack. Browse new and used vehicles, book test drives, and find the best deals on premium automobiles.',
  keywords: [
    'cars',
    'new cars',
    'used cars',
    'car marketplace',
    'test drive',
    'automobile',
    'vehicle',
  ],
  authors: [{ name: 'AutoStack' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'AutoStack',
    title: 'AutoStack - Premium Car Marketplace',
    description:
      'Discover your perfect car at AutoStack. Browse new and used vehicles, book test drives, and find the best deals.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AutoStack - Premium Car Marketplace',
    description:
      'Discover your perfect car at AutoStack. Browse new and used vehicles, book test drives, and find the best deals.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

