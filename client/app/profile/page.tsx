"use client";

import { useEffect, useState } from "react";
import { userService, User } from "@/services/user-service";
import { enrollmentService } from "@/services/enrollment-service";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    User as UserIcon,
    Mail,
    Calendar,
    BookOpen,
    Camera,
    Shield,
    CheckCircle,
    XCircle,
    Loader2,
    Save,
    LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { LoadingScreen } from "@/components/ui/loading-screen";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};

export default function ProfilePage() {
    const { user: authUser, loading: authLoading } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [enrollmentCount, setEnrollmentCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [fullName, setFullName] = useState("");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        let isMounted = true;

        // Fail-safe: Force stop loading after 8 seconds
        const timeoutId = setTimeout(() => {
            if (isMounted) {
                setLoading(false);
            }
        }, 8000);

        if (!authLoading && !authUser) {
            router.push("/login?redirect=/profile");
            return;
        }

        const fetchData = async () => {
            if (!authUser) return;
            try {
                const [userData, courses] = await Promise.all([
                    userService.getMe(),
                    enrollmentService.getMyCourses()
                ]);

                if (isMounted) {
                    setUser(userData);
                    setFullName(userData.full_name || "");
                    setEnrollmentCount(courses.length);
                    setLoading(false);
                    clearTimeout(timeoutId);
                }
            } catch (error) {
                console.error("Failed to fetch profile data", error);
                if (isMounted) {
                    setLoading(false);
                    clearTimeout(timeoutId);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [authUser, authLoading, router]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            const updatedUser = await userService.updateMe({ full_name: fullName });
            setUser(updatedUser);
            setEditMode(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || loading) {
        return <LoadingScreen />;
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 animate-pulse" />

            <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={fadeInUp}
                    className="flex items-center justify-between mb-12"
                >
                    <div>
                        <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4 group font-medium">
                            <LayoutDashboard size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </Link>
                        <h1 className="text-5xl font-black tracking-tight">Your Profile</h1>
                        <p className="text-muted-foreground mt-2">Manage your academic identity in the Omniverse.</p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Avatar & Quick Stats */}
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        <div className="bg-card border border-border rounded-[2.5rem] p-8 glass text-center relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 rounded-full bg-secondary border-4 border-border flex items-center justify-center overflow-hidden shadow-2xl mx-auto group-hover:border-primary/50 transition-colors">
                                    {authUser?.photoURL ? (
                                        <img src={authUser.photoURL} alt={user.full_name || ""} className="w-full h-full object-cover" />
                                    ) : (
                                        <UserIcon size={64} className="text-primary/50" />
                                    )}
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95 border-4 border-card">
                                    <Camera size={16} />
                                </button>
                            </div>

                            <h2 className="text-2xl font-black truncate">{user.full_name || "Nexus Builder"}</h2>
                            <p className="text-muted-foreground text-sm mb-6 truncate">{user.email}</p>

                            <div className="flex justify-center gap-2">
                                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider rounded-full border border-primary/20">
                                    STUDENT
                                </span>
                                {user.is_superuser && (
                                    <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-wider rounded-full border border-amber-500/20">
                                        ADMIN
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-[2rem] p-6 glass space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                                        <BookOpen size={20} />
                                    </div>
                                    <span className="text-sm font-bold">Courses</span>
                                </div>
                                <span className="text-xl font-black">{enrollmentCount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                                        <Shield size={20} />
                                    </div>
                                    <span className="text-sm font-bold">Status</span>
                                </div>
                                <span className="text-xs font-black text-emerald-500 flex items-center gap-1">
                                    <CheckCircle size={12} />
                                    ACTIVE
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Details & Edit Form */}
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 space-y-8"
                    >
                        <div className="bg-card border border-border rounded-[2.5rem] p-8 lg:p-10 glass relative overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black">Personal Information</h3>
                                <button
                                    onClick={() => setEditMode(!editMode)}
                                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-xl font-bold text-sm hover:bg-secondary/80 transition-all border border-border active:scale-95"
                                >
                                    {editMode ? "Cancel" : "Edit Profile"}
                                </button>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-8">
                                <AnimatePresence mode="wait">
                                    {message && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className={`p-4 rounded-2xl flex items-center gap-3 border ${message.type === 'success'
                                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                                : 'bg-destructive/10 border-destructive/20 text-destructive'
                                                }`}
                                        >
                                            {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                                            <span className="font-bold text-sm">{message.text}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                        <div className="relative group">
                                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                disabled={!editMode}
                                                className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                                placeholder="Your name"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                            <input
                                                type="email"
                                                value={user.email}
                                                disabled
                                                className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl outline-none opacity-50 cursor-not-allowed font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Member Since</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                            <input
                                                type="text"
                                                value={new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                disabled
                                                className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl outline-none opacity-50 cursor-not-allowed font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {editMode && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="pt-4"
                                    >
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="w-full md:w-auto px-10 py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
                                        >
                                            {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                                            Save Highlights
                                        </button>
                                    </motion.div>
                                )}
                            </form>
                        </div>

                        {/* Additional Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-primary/20 to-indigo-500/20 border border-primary/20 rounded-[2rem] p-8 glass group cursor-help">
                                <h4 className="text-lg font-black mb-2 flex items-center gap-2">
                                    <Shield size={20} className="text-primary" />
                                    Security Status
                                </h4>
                                <p className="text-muted-foreground text-sm">Your account is secured with Firebase Authentication. Multi-factor authentication is recommended.</p>
                            </div>
                            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 rounded-[2rem] p-8 glass group cursor-help">
                                <h4 className="text-lg font-black mb-2 flex items-center gap-2">
                                    <CheckCircle size={20} className="text-emerald-500" />
                                    Verified Learner
                                </h4>
                                <p className="text-muted-foreground text-sm">You are a verified member of the EduGenius community with access to all free resources.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
