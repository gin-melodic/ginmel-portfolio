import { useState, useEffect } from 'react';
import { Terminal, Zap, ArrowRight, Code2, Cpu } from 'lucide-react';
import { GithubIcon } from './components/icons/GithubIcon';
import { ScrambleText } from './components/ui/ScrambleText';
import { EditorialWall } from './components/EditorialWall';
import { ProjectCard } from './components/ProjectCard';
import { PROJECTS, SKILLS, WHY_ME_REASONS, SOCIAL_LINKS, CONTACT_EMAIL } from './Constant';

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

      <div className="fixed top-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-emerald-900/10 blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-[50vw] h-[50vw] rounded-full bg-cyan-900/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-grid pointer-events-none [mask-image:linear-gradient(to_bottom,white,transparent_80%)]"></div>

      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#050505]/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="font-bold tracking-tighter text-white flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('home')}>
            <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded flex items-center justify-center">
              <span className="text-[#050505] text-[10px] font-black">GM</span>
            </div>
            ginmel.ai
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="px-5 py-2 text-xs font-mono font-bold bg-white text-black hover:bg-emerald-400 transition-colors cursor-pointer"
          >
            <ScrambleText text="PING_ME" onHover={true} duration={400} />
          </a>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-24 md:pt-40 pb-24">

        <section id="home" className="py-12 md:py-20 flex flex-col md:flex-row items-center gap-12 min-h-[70vh] justify-center">
          <div className="flex-1 text-center md:text-left">
            <div className="mb-6 px-3 py-1 border border-emerald-500/20 bg-emerald-500/5 text-[10px] md:text-xs font-mono text-emerald-400 rounded-sm inline-block mx-auto md:mx-0">
              STATUS: <span className="animate-pulse">AVAILABLE FOR FREELANCE_</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 md:mb-8 text-balance">
              10+ years of <br />
              <ScrambleText
                text="engineering judgment."
                delay={100}
                duration={1200}
                className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-mono tracking-tight"
              />
            </h1>

            <div className="font-mono text-sm md:text-base text-neutral-500 space-y-2 mb-10 md:mb-12 border-l-0 md:border-l-2 border-neutral-800 md:pl-4">
              <p>{'>'} <ScrambleText text="iOS Tech Director -> Indie Builder." delay={300} duration={800} /></p>
              <p>{'>'} <ScrambleText text="Zero bloated architectures." delay={500} duration={800} /></p>
              <p>{'>'} <ScrambleText text="Just performant, reliable products." delay={700} duration={800} /></p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <button onClick={() => scrollTo('work')} className="px-6 py-3 bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-colors flex items-center gap-2 group">
                <ScrambleText text="Explore Work" onHover={true} duration={400} /> <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" className="px-4 py-3 bg-neutral-900 text-white font-medium text-sm border border-neutral-800 hover:border-neutral-600 transition-colors flex items-center gap-2">
                <GithubIcon size={16} />
              </a>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-sm md:max-w-md mt-12 md:mt-0 user-select-none">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-cyan-500 rounded-2xl blur-2xl opacity-20 float-animation"></div>
            <div className="relative rounded-2xl border border-white/10 shadow-2xl float-animation glass-panel p-2">
              <img
                src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=2564&auto=format&fit=crop"
                alt="Abstract Tech"
                className="w-full h-auto rounded-xl opacity-80 mix-blend-lighten"
              />
              <div className="absolute -left-4 md:-left-6 top-8 md:top-10 w-12 h-12 md:w-16 md:h-16 bg-[#050505] border border-white/10 rounded-lg md:rounded-xl flex items-center justify-center shadow-xl float-animation-delayed">
                <Code2 className="text-emerald-400" size={20} />
              </div>
              <div className="absolute -right-2 md:-right-4 bottom-8 md:bottom-10 w-10 h-10 md:w-12 md:h-12 bg-emerald-900/50 backdrop-blur-md border border-emerald-500/30 rounded-full flex items-center justify-center shadow-xl float-animation">
                <Cpu className="text-white" size={16} />
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="py-12 border-t border-white/5">
          <h2 className="text-2xl font-bold text-white mb-12 font-mono flex items-center gap-3">
            <Terminal size={20} className="text-emerald-500" />
            <ScrambleText text="/featured_projects" delay={100} duration={800} />
          </h2>

          <div className="grid gap-6">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        <section id="skills" className="py-12 border-t border-white/5">
          <h2 className="text-2xl font-bold text-white mb-12 font-mono flex items-center gap-3">
            <Zap size={20} className="text-emerald-500" />
            <ScrambleText text="/tech_radar" delay={100} duration={800} />
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-sm">
            {SKILLS.map((tech, i) => (
              <div key={tech} className={`glass-panel p-4 rounded text-center text-white transition-colors cursor-crosshair ${i > 7 ? 'hover:text-blue-400' : i > 3 ? 'hover:text-cyan-400' : 'hover:text-emerald-400'} ${i === 11 ? 'border-emerald-500/30 text-emerald-300' : ''}`}>
                <ScrambleText text={tech} onHover={true} duration={500} />
              </div>
            ))}
          </div>
        </section>

        <EditorialWall />

        <section id="why-me" className="py-12 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {WHY_ME_REASONS.map((reason) => (
              <div key={reason.id}>
                <h4 className="text-white font-bold mb-4 font-mono text-lg">
                  <ScrambleText text={reason.title} delay={reason.delay} duration={800} />
                </h4>
                <p className="text-sm text-neutral-400 text-balance">{reason.desc}</p>
              </div>
            ))}
          </div>
        </section>


      </main>

      <footer className="border-t border-white/5 bg-[#050505]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center text-xs text-neutral-600 font-mono">
          <div>
            <ScrambleText text={`© ${new Date().getFullYear()} Liam Fan.`} duration={1000} />
          </div>
          <div className="flex gap-6">
            <a href={SOCIAL_LINKS.github} className="hover:text-emerald-400" target='_blank'><ScrambleText text="GH" onHover={true} duration={300} /></a>
            <a href={SOCIAL_LINKS.twitter} className="hover:text-cyan-400" target='_blank'><ScrambleText text="TW" onHover={true} duration={300} /></a>
            <a href={SOCIAL_LINKS.blog} className="hover:text-white" target='_blank'><ScrambleText text="BLOG" onHover={true} duration={300} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}