import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

const MilestonesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [milestones, setMilestones] = useState(fallbackMilestones);
  const [activeYear, setActiveYear] = useState(fallbackMilestones[0].year);

  useEffect(() => {
    supabase
      .from("milestones")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        if (data && data.length > 0) {
          const mapped = sortNewestFirst(data.map(d => ({
            year: d.year,
            title: d.title,
            description: d.description,
            highlights: d.highlights,
          })));
          setMilestones(mapped);
          setActiveYear(mapped[0].year);
        }
      });
  }, []);

  const activeMilestone = milestones.find(m => m.year === activeYear) || milestones[0];

  return (
    <section id="milestones" className="py-16 sm:py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-10 sm:mb-16"
        >
          <div className="accent-bar mb-6" />
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-4">Milestones That Made Us KGC</h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            From a solo founder to a growing international team, our journey year by year.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8 sm:gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {milestones.map(m => (
              <button
                key={m.year}
                onClick={() => setActiveYear(m.year)}
                className={`relative text-left px-4 sm:px-5 py-3 sm:py-3.5 text-lg font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                  activeYear === m.year
                    ? "text-primary bg-primary/5 border-l-4 border-primary"
                    : "text-muted-foreground hover:text-foreground border-l-4 border-transparent hover:border-border"
                }`}
              >
                <span className="block text-xl sm:text-2xl">{m.year}</span>
                <span className={`block text-xs font-medium mt-0.5 transition-colors ${activeYear === m.year ? "text-primary/70" : "text-muted-foreground/60"}`}>
                  {m.title}
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
                className="border border-border p-6 sm:p-8 lg:p-12"
              >
                <div className="mb-6 sm:mb-8">
                  <p className="text-primary font-bold text-4xl sm:text-6xl lg:text-8xl mb-3 sm:mb-4 leading-none">{activeMilestone.year}</p>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">{activeMilestone.title}</h3>
                  <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xl">{activeMilestone.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {activeMilestone.highlights.filter(h => h.trim()).map(h => (
                    <span key={h} className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-border text-muted-foreground">{h}</span>
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
