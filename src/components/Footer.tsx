import { Link } from "react-router-dom";
import kgcLogo from "@/assets/kgc-logo.png";

const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <img src={kgcLogo} alt="KGC" className="h-6" />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} KGC d.o.o. All rights reserved.
          </p>
        </div>
        <div className="flex gap-8">
          <a href="#about" className="text-xs text-muted-foreground hover:text-primary transition-colors">About</a>
          <a href="#expertise" className="text-xs text-muted-foreground hover:text-primary transition-colors">Expertise</a>
          <a href="#milestones" className="text-xs text-muted-foreground hover:text-primary transition-colors">Milestones</a>
          <Link to="/careers" className="text-xs text-muted-foreground hover:text-primary transition-colors">Careers</Link>
          <Link to="/contact" className="text-xs text-muted-foreground hover:text-primary transition-colors">Contact</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
