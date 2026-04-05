import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Users, Globe, Award, Briefcase, Building2, TrendingUp } from "lucide-react";

const milestones = [
  {
    year: "2017",
    title: "Founded",
    description: "KGC established in Tivat, Montenegro as a management consulting firm.",
    icon: Building2,
    teamSize: 1,
  },
  {
    year: "2018",
    title: "First International Projects",
    description: "Partnered with leading European consulting firms on supply chain engagements.",
    icon: Globe,
    teamSize: 2,
  },
  {
    year: "2019",
    title: "Expanding Expertise",
    description: "Added digital marketing and project management to our service portfolio.",
    icon: Briefcase,
    teamSize: 4,
  },
  {
    year: "2020",
    title: "Remote-First Pivot",
    description: "Successfully transitioned to remote consulting, expanding our global client base.",
    icon: TrendingUp,
    teamSize: 5,
  },
  {
    year: "2021",
    title: "Industry Recognition",
    description: "Delivered projects across automotive, pharma, retail and consumer goods sectors.",
    icon: Award,
    teamSize: 7,
  },
  {
    year: "2022",
    title: "Internship Programme",
    description: "Launched structured internship programme for emerging talent in Montenegro.",
    icon: Users,
    teamSize: 9,
  },
  {
    year: "2023",
    title: "Growing Impact",
    description: "Expanded client base across 15+ countries with a focus on supply chain network design.",
    icon: Globe,
    teamSize: 12,
  },
  {
    year: "2024",
    title: "Scaling Operations",
    description: "Strengthened partnerships and deepened expertise in data-driven consulting.",
    icon: TrendingUp,
    teamSize: 15,
  },
];

const MilestonesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="milestones" className="py-28 bg-muted/40">
      <div className="container mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-display text-sm uppercase tracking-[0.2em] mb-3">Our Journey</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Year by Year <span className="text-gradient">Growth</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From a solo founder to a growing international team — our milestones tell the story.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          {milestones.map((m, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex items-start mb-12 last:mb-0 ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full bg-primary -translate-x-1.5 mt-6 z-10" />

                {/* Content card */}
                <div className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                  <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all hover:shadow-md">
                    <div className={`flex items-center gap-3 mb-3 ${isLeft ? "md:justify-end" : ""}`}>
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <m.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-primary font-display font-bold text-lg">{m.year}</span>
                        <h3 className="font-display font-semibold text-sm">{m.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{m.description}</p>
                    <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isLeft ? "md:justify-end" : ""}`}>
                      <Users className="w-3.5 h-3.5" />
                      <span>Team size: <span className="font-semibold text-foreground">{m.teamSize}</span></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MilestonesSection;
