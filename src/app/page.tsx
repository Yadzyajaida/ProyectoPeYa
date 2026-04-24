'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MessageCircle, Play, Settings, FileCode, Type, FileText, FileSpreadsheet, FileCog, Link as LinkIcon, FileWarning, Fingerprint } from 'lucide-react';
import { signIn, signOut, useSession } from "next-auth/react";
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();

  // 1. Mientras verifica la sesión, mostramos un estado de carga simple
  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center">Cargando...</div>;
  }

  // 2. Si NO hay sesión, mostramos la pantalla de Login (Estilo PedidosYa)
  if (!session) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md text-center border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Peya Tools</h2>
          <p className="text-gray-600 mb-8">Inicia sesión con tu cuenta de pedidosYa para continuar.</p>
          
          <button
            onClick={() => signIn('google')}
            className="flex items-center justify-center w-full px-4 py-3 space-x-3 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-offset-1 focus:ring-primary"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            <span className="font-medium text-gray-700">Acceder con Google</span>
          </button>
          
          <p className="text-xs text-muted-foreground mt-4">
            Solo disponible para dominios @pedidosya.com
          </p>
        </div>
      </div>
    );
  }else{
    return (
      <DashboardLayout>
        <header className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto justify-items-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">
              Herramientas
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
              Una colección de utilidades para optimizar tu trabajo.
            </p>
          </div>
        </header>
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/xlsx-processor">
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group">
                <CardHeader className="flex flex-col items-center justify-center text-center p-6">
                  <div className="p-4 bg-primary/10 rounded-full mb-4 transition-colors group-hover:bg-primary/20">
                    <FileSpreadsheet className="w-10 h-10 text-primary/80 transition-colors group-hover:text-primary" />
                  </div>
                  <CardTitle className="text-xl">Procesador para codificar</CardTitle>
                  <CardDescription className="mt-2">
                    Convierte y procesa tus archivos XLSX a formato CSV (listo para subir).
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/xlsx-converter">
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group">
                <CardHeader className="flex flex-col items-center justify-center text-center p-6">
                  <div className="p-4 bg-primary/10 rounded-full mb-4 transition-colors group-hover:bg-primary/20">
                    <FileCog className="w-10 h-10 text-primary/80 transition-colors group-hover:text-primary" />
                  </div>
                  <CardTitle className="text-xl">Convertidor</CardTitle>
                  <CardDescription className="mt-2">
                    Convierte rápidamente archivos XLSX o XLS a formato CSV UTF-8 o a la inversa.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/link-generator">
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group">
                <CardHeader className="flex flex-col items-center justify-center text-center p-6">
                  <div className="p-4 bg-primary/10 rounded-full mb-4 transition-colors group-hover:bg-primary/20">
                    <LinkIcon className="w-10 h-10 text-primary/80 transition-colors group-hover:text-primary" />
                  </div>
                  <CardTitle className="text-xl">Apertura de multipágina</CardTitle>
                  <CardDescription className="mt-2">
                    Crea enlaces de catálogo de BO o VBO a partir de una lista de ID's.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <a href="https://script.google.com/a/macros/pedidosya.com/s/AKfycbzaiV2u_CgH5JctP6q8sNQz-SLhzKroTH_bPUrx1fwp-w6mnfX0p5k9oEVv9cZG_WDVfA/exec" target="_blank" rel="noopener noreferrer">
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group">
                <CardHeader className="flex flex-col items-center justify-center text-center p-6">
                  <div className="p-4 bg-primary/10 rounded-full mb-4 transition-colors group-hover:bg-primary/20">
                    <Settings className="w-10 h-10 text-primary/80 transition-colors group-hover:text-primary" />
                  </div>
                  <CardTitle className="text-xl">Onboarding de integraciones</CardTitle>
                  <CardDescription className="mt-2">
                    Consulta si un local se encuentra en proceso de onboarding de integración y todo el detalle del mismo.
                  </CardDescription>
                </CardHeader>
              </Card>
            </a>
            <Link href="/remote-id-generator">
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group">
                <CardHeader className="flex flex-col items-center justify-center text-center p-6">
                  <div className="p-4 bg-primary/10 rounded-full mb-4 transition-colors group-hover:bg-primary/20">
                    <FileCode className="w-10 h-10 text-primary/80 transition-colors group-hover:text-primary" />
                  </div>
                  <CardTitle className="text-xl">Generador de remote ID</CardTitle>
                  <CardDescription className="mt-2">
                    Crea un remote ID estandarizado según el nombre del local.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            {/* <a href="https://ppsimulatorcnx.netlify.app/" target="_blank" rel="noopener noreferrer">
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group">
                <CardHeader className="flex flex-col items-center justify-center text-center p-6">
                  <div className="p-4 bg-primary/10 rounded-full mb-4 transition-colors group-hover:bg-primary/20">
                    <Play className="w-10 h-10 text-primary/80 transition-colors group-hover:text-primary" />
                  </div>
                  <CardTitle className="text-xl">Simulador partner portal</CardTitle>
                  <CardDescription className="mt-2">
                    Simulador del portal partner para verificar rutas o tener una guia visual de las mismas.
                  </CardDescription>
                </CardHeader>
              </Card>
            </a>
            <a href="https://simuladorcnx.netlify.app/" target="_blank" rel="noopener noreferrer">
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group">
                <CardHeader className="flex flex-col items-center justify-center text-center p-6">
                  <div className="p-4 bg-primary/10 rounded-full mb-4 transition-colors group-hover:bg-primary/20">
                    <MessageCircle className="w-10 h-10 text-primary/80 transition-colors group-hover:text-primary" />
                  </div>
                  <CardTitle className="text-xl">Simulador de chat</CardTitle>
                  <CardDescription className="mt-2">
                    Simulador de chat para orientar a IS (agente - moderador).
                  </CardDescription>
                </CardHeader>
              </Card>
            </a> 
            <Link href="/enlaces-google">
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group">
                <CardHeader className="flex flex-col items-center justify-center text-center p-6">
                  <div className="p-4 bg-primary/10 rounded-full mb-4 transition-colors group-hover:bg-primary/20">
                    <FileText className="w-10 h-10 text-primary/80 transition-colors group-hover:text-primary" />
                  </div>
                  <CardTitle className="text-xl">Documentos</CardTitle>
                  <CardDescription className="mt-2">
                    Una colección de documentos o sheets creados por el equipo para facilitar la gestión de integraciones.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link> */}
          </div>
        </main>
      </DashboardLayout>
    );
  }
}
