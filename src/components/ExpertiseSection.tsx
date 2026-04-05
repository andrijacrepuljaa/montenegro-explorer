import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Network, Warehouse, PackageSearch, DollarSign, ClipboardCheck, ShieldAlert, Megaphone, Palette } from "lucide-react";

const services = [
  {
    icon: Network,
    title: "Supply Chain Network Design",
    short: "How many production or distribution facilities is the right fit for my business purpose?",
    detail: "We combine sound business knowledge with our linear modelling based approach to (re)define parts or the whole end-to-end supply chain network.",
  },
  {
    icon: Warehouse,
    title: "Warehousing & Transportation",
    short: "Want to give a boost to your logistics operations?",
    detail: "Optimizing warehouse layouts, transportation routes and logistics costs to drive efficiency across your operations.",
  },
  {
    icon: PackageSearch,
    title: "Inventory & Demand Management",
    short: "Strike the right balance between service and working capital.",
    detail: "Advanced forecasting and inventory optimization to ensure the right products are available at the right time and place.",
  },
  {
    icon: DollarSign,
    title: "Cost to Serve",
    short: "Gain visibility of different customer segments and true cost of serving them.",
    detail: "We can help you unveil the true cost of serving your customers and apply the right segmentation policies to maximize profit.",
  },
  {
    icon: ClipboardCheck,
    title: "Project Planning & Execution",
    short: "Enhance team synergy and project transparency.",
    detail: "From resource allocation to stakeholder communication, we guide you through every stage of the project lifecycle.",
  },
  {
    icon: ShieldAlert,
    title: "Risk Assessment & Mitigation",
    short: "Concerned about potential roadblocks? Let's tackle them head-on.",
    detail: "Identifying, evaluating and mitigating risks to keep your projects and operations on track.",
  },
  {
    icon: Megaphone,
    title: "Marketing Strategy Development",
    short: "Discover how to maximize your market presence.",
    detail: "Crafting cohesive strategies that resonate with your target audience, leverage the right channels, and maximize your ROI.",
  },
  {
    icon: Palette,
    title: "Brand Positioning & Identity",
    short: "Solidify your brand's identity and message.",
    detail: "Building a distinctive brand that stands out in the market and connects authentically with your customers.",
  },
];

const ExpertiseSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="expertise" className="py-28 bg-secondary/30 relative">
      <div className="container mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-display text-sm uppercase tracking-[0.2em] mb-3">Our Expertise</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold">
            What We <span className="text-gradient">Deliver</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="cursor-pointer rounded-xl p-6 bg-card border border-border hover:border-primary/40 transition-all group"
            >
              <s.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-display font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {expanded === i ? s.detail : s.short}
              </p>
              <span className="text-xs text-primary mt-3 inline-block opacity-0 group-hover:opacity-100 transition-opacity">
                {expanded === i ? "Show less" : "Learn more →"}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;
