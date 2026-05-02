import {
  FaAws,
  FaCode,
  FaCss3Alt,
  FaFigma,
  FaGitAlt,
  FaGithub,
  FaJava,
  FaNodeJs,
  FaPhp,
  FaReact,
  FaWordpress,
} from "react-icons/fa6";
import {
  SiAndroidstudio,
  SiBootstrap,
  SiDjango,
  SiDocker,
  SiExpress,
  SiFirebase,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiLaravel,
  SiMongodb,
  SiMui,
  SiMysql,
  SiNextdotjs,
  SiPostgresql,
  SiPython,
  SiRedux,
  SiSass,
  SiShopify,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiXcode,
} from "react-icons/si";
import { VscCode } from "react-icons/vsc";

const normalizeRoleLabel = (role) => {
  const value = String(role || "").toLowerCase();
  if (value === "owner") return "Owner";
  if (value === "admin") return "Admin";
  return "Partner";
};

const getInitials = (name) => {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "P";
  if (words.length === 1) return words[0].slice(0, 1).toUpperCase();
  return `${words[0].slice(0, 1)}${words[1].slice(0, 1)}`.toUpperCase();
};

const normalizeSkillKey = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "");

const SKILL_LOGOS = {
  android: { icon: SiAndroidstudio, color: "#3ddc84" },
  androidstudio: { icon: SiAndroidstudio, color: "#3ddc84" },
  api: { icon: FaCode, color: "#14b8a6" },
  aws: { icon: FaAws, color: "#ff9900" },
  bootstrap: { icon: SiBootstrap, color: "#7952b3" },
  css: { icon: FaCss3Alt, color: "#2563eb" },
  css3: { icon: FaCss3Alt, color: "#2563eb" },
  django: { icon: SiDjango, color: "#0c4b33" },
  docker: { icon: SiDocker, color: "#2496ed" },
  express: { icon: SiExpress, color: "#64748b" },
  expressjs: { icon: SiExpress, color: "#64748b" },
  figma: { icon: FaFigma, color: "#f24e1e" },
  firebase: { icon: SiFirebase, color: "#ffca28" },
  git: { icon: FaGitAlt, color: "#f05032" },
  github: { icon: FaGithub, color: "#334155" },
  graphql: { icon: SiGraphql, color: "#e10098" },
  html: { icon: SiHtml5, color: "#e34f26" },
  html5: { icon: SiHtml5, color: "#e34f26" },
  java: { icon: FaJava, color: "#e11d48" },
  javascript: { icon: SiJavascript, color: "#f7df1e" },
  js: { icon: SiJavascript, color: "#f7df1e" },
  laravel: { icon: SiLaravel, color: "#ff2d20" },
  materialui: { icon: SiMui, color: "#007fff" },
  mongodb: { icon: SiMongodb, color: "#47a248" },
  mui: { icon: SiMui, color: "#007fff" },
  mysql: { icon: SiMysql, color: "#4479a1" },
  next: { icon: SiNextdotjs, color: "#111827" },
  nextjs: { icon: SiNextdotjs, color: "#111827" },
  node: { icon: FaNodeJs, color: "#5fa04e" },
  nodejs: { icon: FaNodeJs, color: "#5fa04e" },
  php: { icon: FaPhp, color: "#777bb4" },
  postgresql: { icon: SiPostgresql, color: "#4169e1" },
  python: { icon: SiPython, color: "#3776ab" },
  react: { icon: FaReact, color: "#58c4dc" },
  reactjs: { icon: FaReact, color: "#58c4dc" },
  reactnative: { icon: FaReact, color: "#58c4dc" },
  redux: { icon: SiRedux, color: "#764abc" },
  restapi: { icon: FaCode, color: "#14b8a6" },
  sass: { icon: SiSass, color: "#cc6699" },
  scss: { icon: SiSass, color: "#cc6699" },
  shopify: { icon: SiShopify, color: "#7ab55c" },
  tailwind: { icon: SiTailwindcss, color: "#06b6d4" },
  tailwindcss: { icon: SiTailwindcss, color: "#06b6d4" },
  typescript: { icon: SiTypescript, color: "#3178c6" },
  ts: { icon: SiTypescript, color: "#3178c6" },
  vite: { icon: SiVite, color: "#646cff" },
  vscode: { icon: VscCode, color: "#007acc" },
  wordpress: { icon: FaWordpress, color: "#21759b" },
  xcode: { icon: SiXcode, color: "#147efb" },
};

const FALLBACK_SKILL_COLORS = ["#14b8a6", "#f97316", "#0ea5e9", "#84cc16", "#ec4899", "#f59e0b"];

const getSkillInitials = (name) => {
  const words = String(name || "")
    .trim()
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);
  if (words.length === 0) return "S";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0].slice(0, 1)}${words[1].slice(0, 1)}`.toUpperCase();
};

const getFallbackSkillColor = (name) => {
  const total = String(name || "")
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return FALLBACK_SKILL_COLORS[total % FALLBACK_SKILL_COLORS.length];
};

const getSkillLogo = (name) => {
  const key = normalizeSkillKey(name);
  return SKILL_LOGOS[key] || { icon: null, color: getFallbackSkillColor(name) };
};

function PublicProfileSnapshot({ profile }) {
  const name = profile?.user?.fullName || "Profile";
  const roleLabel = normalizeRoleLabel(profile?.user?.role);
  const designation = profile?.about?.headline || "Designation";
  const intro = profile?.about?.summary || "";
  const avatar = profile?.about?.avatar || "";
  const skills = Array.isArray(profile?.skills) ? profile.skills : [];
  const experienceYearsRaw = profile?.totalExperienceYears;
  const experienceYears = Number.isFinite(Number(experienceYearsRaw))
    ? Number(experienceYearsRaw)
    : null;

  return (
    <section className="panel public-profile">
      <div className="public-profile-head">
        <div className="public-avatar">
          {avatar ? (
            <img src={avatar} alt={`${name} avatar`} />
          ) : (
            <div className="public-avatar-fallback">{getInitials(name)}</div>
          )}
        </div>

        <div className="public-identity">
          <div className="public-role-row">
            {roleLabel === "Owner" && (
              <span className="pill micro badge owner">Owner</span>
            )}
            {designation && <span className="pill micro">{designation}</span>}
          </div>
          <h1 className="public-name">{name}</h1>
          {intro && <p className="public-intro">{intro}</p>}
        </div>
      </div>

      <div className="public-profile-grid">
        <div className="public-block public-skills-block">
          <div className="public-block-head">
            <h2>Skills</h2>
            <span className="pill micro">{skills.length}</span>
          </div>
          <div className="public-skill-chips">
            {skills.length === 0 ? (
              <p className="muted">Skills not added yet.</p>
            ) : (
              skills.map((s, idx) => {
                const skillName = String(s?.name || "Skill").trim() || "Skill";
                const logo = getSkillLogo(skillName);
                const SkillIcon = logo.icon;

                return (
                  <article
                    className="public-skill-card"
                    key={`${skillName}-${idx}`}
                    style={{ "--skill-accent": logo.color }}
                  >
                    <span className={`public-skill-logo${SkillIcon ? "" : " initials"}`} aria-hidden="true">
                      {SkillIcon ? <SkillIcon /> : getSkillInitials(skillName)}
                    </span>
                    <span className="public-skill-name">{skillName}</span>
                  </article>
                );
              })
            )}
          </div>
        </div>

        <div className="public-block public-experience-block">
          <div className="public-block-head">
            <h2>Experience</h2>
          </div>
          <div className="public-exp-card">
            <div className="public-exp-value">
              {experienceYears === null ? "—" : `${experienceYears}`}
            </div>
            <div className="muted">Total years of experience</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PublicProfileSnapshot;
