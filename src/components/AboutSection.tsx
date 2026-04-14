import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Lightbulb, TrendingUp, Users } from "lucide-react";

const pillars = [
  { icon: Target, title: "Precision", desc: "Data-driven strategies tailored to your unique challenges and market position." },
  { icon: Lightbulb, title: "Innovation", desc: "Blending proven methodologies with fresh thinking to unlock new opportunities." },
  { icon: TrendingUp, title: "Impact", desc: "Measurable results that drive sustainable growth and operational excellence." },
  { icon: Users, title: "Partnership", desc: "Collaborative engagement with your teams, not work done in isolation." },
];

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

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
              Management Consulting from Montenegro to the World
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              KGC d.o.o. is a management consulting firm headquartered in Tivat, Montenegro. We specialize in supply chain consulting, digital marketing strategy, and project management, helping businesses across Europe and beyond optimize their operations and accelerate growth.
            </p>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              Our team combines deep industry expertise with a hands-on, collaborative approach. We do not just advise; we embed ourselves in your challenges to deliver measurable, lasting results.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                className="border border-border p-4 sm:p-6 hover:border-primary/40 transition-colors group"
              >
                <p.icon className="w-6 sm:w-8 h-6 sm:h-8 text-primary mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">{p.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
