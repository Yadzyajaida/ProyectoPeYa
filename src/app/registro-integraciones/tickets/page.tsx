'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { RegistroIntegraciones } from '@/components/registro-integraciones/registro-integraciones';

export default function TicketsPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Cargando...</p>;
  if (!session) { redirect('/'); }

  return (
    <DashboardLayout>
      <RegistroIntegraciones
        userEmail={session.user?.email || ''}
        activeTab="tickets"
      />
    </DashboardLayout>
  );
}
