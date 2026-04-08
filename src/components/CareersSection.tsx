import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Globe, Rocket, Coffee } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const perks = [
  { icon: Rocket, title: "Real Projects", desc: "Work on live consulting engagements with international clients." },
  { icon: GraduationCap, title: "Mentorship", desc: "Learn directly from experienced consultants with global expertise." },
  { icon: Globe, title: "International Exposure", desc: "Collaborate with teams and clients across multiple countries." },
  { icon: Coffee, title: "Flexible Environment", desc: "Remote-first culture with a focus on output over hours." },
];

const fields = [
  "Supply Chain & Logistics",
  "Digital Marketing",
  "Project Management",
  "Data Analytics",
  "Business Strategy",
];

const CareersSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="careers" className="section-dark py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="accent-bar mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Careers & Internships
            </h2>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">
              Join our team and build your career in management consulting. We offer internship opportunities for ambitious graduates ready to make an impact.
            </p>

            <div className="mb-8">
              <h3 className="text-sm uppercase tracking-wider text-white/40 mb-4">Preferred Fields</h3>
              <div className="flex flex-wrap gap-2">
                {fields.map((f) => (
                  <span key={f} className="px-4 py-2 text-sm border border-dark-border text-white/70">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Apply Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {perks.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                className="border border-dark-border p-6 hover:border-primary/40 transition-colors"
              >
                <p.icon className="w-7 h-7 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-white">{p.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareersSection;
