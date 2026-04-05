import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, MapPin, Linkedin } from "lucide-react";

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-28">
      <div className="container mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="text-primary font-display text-sm uppercase tracking-[0.2em] mb-3">Contact</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Let's Write Your Next <span className="text-gradient">Success Story</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-12">
            We want to hear from you. Contact us to discuss how we can help transform your business.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto"
        >
          <a
            href="mailto:info@kgc.co.me"
            className="flex flex-col items-center gap-3 rounded-xl p-8 bg-card border border-border hover:border-primary/40 transition-all group"
          >
            <Mail className="w-8 h-8 text-primary" />
            <span className="font-display text-sm font-semibold">Email Us</span>
            <span className="text-xs text-muted-foreground">info@kgc.co.me</span>
          </a>

          <div className="flex flex-col items-center gap-3 rounded-xl p-8 bg-card border border-border">
            <MapPin className="w-8 h-8 text-primary" />
            <span className="font-display text-sm font-semibold">Visit Us</span>
            <span className="text-xs text-muted-foreground text-center">Arsenal Business Club, Seljanovo B.B., Tivat, Montenegro</span>
          </div>

          <a
            href="https://www.linkedin.com/in/velibor-kastratovic/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 rounded-xl p-8 bg-card border border-border hover:border-primary/40 transition-all group"
          >
            <Linkedin className="w-8 h-8 text-primary" />
            <span className="font-display text-sm font-semibold">LinkedIn</span>
            <span className="text-xs text-muted-foreground">Connect with us</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
