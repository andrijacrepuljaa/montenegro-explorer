import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-primary font-display text-sm uppercase tracking-[0.3em] mb-6">
            Management Consulting · Montenegro
          </p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-5xl mx-auto mb-6">
            Empowering Businesses Through{" "}
            <span className="text-gradient">Integrated Solutions</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Supply Chain Excellence, Digital Mastery, and Project Success — insightful strategies across operations, marketing and execution.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="#expertise"
              className="inline-flex items-center px-8 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Our Expertise
            </a>
            <a
              href="#contact"
              className="inline-flex items-center px-8 py-3 rounded-lg border border-border text-foreground font-display font-semibold text-sm hover:border-primary hover:text-primary transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-primary" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
