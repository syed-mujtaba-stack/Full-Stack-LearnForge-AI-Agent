"use client";

import Link from "next/link";
import { motion, useTransform, useSpring, useMotionValue, Variants } from "framer-motion";
import { Sparkles, Shield, Zap, ArrowRight, Github } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Procedural Animation Data (impure values moved to mount effect)
  const [flares, setFlares] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);
  const [particles, setParticles] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);

  useEffect(() => {
    // 6. Aura Flares
    setFlares([...Array(4)].map((_, i) => ({
      left: `${20 + Math.random() * 60}%`,
      top: `${20 + Math.random() * 60}%`,
      duration: 3 + Math.random() * 5,
    })));

    // 7. Data Streams
    setStreams([...Array(15)].map((_, i) => ({
      left: `${(i + 1) * 6.5}%`,
      duration: 3 + Math.random() * 5,
      delay: Math.random() * 15,
    })));

    // 9. Particles
    setParticles([...Array(100)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      x: [0, (Math.random() - 0.5) * 150, 0],
      duration: 3 + Math.random() * 7,
      delay: Math.random() * 8,
    })));

    // 10. Neural Grid
    setLines([...Array(20)].map(() => ({
      x1: `${Math.random() * 100}%`, y1: `${Math.random() * 100}%`,
      x2: `${Math.random() * 100}%`, y2: `${Math.random() * 100}%`,
    })));
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const moveX = clientX - window.innerWidth / 2;
    const moveY = clientY - window.innerHeight / 2;
    mouseX.set(moveX);
    mouseY.set(moveY);
  };

  const fadeIn: Variants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  const container: Variants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-x-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-border/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo size={32} />
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="/courses" className="hover:text-primary transition-colors">Courses</Link>
            <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
            <Link href="/signup" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-all font-bold shadow-lg shadow-primary/20">
              Join Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950">
        {/* Visual Background Elements ('Omniverse' Transcendence Stack) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* 1. Dynamic Chroma-Shift Overlay (Cycles core theme color) */}
          <motion.div
            animate={{
              backgroundColor: [
                'rgba(99, 102, 241, 0.05)', // indigo-500
                'rgba(168, 85, 247, 0.05)',  // purple-500
                'rgba(59, 130, 246, 0.05)',  // blue-500
                'rgba(99, 102, 241, 0.05)'
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 z-[1]"
          />

          {/* 2. SVG Filters (Liquid & Omniverse Distortion) */}
          <svg className="absolute w-0 h-0">
            <defs>
              <filter id="liquid">
                <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="4" seed="5" result="noise">
                  <animate attributeName="baseFrequency" values="0.012 0.02; 0.018 0.025; 0.012 0.02" dur="15s" repeatCount="indefinite" />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" />
              </filter>
              <filter id="aura">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="aura" />
              </filter>
            </defs>
          </svg>

          {/* 3. Simulated 3D Wireframe Hub (SVG) */}
          <div className="absolute inset-0 z-10 flex items-center justify-center opacity-10">
            <motion.svg
              viewBox="0 0 200 200" className="w-[800px] h-[800px]"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              <motion.path
                d="M100 20 L180 60 L180 140 L100 180 L20 140 L20 60 Z"
                stroke="currentColor" fill="none" strokeWidth="0.5" className="text-primary"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              {[...Array(6)].map((_, i) => (
                <line
                  key={`wf-${i}`} x1="100" y1="100"
                  x2={100 + 80 * Math.cos(i * Math.PI / 3)}
                  y2={100 + 80 * Math.sin(i * Math.PI / 3)}
                  stroke="currentColor" strokeWidth="0.2" className="text-primary"
                />
              ))}
            </motion.svg>
          </div>

          {/* 4. Film Grain & Holographic Texture */}
          <div className="absolute inset-0 z-[100] opacity-[0.25] pointer-events-none mix-blend-overlay">
            <svg className="h-full w-full">
              <filter id="omninoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
              </filter>
              <rect width="100%" height="100%" filter="url(#omninoise)" />
            </svg>
          </div>

          {/* 5. Aurora Mesh Gradient Base ( Transcendent Scale) */}
          <div className="absolute inset-0 z-0 opacity-90" style={{ filter: 'url(#liquid)' }}>
            <motion.div
              animate={{
                scale: [1, 1.8, 1],
                rotate: [0, 360, 0],
                x: ["-25%", "25%", "-25%"],
                y: ["-20%", "20%", "-20%"],
              }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute top-[-40%] left-[-30%] w-[120%] h-[120%] bg-primary/30 blur-[200px] rounded-full mix-blend-screen"
            />
            <motion.div
              animate={{
                scale: [1.8, 1, 1.8],
                rotate: [0, -360, 0],
                x: ["25%", "-25%", "25%"],
                y: ["20%", "-20%", "20%"],
              }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-[-40%] right-[-30%] w-[130%] h-[130%] bg-violet-600/30 blur-[200px] rounded-full mix-blend-screen"
            />
          </div>

          {/* 6. Aura Flares (Random Intelligence Bursts) */}
          {flares.map((flare, i) => (
            <motion.div
              key={`flare-${i}`}
              className="absolute w-32 h-32 bg-white blur-[60px] rounded-full mix-blend-overlay"
              style={{
                left: flare.left,
                top: flare.top,
              }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 0.4, 0],
              }}
              transition={{
                duration: flare.duration,
                repeat: Infinity,
                delay: i * 4,
              }}
            />
          ))}

          {/* 7. Data Stream Knowledge Packets */}
          {streams.map((stream, i) => (
            <motion.div
              key={`dstream-${i}`}
              className="absolute w-[2px] bg-gradient-to-b from-transparent via-primary/50 to-transparent z-10"
              style={{
                height: '30vh',
                left: stream.left,
                top: '-30vh',
              }}
              animate={{
                y: ['0vh', '150vh'],
              }}
              transition={{
                duration: stream.duration,
                repeat: Infinity,
                delay: stream.delay,
                ease: "linear"
              }}
            />
          ))}

          {/* 8. Transcendent Gravity Well (Precision Distortion) */}
          <motion.div
            style={{
              x: useSpring(useTransform(mouseX, [-500, 500], [100, -100])),
              y: useSpring(useTransform(mouseY, [-500, 500], [100, -100])),
              scale: useSpring(useTransform(mouseY, [-500, 500], [0.5, 1.5]))
            }}
            className="absolute inset-0 flex items-center justify-center z-20"
          >
            <div className="w-[500px] h-[500px] bg-primary/40 blur-[150px] rounded-full mix-blend-plus-lighter opacity-40 shadow-[0_0_200px_-50px_rgba(99,102,241,0.5)]" />
          </motion.div>

          {/* 9. Nexus Particle Intelligence */}
          {particles.map((part, i) => (
            <motion.div
              key={`omnipart-${i}`}
              className="absolute w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.9)]"
              style={{
                left: part.left,
                top: part.top,
              }}
              animate={{
                y: [0, -400, 0],
                x: part.x,
                scale: [0, 3.5, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: part.duration,
                repeat: Infinity,
                delay: part.delay,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* 10. Neural Grid Constellation (Reactive Intensity) */}
          <div className="absolute inset-0 z-5 opacity-40" style={{ filter: 'url(#liquid)' }}>
            <svg className="w-full h-full">
              {lines.map((line, i) => (
                <motion.line
                  key={`transline-${i}`}
                  x1={line.x1} y1={line.y1}
                  x2={line.x2} y2={line.y2}
                  stroke="currentColor" strokeWidth="0.8"
                  className="text-primary"
                  animate={{ opacity: [0.1, 0.6, 0.1], strokeWidth: [0.5, 1.5, 0.5] }}
                  transition={{ duration: 5, repeat: Infinity, delay: i * 0.25 }}
                />
              ))}
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8 backdrop-blur-md">
              <Sparkles size={16} className="animate-pulse" />
              <span>Empowering Next-Gen Innovators</span>
            </div>

            <div className="mb-8">
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] flex flex-wrap justify-center gap-x-4">
                {["Master", "Any", "Skill"].map((word, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={wordVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] mt-2">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="text-gradient italic"
                >
                  With AI Precision.
                </motion.span>
              </h1>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="max-w-2xl mx-auto text-xl text-muted-foreground mb-12 leading-relaxed"
            >
              EduGenius leverages state-of-the-art AI to personalize your
              learning experience, breaking barriers to complex engineering
              and creative mastery.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link href="/signup" className="group px-10 py-5 bg-primary text-primary-foreground rounded-full text-lg font-black transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/30 flex items-center gap-2">
                Start Free Journey
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/courses" className="px-10 py-5 bg-background text-foreground rounded-full text-lg font-bold transition-all hover:bg-secondary/50 border border-border/50 backdrop-blur-md">
                Explore Curriculum
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.h2
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black tracking-tight mb-6"
            >
              Engineered for <span className="text-primary">Results</span>
            </motion.h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
              Beyond just videos—we provide an immersive ecosystem that
              adapts to your unique learning style in real-time.
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {[
              {
                icon: <Zap size={32} />,
                title: "Adaptive Engine",
                desc: "Content evolves as you learn. We identify your gaps and bridge them automatically."
              },
              {
                icon: <Shield size={32} />,
                title: "Verified Skills",
                desc: "Dynamic assessments that ensure you're not just watching, but mastering."
              },
              {
                icon: <Sparkles size={32} />,
                title: "AI Companion",
                desc: "Your personal tutor that remembers your progress and explains like a pro."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="relative bg-card/50 backdrop-blur-sm border border-border/50 p-10 rounded-[2.5rem] hover:border-primary/50 transition-all group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-colors" />
                <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tighter">{feature.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <motion.div
          whileInView={{ scale: 1, opacity: 1 }}
          initial={{ scale: 0.95, opacity: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-primary rounded-[4rem] p-16 md:p-24 text-center text-primary-foreground relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(var(--primary),0.5)]"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-[60px]" />

          <h2 className="text-5xl md:text-7xl font-black mb-10 leading-[0.9] tracking-tighter">
            Stop Browsing. <br />
            Start Mastering.
          </h2>
          <p className="text-primary-foreground/90 text-xl mb-12 max-w-xl mx-auto leading-relaxed font-medium">
            Join 50,000+ ambitious minds who have already unlocked their
            potential with EduGenius AI.
          </p>
          <Link href="/signup" className="px-12 py-6 bg-white text-primary font-black text-2xl rounded-full hover:bg-slate-100 transition-all active:scale-95 shadow-2xl relative z-10">
            Join the Revolution
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border/50 px-6 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <Logo size={28} animated={false} />
          <p className="text-muted-foreground font-medium">
            © 2026 EduGenius Platform. Redefining Human Intelligence.
          </p>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-all hover:scale-110"><Github size={24} /></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
