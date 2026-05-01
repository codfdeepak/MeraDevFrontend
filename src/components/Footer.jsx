import { Link, NavLink } from "react-router-dom";
import logoDark from "../assets/logo1.png";
import logoLight from "../assets/logo2.png";

const QUICK_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about-us", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/projects", label: "Projects" },
  { to: "/technologies", label: "Technologies" },
  { to: "/partners", label: "Partners" },
  { to: "/contact-us", label: "Contact Us" },
  { to: "/payment-policy", label: "Payment Policy" },
];

const CAPABILITIES = [
  "Business Websites and Corporate Platforms",
  "Custom E-Commerce Store Development",
  "Scalable Web Applications and Portals",
  "Performance and Security Focused Delivery",
  "Post-Launch Support and Continuous Improvements",
];

const CONTACT_INFO = [
  {
    label: "Email",
    value: "codfdeepak@gmail.com",
    href: "mailto:codfdeepak@gmail.com",
    icon: "email",
  },
  {
    label: "Phone",
    value: "+91 95019 24299",
    href: "tel:+919501924299",
    icon: "phone",
  },
  {
    label: "WhatsApp",
    value: "Chat on WhatsApp",
    href: "https://wa.me/919501924299",
    external: true,
    icon: "whatsapp",
  },
  {
    label: "Address",
    value: "Sector 18, Noida - 201301, Uttar Pradesh",
    icon: "location",
  },
];

function ContactIcon({ type }) {
  if (type === "email") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
        <path d="m4.5 7 7.5 6 7.5-6" />
      </svg>
    );
  }

  if (type === "phone") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.4 16.6v2.9a1.9 1.9 0 0 1-2.1 1.9 16.6 16.6 0 0 1-7.2-2.6 16.3 16.3 0 0 1-5-5 16.6 16.6 0 0 1-2.6-7.2 1.9 1.9 0 0 1 1.9-2.1h2.9a1.9 1.9 0 0 1 1.9 1.6c.1.9.3 1.8.7 2.6a1.9 1.9 0 0 1-.4 2l-1.2 1.2a13.7 13.7 0 0 0 4.5 4.5l1.2-1.2a1.9 1.9 0 0 1 2-.4c.8.4 1.7.6 2.6.7a1.9 1.9 0 0 1 1.6 1.9Z" />
      </svg>
    );
  }

  if (type === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 11.7a8.1 8.1 0 0 1-11.8 7.2L4 20l1.1-4a8.1 8.1 0 1 1 14.9-4.3Z" />
        <path d="M9.3 8.7c.2-.4.3-.4.6-.4h.4c.2 0 .3.1.5.4l.8 1.8c.1.2.1.4 0 .5l-.4.6c-.1.2-.2.3-.1.4.2.3.7 1 1.4 1.5.8.6 1.4.9 1.8 1 .2.1.3 0 .4-.1l.6-.7c.1-.2.3-.2.5-.1l1.7.8c.2.1.3.3.3.4-.1.4-.4 1-.8 1.3-.4.2-.9.3-1.4.2-.4-.1-1-.2-1.7-.5a9.1 9.1 0 0 1-3.4-2.9 8.8 8.8 0 0 1-1.5-2.7c-.3-.8-.3-1.4-.2-1.8.1-.4.3-.8.5-1.1Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="site-footer-top-break" aria-hidden="true" />

      <div className="site-footer-main">
        <section className="site-footer-brand">
          <Link
            to="/"
            className="site-footer-logo-wrap"
            aria-label="MeraDev Technologies"
          >
            <img
              className="site-footer-logo site-footer-logo-dark"
              src={logoDark}
              alt="MeraDev dark logo"
            />
            <img
              className="site-footer-logo site-footer-logo-light"
              src={logoLight}
              alt="MeraDev light logo"
            />
          </Link>
          <a
            className="site-footer-contact-chip"
            href="mailto:codfdeepak@gmail.com"
          >
            codfdeepak@gmail.com
          </a>
          <p className="site-footer-summary">
            We transform business ideas into scalable software solutions with strategy, clean architecture, and
            production-ready development.
          </p>
        </section>

        <section className="site-footer-column">
          <h3>Quick Links</h3>
          <nav className="site-footer-links" aria-label="Footer links">
            {QUICK_LINKS.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </section>

        <section className="site-footer-column">
          <h3>What We Build</h3>
          <ul className="site-footer-list">
            {CAPABILITIES.map((capability) => (
              <li key={capability}>{capability}</li>
            ))}
          </ul>
        </section>

        <section className="site-footer-column">
          <h3>Contact</h3>
          <div className="site-footer-contact">
            {CONTACT_INFO.map((item) => (
              <div className="site-footer-contact-item" key={item.label}>
                <span
                  className={`site-footer-contact-icon${item.icon ? ` site-footer-contact-icon--${item.icon}` : ""}`}
                  aria-hidden="true"
                >
                  <ContactIcon type={item.icon} />
                </span>
                {item.href ? (
                  <a
                    className="site-footer-contact-value"
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className="site-footer-contact-value">{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="site-footer-bottom">
        <span>© {currentYear} MeraDev Technologies. All rights reserved.</span>
        <span>Built with care in India.</span>
      </div>
    </footer>
  );
}

export default Footer;
