import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Terminal,
  Smartphone,
  ShieldCheck,
  Layers,
  Zap,
  ArrowRight,
  Code2,
  Cpu
} from 'lucide-react';

interface GithubIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number | string;
}

const Github = ({ size = 24, className = "", ...props }: GithubIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.53 6-6.76a5.2 5.2 0 0 0-1.4-3.6 4.9 4.9 0 0 0-.1-3.6s-1.1-.35-3.5 1.25a12.1 12.1 0 0 0-6.4 0C6.1 2.5 5 2.85 5 2.85a4.9 4.9 0 0 0-.1 3.6A5.2 5.2 0 0 0 3.5 10c0 5.2 3 6.4 6 6.74-.7.6-1 1.6-1 2.8v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// ============================================================================
// Core Effect Component: PretextEffect (Simulating chenglou/pretext)
// ============================================================================
// High-tech character set for the scramble effect
const chars = '░▒▓█▄▀■abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>-_\\/[]{}—=+*^?#_';

interface PretextEffectProps {
  text: string;
  delay?: number;
  duration?: number;
  onHover?: boolean;
  className?: string;
  as?: React.ElementType;
}

const PretextEffect = ({
  text,
  delay = 0,
  duration = 800,
  onHover = false,
  className = "",
  as: Component = "span"
}: PretextEffectProps) => {
  const [content, setContent] = useState(onHover ? text : '');

  // 改用 useRef，避免觸發重新渲染，確保 useCallback 參考穩定
  const isAnimating = useRef(false);

  const frameRef = useRef<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const nodeRef = useRef<HTMLElement | null>(null);

  const triggerAnimation = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    let start: number | undefined;
    let lastUpdate = 0;

    const tick = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      // 節流閥：限制在約 30FPS，避免首屏並發更新導致 React 渲染卡頓，且更有終端跳動感
      if (timestamp - lastUpdate < 30 && elapsed < delay + duration) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }
      lastUpdate = timestamp;

      let progress = 0;
      // 在 delay 期間，progress 為 0，全量亂碼；delay 過後，開始逐步揭示文字
      if (elapsed > delay) {
        const linearProgress = Math.min((elapsed - delay) / duration, 1);
        progress = 1 - Math.pow(1 - linearProgress, 4);
      }

      let newText = '';
      const revealIndex = Math.floor(progress * text.length);

      for (let i = 0; i < text.length; i++) {
        if (i < revealIndex) {
          newText += text[i];
        } else if (text[i] === ' ') {
          newText += ' ';
        } else {
          newText += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      setContent(newText);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setContent(text);
        isAnimating.current = false;
      }
    };

    frameRef.current = requestAnimationFrame(tick);
  }, [text, delay, duration]);

  // Observer Effect：只負責綁定 IntersectionObserver
  useEffect(() => {
    if (!onHover) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            triggerAnimation();
            observerRef.current?.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      if (nodeRef.current && observerRef.current) {
        observerRef.current.observe(nodeRef.current);
      }
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [onHover, triggerAnimation]);

  // Cleanup Effect：分離 cancelAnimationFrame，確保它只在元件徹底卸載時觸發
  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  // 使用底層感強烈的區塊符填充初始狀態，拒絕假死的透明文本
  const initialPlaceholder = text.replace(/[^\s]/g, '░');

  return (
    <Component
      ref={nodeRef}
      className={className}
      onMouseEnter={onHover ? triggerAnimation : undefined}
      style={{ display: 'inline-block', minWidth: onHover ? 'auto' : `${text.length}ch` }}
    >
      {content || initialPlaceholder}
    </Component>
  );
};


// ============================================================================
// Main Application
// ============================================================================
export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-neutral-300 font-sans selection:bg-emerald-500/30 overflow-hidden">

      <style dangerouslySetInnerHTML={{
        __html: `
        .bg-grid {
          background-size: 30px 30px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), 
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
        }
        .glass-panel {
          background: rgba(10, 10, 10, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.03);
        }
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        .float-animation-delayed {
          animation: float 6s ease-in-out 3s infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}} />

      {/* Ambient Background Glows */}
      <div className="fixed top-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-emerald-900/10 blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-[50vw] h-[50vw] rounded-full bg-cyan-900/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-grid pointer-events-none [mask-image:linear-gradient(to_bottom,white,transparent_80%)]"></div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#050505]/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="font-bold tracking-tighter text-white flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('home')}>
            <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded flex items-center justify-center">
              <span className="text-[#050505] text-[10px] font-black">GM</span>
            </div>
            ginmel.ai
          </div>
          <a
            href="mailto:hello@ginmel.ai"
            className="px-5 py-2 text-xs font-mono font-bold bg-white text-black hover:bg-emerald-400 transition-colors cursor-pointer"
          >
            <PretextEffect text="PING_ME" onHover={true} duration={400} />
          </a>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-40 pb-24">

        {/* --- Hero Section --- */}
        <section id="home" className="py-20 flex flex-col md:flex-row items-center gap-12 min-h-[60vh] justify-center">

          <div className="flex-1 text-left">
            <div className="mb-6 px-3 py-1 border border-emerald-500/20 bg-emerald-500/5 text-xs font-mono text-emerald-400 rounded-sm inline-block">
              STATUS: <span className="animate-pulse">AVAILABLE FOR FREELANCE_</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-8 text-balance">
              10+ years of <br />
              <PretextEffect
                text="engineering judgment."
                delay={100}
                duration={1200}
                className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-mono tracking-tight"
              />
            </h1>

            <div className="font-mono text-sm md:text-base text-neutral-500 space-y-2 mb-12 border-l-2 border-neutral-800 pl-4">
              <p>{'>'} <PretextEffect text="iOS Tech Director -> Indie Builder." delay={300} duration={800} /></p>
              <p>{'>'} <PretextEffect text="Zero bloated architectures." delay={500} duration={800} /></p>
              <p>{'>'} <PretextEffect text="Just performant, reliable products." delay={700} duration={800} /></p>
            </div>

            <div className="flex gap-4">
              <button onClick={() => scrollTo('work')} className="px-6 py-3 bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-colors flex items-center gap-2 group">
                <PretextEffect text="Explore Work" onHover={true} duration={400} /> <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="https://github.com/gin-melodic" target="_blank" rel="noreferrer" className="px-4 py-3 bg-neutral-900 text-white font-medium text-sm border border-neutral-800 hover:border-neutral-600 transition-colors flex items-center gap-2">
                <Github size={16} />
              </a>
            </div>
          </div>

          {/* Restored Hero Visual Element */}
          <div className="flex-1 relative w-full max-w-md hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-cyan-500 rounded-2xl blur-2xl opacity-20 float-animation"></div>
            <div className="relative rounded-2xl border border-white/10 shadow-2xl float-animation glass-panel p-2">
              <img
                src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=2564&auto=format&fit=crop"
                alt="Abstract Tech"
                className="w-full h-auto rounded-xl opacity-80 mix-blend-lighten"
              />
              <div className="absolute -left-6 top-10 w-16 h-16 bg-[#050505] border border-white/10 rounded-xl flex items-center justify-center shadow-xl float-animation-delayed">
                <Code2 className="text-emerald-400" size={24} />
              </div>
              <div className="absolute -right-4 bottom-10 w-12 h-12 bg-emerald-900/50 backdrop-blur-md border border-emerald-500/30 rounded-full flex items-center justify-center shadow-xl float-animation">
                <Cpu className="text-white" size={20} />
              </div>
            </div>
          </div>
        </section>

        {/* --- Featured Projects --- */}
        <section id="work" className="py-24 border-t border-white/5">
          <h2 className="text-2xl font-bold text-white mb-12 font-mono flex items-center gap-3">
            <Terminal size={20} className="text-emerald-500" />
            <PretextEffect text="/featured_projects" delay={100} duration={800} />
          </h2>

          <div className="grid gap-6">

            {/* Project 1 */}
            <div className="group relative glass-panel p-[1px] rounded-lg hover:-translate-y-1 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-md"></div>

              <div className="bg-[#0a0a0a]/90 h-full rounded-lg p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden backdrop-blur-sm">
                <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded flex items-center justify-center shrink-0 group-hover:border-emerald-500/50 transition-colors">
                  <Smartphone className="text-emerald-400" size={24} />
                </div>
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">SDAC Poster Editor</h3>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Mobile Native</span>
                  </div>
                  <div className="font-mono text-xs text-neutral-500 mb-6 flex gap-3 cursor-default">
                    <PretextEffect text="[Hybrid_Mobile]" onHover={true} duration={400} className="hover:text-emerald-400 transition-colors" />
                    <PretextEffect text="[Go]" onHover={true} duration={400} className="hover:text-emerald-400 transition-colors" />
                    <PretextEffect text="[Canvas_API]" onHover={true} duration={400} className="hover:text-emerald-400 transition-colors" />
                  </div>
                  <div className="space-y-3 text-sm text-neutral-400 text-balance">
                    <p><strong className="text-neutral-200">Problem:</strong> Complex mobile drag-and-drop editor with rendering inconsistencies across devices.</p>
                    <p><strong className="text-neutral-200">Arch:</strong> Hybrid approach. Frontend Canvas for UI + Go backend for exact image compositing.</p>
                    <p><strong className="text-neutral-200">Result:</strong> <PretextEffect text="Zero layout bugs." delay={200} duration={800} /></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div className="group relative glass-panel p-[1px] rounded-lg hover:-translate-y-1 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-md"></div>

              <div className="bg-[#0a0a0a]/90 h-full rounded-lg p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden backdrop-blur-sm">
                <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded flex items-center justify-center shrink-0 group-hover:border-cyan-500/50 transition-colors">
                  <ShieldCheck className="text-cyan-400" size={24} />
                </div>
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">GAAP FinSystem</h3>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">AI/FinTech</span>
                  </div>
                  <div className="font-mono text-xs text-neutral-500 mb-6 flex gap-3 cursor-default">
                    <PretextEffect text="[GoFrame]" onHover={true} duration={400} className="hover:text-cyan-400 transition-colors" />
                    <PretextEffect text="[Next.js_15]" onHover={true} duration={400} className="hover:text-cyan-400 transition-colors" />
                    <PretextEffect text="[gRPC]" onHover={true} duration={400} className="hover:text-cyan-400 transition-colors" />
                  </div>
                  <div className="space-y-3 text-sm text-neutral-400 text-balance">
                    <p><strong className="text-neutral-200">Focus:</strong> Exploring the engineering boundaries of LLM "Vibe Coding".</p>
                    <p><strong className="text-neutral-200">Guardrails:</strong> Strict Go-level type systems & property-based testing to intercept AI hallucinations.</p>
                    <p><strong className="text-neutral-200">Result:</strong> <PretextEffect text="Safe, reliable multi-currency accounting MVP." delay={200} duration={1000} /></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Project 3 */}
            <div className="group relative glass-panel p-[1px] rounded-lg hover:-translate-y-1 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-md"></div>

              <div className="bg-[#0a0a0a]/90 h-full rounded-lg p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden backdrop-blur-sm">
                <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded flex items-center justify-center shrink-0 group-hover:border-blue-500/50 transition-colors">
                  <Layers className="text-blue-400" size={24} />
                </div>
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">Enterprise AI Gateway</h3>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20">Infrastructure</span>
                  </div>
                  <div className="font-mono text-xs text-neutral-500 mb-6 flex gap-3 cursor-default">
                    <PretextEffect text="[Dify]" onHover={true} duration={400} className="hover:text-blue-400 transition-colors" />
                    <PretextEffect text="[SSO/RBAC]" onHover={true} duration={400} className="hover:text-blue-400 transition-colors" />
                    <PretextEffect text="[Python]" onHover={true} duration={400} className="hover:text-blue-400 transition-colors" />
                  </div>
                  <div className="space-y-3 text-sm text-neutral-400 text-balance">
                    <p><strong className="text-neutral-200">Task:</strong> Intranet deployment & adaptation of open-source Dify platform.</p>
                    <p><strong className="text-neutral-200">Arch:</strong> Global SSO gateway + RBAC reverse proxy for 1000+ users.</p>
                    <p><strong className="text-neutral-200">Result:</strong> <PretextEffect text="Highly secure, low-intrusion enterprise AI." delay={200} duration={1000} /></p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --- Tech Radar --- */}
        <section id="skills" className="py-24 border-t border-white/5">
          <h2 className="text-2xl font-bold text-white mb-12 font-mono flex items-center gap-3">
            <Zap size={20} className="text-emerald-500" />
            <PretextEffect text="/tech_radar" delay={100} duration={800} />
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-sm">
            {[
              "Swift_Obj-C", "React_Native", "React_Next.js", "Tailwind_CSS",
              "Golang_GoFrame", "Node.js_Python", "Docker_CICD", "gRPC_Microservices",
              "LLM_API", "RAG_Agent", "Dify_Custom", "AI_Code_Auditing"
            ].map((tech, i) => (
              <div key={tech} className={`glass-panel p-4 rounded text-center text-white transition-colors cursor-crosshair ${i > 7 ? 'hover:text-blue-400' : i > 3 ? 'hover:text-cyan-400' : 'hover:text-emerald-400'} ${i === 11 ? 'border-emerald-500/30 text-emerald-300' : ''}`}>
                <PretextEffect text={tech} onHover={true} duration={500} />
              </div>
            ))}
          </div>
        </section>

        {/* --- Why Me --- */}
        <section id="why-me" className="py-24 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-white font-bold mb-4 font-mono text-lg">
                <PretextEffect text="01. No Translation Lost" duration={800} />
              </h4>
              <p className="text-sm text-neutral-400 text-balance">Former Tech Director. Give me a business goal; I'll break it down into a technical WBS. Zero spoon-feeding required.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 font-mono text-lg">
                <PretextEffect text="02. Design to Code" delay={200} duration={800} />
              </h4>
              <p className="text-sm text-neutral-400 text-balance">High standard for UI aesthetics (Sketch/Figma). I deliver the full pipeline from frontend interaction to backend logic.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 font-mono text-lg">
                <PretextEffect text="03. Honest Estimation" delay={400} duration={800} />
              </h4>
              <p className="text-sm text-neutral-400 text-balance">I know which AI features are pseudo-needs. I provide honest estimations to prevent expensive technical debt.</p>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-white/5 bg-[#050505]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center text-xs text-neutral-600 font-mono">
          <div>
            <PretextEffect text={`© ${new Date().getFullYear()} Liam Fan.`} duration={1000} />
          </div>
          <div className="flex gap-6">
            <a href="https://github.com/gin-melodic" className="hover:text-emerald-400"><PretextEffect text="GH" onHover={true} duration={300} /></a>
            <a href="https://twitter.com/melodicgin" className="hover:text-cyan-400"><PretextEffect text="TW" onHover={true} duration={300} /></a>
            <a href="https://antinomy.me" className="hover:text-white"><PretextEffect text="BLOG" onHover={true} duration={300} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}