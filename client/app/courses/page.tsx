"use client";

import { useEffect, useState, useMemo } from "react";
import { courseService, Course } from "@/services/course-service";
import { enrollmentService } from "@/services/enrollment-service";
import { CourseCard } from "@/components/course-card";
import { Search, Filter, LayoutGrid, List as ListIcon, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = [
    "All",
    "Development",
    "Data Science",
    "AI & ML",
    "Security",
    "Business",
    "Design"
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

export default function CoursesPage() {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [enrolledIds, setEnrolledIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [enrolling, setEnrolling] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        let isMounted = true;

        const timeoutId = setTimeout(() => {
            if (isMounted) {
                setLoading(false);
            }
        }, 5000);

        const fetchData = async () => {
            try {
                const coursesPromise = courseService.getAll();
                const enrollmentsPromise = user
                    ? enrollmentService.getMyCourses()
                    : Promise.resolve([]);

                const [allCourses, myCourses] = await Promise.all([
                    coursesPromise,
                    enrollmentsPromise
                ]);

                if (isMounted) {
                    setCourses(allCourses);
                    if (user) {
                        setEnrolledIds(myCourses.map(c => c.id));
                    }
                    setLoading(false);
                    clearTimeout(timeoutId);
                }
            } catch (error) {
                console.error("Failed to fetch courses data:", error);
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
    }, [user]);

    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description?.toLowerCase().includes(searchQuery.toLowerCase());

            // For now, mapping categories logic needs backend support or mock metadata
            // Assuming for demo we handle 'All' or match title keywords
            const matchesCategory = selectedCategory === "All" ||
                course.title.toLowerCase().includes(selectedCategory.toLowerCase());

            return matchesSearch && matchesCategory;
        });
    }, [courses, searchQuery, selectedCategory]);

    const handleEnroll = async (courseId: number) => {
        if (!user) {
            router.push(`/login?redirect=/courses`);
            return;
        }

        setEnrolling(courseId);
        try {
            await enrollmentService.enroll(courseId);
            setEnrolledIds(prev => [...prev, courseId]);
            router.push(`/dashboard`);
        } catch (error) {
            console.error("Enrollment failed", error);
        } finally {
            setEnrolling(null);
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="min-h-screen bg-background pb-20 pt-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 text-center space-y-6"
                >
                    <Badge variant="outline" className="px-4 py-1.5 border-primary/30 bg-primary/5 text-primary rounded-full animate-pulse">
                        <Sparkles size={14} className="mr-2" />
                        AI-Powered Curriculum
                    </Badge>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-tight">
                        Explore <span className="text-gradient">Knowledge</span>
                    </h1>
                    <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                        Master high-demand skills with our autonomous agent-driven learning paths.
                    </p>
                </motion.div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12 bg-card/30 backdrop-blur-md p-6 rounded-[2rem] border border-border/50 sticky top-24 z-30">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                            placeholder="Search courses, keywords..."
                            className="pl-12 h-14 bg-background/50 border-border/50 rounded-2xl focus:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
                            <TabsList className="bg-background/50 p-1 h-12 rounded-xl hidden lg:flex">
                                {categories.map(cat => (
                                    <TabsTrigger key={cat} value={cat} className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                        {cat}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            <div className="lg:hidden w-full">
                                <select
                                    className="w-full h-12 bg-background/50 border border-border/50 rounded-xl px-4 text-sm"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                        </Tabs>

                        <div className="flex gap-1 bg-background/50 p-1 rounded-xl border border-border/50 shrink-0">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                size="icon"
                                className="h-10 w-10 rounded-lg"
                                onClick={() => setViewMode('grid')}
                            >
                                <LayoutGrid size={18} />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'ghost'}
                                size="icon"
                                className="h-10 w-10 rounded-lg"
                                onClick={() => setViewMode('list')}
                            >
                                <ListIcon size={18} />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Course Grid */}
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={selectedCategory + searchQuery + viewMode}
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className={cn(
                            "grid gap-8",
                            viewMode === 'grid' ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                        )}
                    >
                        {filteredCourses.length > 0 ? (
                            filteredCourses.map((course) => (
                                <motion.div
                                    key={course.id}
                                    variants={item}
                                    layout
                                >
                                    <CourseCard
                                        course={course}
                                        isEnrolled={enrolledIds.includes(course.id)}
                                        onEnroll={handleEnroll}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full py-32 bg-card/30 border-2 border-dashed border-border/50 rounded-[3rem] text-center flex flex-col items-center gap-6"
                            >
                                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground">
                                    <Filter size={32} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">No courses found</h3>
                                    <p className="text-muted-foreground italic max-w-xs mx-auto">Try adjusting your search or filters to find what you're looking for.</p>
                                </div>
                                <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
                                    Clear all filters
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

