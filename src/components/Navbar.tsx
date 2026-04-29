import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import kgcLogo from "@/assets/kgc-logo.png";
import { defaultHeaderNavigation, type NavigationItem } from "@/lib/cms";
import { useNavigationItems, usePageStructure } from "@/hooks/useSiteContent";
import { getStructureSection, normalizeNavigationHref } from "@/lib/pageSections";

const isRoute = (href: string) => href.startsWith("/");

const parseNavHref = (href: string) => {
  const [rawPath, rawHash] = href.split("#");
  return {
    pathname: rawPath || "/",
    hash: rawHash || "",
  };
};

const DesktopNavLink = ({ link, scrolled, active }: { link: NavigationItem; scrolled: boolean; active: boolean }) => {
  const className = `border-b-2 pb-1 text-sm font-medium transition-colors ${
    active
      ? scrolled
        ? "border-primary text-primary"
        : "border-primary text-hero-fg"
      : scrolled
        ? "border-transparent text-foreground hover:text-primary"
        : "border-transparent text-hero-fg/80 hover:text-hero-fg"
  }`;

  if (link.is_external) {
    return <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>{link.label}</a>;
  }

  return isRoute(link.href) ? (
    <Link to={link.href} className={className}>{link.label}</Link>
  ) : (
    <a href={link.href} className={className}>{link.label}</a>
  );
};

const MobileNavLink = ({ link, onClick, active }: { link: NavigationItem; onClick: () => void; active: boolean }) => {
  const className = `border-l-2 py-2 pl-3 text-sm font-medium transition-colors ${
    active ? "border-primary text-primary" : "border-transparent text-foreground hover:text-primary"
  }`;

  if (link.is_external) {
    return <a href={link.href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>{link.label}</a>;
  }

  return isRoute(link.href) ? (
    <Link to={link.href} onClick={onClick} className={className}>{link.label}</Link>
  ) : (
    <a href={link.href} onClick={onClick} className={className}>{link.label}</a>
  );
};

const ContactButton = ({ link, onClick }: { link: NavigationItem; onClick?: () => void }) => {
  const className = onClick
    ? "text-sm font-semibold text-primary py-2"
    : "inline-flex items-center px-5 py-2 rounded bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity";

  if (link.is_external) {
    return <a href={link.href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>{link.label}</a>;
  }

  return <Link to={link.href} onClick={onClick} className={className}>{link.label}</Link>;
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("");
  const location = useLocation();
  const navItems = useNavigationItems("header", defaultHeaderNavigation);
  const homeStructure = usePageStructure("home");
  const isHomePage = location.pathname === "/";
  const useTransparentStyle = isHomePage && !scrolled;
  const heroAnchor = getStructureSection(homeStructure, "hero")?.anchor || "hero";
  const homeLogoHref = getStructureSection(homeStructure, "hero")?.visible === false ? "/" : `/#${heroAnchor}`;
  const contactLink = navItems.find((link) => normalizeNavigationHref(link.href) === "/contact") || {
    location: "header" as const,
    label: "Contact Us",
    href: "/contact",
    is_external: false,
    sort_order: 99,
    is_active: true,
  };
  const mainLinks = navItems.filter((link) => !(link.href === contactLink.href && link.label === contactLink.label));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const currentCandidates = mainLinks
      .filter((link) => !link.is_external && normalizeNavigationHref(link.href).includes("#"))
      .map((link) => ({ link, parsed: parseNavHref(normalizeNavigationHref(link.href)) }))
      .filter(({ parsed }) => parsed.pathname === location.pathname);

    const updateActiveLink = () => {
      if (currentCandidates.length === 0) {
        setActiveHref(location.pathname);
        return;
      }

      const offset = 120;
      let nextActive = "";

      currentCandidates.forEach(({ link, parsed }) => {
        const element = document.getElementById(parsed.hash);
        if (!element) return;
        if (element.getBoundingClientRect().top - offset <= 0) {
          nextActive = normalizeNavigationHref(link.href);
        }
      });

      setActiveHref(nextActive || location.pathname);
    };

    updateActiveLink();
    const onScroll = () => updateActiveLink();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", updateActiveLink);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", updateActiveLink);
    };
  }, [location.pathname, mainLinks]);

  const isLinkActive = (link: NavigationItem) => {
    if (link.is_external) return false;
    const normalizedHref = normalizeNavigationHref(link.href);
    if (normalizedHref.includes("#")) {
      return activeHref === normalizedHref;
    }
    return activeHref === normalizedHref || location.pathname === normalizedHref;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        useTransparentStyle
          ? "bg-transparent"
          : "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
      }`}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 lg:px-12 h-16">
        {isHomePage ? (
          <a href={homeLogoHref} className="flex items-center">
            <img
              src={kgcLogo}
              alt="KGC"
              className={`h-8 transition-all ${useTransparentStyle ? "brightness-0 invert" : ""}`}
            />
          </a>
        ) : (
          <Link to="/" className="flex items-center">
            <img
              src={kgcLogo}
              alt="KGC"
              className={`h-8 transition-all ${useTransparentStyle ? "brightness-0 invert" : ""}`}
            />
          </Link>
        )}

        <div className="hidden md:flex items-center gap-8">
          {mainLinks.map((link) => (
            <DesktopNavLink
              key={`${link.label}-${link.href}`}
              link={link}
              scrolled={!useTransparentStyle}
              active={isLinkActive(link)}
            />
          ))}
          <ContactButton link={contactLink} />
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden p-2 -mr-2 focus:outline-none focus:ring-2 focus:ring-primary ${
            useTransparentStyle ? "text-hero-fg" : "text-foreground"
          }`}
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-background border-b border-border md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {mainLinks.map((link) => (
                <MobileNavLink
                  key={`${link.label}-${link.href}`}
                  link={link}
                  onClick={() => setMobileOpen(false)}
                  active={isLinkActive(link)}
                />
              ))}
              <ContactButton link={contactLink} onClick={() => setMobileOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
