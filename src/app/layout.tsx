import { Montserrat } from 'next/font/google';
import type { Metadata } from 'next';
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
        {children}
      </body>
    </html>
  );
}