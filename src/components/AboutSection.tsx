import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { defaultHomeAbout, type HomeAboutContent } from "@/lib/cms";
import { useSiteContent } from "@/hooks/useSiteContent";
import { getIconByName } from "@/lib/iconLibrary";
import type { PageSurface } from "@/lib/pageSections";
import { cn } from "@/lib/utils";

const AboutSection = ({
  sectionId = "about",
  content,
  surface = "light",
  embedded = false,
}: {
  sectionId?: string;
  content?: HomeAboutContent;
  surface?: PageSurface;
  embedded?: boolean;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const storedAbout = useSiteContent("home.about", defaultHomeAbout);
  const about = content || storedAbout;
  const isDark = surface === "dark";
  const containerClass = embedded
    ? "mx-auto max-w-full px-0"
    : "max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12";

  return (
    <section id={sectionId} className={cn("py-16 sm:py-24 lg:py-32", isDark && "section-dark")}>
      <div className={containerClass} ref={ref}>
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="accent-bar mb-6" />
            <h2 className={cn("text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight", isDark && "text-hero-fg")}>
              {about.headline}
            </h2>
            {about.body.map((paragraph, index) => (
              <p
                key={paragraph}
                className={cn(
                  index === 0 ? "text-base sm:text-lg leading-relaxed mb-4 sm:mb-6" : "leading-relaxed text-sm sm:text-base",
                  isDark ? "text-hero-fg/70" : "text-muted-foreground",
                )}
              >
                {paragraph}
              </p>
            ))}
          </motion.div>

          <div className="grid auto-rows-fr grid-cols-2 gap-4 sm:gap-6">
            {about.pillars.map((p, i) => {
              const Icon = getIconByName(p.iconName);
              return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                className={cn(
                  "flex h-full min-h-[11.5rem] flex-col border p-4 transition-colors group hover:border-primary/40 sm:min-h-[13rem] sm:p-6",
                  isDark ? "border-dark-border bg-dark-surface" : "border-border bg-background",
                )}
              >
                <Icon className="w-6 sm:w-8 h-6 sm:h-8 text-primary mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
                <h3 className={cn("font-semibold text-base sm:text-lg mb-1 sm:mb-2", isDark && "text-hero-fg")}>{p.title}</h3>
                <p className={cn("text-xs sm:text-sm leading-relaxed", isDark ? "text-hero-fg/70" : "text-muted-foreground")}>{p.description}</p>
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
