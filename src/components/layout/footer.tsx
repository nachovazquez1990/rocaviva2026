import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";

const socialLinks = [
  { href: "https://facebook.com/RocavivaEventos/", label: "Facebook", icon: FacebookIcon },
  { href: "https://instagram.com/rocavivaeventos", label: "Instagram", icon: InstagramIcon },
  { href: "https://twitter.com/rocaviva_", label: "X / Twitter", icon: XIcon },
  { href: "https://youtube.com/@rocavivaeventos", label: "YouTube", icon: YouTubeIcon },
  { href: "https://linkedin.com/company/rocaviva-eventos/", label: "LinkedIn", icon: LinkedInIcon },
];

const navItems = [
  { href: "/", key: "home" },
  { href: "/projects", key: "projects" },
  { href: "/communication", key: "communication" },
  { href: "/books", key: "books" },
  { href: "/collaborators", key: "collaborators" },
] as const;

export function Footer() {
  const t = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <p className="font-display text-2xl font-bold text-white tracking-tight mb-4">
              ROCAVIVA
            </p>
            <p className="text-sm leading-relaxed max-w-xs">
              Exposiciones culturales itinerantes que recorren el mundo.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-neutral-400 mb-4">
              Navegacion
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className="text-sm text-neutral-300 hover:text-white transition-colors"
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Social + Legal */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-neutral-400 mb-4">
              Redes sociales
            </h3>
            <div className="flex gap-4 mb-8">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${link.label} (opens in new window)`}
                  className="text-neutral-400 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                >
                  <link.icon />
                </a>
              ))}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400">
              <span>{tFooter("privacy")}</span>
              <span>{tFooter("legal")}</span>
              <span>{tFooter("cookies")}</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800">
          <p className="text-xs text-neutral-400">
            &copy; {year} Rocaviva Eventos. {tFooter("rights")}.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ── Social icons (20x20, stroke style) ── */
function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46L20 4" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
    </svg>
  );
}
