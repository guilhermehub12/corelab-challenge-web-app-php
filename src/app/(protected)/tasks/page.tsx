"use client" 

import dynamic from 'next/dynamic';
import { LoadingSuspense } from '@/components/ui/suspense/LoadingSuspense';

// Importação dinâmica do componente de tarefas
const TasksPage = dynamic(
  () => import('@/components/pages/tasks/TasksPage'),
  {
    loading: () => <LoadingSuspense type="page" count={6} />,
    ssr: false // Desabilitar SSR para este componente específico
  }
);

export default function Page() {
  return <TasksPage />;
}