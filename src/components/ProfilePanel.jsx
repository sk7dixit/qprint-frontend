import * as React from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/shared/AuthContext";
import { User, Phone, Hash, ShieldCheck, Edit3, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ProfilePanel({ open, onOpenChange }) {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = React.useState(false);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md p-0 border-l border-slate-200 shadow-2xl">
                <div className="h-full flex flex-col bg-white">
                    {/* Header Section */}
                    <div className="relative h-32 bg-indigo-600 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-800 opacity-90" />
                        <div className="absolute -right-8 -top-8 size-32 bg-white/10 rounded-full blur-2xl" />
                        <div className="absolute -left-4 -bottom-4 size-24 bg-indigo-400/20 rounded-full blur-xl" />


                    </div>

                    {/* Profile Summary */}
                    <div className="px-6 -mt-12 flex flex-col items-center pb-6 border-b border-slate-100">
                        <Avatar className="size-24 border-4 border-white shadow-xl ring-1 ring-slate-100 mb-4">
                            <AvatarImage src={user?.photoURL} />
                            <AvatarFallback className="bg-slate-100 text-indigo-600 text-2xl font-black">
                                {(user?.displayName || user?.name || "ST").split(" ").map(n => n[0]).join("").toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <h2 className="text-xl font-heading font-extrabold text-slate-900">{user?.displayName || user?.name}</h2>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em] mt-1">{user?.role || "Student"}</p>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Information Grid */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-heading font-bold text-slate-900 flex items-center gap-2">
                                    <User className="size-4 text-indigo-600" />
                                    Personal Information
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="h-8 text-[11px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                >
                                    {isEditing ? <Save className="size-3 mr-2" /> : <Edit3 className="size-3 mr-2" />}
                                    {isEditing ? "Save Changes" : "Edit Profile"}
                                </Button>
                            </div>

                            <div className="grid gap-5">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</Label>
                                    <Input
                                        defaultValue={user?.displayName || user?.name}
                                        disabled={!isEditing}
                                        className="h-11 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-600 transition-all font-semibold"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Enrollment ID</Label>
                                    <div className="relative group">
                                        <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                        <Input
                                            defaultValue={user?.enrollment_id || "2303051050861"}
                                            disabled={true}
                                            className="h-11 pl-10 rounded-xl bg-slate-100/50 border-transparent font-bold text-slate-600"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Mobile Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                        <Input
                                            defaultValue={user?.mobile || "+91 98765 43210"}
                                            disabled={!isEditing}
                                            className="h-11 pl-10 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-600 transition-all font-semibold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <h3 className="text-sm font-heading font-bold text-slate-900 flex items-center gap-2 mb-3">
                                <ShieldCheck className="size-4 text-green-600" />
                                Account Security
                            </h3>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                                Your account is secured via Google Authentication. To change your password or security settings, visit your Google Account.
                            </p>
                            <Button variant="outline" className="w-full h-10 rounded-xl text-xs font-bold border-slate-200">
                                Manage Google Account
                            </Button>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-slate-100 flex gap-3">
                        <Button variant="ghost" className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500">
                            Support
                        </Button>
                        <Button className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100">
                            Help Center
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
