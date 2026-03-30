import type { ProjectData } from '../Constant';
import { ScrambleText } from './ui/ScrambleText';

const colorConfig = {
  emerald: {
    borderHover: "group-hover:border-emerald-500/50",
    textClass: "text-emerald-400",
    textGroupHover: "group-hover:text-emerald-400",
    tagBg: "bg-emerald-500/10",
    tagBorder: "border-emerald-500/20",
    gradientFrom: "from-emerald-500/30",
    textHover: "hover:text-emerald-400"
  },
  cyan: {
    borderHover: "group-hover:border-cyan-500/50",
    textClass: "text-cyan-400",
    textGroupHover: "group-hover:text-cyan-400",
    tagBg: "bg-cyan-500/10",
    tagBorder: "border-cyan-500/20",
    gradientFrom: "from-cyan-500/30",
    textHover: "hover:text-cyan-400"
  },
  blue: {
    borderHover: "group-hover:border-blue-500/50",
    textClass: "text-blue-400",
    textGroupHover: "group-hover:text-blue-400",
    tagBg: "bg-blue-500/10",
    tagBorder: "border-blue-500/20",
    gradientFrom: "from-blue-500/30",
    textHover: "hover:text-blue-400"
  }
};

export const ProjectCard = ({ project }: { project: ProjectData }) => {
  const Icon = project.icon;
  const tc = colorConfig[project.themeColor];

  return (
    <div className="group relative glass-panel p-[1px] rounded-lg hover:-translate-y-1 transition-all duration-500">
      <div className={`absolute inset-0 bg-gradient-to-br ${tc.gradientFrom} to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-md`}></div>

      <div className="bg-[#0a0a0a]/90 h-full rounded-lg p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden backdrop-blur-sm">
        <div className={`w-12 h-12 bg-neutral-900 border border-neutral-800 rounded flex items-center justify-center shrink-0 ${tc.borderHover} transition-colors`}>
          <Icon className={tc.textClass} size={24} />
        </div>
        <div className="flex-1 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <h3 className={`text-xl font-bold text-white ${tc.textGroupHover} transition-colors`}>{project.title}</h3>
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${tc.tagBg} ${tc.textClass} border ${tc.tagBorder}`}>{project.tag}</span>
          </div>
          <div className="font-mono text-xs text-neutral-500 mb-6 flex gap-3 cursor-default">
            {project.tags.map(tag => (
              <ScrambleText key={tag} text={tag} onHover={true} duration={400} className={`${tc.textHover} transition-colors`} />
            ))}
          </div>
          <div className="space-y-3 text-sm text-neutral-400 text-balance">
            <p><strong className="text-neutral-200">{project.description.label1}</strong> {project.description.text1}</p>
            <p><strong className="text-neutral-200">{project.description.label2}</strong> {project.description.text2}</p>
            <p><strong className="text-neutral-200">{project.description.label3}</strong> <ScrambleText text={project.description.scrambleText3} delay={200} duration={800} /></p>
          </div>
        </div>
      </div>
    </div>
  );
};
