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
          <h1 className="public-name">{name}</h1>
          <div className="public-role-row">
            {roleLabel === "Owner" && (
              <span className="pill micro badge owner">Owner</span>
            )}
            {designation && <span className="pill micro">{designation}</span>}
          </div>
          {intro && <p className="public-intro">{intro}</p>}
        </div>
      </div>

      <div className="public-profile-grid">
        <div className="public-block">
          <div className="public-block-head">
            <h2>Skills</h2>
            <span className="pill micro">{skills.length}</span>
          </div>
          <div className="public-skill-chips">
            {skills.length === 0 ? (
              <p className="muted">Skills not added yet.</p>
            ) : (
              skills.map((s, idx) => (
                <span className="tag" key={`${s?.name || "skill"}-${idx}`}>
                  {s?.name || "Skill"}
                  {s?.years ? ` · ${s.years}y` : ""}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="public-block">
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

