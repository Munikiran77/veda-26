"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, GraduationCap, Briefcase, ChevronRight } from "lucide-react";
import { Container } from "./container";
import { AuthRoleDropdown, type AuthMode, AUTH_CONFIG } from "./auth-role-dropdown";
import { cn } from "@/lib/utils";
import { useIntroPhase } from "@/components/intro";

export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Find Projects", href: "/student/projects" },
  { label: "Find Talent", href: "/client/talent" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

export interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const phase = useIntroPhase();
  const isRevealed = phase !== "playing";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeAuthMenu, setActiveAuthMenu] = useState<AuthMode | null>(null);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<AuthMode | null>(null);
  const authRef = useRef<HTMLDivElement>(null);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setMobileExpandedSection(null);
  }, []);

  // Monitor scroll state for enhanced elevation on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (authRef.current && !authRef.current.contains(event.target as Node)) {
        setActiveAuthMenu(null);
      }
    };

    if (activeAuthMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeAuthMenu]);

  // Close menus on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeAuthMenu) setActiveAuthMenu(null);
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeAuthMenu, isMobileMenuOpen]);

  // Handle route change closing menus
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveAuthMenu(null);
    setMobileExpandedSection(null);
  }, [pathname]);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Return null if on client or student dashboard routes so they use their own dedicated shells
  if (pathname?.startsWith("/client") || pathname?.startsWith("/student")) {
    return null;
  }

  return (
    <motion.header
      initial={reduced ? false : { y: -20, opacity: 0 }}
      animate={
        isRevealed
          ? { y: 0, opacity: 1 }
          : { y: reduced ? 0 : -20, opacity: 0 }
      }
      transition={{
        duration: reduced ? 0.35 : 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        isScrolled
          ? "bg-[var(--color-canvas-bg)]/85 backdrop-blur-md shadow-xs border-b border-[var(--color-border-subtle)]"
          : "bg-[var(--color-canvas-bg)]/70 backdrop-blur-xs border-b border-transparent",
        className
      )}
    >
      <Container size="xl">
        <div className="flex h-16 sm:h-[68px] items-center justify-between">
          {/* Left: Wordmark */}
          <div className="flex items-center">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 rounded-md py-1"
              aria-label="SkillBridge Home"
              onClick={closeMobileMenu}
            >
              <span className="text-xl sm:text-[22px] font-semibold tracking-tight text-[var(--color-text-primary)] transition-colors duration-200 group-hover:text-black">
                SkillBridge
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] opacity-85 transition-transform duration-300 motion-safe:group-hover:scale-125" />
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-7 lg:gap-9"
            aria-label="Desktop Primary Navigation"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[14px] font-medium text-[var(--color-text-secondary)] transition-colors duration-200 hover:text-[var(--color-text-primary)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 rounded-md px-1.5 py-1"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: Actions */}
          <div ref={authRef} className="relative hidden md:flex items-center gap-2 lg:gap-3">
            {/* Login Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setActiveAuthMenu((curr) => (curr === "login" ? null : "login"))
                }
                aria-expanded={activeAuthMenu === "login"}
                aria-haspopup="menu"
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[14px] font-medium transition-all duration-200 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 motion-safe:active:scale-[0.99]",
                  activeAuthMenu === "login"
                    ? "bg-black/[0.06] text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/[0.03]"
                )}
              >
                <span>Log in</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200 text-[#8e8e93]",
                    activeAuthMenu === "login" && "rotate-180 text-[var(--color-text-primary)]"
                  )}
                />
              </button>

              <AnimatePresence>
                {activeAuthMenu === "login" && (
                  <AuthRoleDropdown
                    mode="login"
                    align="right"
                    onClose={() => setActiveAuthMenu(null)}
                    onSwitchMode={(mode) => setActiveAuthMenu(mode)}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Sign Up Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setActiveAuthMenu((curr) => (curr === "signup" ? null : "signup"))
                }
                aria-expanded={activeAuthMenu === "signup"}
                aria-haspopup="menu"
                className={cn(
                  "group inline-flex items-center gap-1.5 rounded-full px-4.5 py-2 text-[14px] font-medium shadow-xs transition-all duration-200 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 motion-safe:active:scale-[0.98]",
                  activeAuthMenu === "signup"
                    ? "bg-black text-white shadow-md ring-2 ring-[var(--color-accent)] ring-offset-2"
                    : "bg-[var(--color-text-primary)] text-white hover:bg-black hover:shadow-md"
                )}
              >
                <span>Sign Up</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200 opacity-70 group-hover:opacity-100",
                    activeAuthMenu === "signup" && "rotate-180 opacity-100"
                  )}
                />
              </button>

              <AnimatePresence>
                {activeAuthMenu === "signup" && (
                  <AuthRoleDropdown
                    mode="signup"
                    align="right"
                    onClose={() => setActiveAuthMenu(null)}
                    onSwitchMode={(mode) => setActiveAuthMenu(mode)}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile: Hamburger / Close Trigger */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-[var(--color-text-primary)] transition-colors hover:bg-black/5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] motion-safe:active:scale-95"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-menu"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              <div className="relative h-4 w-5">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-0.5 w-5 rounded-full bg-[var(--color-text-primary)] transition-all duration-300 motion-reduce:transition-none ease-out",
                    isMobileMenuOpen ? "top-2 rotate-45" : "top-0.5"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-2 h-0.5 w-5 rounded-full bg-[var(--color-text-primary)] transition-all duration-200 motion-reduce:transition-none ease-out",
                    isMobileMenuOpen ? "opacity-0" : "opacity-100"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 bottom-0 h-0.5 w-5 rounded-full bg-[var(--color-text-primary)] transition-all duration-300 motion-reduce:transition-none ease-out",
                    isMobileMenuOpen ? "bottom-1.5 -rotate-45" : "bottom-0.5"
                  )}
                />
              </div>
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Navigation Drawer / Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-navigation-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            initial={reduced ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: reduced ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-[var(--color-border-subtle)] bg-[var(--color-canvas-bg)] md:hidden shadow-lg"
          >
            <Container size="xl" className="py-6">
              <nav
                className="flex flex-col space-y-1"
                aria-label="Mobile Primary Navigation"
              >
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="flex h-12 items-center rounded-lg px-3 text-[16px] font-medium text-[var(--color-text-primary)] transition-colors hover:bg-black/5 active:bg-black/10 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="my-5 h-px w-full bg-[var(--color-border-subtle)]" />

              {/* Mobile Auth Sections */}
              <div className="flex flex-col gap-2.5">
                {/* Mobile Log in Accordion */}
                <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-white/70 overflow-hidden transition-colors">
                  <button
                    type="button"
                    onClick={() =>
                      setMobileExpandedSection((curr) => (curr === "login" ? null : "login"))
                    }
                    aria-expanded={mobileExpandedSection === "login"}
                    className="flex h-12 w-full items-center justify-between px-4 text-[15px] font-medium text-[var(--color-text-primary)] transition-colors hover:bg-black/[0.02] cursor-pointer"
                  >
                    <span>Log in</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-[#8e8e93] transition-transform duration-200",
                        mobileExpandedSection === "login" && "rotate-180 text-[var(--color-text-primary)]"
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileExpandedSection === "login" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden border-t border-[var(--color-border-subtle)] bg-[#fafafc] px-2 py-2 space-y-1"
                      >
                        {AUTH_CONFIG.login.options.map((opt) => (
                          <Link
                            key={opt.role}
                            href={opt.href}
                            onClick={closeMobileMenu}
                            className="flex items-center justify-between rounded-xl p-2.5 transition-colors hover:bg-white active:bg-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                  opt.color === "blue"
                                    ? "bg-blue-500/10 text-blue-600"
                                    : "bg-purple-500/10 text-purple-600"
                                )}
                              >
                                {opt.color === "blue" ? (
                                  <GraduationCap className="h-4.5 w-4.5" />
                                ) : (
                                  <Briefcase className="h-4 w-4" />
                                )}
                              </div>
                              <div>
                                <p className="text-[14px] font-semibold text-[#1c1c1e] leading-tight">
                                  {opt.role}
                                </p>
                                <p className="text-[12px] text-[#8e8e93]">
                                  {opt.description}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-[#8e8e93] shrink-0 ml-2" />
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Sign up Accordion */}
                <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-white/70 overflow-hidden transition-colors">
                  <button
                    type="button"
                    onClick={() =>
                      setMobileExpandedSection((curr) => (curr === "signup" ? null : "signup"))
                    }
                    aria-expanded={mobileExpandedSection === "signup"}
                    className="flex h-12 w-full items-center justify-between px-4 text-[15px] font-medium text-[var(--color-text-primary)] transition-colors hover:bg-black/[0.02] cursor-pointer"
                  >
                    <span className="font-semibold">Sign Up</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-[#8e8e93] transition-transform duration-200",
                        mobileExpandedSection === "signup" && "rotate-180 text-[var(--color-text-primary)]"
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileExpandedSection === "signup" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden border-t border-[var(--color-border-subtle)] bg-[#fafafc] px-2 py-2 space-y-1"
                      >
                        {AUTH_CONFIG.signup.options.map((opt) => (
                          <Link
                            key={opt.role}
                            href={opt.href}
                            onClick={closeMobileMenu}
                            className="flex items-center justify-between rounded-xl p-2.5 transition-colors hover:bg-white active:bg-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                  opt.color === "blue"
                                    ? "bg-blue-500/10 text-blue-600"
                                    : "bg-purple-500/10 text-purple-600"
                                )}
                              >
                                {opt.color === "blue" ? (
                                  <GraduationCap className="h-4.5 w-4.5" />
                                ) : (
                                  <Briefcase className="h-4 w-4" />
                                )}
                              </div>
                              <div>
                                <p className="text-[14px] font-semibold text-[#1c1c1e] leading-tight">
                                  {opt.role}
                                </p>
                                <p className="text-[12px] text-[#8e8e93]">
                                  {opt.description}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-[#8e8e93] shrink-0 ml-2" />
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
