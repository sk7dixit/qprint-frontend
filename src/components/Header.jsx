"use client";

import * as React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { useLocation, Link } from "react-router-dom";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/shared/AuthContext";
import { User, Settings, LogOut } from "lucide-react";
import logo from "@/assets/images/logo_raw.png";

function Header({ onProfileClick }) {
    const location = useLocation();
    const { user, logout } = useAuth();
    const pathSegements = location.pathname.split("/").filter(Boolean);

    return (
        <header className="w-full flex h-16 items-center justify-between gap-2 px-4 border-b bg-white/80 backdrop-blur-md z-40">
            <div className="flex items-center gap-4">
                {/* Brand Logo & Name */}
                <Link to="/student/dashboard" className="flex items-center gap-2 mr-2">
                    <img src={logo} alt="QPrint" className="h-8 w-auto object-contain" />
                </Link>

                <Separator orientation="vertical" className="h-6 mx-2 hidden sm:block" />

                <div className="flex items-center gap-2">
                    <Breadcrumb>
                        <BreadcrumbList>
                            {pathSegements.map((segment, index) => {
                                const url = `/${pathSegements.slice(0, index + 1).join("/")}`;
                                const isLast = index === pathSegements.length - 1;

                                const segmentTitleMap = {
                                    dashboard: "Dashboard",
                                    upload: "Upload & Prepare",
                                    editor: "Editor",
                                    compress: "Compress",
                                    shops: "Shops",
                                    cart: "Cart",
                                    orders: "Orders",
                                    chat: "Chat",
                                    profile: "Profile",
                                    student: "Student Portal"
                                };

                                const title = segmentTitleMap[segment.toLowerCase()] || (segment.charAt(0).toUpperCase() + segment.slice(1));

                                return (
                                    <React.Fragment key={url}>
                                        {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                                        <BreadcrumbItem className={isLast ? "" : "hidden md:block"}>
                                            {isLast ? (
                                                <BreadcrumbPage className="font-heading font-bold text-slate-900">{title}</BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink asChild>
                                                    <Link to={url} className="text-slate-500 hover:text-indigo-600 transition-colors">{title}</Link>
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                );
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-all outline-none group">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-slate-900 leading-none">{user?.displayName || user?.name || "Student"}</p>
                                <p className="text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-wider">{user?.role || "Student"}</p>
                            </div>
                            <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-slate-200 group-hover:ring-indigo-200 transition-all">
                                <AvatarImage src={user?.photoURL} />
                                <AvatarFallback className="bg-indigo-600 text-white font-bold text-xs">
                                    {(user?.displayName || user?.name || "ST").split(" ").map(n => n[0]).join("").toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-1 rounded-2xl p-2 shadow-xl border-slate-200/60">
                        <DropdownMenuLabel className="font-heading font-bold text-slate-900 px-3 py-2">My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-100" />
                        <DropdownMenuItem
                            onClick={(e) => {
                                if (onProfileClick) {
                                    e.preventDefault();
                                    onProfileClick();
                                }
                            }}
                            className="rounded-xl focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer gap-3 p-2.5"
                        >
                            <User className="h-4 w-4" />
                            <span className="font-medium">Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer gap-3 p-2.5">
                            <Settings className="h-4 w-4" />
                            <span className="font-medium">Settings</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-slate-100" />
                        <DropdownMenuItem onClick={logout} className="rounded-xl focus:bg-red-50 focus:text-red-600 text-red-600 cursor-pointer gap-3 p-2.5">
                            <LogOut className="h-4 w-4" />
                            <span className="font-medium text-destructive">Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

export { Header };
