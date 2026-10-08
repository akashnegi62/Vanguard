import type { Metadata } from 'next';
import './globals.css';
import StoreInitializer from '@/components/StoreInitializer';

export const metadata: Metadata = {
  title: 'VANGUARD — Modern Men’s Fashion & Sartorial Essentials',
  description: 'Discover luxury heavyweight tees, selvedge denim, tailored trousers, and premium outerwear. Engineered for the modern discerning gentleman.',
  keywords: "men's fashion, luxury clothing, selvedge denim, tailored trousers, heavyweight tees, minimalist menswear",
  openGraph: {
    title: 'VANGUARD — Modern Men’s Fashion',
    description: 'Elevated essentials and tailored menswear crafted with artisanal fabrics.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-obsidian-950 text-obsidian-100 flex flex-col antialiased">
        <StoreInitializer />
        {children}
      </body>
    </html>
  );
}
