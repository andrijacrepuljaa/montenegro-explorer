import { Link } from "react-router-dom";
import kgcLogo from "@/assets/kgc-logo.png";

const Footer = () => (
  <footer className="border-t border-border py-10">
    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <img src={kgcLogo} alt="KGC" className="h-6" />
      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} KGC d.o.o. Management consulting firm. All rights reserved.
      </p>
      <div className="flex gap-6">
        <a href="#hero" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</a>
        <a href="#about" className="text-xs text-muted-foreground hover:text-primary transition-colors">About</a>
        <a href="#expertise" className="text-xs text-muted-foreground hover:text-primary transition-colors">Expertise</a>
        <Link to="/contact" className="text-xs text-muted-foreground hover:text-primary transition-colors">Contact</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
