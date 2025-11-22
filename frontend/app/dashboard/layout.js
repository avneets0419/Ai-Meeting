"use client"
import { Geist, Geist_Mono, Readex_Pro } from "next/font/google"
import "../globals.css"
import { Providers } from "../providers"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/appSidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import React, { useState } from "react"
import { HeroUIProvider } from "@heroui/system"
import UserProvider from "../providers/UserProvider";



export default function RootLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Prevent hydration mismatch — render nothing until client mounts
    return <div className="h-4 w-4" />;
  }
  return (
    
        <Providers>
          <UserProvider>
          <HeroUIProvider>
          <SidebarProvider>
            <div className="flex h-screen w-screen overflow-hidden">
              {/* Sidebar */}
              <AppSidebar />

              {/* Main content */}
              <main className="flex-1 overflow-y-auto overflow-x-hidden">
                <SidebarTrigger />
                <div className="">{children}</div>
              </main>
            </div>
          </SidebarProvider>
          </HeroUIProvider>
          </UserProvider>
        </Providers>
  )
}