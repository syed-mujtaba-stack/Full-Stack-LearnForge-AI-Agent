"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authService } from "@/services/auth-service";
import { BookOpen, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await authService.signIn(email, password);
            router.push("/");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to login");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await authService.signInWithGoogle(true);
            router.push("/");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Google login failed");
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 font-black text-2xl tracking-tighter mb-6 group">
                        <div className="bg-primary p-1.5 rounded-lg text-primary-foreground group-hover:rotate-12 transition-transform">
                            <BookOpen size={24} />
                        </div>
                        <span>EduGenius</span>
                    </Link>
                    <h1 className="text-3xl font-black tracking-tight">Welcome Back</h1>
                    <p className="text-muted-foreground mt-2">Continue your journey to mastery.</p>
                </div>

                <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-2xl glass">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-bold">Password</label>
                                <Link href="#" className="text-xs text-primary hover:underline font-bold">Forgot?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary text-primary-foreground font-black text-lg rounded-2xl hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                            {!loading && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-4 text-muted-foreground font-bold tracking-widest">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full py-4 bg-secondary text-secondary-foreground font-bold rounded-2xl hover:bg-secondary/80 transition-all active:scale-[0.98] flex items-center justify-center gap-3 border border-border"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google Account
                    </button>
                </div>

                <p className="text-center mt-8 text-muted-foreground font-medium">
                    New to EduGenius? <Link href="/signup" className="text-primary font-black hover:underline">Create Account</Link>
                </p>
            </motion.div>
        </div>
    );
}
