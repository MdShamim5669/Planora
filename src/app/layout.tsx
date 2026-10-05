import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import QueryProvider from '@/providers/QueryProvider';
import { Toaster } from 'react-hot-toast';
import { PageCurtainProvider } from '@/components/ui/PageCurtain';
import { AssistantWidget } from '@/components/assistant/AssistantWidget';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Planora - Modern Event Management Platform',
  description:
    'A secure event management platform for hosting and attending public, private, free, and paid events with seamless SSLCommerz payments.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen bg-background text-foreground flex flex-col">
        <QueryProvider>
          <AuthProvider>
            <PageCurtainProvider>
              {children}
            </PageCurtainProvider>
            <AssistantWidget />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#FFFFFF',
                  color: '#0F172A',
                  border: '1px solid #E2E8F0',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                },
              }}
            />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
