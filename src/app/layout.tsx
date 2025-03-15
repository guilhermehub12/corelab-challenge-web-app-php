import { Montserrat } from 'next/font/google';
import type { Metadata } from 'next';
import { AuthProvider } from '../context/AuthContext';
import { TasksProvider } from '../context/TasksContext';
import { UIProvider } from '../context/UIContext';
import '../styles/globals.scss';
import { ToastProvider } from '@/context/ToastContext';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  display: 'swap', // Melhorar performance ao carregar a fonte
  preload: true,
});

export const metadata: Metadata = {
  title: 'CoreTasks - Organize suas tarefas',
  description: 'Aplicativo para organização de tarefas',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CoreTasks',
  },
  formatDetection: {
    telephone: false,
  },
  applicationName: 'CoreTasks',
  keywords: ['tarefas', 'organização', 'produtividade', 'notas'],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const themeColor = [
  { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
  { media: '(prefers-color-scheme: dark)', color: '#1F1F1F' },
];

// Definição de headers para cache e performance
export const headers = () => {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400'
        }
      ]
    },
    {
      source: '/api/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-cache, no-store, must-revalidate'
        }
      ]
    }
  ];
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={montserrat.className}>
        <UIProvider>
          <AuthProvider>
          <TasksProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </TasksProvider>
          </AuthProvider>
        </UIProvider>
      </body>
    </html>
  );
}