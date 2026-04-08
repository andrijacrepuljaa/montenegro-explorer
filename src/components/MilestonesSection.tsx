import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const milestones = [
  { year: "2017", title: "Founded", description: "KGC established in Tivat, Montenegro as a management consulting firm.", teamSize: 1 },
  { year: "2018", title: "First International Projects", description: "Partnered with leading European consulting firms on supply chain engagements.", teamSize: 2 },
  { year: "2019", title: "Expanding Expertise", description: "Added digital marketing and project management to our service portfolio.", teamSize: 4 },
  { year: "2020", title: "Remote-First Pivot", description: "Successfully transitioned to remote consulting, expanding our global client base.", teamSize: 5 },
  { year: "2021", title: "Industry Recognition", description: "Delivered projects across automotive, pharma, retail and consumer goods sectors.", teamSize: 7 },
  { year: "2022", title: "Internship Programme", description: "Launched structured internship programme for emerging talent in Montenegro.", teamSize: 9 },
  { year: "2023", title: "Growing Impact", description: "Expanded client base across 15+ countries with a focus on supply chain network design.", teamSize: 12 },
  { year: "2024", title: "Scaling Operations", description: "Strengthened partnerships and deepened expertise in data-driven consulting.", teamSize: 15 },
];

const MilestonesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="milestones" className="py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <div className="accent-bar mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Our Journey</h2>
          <p className="text-muted-foreground text-lg">
            From a solo founder to a growing international team — year by year growth.
          </p>
        </motion.div>

        {/* Horizontal timeline */}
        <div className="relative">
          <div className="absolute top-[28px] left-0 right-0 h-px bg-border" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-0">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative pt-14 px-3 group"
              >
                {/* Dot */}
                <div className="absolute top-[22px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background z-10 group-hover:scale-150 transition-transform" />
                <p className="text-primary font-bold text-lg mb-1">{m.year}</p>
                <h3 className="font-semibold text-sm mb-2">{m.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{m.description}</p>
                <p className="text-xs text-muted-foreground">
                  Team: <span className="font-bold text-foreground">{m.teamSize}</span>
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MilestonesSection;
