"use client";

import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ProfilePanel } from "@/components/ProfilePanel";
import { Outlet } from "react-router-dom";

export default function StudentLayout() {
    const [profileOpen, setProfileOpen] = useState(false);

    return (
        <SidebarProvider>
            <div className="h-screen w-full flex flex-col overflow-hidden bg-background font-body">
                {/* Independent Header: Always Full Width, Stable Toggle */}
                <Header onProfileClick={() => setProfileOpen(true)} />

                <div className="flex flex-1 min-h-0 overflow-hidden">
                    {/* Collapsible Sidebar Content Area */}
                    <AppSidebar />

                    {/* Main Content: Responsive Flex Container */}
                    <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 md:p-8">
                        <div className="max-w-7xl mx-auto min-h-full">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
            {/* Slide-over Profile Management */}
            <ProfilePanel open={profileOpen} onOpenChange={setProfileOpen} />
        </SidebarProvider>
    );
}
