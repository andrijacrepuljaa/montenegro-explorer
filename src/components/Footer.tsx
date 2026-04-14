import { Link } from "react-router-dom";
import kgcLogo from "@/assets/kgc-logo.png";
import { defaultFooterNavigation } from "@/lib/cms";
import { useNavigationItems } from "@/hooks/useSiteContent";

const isRoute = (href: string) => href.startsWith("/");

const Footer = () => {
  const navItems = useNavigationItems("footer", defaultFooterNavigation);

  return (
    <footer className="border-t border-border py-8 sm:py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <img src={kgcLogo} alt="KGC" className="h-6" />
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} KGC d.o.o. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 sm:gap-8">
            {navItems.map((item) =>
              item.is_external ? (
                <a key={`${item.label}-${item.href}`} href={item.href} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  {item.label}
                </a>
              ) : isRoute(item.href) ? (
                <Link key={`${item.label}-${item.href}`} to={item.href} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  {item.label}
                </Link>
              ) : (
                <a key={`${item.label}-${item.href}`} href={item.href} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  {item.label}
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
