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
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Settings, FileSpreadsheet, Home, ChevronLeft, FileCog, Link as LinkIcon, FileWarning, Fingerprint } from 'lucide-react';
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

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 my-2 border-b border-gray-50 pb-4">
             <div className="w-8 h-8 flex items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground rounded-full">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 569.73 539.33"><path d="M529.14,318.31c-34.91,46.46-92.09,75.34-150.16,78.06l-189.35.12c-1.71.58-4.52,9.37-5.35,11.87-15.07,45.48-15.69,124.82-76.03,129.43-23.8,1.82-67.57,2.24-91.08.06-10.16-.94-12.91-4.94-11.34-15.14l67.17-265.01c2.4-7.11,4.38-8.44,11.84-9.07l293.99-.05c57.26-11.83,54.76-91.38-3.75-98.17-88.72-3.85-181.03,4.57-269.33-.11-39.39-2.09-84.78-14.54-99.6-55.42C-.8,75.72-.46,39.96.55,19.18c.1-2,.93-12.37,1.39-13.27.8-1.55,3.52-4.16,5.13-4.82C127.96-1.12,249.31.84,370.37.1c163.03.76,258.33,185.69,158.77,318.21Z"/></svg>
            </div>
            <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">PeYa Dash</span>
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
                  <span>Processor</span>
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
                  <span>Converter</span>
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
                  <span>Link Gen</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/remote-id-generator'}
                tooltip="Remote ID Gen"
              >
                <Link href="/remote-id-generator">
                  <Fingerprint />
                  <span>Remote ID Gen</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Escalaciones"
                >
                  <a href="https://docs.google.com/document/d/1OqGgsJzInXzzqnQOXTCcP0ACF0BhEXi2YjTvPpbLOC0/edit?usp=sharing" target="_blank" rel="noopener noreferrer">
                    <FileWarning />
                    <span>Escalaciones</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Escalaciones"
                >
                  <a href="https://docs.google.com/spreadsheets/d/1xjyXZE-Euk_fUZcoLGDbzIjVdA9XUAmD/edit?gid=1033260094#gid=1033260094" target="_blank" rel="noopener noreferrer">
                    <FileWarning />
                    <span>Templates</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Escalaciones"
                >
                  <a href="https://docs.google.com/spreadsheets/d/1_w8qumDWMf3cx1o5PGXyWlSMs1_KwxUwVBRAEQ3yeQE/edit?gid=240001792#gid=240001792" target="_blank" rel="noopener noreferrer">
                    <FileWarning />
                    <span>Lista Integradas</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Escalaciones"
                >
                  <a href="https://docs.google.com/spreadsheets/d/18smPZvC53Rw85qbiq8CdIrT-l8vg60XIUSXA9byRiqk/edit?gid=443275292#gid=443275292" target="_blank" rel="noopener noreferrer">
                    <FileWarning />
                    <span>Locales Eliminados</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuItem className="mt-2 flex items-center justify-end">
                <SidebarToggle />
          </SidebarMenuItem>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex items-center justify-between p-2">
            {isMobile && <SidebarTrigger />}
            <div className={cn("flex-grow", !isMobile && "flex justify-end")}>
              <ThemeToggle />
            </div>
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
