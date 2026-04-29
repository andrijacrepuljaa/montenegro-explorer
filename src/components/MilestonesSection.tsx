import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { PageSurface, TimelineItem } from "@/lib/pageSections";
import { cn } from "@/lib/utils";

const fallbackMilestones = [
  { year: "2024", title: "Scaling Operations", description: "Strengthened partnerships and deepened expertise in data-driven consulting.", highlights: ["15 team members", "Expanded client base across 15+ countries", "Focus on supply chain network design"] },
  { year: "2023", title: "Growing Impact", description: "Expanded international reach with a growing portfolio of complex engagements.", highlights: ["12 team members", "Projects in 15+ countries", "Supply chain network design focus"] },
  { year: "2022", title: "Internship Programme", description: "Launched a structured internship programme for emerging talent in Montenegro.", highlights: ["9 team members", "First intern cohort", "Talent pipeline established"] },
  { year: "2021", title: "Industry Recognition", description: "Delivered projects across automotive, pharma, retail and consumer goods sectors.", highlights: ["7 team members", "Multi-sector delivery", "European partner network"] },
  { year: "2020", title: "Remote-First Pivot", description: "Successfully transitioned to remote consulting, expanding our global client base.", highlights: ["5 team members", "Remote-first operations", "Global client expansion"] },
  { year: "2019", title: "Expanding Expertise", description: "Added digital marketing and project management to our service portfolio.", highlights: ["4 team members", "New service lines", "Broader consulting scope"] },
  { year: "2018", title: "First International Projects", description: "Partnered with leading European consulting firms on supply chain engagements.", highlights: ["2 team members", "European partnerships", "Supply chain focus"] },
  { year: "2017", title: "Founded", description: "KGC established in Tivat, Montenegro as a management consulting firm.", highlights: ["1 founder", "Tivat, Montenegro", "Vision set in motion"] },
];

const sortNewestFirst = <T extends { year: string }>(items: T[]) =>
  [...items].sort((a, b) => Number.parseInt(b.year, 10) - Number.parseInt(a.year, 10));

const MilestonesSection = ({
  sectionId = "milestones",
  headline = "Milestones That Made Us KGC",
  intro = "From a solo founder to a growing international team, our journey year by year.",
  items,
  surface = "light",
  embedded = false,
}: {
  sectionId?: string;
  headline?: string;
  intro?: string;
  items?: TimelineItem[];
  surface?: PageSurface;
  embedded?: boolean;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const initialItems = items && items.length > 0 ? sortNewestFirst(items) : fallbackMilestones;
  const [milestones, setMilestones] = useState(initialItems);
  const [activeYear, setActiveYear] = useState(initialItems[0].year);
  const isDark = surface === "dark";
  const containerClass = embedded
    ? "mx-auto max-w-full px-0"
    : "max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12";

  useEffect(() => {
    if (items && items.length > 0) {
      const mapped = sortNewestFirst(items);
      setMilestones(mapped);
      setActiveYear(mapped[0].year);
      return;
    }

    supabase
      .from("milestones")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data && data.length > 0) {
          const mapped = sortNewestFirst(data.map((d) => ({
            year: d.year,
            title: d.title,
            description: d.description,
            highlights: d.highlights,
          })));
          setMilestones(mapped);
          setActiveYear(mapped[0].year);
        }
      });
  }, [items]);

  const activeMilestone = milestones.find((milestone) => milestone.year === activeYear) || milestones[0];

  return (
    <section id={sectionId} className={cn("py-16 sm:py-24 lg:py-32", isDark && "section-dark")}>
      <div className={containerClass} ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-10 sm:mb-16"
        >
          <div className="accent-bar mb-6" />
          <h2 className={cn("text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-4", isDark && "text-hero-fg")}>{headline}</h2>
          <p className={cn("text-base sm:text-lg", isDark ? "text-hero-fg/70" : "text-muted-foreground")}>
            {intro}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8 sm:gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {milestones.map((milestone) => (
              <button
                key={milestone.year}
                onClick={() => setActiveYear(milestone.year)}
                className={cn(
                  "relative text-left px-4 sm:px-5 py-3 sm:py-3.5 text-lg font-bold transition-all whitespace-nowrap flex-shrink-0 border-l-4",
                  activeYear === milestone.year
                    ? "text-primary bg-primary/5 border-primary"
                    : isDark
                      ? "text-hero-fg/60 hover:text-hero-fg border-transparent hover:border-dark-border"
                      : "text-muted-foreground hover:text-foreground border-transparent hover:border-border",
                )}
              >
                <span className="block text-xl sm:text-2xl">{milestone.year}</span>
                <span className={cn("block text-xs font-medium mt-0.5 transition-colors", activeYear === milestone.year ? "text-primary/70" : isDark ? "text-hero-fg/45" : "text-muted-foreground/60")}>
                  {milestone.title}
                </span>
              </button>
            ))}
          </motion.div>

          <div className="min-h-[250px] sm:min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeYear}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className={cn("border p-6 sm:p-8 lg:p-12", isDark ? "border-dark-border bg-dark-surface" : "border-border bg-background")}
              >
                <div className="mb-6 sm:mb-8">
                  <p className="text-primary font-bold text-4xl sm:text-6xl lg:text-8xl mb-3 sm:mb-4 leading-none">{activeMilestone.year}</p>
                  <h3 className={cn("text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4", isDark && "text-hero-fg")}>{activeMilestone.title}</h3>
                  <p className={cn("text-base sm:text-lg leading-relaxed max-w-xl", isDark ? "text-hero-fg/70" : "text-muted-foreground")}>{activeMilestone.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {activeMilestone.highlights.filter((highlight) => highlight.trim()).map((highlight) => (
                    <span key={highlight} className={cn("px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border", isDark ? "border-dark-border text-hero-fg/70" : "border-border text-muted-foreground")}>
                      {highlight}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MilestonesSection;
