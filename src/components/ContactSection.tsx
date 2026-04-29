import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Linkedin, ArrowRight } from "lucide-react";
import { defaultCompanyContact, defaultHomeContactCta, type CompanyContactContent, type SectionIntroContent } from "@/lib/cms";
import { useSiteContent } from "@/hooks/useSiteContent";
import type { PageSectionContactCtaContent, PageSurface } from "@/lib/pageSections";
import { cn } from "@/lib/utils";

const ContactSection = ({
  sectionId = "contact",
  ctaContent,
  contactContent,
  surface = "light",
  embedded = false,
}: {
  sectionId?: string;
  ctaContent?: PageSectionContactCtaContent | SectionIntroContent;
  contactContent?: CompanyContactContent;
  surface?: PageSurface;
  embedded?: boolean;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const storedCta = useSiteContent("home.contact_cta", defaultHomeContactCta);
  const storedContact = useSiteContent("company.contact", defaultCompanyContact);
  const cta = ctaContent || storedCta;
  const contact = contactContent || ("contact" in cta ? cta.contact : storedContact);
  const isDark = surface === "dark";
  const containerClass = embedded
    ? "mx-auto max-w-full px-0"
    : "max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12";

  return (
    <section id={sectionId} className={cn("py-16 sm:py-28", isDark && "section-dark")}>
      <div className={containerClass} ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="text-primary font-display text-sm uppercase tracking-[0.2em] mb-3">{cta.eyebrow}</p>
          <h2 className={cn("font-display text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6", isDark && "text-hero-fg")}>
            {cta.headline}
          </h2>
          <p className={cn("text-base sm:text-lg mb-8 sm:mb-12", isDark ? "text-hero-fg/70" : "text-muted-foreground")}>
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
          <a href={`mailto:${contact.email}`} className={cn("flex flex-col items-center gap-3 rounded-lg p-6 sm:p-8 border hover:border-primary/40 transition-all group", isDark ? "bg-dark-surface border-dark-border" : "bg-card border-border")}>
            <Mail className="w-7 sm:w-8 h-7 sm:h-8 text-primary" />
            <span className={cn("font-display text-sm font-semibold", isDark && "text-hero-fg")}>Email Us</span>
            <span className={cn("text-xs", isDark ? "text-hero-fg/70" : "text-muted-foreground")}>{contact.email}</span>
          </a>
          <div className={cn("flex flex-col items-center gap-3 rounded-lg p-6 sm:p-8 border", isDark ? "bg-dark-surface border-dark-border" : "bg-card border-border")}>
            <MapPin className="w-7 sm:w-8 h-7 sm:h-8 text-primary" />
            <span className={cn("font-display text-sm font-semibold", isDark && "text-hero-fg")}>Visit Us</span>
            <span className={cn("text-xs text-center", isDark ? "text-hero-fg/70" : "text-muted-foreground")}>{contact.officeName}, {contact.street}, {contact.city}, {contact.country}</span>
          </div>
          <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className={cn("flex flex-col items-center gap-3 rounded-lg p-6 sm:p-8 border hover:border-primary/40 transition-all group", isDark ? "bg-dark-surface border-dark-border" : "bg-card border-border")}>
            <Linkedin className="w-7 sm:w-8 h-7 sm:h-8 text-primary" />
            <span className={cn("font-display text-sm font-semibold", isDark && "text-hero-fg")}>LinkedIn</span>
            <span className={cn("text-xs", isDark ? "text-hero-fg/70" : "text-muted-foreground")}>Connect with us</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
