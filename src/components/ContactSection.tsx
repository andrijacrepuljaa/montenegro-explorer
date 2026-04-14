import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Linkedin, ArrowRight } from "lucide-react";
import { defaultCompanyContact, defaultHomeContactCta } from "@/lib/cms";
import { useSiteContent } from "@/hooks/useSiteContent";

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const cta = useSiteContent("home.contact_cta", defaultHomeContactCta);
  const contact = useSiteContent("company.contact", defaultCompanyContact);

  return (
    <section id="contact" className="py-16 sm:py-28">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="text-primary font-display text-sm uppercase tracking-[0.2em] mb-3">{cta.eyebrow}</p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
            {cta.headline}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mb-8 sm:mb-12">
            {cta.intro}
          </p>
          <Link to={cta.buttonHref || "/contact"} className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity mb-8 sm:mb-12">
            {cta.buttonLabel || "Start a Conversation"} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto"
        >
          <a href={`mailto:${contact.email}`} className="flex flex-col items-center gap-3 rounded-lg p-6 sm:p-8 bg-card border border-border hover:border-primary/40 transition-all group">
            <Mail className="w-7 sm:w-8 h-7 sm:h-8 text-primary" />
            <span className="font-display text-sm font-semibold">Email Us</span>
            <span className="text-xs text-muted-foreground">{contact.email}</span>
          </a>
          <div className="flex flex-col items-center gap-3 rounded-lg p-6 sm:p-8 bg-card border border-border">
            <MapPin className="w-7 sm:w-8 h-7 sm:h-8 text-primary" />
            <span className="font-display text-sm font-semibold">Visit Us</span>
            <span className="text-xs text-muted-foreground text-center">{contact.officeName}, {contact.street}, {contact.city}, {contact.country}</span>
          </div>
          <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 rounded-lg p-6 sm:p-8 bg-card border border-border hover:border-primary/40 transition-all group">
            <Linkedin className="w-7 sm:w-8 h-7 sm:h-8 text-primary" />
            <span className="font-display text-sm font-semibold">LinkedIn</span>
            <span className="text-xs text-muted-foreground">Connect with us</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
