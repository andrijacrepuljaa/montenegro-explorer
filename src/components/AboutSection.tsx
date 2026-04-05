import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Link2, BarChart3, Globe, TrendingUp } from "lucide-react";

const pillars = [
  { icon: Link2, title: "Supply Chain Consulting", desc: "We work closely with our clients and partners to make fit supply chains." },
  { icon: BarChart3, title: "Data-Driven Decisions", desc: "We go digital to derive unbiased conclusions and recommendations." },
  { icon: Globe, title: "Globally Oriented", desc: "We are serving our clients globally from our home base in Montenegro." },
  { icon: TrendingUp, title: "Profitability & Service", desc: "We aim to provide lean and value-for-money service." },
];

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-28 relative">
      <div className="container mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <p className="text-primary font-display text-sm uppercase tracking-[0.2em] mb-3">About Us</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Established in 2017 in <span className="text-gradient">Montenegro</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            KGC is a company that provides management consulting services focusing on the domain of supply chain optimisation, digital marketing and project management. We partner with leading European consulting firms to provide specialist support across various topics.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-xl p-6 bg-card border border-border hover:border-primary/40 transition-all hover:glow-border"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <pillar.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{pillar.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
