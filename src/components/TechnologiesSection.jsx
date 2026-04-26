import { useMemo, useState } from "react";
import {
  FaAws,
  FaCode,
  FaCss3Alt,
  FaFigma,
  FaGitAlt,
  FaGithub,
  FaNodeJs,
  FaReact,
  FaServer,
} from "react-icons/fa6";
import { RiCursorFill } from "react-icons/ri";
import {
  SiBootstrap,
  SiDocker,
  SiExpress,
  SiFirebase,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiJira,
  SiMongodb,
  SiNextdotjs,
  SiPostgresql,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { VscCode } from "react-icons/vsc";

const TECH_SECTIONS = [
  {
    key: "frontend",
    label: "Frontend",
    icon: FaCode,
    items: [
      { name: "React", icon: FaReact, color: "#58c4dc" },
      { name: "Next.js", icon: SiNextdotjs, color: "#111827" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#0ea5e9" },
      { name: "Bootstrap", icon: SiBootstrap, color: "#9333ea" },
      { name: "HTML5", icon: SiHtml5, color: "#ea580c" },
      { name: "CSS3", icon: FaCss3Alt, color: "#2563eb" },
      { name: "JavaScript", icon: SiJavascript, color: "#eab308" },
      { name: "TypeScript", icon: SiTypescript, color: "#2563eb" },
    ],
  },
  {
    key: "backend",
    label: "Backend",
    icon: FaServer,
    items: [
      { name: "Node.js", icon: FaNodeJs, color: "#16a34a" },
      { name: "Express.js", icon: SiExpress, color: "#334155" },
      { name: "MongoDB", icon: SiMongodb, color: "#22c55e" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#3b82f6" },
      { name: "Firebase", icon: SiFirebase, color: "#eab308" },
      { name: "GraphQL", icon: SiGraphql, color: "#ec4899" },
      { name: "AWS", icon: FaAws, color: "#f97316" },
      { name: "Docker", icon: SiDocker, color: "#38bdf8" },
    ],
  },
  {
    key: "tools",
    label: "Tools & Platforms",
    icon: RiCursorFill,
    items: [
      { name: "Git", icon: FaGitAlt, color: "#ef4444" },
      { name: "GitHub", icon: FaGithub, color: "#1f2937" },
      { name: "VS Code", icon: VscCode, color: "#3b82f6" },
      { name: "Figma", icon: FaFigma, color: "#ec4899" },
      { name: "Jira", icon: SiJira, color: "#2563eb" },
      { name: "Cursor", icon: RiCursorFill, color: "#8b5cf6" },
    ],
  },
];

function TechnologiesSection() {
  const [activeKey, setActiveKey] = useState("frontend");

  const activeSection = useMemo(
    () => TECH_SECTIONS.find((section) => section.key === activeKey) || TECH_SECTIONS[0],
    [activeKey],
  );

  return (
    <section className="panel technologies-panel">
      <div className="technologies-head">
        <h1>
          Technologies <span>We Use</span>
        </h1>
        <p className="muted">
          We specialize in both frontend and backend development, powered by modern
          tools to deliver high-quality, scalable solutions.
        </p>
      </div>

      <div className="technologies-tabs">
        {TECH_SECTIONS.map((section) => (
          <button
            key={section.key}
            type="button"
            className={`technologies-tab ${activeKey === section.key ? "active" : ""}`}
            onClick={() => setActiveKey(section.key)}
          >
            <span>
              <section.icon />
            </span>
            {section.label}
          </button>
        ))}
      </div>

      <div className="technologies-grid">
        {activeSection.items.map((item) => (
          <article key={item.name} className="technology-card">
            <div className="technology-logo" style={{ color: item.color }}>
              <item.icon />
            </div>
            <h3>{item.name}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

export default TechnologiesSection;

