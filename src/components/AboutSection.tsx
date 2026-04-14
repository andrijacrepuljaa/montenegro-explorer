import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Lightbulb, TrendingUp, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { defaultHomeAbout } from "@/lib/cms";
import { useSiteContent } from "@/hooks/useSiteContent";

const iconMap: Record<string, LucideIcon> = {
  Target,
  Lightbulb,
  TrendingUp,
  Users,
};

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const about = useSiteContent("home.about", defaultHomeAbout);

  return (
    <section id="about" className="py-16 sm:py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="accent-bar mb-6" />
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight">
              {about.headline}
            </h2>
            {about.body.map((paragraph, index) => (
              <p
                key={paragraph}
                className={index === 0 ? "text-muted-foreground text-base sm:text-lg leading-relaxed mb-4 sm:mb-6" : "text-muted-foreground leading-relaxed text-sm sm:text-base"}
              >
                {paragraph}
              </p>
            ))}
          </motion.div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {about.pillars.map((p, i) => {
              const Icon = iconMap[p.iconName] || Target;
              return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                className="border border-border p-4 sm:p-6 hover:border-primary/40 transition-colors group"
              >
                <Icon className="w-6 sm:w-8 h-6 sm:h-8 text-primary mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">{p.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{p.description}</p>
              </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
