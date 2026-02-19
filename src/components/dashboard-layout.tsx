'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Play, FileCode, Minus, FileText, Settings, FileSpreadsheet, Home, ChevronLeft, FileCog, Link as LinkIcon, FileWarning, Fingerprint } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

function SidebarToggle() {
  const { toggleSidebar, state } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-7 group-data-[collapsible=icon]:-rotate-180 transition-transform"
      onClick={toggleSidebar}
    >
      <ChevronLeft />
    </Button>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 my-2 border-b border-gray-50 pb-4">
            <div className="w-9 h-9 flex items-center justify-center ">
              <svg className="w-full h-full" viewBox="0 0 569.73 539.33" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(-230,720) scale(0.1,-0.1)" fill="currentColor" stroke="none">
                <path d="M4445 7207 c-38 -21 -87 -89 -74 -102 3 -3 47 6 98 19 50 14 116 28
                146 31 30 4 55 11 55 15 0 5 -14 20 -31 34 -42 35 -134 37 -194 3z"/>
                <path d="M4755 7124 c-89 -9 -221 -36 -242 -50 -30 -19 -107 -181 -132 -277
                -36 -137 -44 -238 -38 -452 3 -110 13 -242 21 -294 20 -123 56 -295 66 -310 5
                -9 34 1 107 37 157 79 295 135 480 196 326 106 624 145 873 116 41 -4 76 -8
                76 -7 1 1 -9 49 -22 107 -93 409 -244 645 -516 802 -81 47 -214 96 -318 118
                -58 12 -287 21 -355 14z m814 -404 c72 -36 107 -105 99 -192 -8 -83 -66 -139
                -166 -158 -112 -21 -104 -16 -95 -58 4 -20 8 -53 8 -72 0 -34 -1 -35 -45 -41
                -25 -4 -47 -5 -49 -3 -8 7 -100 498 -95 504 11 10 180 37 242 39 45 1 74 -5
                101 -19z"/>
                <path d="M5385 6631 c-18 -4 -29 -12 -28 -21 13 -114 26 -160 43 -160 46 0
                123 24 141 43 28 29 21 103 -11 129 -23 19 -85 22 -145 9z"/>
                <path d="M4336 7034 c-355 -124 -633 -389 -743 -709 -45 -131 -54 -193 -60
                -402 -8 -282 18 -510 67 -591 l20 -33 60 51 c93 77 166 123 297 189 131 66
                239 110 327 136 57 17 58 18 53 48 -2 18 -18 111 -35 207 -59 340 -66 585 -22
                802 23 111 66 230 106 291 29 43 24 44 -70 11z m-346 -404 c24 -24 25 -38 4
                -68 -30 -43 -94 -21 -94 32 0 20 35 56 55 56 8 0 24 -9 35 -20z"/>
                <path d="M5540 6024 c-279 -34 -643 -147 -970 -302 l-104 -50 69 -35 c291
                -146 600 -237 803 -237 179 0 306 35 557 152 390 183 513 226 674 237 l96 6
                -85 34 c-139 55 -388 140 -490 168 -86 24 -114 26 -305 28 -115 2 -226 1 -245
                -1z"/>
                <path d="M6480 5706 c-36 -8 -101 -26 -145 -41 -83 -28 -305 -129 -305 -140 0
                -7 49 -28 220 -97 323 -130 509 -130 597 1 66 98 28 210 -88 260 -64 28 -190
                36 -279 17z"/>
                <path d="M4255 5570 c-166 -60 -388 -173 -424 -217 -41 -49 -132 -229 -174
                -343 -70 -188 -103 -429 -87 -636 17 -218 62 -389 150 -564 182 -362 500 -595
                925 -677 124 -24 387 -24 510 0 345 67 652 260 808 507 l16 26 -235 194 c-129
                107 -238 196 -242 197 -4 1 -29 -24 -56 -55 -101 -116 -238 -203 -371 -237
                -77 -20 -253 -20 -330 0 -33 8 -98 34 -145 57 -120 58 -238 177 -298 298 -111
                227 -111 503 0 730 34 67 60 103 128 171 137 138 284 199 477 199 217 0 405
                -85 529 -239 26 -31 50 -57 55 -59 7 -3 274 234 393 349 l29 28 -26 39 c-15
                21 -40 51 -56 66 l-29 27 -72 -30 c-124 -53 -212 -72 -360 -78 -113 -4 -152
                -1 -240 17 -181 37 -445 132 -640 230 -44 22 -90 40 -102 39 -13 0 -72 -18
                -133 -39z"/>
                </g>
              </svg>
            </div>
            <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">Peya Tools</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-2">
          <SidebarMenu className="mt-2 gap-2 flex justify-center">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/'}
                tooltip="Home"
              >
                <Link href="/">
                  <Home />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/xlsx-processor'}
                tooltip="XLSX Processor"
              >
                <Link href="/xlsx-processor">
                  <FileSpreadsheet />
                  <span>Procesador</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/xlsx-converter'}
                tooltip="Converter"
              >
                <Link href="/xlsx-converter">
                  <FileCog />
                  <span>Convertidor</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/link-generator'}
                tooltip="Link Generator"
              >
                <Link href="/link-generator">
                  <LinkIcon />
                  <span>Apertura de multipágina</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Simulador Portal"
              >
                <a href="https://ppsimulatorcnx.netlify.app/" target="_blank" rel="noopener noreferrer">
                  <Play />
                  <span>Simulador partner portal</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/remote-id-generator'}
                tooltip="Remote ID Gen"
              >
                <Link href="/remote-id-generator">
                  <FileCode />
                  <span>Remote ID</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/enlaces-google'}
                tooltip="Documentos"
              >
                <Link href="/enlaces-google">
                  <FileText  />
                  <span>Documentos</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuSubButton asChild>
                  <a href="https://docs.google.com/document/d/1OqGgsJzInXzzqnQOXTCcP0ACF0BhEXi2YjTvPpbLOC0/edit?usp=sharing" target="_blank" rel="noopener noreferrer">
                    <Minus className="w-3 h-3" />
                    <span>Escalaciones</span>
                  </a>
                </SidebarMenuSubButton>

                <SidebarMenuSubButton asChild>
                  <a href="https://docs.google.com/spreadsheets/d/1hWMT321v8bN6avO_jA3TfjTsbhBSe3vIwHt0-T_r_nM/edit?usp=sharing" target="_blank" rel="noopener noreferrer">
                    <Minus className="w-3 h-3" />
                    <span>Templates Faltantes</span>
                  </a>
                </SidebarMenuSubButton>

                <SidebarMenuSubButton asChild>
                  <a href="https://docs.google.com/spreadsheets/d/1_w8qumDWMf3cx1o5PGXyWlSMs1_KwxUwVBRAEQ3yeQE/edit?gid=240001792#gid=240001792" target="_blank" rel="noopener noreferrer">
                    <Minus className="w-3 h-3" />
                    <span>Lista Integradas</span>
                  </a>
                </SidebarMenuSubButton>

                <SidebarMenuSubButton asChild>
                  <a href="https://docs.google.com/spreadsheets/d/18smPZvC53Rw85qbiq8CdIrT-l8vg60XIUSXA9byRiqk/edit?gid=443275292#gid=443275292" target="_blank" rel="noopener noreferrer">
                    <Minus className="w-3 h-3" />
                    <span>Locales Eliminados</span>
                  </a>
                </SidebarMenuSubButton>
                <SidebarMenuSubButton asChild>
                  <a href="https://docs.google.com/spreadsheets/d/1putMthnP2F_1wiMDnCs-v8Femy4lo4NDcBAXD9S8aVw/edit?gid=0#gid=0" target="_blank" rel="noopener noreferrer">
                    <Minus className="w-3 h-3" />
                    <span>Identificador Locales</span>
                  </a>
                </SidebarMenuSubButton>
                <SidebarMenuSubButton asChild>
                  <a href="https://docs.google.com/spreadsheets/d/1vPueVoGogcdpLTgsvfqj3S0AT5xBdGHQ6w0pja7xZ7s/edit?pli=1&gid=1564924724#gid=1564924724" target="_blank" rel="noopener noreferrer">
                    <Minus className="w-3 h-3" />
                    <span>Tipificación</span>
                  </a>
                </SidebarMenuSubButton>
                <SidebarMenuSubButton asChild>
                  <a href="https://docs.google.com/spreadsheets/d/1vPueVoGogcdpLTgsvfqj3S0AT5xBdGHQ6w0pja7xZ7s/edit?pli=1&gid=1564924724#gid=1564924724" target="_blank" rel="noopener noreferrer">
                    <Minus className="w-3 h-3" />
                    <span>Seteo Masivo</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
             <SidebarMenuItem className="mt-2 flex items-center justify-end">
                <SidebarToggle />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {mounted ? (
          <div className="flex items-center justify-between p-2">
              {isMobile && <SidebarTrigger />}
              <div className={cn("flex-grow", !isMobile && "flex justify-end")}>
                <ThemeToggle />
              </div>
          </div>
        ) : (
          <div className="p-2 h-[56px]" />
        )}
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
