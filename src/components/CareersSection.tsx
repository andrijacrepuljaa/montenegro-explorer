import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CareersSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="careers" className="section-dark py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="accent-bar mb-6 mx-auto" />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Join Our Team
          </h2>
          <p className="text-white/60 text-lg mb-10 leading-relaxed">
            Build your career in management consulting. We offer full-time positions and internship opportunities for ambitious professionals ready to make an impact.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/careers"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              View Opportunities
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CareersSection;
