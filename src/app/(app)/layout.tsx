
'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader as ShadSidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
  SidebarInset,
} from '@/components/ui/sidebar'; // Using the ShadCN sidebar
import { Logo } from '@/components/core/Logo';
import { AppHeader } from '@/components/core/Header';
import Link from 'next/link';
import { SIDENAV_ITEMS, SIDENAV_BOTTOM_ITEMS } from '@/lib/constants';
import type { NavItem } from '@/lib/types';

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, isReady, router]);

  if (loading || !isReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // This will be shown briefly before redirect, or if redirect fails.
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <p>Redirecting to login...</p>
        <Loader2 className="ml-2 h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="sidebar" collapsible="icon" className="border-r border-sidebar-border shadow-md">
        <ShadSidebarHeader className="p-4">
          <Logo showText={true} className="group-data-[collapsible=icon]:hidden"/>
          <Logo showText={false} className="hidden group-data-[collapsible=icon]:flex justify-center"/>
        </ShadSidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {SIDENAV_ITEMS.map((item) => (
              <SidebarMenuItem key={item.title}>
                <Link href={item.href} asChild>
                  <SidebarMenuButton tooltip={item.title} isActive={router.pathname === item.href} disabled={item.disabled}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter className="p-2">
           <SidebarMenu>
            {SIDENAV_BOTTOM_ITEMS.map((item) => (
              <SidebarMenuItem key={item.title}>
                 <Link href={item.href} asChild>
                    <SidebarMenuButton tooltip={item.title} isActive={router.pathname === item.href} disabled={item.disabled}>
                        <item.icon />
                        <span>{item.title}</span>
                    </SidebarMenuButton>
                 </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
