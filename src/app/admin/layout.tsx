"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ADMIN_APP_NAME, ADMIN_NAV_ITEMS, AdminPageTitles } from '@/lib/constants';
import { Logo } from '@/components/icons'; // Using the same logo for now
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { PanelLeft, ShieldCheck } from 'lucide-react';

export default function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  const pageTitle = AdminPageTitles[pathname] || ADMIN_APP_NAME;

  const sidebarContent = (
    <>
      <SidebarHeader className="p-4">
        <Link href="/admin/billing" className="flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden">
            {ADMIN_APP_NAME}
          </h1>
        </Link>
      </SidebarHeader>
      <ScrollArea className="flex-1">
        <SidebarContent className="p-2">
          <SidebarMenu>
            {ADMIN_NAV_ITEMS.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={{ children: item.title, side: 'right', align: 'center' }}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span className="truncate group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </ScrollArea>
    </>
  );

  if (isMobile) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6 z-30">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs p-0">
              <nav className="grid gap-6 text-lg font-medium h-full flex flex-col">
                {sidebarContent}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/admin/billing" className="flex items-center gap-2 text-lg font-semibold md:text-base">
             <ShieldCheck className="h-6 w-6 text-primary" />
             <span className="sr-only">{ADMIN_APP_NAME}</span>
          </Link>
           <h1 className="font-semibold text-lg ml-4">{pageTitle}</h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    );
  }

  return (
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="icon" className="hidden md:flex md:flex-col">
          {sidebarContent}
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 justify-between">
             <h1 className="font-semibold text-xl">{pageTitle}</h1>
             {/* Add user menu or other header items here for admin */}
          </header>
          <SidebarInset>
            <main className="flex-1 p-4 md:p-6 overflow-auto">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
  );
}
