import { Link, NavLink } from "react-router-dom";
import logoDark from "../assets/logo1.png";
import logoLight from "../assets/logo2.png";

const QUICK_LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/partners", label: "Partners" },
  { to: "/contact-us", label: "Contact" },
];

const CAPABILITIES = [
  "Custom E-Commerce Websites with End-to-End Setup",
  "Business Websites for All Industries and Use Cases",
  "Web Application Development for Real-World Workflows",
  "WebView Integration for Android and iOS Apps",
  "Secure, Fast, and Performance-Optimized Web Solutions",
  "On-Time Service Delivery and Reliable Project Completion",
];

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
            href="mailto:hello@meradev.tech"
          >
            codfdeepak@gmail.com
          </a>
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
          <h3>Reach Out</h3>
          <div className="site-footer-contact">
            <a href="tel:+919501924299">+91 95019 24299</a>
            <a
              href="https://wa.me/919501924299"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp Chat
            </a>
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
