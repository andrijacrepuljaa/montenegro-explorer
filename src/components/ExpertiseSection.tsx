import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Network, Warehouse, PackageSearch, DollarSign, ClipboardCheck, ShieldAlert, Megaphone, Palette, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Network,
    title: "Supply Chain Network Design",
    short: "How many production or distribution facilities is the right fit for my business purpose?",
    detail: "We combine sound business knowledge with our linear modelling based approach to (re)define parts or the whole end-to-end supply chain network.",
    category: "Supply Chain",
  },
  {
    icon: Warehouse,
    title: "Warehousing & Transportation",
    short: "Want to give a boost to your logistics operations?",
    detail: "Optimizing warehouse layouts, transportation routes and logistics costs to drive efficiency across your operations.",
    category: "Supply Chain",
  },
  {
    icon: PackageSearch,
    title: "Inventory & Demand Management",
    short: "Strike the right balance between service and working capital.",
    detail: "Advanced forecasting and inventory optimization to ensure the right products are available at the right time and place.",
    category: "Supply Chain",
  },
  {
    icon: DollarSign,
    title: "Cost to Serve",
    short: "Gain visibility of different customer segments and true cost of serving them.",
    detail: "We can help you unveil the true cost of serving your customers and apply the right segmentation policies to maximize profit.",
    category: "Supply Chain",
  },
  {
    icon: ClipboardCheck,
    title: "Project Planning & Execution",
    short: "Enhance team synergy and project transparency.",
    detail: "From resource allocation to stakeholder communication, we guide you through every stage of the project lifecycle.",
    category: "Project Management",
  },
  {
    icon: ShieldAlert,
    title: "Risk Assessment & Mitigation",
    short: "Concerned about potential roadblocks? Let's tackle them head-on.",
    detail: "Identifying, evaluating and mitigating risks to keep your projects and operations on track.",
    category: "Project Management",
  },
  {
    icon: Megaphone,
    title: "Marketing Strategy Development",
    short: "Discover how to maximize your market presence.",
    detail: "Crafting cohesive strategies that resonate with your target audience, leverage the right channels, and maximize your ROI.",
    category: "Digital Marketing",
  },
  {
    icon: Palette,
    title: "Brand Positioning & Identity",
    short: "Solidify your brand's identity and message.",
    detail: "Building a distinctive brand that stands out in the market and connects authentically with your customers.",
    category: "Digital Marketing",
  },
];

const ExpertiseSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="expertise" className="section-dark py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <div className="accent-bar mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            What We Deliver
          </h2>
          <p className="text-white/60 text-lg">
            The advantage of an integrated approach to consulting — across supply chain, project management, and digital marketing.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-dark-border">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="cursor-pointer p-8 bg-hero-bg hover:bg-dark-surface transition-all group relative"
            >
              <p className="text-xs font-medium text-primary uppercase tracking-wider mb-4">{s.category}</p>
              <s.icon className="w-7 h-7 text-white/40 group-hover:text-primary transition-colors mb-5" />
              <h3 className="font-semibold text-lg mb-3 text-white">{s.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed mb-4">
                {expanded === i ? s.detail : s.short}
              </p>
              <span className="inline-flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {expanded === i ? "Show less" : "Learn more"} <ArrowRight className="w-3 h-3" />
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;
