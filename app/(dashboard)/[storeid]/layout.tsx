//Convencion paranext route necesita store id

import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Navbar from '@/components/navbar';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeid: string };
}) {
  const { userId } = auth();
  if (!userId) {
    redirect('/sign-in');
  }

  //   cARGAREMOS LA PRIMER TIENDA CON ESTA ID
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeid,
      userId,
    },
  });

  if (!store) {
    redirect('/');
  }
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
