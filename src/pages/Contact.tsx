import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Linkedin, Send, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { PageSectionsRenderer } from "@/components/FlexibleSectionsRenderer";
import kgcLogo from "@/assets/kgc-logo.png";
import { defaultCompanyContact, defaultContactPage } from "@/lib/cms";
import { usePageSections, usePageStructure, useSiteContent } from "@/hooks/useSiteContent";
import { usePageSeo } from "@/hooks/usePageSeo";
import { buildContactMailtoLink, contactSchema, contactTopicOptions, type ContactFormDraft } from "@/lib/contactForm";
import { getFlexibleSectionSurfaceMap, getSectionsForPlacement, getStructureSection, type PageSurface } from "@/lib/pageSections";
import { cn } from "@/lib/utils";

const contactSeo = {
  title: "Contact KGC",
  description: "Start a conversation with KGC about your project, operations, or growth challenge.",
};

const pageSectionClass = (surface: PageSurface, first = false) =>
  cn(
    !first && "pt-12 sm:pt-16",
    surface === "dark" && "section-dark -mx-4 px-4 pb-12 sm:-mx-6 sm:px-6 sm:pb-16 lg:-mx-12 lg:px-12",
  );

const Contact = () => {
  const [form, setForm] = useState<ContactFormDraft>({
    name: "", email: "", company: "", subject: "", message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormDraft, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const content = useSiteContent("contact.page", defaultContactPage);
  const contact = useSiteContent("company.contact", defaultCompanyContact);
  const flexibleSections = usePageSections("contact");
  const structure = usePageStructure("contact");
  usePageSeo("contact", contactSeo);
  const introSection = getStructureSection(structure, "intro");
  const contactContentSection = getStructureSection(structure, "contact-content");
  const flexibleSectionSurfaces = getFlexibleSectionSurfaceMap("contact", flexibleSections, structure);
  const introSurface = flexibleSectionSurfaces.intro || "light";
  const contactContentSurface = flexibleSectionSurfaces["contact-content"] || "light";
  const isIntroDark = introSurface === "dark";
  const isContactContentDark = contactContentSurface === "dark";

  const handleChange = (field: keyof ContactFormDraft, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormDraft, string>> = {};
      result.error.issues.forEach(issue => {
        fieldErrors[issue.path[0] as keyof ContactFormDraft] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    window.location.href = buildContactMailtoLink(result.data, contact.email);
    setSubmitted(true);
  };

  const inputClass = cn(
    "w-full px-4 py-3 border focus:outline-none focus:border-primary transition-colors text-sm",
    isContactContentDark
      ? "border-dark-border bg-dark-surface text-hero-fg placeholder:text-hero-fg/45"
      : "border-border bg-background text-foreground placeholder:text-muted-foreground",
  );

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border sticky top-0 z-50 bg-background">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={kgcLogo} alt="KGC" className="h-8" />
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-20">
        <div className="max-w-5xl">
          {introSection?.visible !== false ? (
            <section className={pageSectionClass(introSurface, true)}>
              <motion.div
                id={introSection?.anchor}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="accent-bar mb-6" />
                <h1 className={cn("text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-4", isIntroDark && "text-hero-fg")}>{content.headline}</h1>
                <p className={cn("text-base sm:text-lg max-w-xl", isIntroDark ? "text-hero-fg/70" : "text-muted-foreground")}>
                  {content.intro}
                </p>
              </motion.div>
            </section>
          ) : null}

          <PageSectionsRenderer sections={getSectionsForPlacement(flexibleSections, "after-intro")} embedded surfaceMap={flexibleSectionSurfaces} />

          {contactContentSection?.visible !== false ? (
            <section className={pageSectionClass(contactContentSurface)}>
              <div id={contactContentSection?.anchor} className="grid lg:grid-cols-3 gap-8 sm:gap-12">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="order-2 lg:order-1 space-y-4 sm:space-y-6">
                  {[
                    {
                      icon: Mail,
                      title: "Email",
                      content: <a href={`mailto:${contact.email}`} className={cn("text-sm hover:text-primary transition-colors", isContactContentDark ? "text-hero-fg/70" : "text-muted-foreground")}>{contact.email}</a>,
                    },
                    {
                      icon: MapPin,
                      title: "Office",
                      content: <p className={cn("text-sm", isContactContentDark ? "text-hero-fg/70" : "text-muted-foreground")}>{contact.officeName}<br />{contact.street}, {contact.city}<br />{contact.country}</p>,
                    },
                    {
                      icon: Linkedin,
                      title: "LinkedIn",
                      content: <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className={cn("text-sm hover:text-primary transition-colors", isContactContentDark ? "text-hero-fg/70" : "text-muted-foreground")}>Connect with us</a>,
                    },
                  ].map(item => (
                    <div key={item.title} className={cn("border p-5 sm:p-6", isContactContentDark ? "border-dark-border bg-dark-surface" : "border-border bg-background")}>
                      <item.icon className="w-5 h-5 text-primary mb-3" />
                      <h3 className={cn("font-semibold mb-1", isContactContentDark && "text-hero-fg")}>{item.title}</h3>
                      {item.content}
                    </div>
                  ))}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="order-1 lg:order-2 lg:col-span-2">
                  {submitted ? (
                    <div className={cn("border p-10 sm:p-16 text-center", isContactContentDark ? "border-dark-border bg-dark-surface" : "border-border bg-background")} aria-live="polite">
                      <div className="w-14 h-14 bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <Send className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className={cn("text-xl sm:text-2xl font-bold mb-3", isContactContentDark && "text-hero-fg")}>Your draft is ready</h3>
                      <p className={cn("mb-6", isContactContentDark ? "text-hero-fg/70" : "text-muted-foreground")}>
                        We opened your default email app with your topic, contact details, and message already prepared.
                      </p>
                      <button onClick={() => { setSubmitted(false); setErrors({}); setForm({ name: "", email: "", company: "", subject: "", message: "" }); }} className="text-sm text-primary hover:underline">
                        Prepare another message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                      <p className={cn("text-sm", isContactContentDark ? "text-hero-fg/70" : "text-muted-foreground")}>
                        {content.formHelper}
                      </p>
                      <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                        <div>
                          <label className={cn("block text-sm font-medium mb-1.5", isContactContentDark && "text-hero-fg")}>Name *</label>
                          <input type="text" value={form.name} onChange={e => handleChange("name", e.target.value)} className={inputClass} placeholder="Your name" />
                          {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                          <label className={cn("block text-sm font-medium mb-1.5", isContactContentDark && "text-hero-fg")}>Email *</label>
                          <input type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} className={inputClass} placeholder="your@email.com" />
                          {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                        <div>
                          <label className={cn("block text-sm font-medium mb-1.5", isContactContentDark && "text-hero-fg")}>Company</label>
                          <input type="text" value={form.company} onChange={e => handleChange("company", e.target.value)} className={inputClass} placeholder="Company name" />
                        </div>
                        <div>
                          <label className={cn("block text-sm font-medium mb-1.5", isContactContentDark && "text-hero-fg")}>Subject *</label>
                          <select value={form.subject} onChange={e => handleChange("subject", e.target.value)} className={inputClass}>
                            <option value="" disabled>Choose a topic</option>
                            {contactTopicOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject}</p>}
                        </div>
                      </div>
                      <div>
                        <label className={cn("block text-sm font-medium mb-1.5", isContactContentDark && "text-hero-fg")}>Message *</label>
                        <textarea value={form.message} onChange={e => handleChange("message", e.target.value)} rows={6} className={`${inputClass} resize-none`} placeholder="Tell us about your project or inquiry..." />
                        {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
                      </div>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-primary text-primary-foreground font-semibold text-sm transition-opacity hover:opacity-90"
                      >
                        <Send className="w-4 h-4" /> Open Email Draft
                      </button>
                    </form>
                  )}
                </motion.div>
              </div>
            </section>
          ) : null}
        </div>

        <PageSectionsRenderer sections={getSectionsForPlacement(flexibleSections, "after-contact-content")} embedded surfaceMap={flexibleSectionSurfaces} />
      </div>
    </div>
  );
};

export default Contact;
