"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; 
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar, // Removed SidebarTrigger as it's not used
  SidebarFooter, 
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { APP_NAME, NAV_ITEMS, PageTitles } from '@/lib/constants';
import { Logo } from '@/components/icons';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { PanelLeft, LogOut } from 'lucide-react'; 
import { NotificationBell } from '@/components/notifications/notification-bell'; // Added NotificationBell import

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isMobile, open: sidebarOpen, setOpen: setSidebarOpen } = useSidebar(); // get sidebar state
  const router = useRouter();

  // MOCK USER ID - In a real app, get this from auth session
  const currentUserId = "user123"; 

  const pageTitle = PageTitles[pathname] || APP_NAME;

  const handleLogout = () => {
    router.push('/landing'); // Changed from /login to /landing
  };

  const sidebarContent = (
    <>
      <SidebarHeader className="p-4">
        <Link href="/community-feed" className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden">
            {APP_NAME}
          </h1>
        </Link>
      </SidebarHeader>
      <ScrollArea className="flex-1">
        <SidebarContent className="p-2">
          <SidebarMenu>
            {NAV_ITEMS.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={{ children: item.title, side: 'right', align: 'center' }}
                  onClick={() => isMobile && setSidebarOpen(false)} // Close mobile sidebar on item click
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
      <SidebarFooter className="p-2 mt-auto border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} variant="ghost" className="w-full justify-start" tooltip={{ children: "Logout", side: 'right', align: 'center' }}>
              <LogOut className="h-5 w-5" />
              <span className="truncate group-data-[collapsible=icon]:hidden">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );

  if (isMobile) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6 z-30">
          <div className="flex items-center gap-2">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
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
            <Link href="/community-feed" className="flex items-center gap-2 text-lg font-semibold md:text-base">
              <Logo className="h-6 w-6 text-primary" />
              <span className="sr-only">{APP_NAME}</span>
            </Link>
            <h1 className="font-semibold text-lg ml-2 hidden sm:block">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell userId={currentUserId} />
            {/* Add other header items like user avatar/menu here */}
          </div>
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
             <div className="flex items-center gap-2">
               <NotificationBell userId={currentUserId} />
               {/* Add user menu or other header items here */}
             </div>
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
