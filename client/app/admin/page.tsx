"use client";

import React, { useState, useEffect } from 'react';
import {
    BarChart3, Users, Activity, Settings, AlertCircle,
    Search, Filter, Download, UserPlus, Shield, Zap,
    Cpu, HardDrive, Globe, MoreVertical, CheckCircle2, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="min-h-screen bg-background/50 p-6 lg:p-10">
            <div className="max-w-[1600px] mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                            Admin <span className="text-primary italic">Command Center</span>
                        </h1>
                        <p className="text-muted-foreground font-medium">Monitoring autonomous learning agents and system health.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-xl h-12 px-6">
                            <Download size={18} className="mr-2" />
                            Export Report
                        </Button>
                        <Button className="rounded-xl h-12 px-6 shadow-lg shadow-primary/20">
                            <UserPlus size={18} className="mr-2" />
                            Invite Agent
                        </Button>
                    </div>
                </div>

                {/* Dashboard Content */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList className="bg-card/50 border border-border/50 p-1.5 h-16 rounded-2xl w-full justify-start overflow-x-auto no-scrollbar">
                        <TabsTrigger value="overview" className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            <BarChart3 size={18} className="mr-2" /> Overview
                        </TabsTrigger>
                        <TabsTrigger value="users" className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            <Users size={18} className="mr-2" /> Users
                        </TabsTrigger>
                        <TabsTrigger value="activity" className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            <Activity size={18} className="mr-2" /> Activity
                        </TabsTrigger>
                        <TabsTrigger value="performance" className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            <Zap size={18} className="mr-2" /> Performance
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            <Settings size={18} className="mr-2" /> Settings
                        </TabsTrigger>
                    </TabsList>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <TabsContent value="overview" className="mt-0 space-y-8">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatCard title="Total Users" value="12,842" trend="+12.5%" icon={<Users className="text-blue-500" />} />
                                    <StatCard title="Avg. Score" value="84%" trend="+4.1%" icon={<Zap className="text-amber-500" />} />
                                    <StatCard title="Active Agents" value="24" trend="Optimal" icon={<Shield className="text-emerald-500" />} />
                                    <StatCard title="System Health" value="99.9%" trend="Stable" icon={<Activity className="text-primary" />} />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Recent Activity Mini */}
                                    <Card className="lg:col-span-2 bg-card/30 backdrop-blur-xl border-border/50 rounded-[2.5rem] overflow-hidden">
                                        <CardHeader className="p-8 pb-4">
                                            <CardTitle className="text-2xl font-black">System Pulse</CardTitle>
                                            <CardDescription>Real-time activity across all autonomous modules.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <ScrollArea className="h-[400px]">
                                                <div className="px-8 pb-8 space-y-6">
                                                    <ActivityItem
                                                        label="Course Generation"
                                                        user="Agent Orion"
                                                        desc="Successfully published 'Quantum Computing v2'"
                                                        time="2m ago"
                                                        status="success"
                                                    />
                                                    <ActivityItem
                                                        label="Security"
                                                        user="Protocol X"
                                                        desc="Detected & blocked suspicious login attempt (IP 192.168.1.1)"
                                                        time="15m ago"
                                                        status="warning"
                                                    />
                                                    <ActivityItem
                                                        label="Chat"
                                                        user="Mujtaba"
                                                        desc="Completed multi-turn dialogue on React Hooks"
                                                        time="45m ago"
                                                        status="info"
                                                    />
                                                    <ActivityItem
                                                        label="System"
                                                        user="Core"
                                                        desc="Background vector indexing complete"
                                                        time="1h ago"
                                                        status="success"
                                                    />
                                                </div>
                                            </ScrollArea>
                                        </CardContent>
                                    </Card>

                                    {/* Resource Monitors */}
                                    <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2.5rem] p-8 space-y-8">
                                        <h3 className="text-xl font-bold">Infrastucture</h3>
                                        <ResourceBar label="AI Provider Latency" value={78} color="bg-primary" />
                                        <ResourceBar label="Vector DB Indexing" value={42} color="bg-blue-500" />
                                        <ResourceBar label="Cache Hit Ratio" value={94} color="bg-emerald-500" />
                                        <ResourceBar label="Storage Usage" value={15} color="bg-amber-500" />
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="users" className="mt-0">
                                <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2.5rem] overflow-hidden">
                                    <div className="p-8 border-b border-border/50 flex flex-col md:flex-row justify-between gap-6">
                                        <div className="relative w-full md:max-w-md">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                            <Input placeholder="Search users by name, email, or role..." className="pl-12 bg-background/50 rounded-2xl border-border/50" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Button variant="outline" className="rounded-xl"><Filter size={18} className="mr-2" /> Filter</Button>
                                            <Button variant="outline" className="rounded-xl"><Download size={18} className="mr-2" /> Export</Button>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-muted/30">
                                                    <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">User</th>
                                                    <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Role</th>
                                                    <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Status</th>
                                                    <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Join Date</th>
                                                    <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border/50">
                                                <UserRow name="Alex Johnson" email="alex@example.com" role="Admin" status="Active" date="Jan 12, 2026" />
                                                <UserRow name="Sarah Chen" email="sarah.c@ai.edu" role="Student" status="Active" date="Jan 08, 2026" />
                                                <UserRow name="John Doe" email="john.d@mail.com" role="Student" status="Warning" date="Dec 28, 2025" />
                                                <UserRow name="Agent Nova" email="nova@edugenius.ai" role="AI Agent" status="Active" date="Dec 15, 2025" />
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            </TabsContent>

                            <TabsContent value="performance" className="mt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <PerformanceMetricCard
                                        title="Largest Contentful Paint (LCP)"
                                        value="1.2s"
                                        status="Good"
                                        desc="Measures how long it takes for the largest content element to become visible."
                                    />
                                    <PerformanceMetricCard
                                        title="First Input Delay (FID)"
                                        value="18ms"
                                        status="Good"
                                        desc="Measures the time from when a user first interacts with your site to response."
                                    />
                                    <PerformanceMetricCard
                                        title="Cumulative Layout Shift (CLS)"
                                        value="0.02"
                                        status="Good"
                                        desc="Measures the visual stability of the page content."
                                    />
                                    <PerformanceMetricCard
                                        title="AI Response Time"
                                        value="2.4s"
                                        status="Needs Improvement"
                                        desc="Average time for Gemini to generate multi-turn agent responses."
                                    />
                                </div>
                            </TabsContent>
                        </motion.div>
                    </AnimatePresence>
                </Tabs>
            </div>
        </div>
    );
}

function StatCard({ title, value, trend, icon }: any) {
    return (
        <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2.5rem] p-8 space-y-4 hover:border-primary/50 transition-colors duration-500">
            <div className="flex justify-between items-start">
                <div className="p-4 bg-background/50 rounded-2xl border border-border/50 shadow-inner">
                    {React.cloneElement(icon, { size: 24 })}
                </div>
                <Badge variant="outline" className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-black",
                    trend.includes('+') ? "text-emerald-500 border-emerald-500/20" : "text-muted-foreground border-border"
                )}>
                    {trend}
                </Badge>
            </div>
            <div>
                <h4 className="text-sm font-bold text-muted-foreground mb-1">{title}</h4>
                <p className="text-3xl font-black tracking-tight">{value}</p>
            </div>
        </Card>
    );
}

function ActivityItem({ label, user, desc, time, status }: any) {
    const statusColors: any = {
        success: "bg-emerald-500",
        warning: "bg-amber-500",
        info: "bg-blue-500",
        error: "bg-destructive"
    };

    return (
        <div className="flex gap-6 items-start group">
            <div className="relative mt-1.5 flex flex-col items-center">
                <div className={cn("w-3 h-3 rounded-full shrink-0 z-10", statusColors[status])} />
                <div className="w-[2px] h-full bg-border/50 absolute top-3 flex-1 group-last:hidden" />
            </div>
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="px-2 py-0 rounded text-[9px] uppercase font-bold">{label}</Badge>
                    <span className="text-xs text-muted-foreground font-medium">{time}</span>
                </div>
                <p className="text-sm font-bold">{user} <span className="text-muted-foreground font-medium font-normal">{desc}</span></p>
            </div>
        </div>
    );
}

function ResourceBar({ label, value, color }: any) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                <span>{label}</span>
                <span>{value}%</span>
            </div>
            <div className="h-3 bg-muted/50 rounded-full overflow-hidden border border-border/50">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    className={cn("h-full rounded-full shadow-lg shadow-white/10", color)}
                />
            </div>
        </div>
    );
}

function UserRow({ name, email, role, status, date }: any) {
    return (
        <tr className="hover:bg-muted/20 transition-colors group">
            <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary border border-primary/20 shrink-0">
                        {name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-sm leading-tight">{name}</p>
                        <p className="text-xs text-muted-foreground">{email}</p>
                    </div>
                </div>
            </td>
            <td className="px-8 py-6">
                <Badge variant="outline" className="font-bold border-border/50">{role}</Badge>
            </td>
            <td className="px-8 py-6">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        status === 'Active' ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                    )} />
                    <span className="text-sm font-bold">{status}</span>
                </div>
            </td>
            <td className="px-8 py-6 text-sm font-medium text-muted-foreground">
                {date}
            </td>
            <td className="px-8 py-6">
                <button className="p-2 hover:bg-muted rounded-xl transition-colors">
                    <MoreVertical size={18} className="text-muted-foreground" />
                </button>
            </td>
        </tr>
    );
}

function PerformanceMetricCard({ title, value, status, desc }: any) {
    return (
        <Card className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[2.5rem] p-8 space-y-4">
            <div className="flex justify-between items-center">
                <h4 className="font-black text-lg tracking-tight">{title}</h4>
                <Badge className={cn(
                    "px-3 py-1 rounded-full",
                    status === 'Good' ? "bg-emerald-500" : "bg-amber-500"
                )}>{status}</Badge>
            </div>
            <p className="text-5xl font-black text-primary">{value}</p>
            <p className="text-sm text-muted-foreground leading-relaxed italic">{desc}</p>
        </Card>
    );
}
