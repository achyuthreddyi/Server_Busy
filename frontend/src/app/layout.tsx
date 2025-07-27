import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kaksha LM",
    template: "%s | Kaksha LM"
  },
  description: "Kaksha LM - AI-powered classroom management and learning platform for modern education. Manage classes, track student progress, and enhance teaching with intelligent assistance.",
  keywords: ["education", "learning management", "classroom", "teaching", "AI assistant", "student tracking"],
  authors: [{ name: "Kaksha LM Team" }],
  creator: "Kaksha LM",
  publisher: "Kaksha LM",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://kaksha-lm.app'), // Replace with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Kaksha LM - Learning Management Platform",
    description: "AI-powered classroom management and learning platform for modern education",
    url: 'https://kaksha-lm.app',
    siteName: 'Kaksha LM',
    images: [
      {
        url: '/og-image.png', // You can add this later
        width: 1200,
        height: 630,
        alt: 'Kaksha LM - Learning Management Platform',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kaksha LM - Learning Management Platform',
    description: 'AI-powered classroom management and learning platform for modern education',
    images: ['/og-image.png'], // You can add this later
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%23667eea;stop-opacity:1' /><stop offset='100%' style='stop-color:%23764ba2;stop-opacity:1' /></linearGradient></defs><rect width='100' height='100' rx='20' fill='url(%23grad)'/><path d='M25 30 L75 30 L75 35 L25 35 Z M25 45 L75 45 L75 50 L25 50 Z M25 60 L75 60 L75 65 L25 65 Z M30 25 L70 25 L70 75 L30 75 Z' fill='white' stroke='white' stroke-width='2'/></svg>",
        sizes: "32x32",
        type: "image/svg+xml",
      },
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%23667eea;stop-opacity:1' /><stop offset='100%' style='stop-color:%23764ba2;stop-opacity:1' /></linearGradient></defs><rect width='100' height='100' rx='20' fill='url(%23grad)'/><path d='M25 30 L75 30 L75 35 L25 35 Z M25 45 L75 45 L75 50 L25 50 Z M25 60 L75 60 L75 65 L25 65 Z M30 25 L70 25 L70 75 L30 75 Z' fill='white' stroke='white' stroke-width='2'/></svg>",
        sizes: "16x16",
        type: "image/svg+xml",
      }
    ],
    apple: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%23667eea;stop-opacity:1' /><stop offset='100%' style='stop-color:%23764ba2;stop-opacity:1' /></linearGradient></defs><rect width='100' height='100' rx='20' fill='url(%23grad)'/><path d='M25 30 L75 30 L75 35 L25 35 Z M25 45 L75 45 L75 50 L25 50 Z M25 60 L75 60 L75 65 L25 65 Z M30 25 L70 25 L70 75 L30 75 Z' fill='white' stroke='white' stroke-width='2'/></svg>",
        sizes: "180x180",
        type: "image/svg+xml",
      }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M25 30 L75 30 L75 35 L25 35 Z M25 45 L75 45 L75 50 L25 50 Z M25 60 L75 60 L75 65 L25 65 Z M30 25 L70 25 L70 75 L30 75 Z' fill='black'/></svg>",
        color: '#667eea',
      }
    ]
  },
  manifest: '/manifest.json', // You can add this later for PWA support
  themeColor: '#667eea',
  colorScheme: 'light',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Additional meta tags for better branding */}
        <meta name="application-name" content="Kaksha LM" />
        <meta name="apple-mobile-web-app-title" content="Kaksha LM" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#667eea" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Preload key resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
          <Sidebar />
        </div>
      </body>
    </html>
  );
}
