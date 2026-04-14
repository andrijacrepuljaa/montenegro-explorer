import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { defaultHomeHero } from "@/lib/cms";
import { useSiteContent } from "@/hooks/useSiteContent";

const HeroSection = () => {
  const hero = useSiteContent("home.hero", defaultHomeHero);

  return (
    <section id="hero" className="relative min-h-[760px] sm:min-h-[82vh] flex items-center section-dark overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-hero-bg/80" />
        <div className="absolute left-0 bottom-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-24 sm:py-28 w-full">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="max-w-[22rem] sm:max-w-4xl">
          <div className="accent-bar mb-6 sm:mb-8" />
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-4 sm:mb-6">
            {hero.headline}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mb-8 sm:mb-10 leading-relaxed">
            {hero.intro}
          </p>
          <div className="flex gap-3 sm:gap-4 flex-wrap">
            <a href={hero.primaryCtaHref} className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
              {hero.primaryCtaLabel} <ArrowRight className="w-4 h-4" />
            </a>
            <Link to={hero.secondaryCtaHref} className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
              {hero.secondaryCtaLabel}
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="mt-12 sm:mt-16 grid grid-cols-2 sm:flex gap-8 sm:gap-12 md:gap-20">
          {hero.stats.map(s => (
            <div key={s.label}>
              <p className="text-2xl sm:text-3xl md:text-5xl font-bold text-primary mb-1">{s.value}</p>
              <p className="text-xs sm:text-sm text-white/50 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
