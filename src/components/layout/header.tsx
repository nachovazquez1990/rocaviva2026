"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import type { Easing } from "framer-motion";
import { cn } from "@/lib/utils";
import { LanguageSelector } from "./language-selector";

const ease: Easing = [0.16, 1, 0.3, 1];

const navItems = [
  { href: "/", key: "home" },
  { href: "/projects", key: "projects" },
  { href: "/communication", key: "communication" },
  { href: "/books", key: "books" },
  { href: "/collaborators", key: "collaborators" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === "/";
  const isTransparentDark = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Focus management: move focus to menu when opened, back to button when closed
  const prevMobileOpen = useRef(false);
  useEffect(() => {
    if (mobileOpen && !prevMobileOpen.current) {
      // Menu just opened — focus first nav link
      requestAnimationFrame(() => {
        const firstLink = menuRef.current?.querySelector("a");
        firstLink?.focus();
      });
    } else if (!mobileOpen && prevMobileOpen.current) {
      // Menu just closed — return focus to toggle button
      menuButtonRef.current?.focus();
    }
    prevMobileOpen.current = mobileOpen;
  }, [mobileOpen]);

  // Close mobile menu on Escape
  const handleMenuKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setMobileOpen(false);
    }
  }, []);

  return (
    <>
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-brand-600 focus:text-white focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          mobileOpen && "lg:z-50 z-[60]",
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.05)] py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo: icon + text */}
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 hover:opacity-80 transition-opacity",
              mobileOpen && "opacity-0 lg:opacity-100"
            )}
          >
            <Image
              src="/images/rocaviva_icon.svg"
              alt=""
              width={32}
              height={28}
              className="h-7 w-auto"
              priority
            />
            <span className={cn(
              "font-display text-xl font-bold tracking-tight transition-colors duration-500",
              isTransparentDark ? "text-white" : "text-neutral-900"
            )}>
              ROCAVIVA
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "text-xs font-medium tracking-[0.2em] uppercase transition-colors duration-500 relative py-1",
                    isTransparentDark
                      ? isActive
                        ? "text-white"
                        : "text-white/90 hover:text-white"
                      : isActive
                        ? "text-brand-600"
                        : "text-neutral-600 hover:text-neutral-900"
                  )}
                >
                  {t(item.key)}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className={cn("absolute -bottom-0.5 left-0 right-0 h-px", isTransparentDark ? "bg-white" : "bg-brand-600")}
                      transition={{ duration: 0.3, ease }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Language selector: visible when menu is closed, hidden when open (mobile) */}
            <div className={cn("lg:block", mobileOpen ? "hidden" : "block")}>
              <LanguageSelector variant={isTransparentDark ? "light" : "default"} />
            </div>

            {/* Mobile hamburger / close */}
            <button
              ref={menuButtonRef}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              ) : (
                <div className="flex flex-col gap-[5px]" aria-hidden="true">
                  <span className={cn("block w-6 h-[2px] transition-colors duration-500", isTransparentDark ? "bg-white" : "bg-neutral-900")} />
                  <span className={cn("block w-6 h-[2px] transition-colors duration-500", isTransparentDark ? "bg-white" : "bg-neutral-900")} />
                  <span className={cn("block w-6 h-[2px] transition-colors duration-500", isTransparentDark ? "bg-white" : "bg-neutral-900")} />
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen overlay — red background, below header close button */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            onKeyDown={handleMenuKeyDown}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease }}
            className="fixed inset-0 z-[55] bg-brand-600 flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-7" aria-label="Mobile navigation">
              {navItems.map((item, i) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: i * 0.05, duration: 0.4, ease }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "font-display text-3xl font-bold tracking-[0.05em] uppercase transition-opacity focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4",
                        isActive ? "text-white" : "text-white/90 hover:text-white"
                      )}
                    >
                      {t(item.key)}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Language selector inside menu, below nav items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: navItems.length * 0.05, duration: 0.4, ease }}
                className="mt-4"
              >
                <LanguageSelector variant="light" size="lg" />
              </motion.div>
            </nav>

            {/* Social links at bottom — larger icons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="absolute bottom-12 flex gap-8"
            >
              <a href="https://facebook.com/RocavivaEventos/" target="_blank" rel="noopener noreferrer" aria-label="Facebook (opens in new window)" className="text-white hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2">
                <FacebookIcon />
              </a>
              <a href="https://instagram.com/rocavivaeventos" target="_blank" rel="noopener noreferrer" aria-label="Instagram (opens in new window)" className="text-white hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2">
                <InstagramIcon />
              </a>
              <a href="https://twitter.com/rocaviva_" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter (opens in new window)" className="text-white hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2">
                <XIcon />
              </a>
              <a href="https://youtube.com/@rocavivaeventos" target="_blank" rel="noopener noreferrer" aria-label="YouTube (opens in new window)" className="text-white hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2">
                <YouTubeIcon />
              </a>
              <a href="https://linkedin.com/company/rocaviva-eventos/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in new window)" className="text-white hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2">
                <LinkedInIcon />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Social icons — larger for mobile menu (28x28) ── */
function FacebookIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46L20 4" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
    </svg>
  );
}
