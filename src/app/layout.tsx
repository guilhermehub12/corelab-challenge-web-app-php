import { Montserrat } from 'next/font/google';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';
import { TasksProvider } from '../context/TasksContext';
import { UIProvider } from '../context/UIContext';
import '../styles/globals.scss';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CoreTasks - Organize suas tarefas',
  description: 'Aplicativo para organização de tarefas',
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
              {children}
              <Toaster />
            </TasksProvider>
          </AuthProvider>
        </UIProvider>
      </body>
    </html>
  );
}