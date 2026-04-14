import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import kgcLogo from "@/assets/kgc-logo.png";
import { defaultHeaderNavigation, type NavigationItem } from "@/lib/cms";
import { useNavigationItems } from "@/hooks/useSiteContent";

const isRoute = (href: string) => href.startsWith("/");

const DesktopNavLink = ({ link, scrolled }: { link: NavigationItem; scrolled: boolean }) => {
  const className = `text-sm font-medium transition-colors ${
    scrolled ? "text-foreground hover:text-primary" : "text-white/80 hover:text-white"
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

const MobileNavLink = ({ link, onClick }: { link: NavigationItem; onClick: () => void }) => {
  const className = "text-sm font-medium text-foreground hover:text-primary py-2 transition-colors";

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
  const navItems = useNavigationItems("header", defaultHeaderNavigation);
  const contactLink = navItems.find((link) => link.label.toLowerCase().includes("contact")) || {
    location: "header" as const,
    label: "Contact Us",
    href: "/contact",
    is_external: false,
    sort_order: 99,
    is_active: true,
  };
  const mainLinks = navItems.filter((link) => !link.label.toLowerCase().includes("contact"));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 lg:px-12 h-16">
        <a href="#hero" className="flex items-center">
          <img
            src={kgcLogo}
            alt="KGC"
            className={`h-8 transition-all ${scrolled ? "" : "brightness-0 invert"}`}
          />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {mainLinks.map((link) => <DesktopNavLink key={`${link.label}-${link.href}`} link={link} scrolled={scrolled} />)}
          <ContactButton link={contactLink} />
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden p-2 -mr-2 focus:outline-none focus:ring-2 focus:ring-primary ${
            scrolled ? "text-foreground" : "text-white"
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
              {mainLinks.map((link) => <MobileNavLink key={`${link.label}-${link.href}`} link={link} onClick={() => setMobileOpen(false)} />)}
              <ContactButton link={contactLink} onClick={() => setMobileOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
