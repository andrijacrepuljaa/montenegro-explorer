import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Rocket, Users, BookOpen, Award, Network, Briefcase } from "lucide-react";

const perks = [
  { icon: Rocket, title: "Professional Growth", desc: "Hands-on experience in a dynamic work environment." },
  { icon: Users, title: "Dynamic & Flexible", desc: "Collaboration and creativity with optimal work-life mix." },
  { icon: BookOpen, title: "Mentorship", desc: "Work closely with industry professionals." },
  { icon: Award, title: "Remuneration", desc: "Some interns may be awarded compensation." },
  { icon: Network, title: "Networking", desc: "Build valuable industry connections." },
  { icon: Briefcase, title: "Career Advancement", desc: "Successful internships can lead to full-time roles." },
];

const fields = ["Business & Economics", "Organizational Studies", "Logistics & Supply Chain", "Operations Research / Statistics"];

const CareersSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="careers" className="py-28 bg-secondary/30">
      <div className="container mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <p className="text-primary font-display text-sm uppercase tracking-[0.2em] mb-3">Careers</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Join <span className="text-gradient">Our Team</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            KGC offers a unique opportunity to grow in a highly professional and internationally oriented ambient. We're always looking for ambitious individuals eager to step out of their comfort zones.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Internship fields */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl p-8 bg-card border border-border"
          >
            <h3 className="font-display font-semibold text-xl mb-6">Internship Fields</h3>
            <div className="space-y-3">
              {fields.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm text-secondary-foreground">{f}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Preferred candidates: bachelor's or master's students in their final year or graduates up to two years post-graduation with the right to reside and work in Montenegro.
              </p>
            </div>
          </motion.div>

          {/* Perks grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            {perks.map((p) => (
              <div key={p.title} className="rounded-xl p-5 bg-card border border-border">
                <p.icon className="w-5 h-5 text-primary mb-3" />
                <h4 className="font-display text-sm font-semibold mb-1">{p.title}</h4>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CareersSection;
