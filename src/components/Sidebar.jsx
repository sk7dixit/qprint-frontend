"use client";

import * as React from "react";
import {
    LayoutDashboard,
    Upload,
    FileEdit,
    Zap,
    Store,
    ShoppingCart,
    History as HistoryIcon,
    MessageSquare,
    User,
    LogOut,
    ChevronUp,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Actually, standard shadcn sidebar uses dropdown menu.
// The user provided DropoutMenu code too.
import { useAuth } from "@/shared/AuthContext";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/images/logo_raw.png";

const navItems = [
    { title: "Dashboard", url: "/student/dashboard", icon: LayoutDashboard },
    { title: "Upload & Prepare", url: "/student/upload", icon: Upload },
    { title: "Editor", url: "/student/editor", icon: FileEdit },
    { title: "Compress", url: "/student/compress", icon: Zap },
    { title: "Shops", url: "/student/shops", icon: Store },
    { title: "Cart", url: "/student/cart", icon: ShoppingCart },
    { title: "Orders", url: "/student/orders", icon: HistoryIcon },
    { title: "Chat", url: "/student/chat", icon: MessageSquare },
];

function AppSidebar({ ...props }) {
    const location = useLocation();

    return (
        <Sidebar
            variant="sidebar"
            collapsible="none"
            className="group border-r border-slate-200/60 h-full w-16 hover:w-64 transition-[width] duration-300 ease-out overflow-hidden bg-white z-30"
            {...props}
        >
            <SidebarContent className="py-6 px-3">
                <SidebarMenu className="gap-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.url;
                        return (
                            <SidebarMenuItem key={item.title} className="relative group/item">
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    className={`
                                        relative flex items-center h-11 rounded-xl transition-all duration-200 
                                        hover:bg-slate-100/70 active:scale-[0.98]
                                        ${isActive
                                            ? "bg-indigo-50 text-indigo-600 font-semibold shadow-sm shadow-indigo-100/50"
                                            : "text-slate-600 hover:text-slate-900"}
                                    `}
                                >
                                    <Link to={item.url} className="flex items-center gap-3 w-full">
                                        {/* Active/Hover Indicator */}
                                        <span className={`
                                            absolute left-0 h-6 w-1 bg-indigo-600 rounded-r-full transition-transform duration-200 origin-center
                                            ${isActive ? "scale-y-100" : "scale-y-0 group-hover/item:scale-y-100"}
                                        `} />

                                        {/* Icon with Micro-motion */}
                                        <item.icon className={`
                                            size-[18px] shrink-0 transition-transform duration-200 
                                            ${isActive ? "scale-110 translate-x-1" : "group-hover/item:translate-x-1"}
                                        `} />

                                        {/* Label with Slide + Fade */}
                                        <span className={`
                                            font-body text-sm whitespace-nowrap transition-all duration-200 delay-75
                                            opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0
                                        `}>
                                            {item.title}
                                        </span>
                                    </Link>
                                </SidebarMenuButton>

                                {/* Tooltip for Collapsed State */}
                                <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded-md opacity-0 scale-95 group-hover/item:opacity-100 group-hover/item:scale-100 group-hover:hidden transition-all duration-150 pointer-events-none whitespace-nowrap z-50">
                                    {item.title}
                                </span>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
}

export { AppSidebar };
