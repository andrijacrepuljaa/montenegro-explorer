import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Globe, Rocket, Coffee, Briefcase, ArrowRight, ArrowLeft, Clock, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import kgcLogo from "@/assets/kgc-logo.png";
import { defaultCareersPage } from "@/lib/cms";
import { useSiteContent } from "@/hooks/useSiteContent";
import { usePageSeo } from "@/hooks/usePageSeo";

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  Globe,
  Rocket,
  Coffee,
  Briefcase,
};

interface CareerOpening {
  id: string;
  title: string;
  type: string;
  location: string;
  description: string;
  tab: string;
}

const careersSeo = {
  title: "Careers at KGC",
  description: "Build your career in management consulting with KGC.",
};

const Careers = () => {
  const [activeTab, setActiveTab] = useState<"careers" | "internships">("careers");
  const [openings, setOpenings] = useState<CareerOpening[]>([]);
  const content = useSiteContent("careers.page", defaultCareersPage);
  usePageSeo("careers", careersSeo);

  useEffect(() => {
    supabase
      .from("career_openings")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data) setOpenings(data);
      });
  }, []);

  const careerOpenings = openings.filter(o => o.tab === "careers");
  const internOpenings = openings.filter(o => o.tab === "internships");

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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 sm:mb-12">
          <div className="accent-bar mb-6" />
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-4">{content.headline}</h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl">
            {content.intro}
          </p>
        </motion.div>

        <div className="flex gap-0 border-b border-border mb-8 sm:mb-12">
          <button onClick={() => setActiveTab("careers")} className={`px-4 sm:px-8 py-3 sm:py-4 text-sm font-semibold transition-all border-b-2 -mb-px ${activeTab === "careers" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            Careers
          </button>
          <button onClick={() => setActiveTab("internships")} className={`px-4 sm:px-8 py-3 sm:py-4 text-sm font-semibold transition-all border-b-2 -mb-px ${activeTab === "internships" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            Internships
          </button>
        </div>

        {activeTab === "careers" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="mb-12 sm:mb-16">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">{content.careersHeading}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {content.careerPerks.map((p, i) => {
                  const Icon = iconMap[p.iconName] || Rocket;
                  return (
                    <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="border border-border p-5 sm:p-6 hover:border-primary/40 transition-colors">
                      <Icon className="w-6 sm:w-7 h-6 sm:h-7 text-primary mb-3 sm:mb-4" />
                      <h3 className="font-semibold text-base sm:text-lg mb-2">{p.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mb-12 sm:mb-16">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">{content.positionsHeading}</h2>
              {careerOpenings.length === 0 ? (
                <div className="border border-border p-5 sm:p-6">
                  <h3 className="font-semibold text-base sm:text-lg mb-2">{content.noOpeningsTitle}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 max-w-2xl">
                    {content.noOpeningsBody}
                  </p>
                  <Link to="/contact" className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                    Join Talent Pool <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {careerOpenings.map((job, i) => (
                    <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }} className="border border-border p-4 sm:p-6 hover:border-primary/30 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-base sm:text-lg mb-2">{job.title}</h3>
                          <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-muted-foreground mb-2">
                            <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {job.type}</span>
                            <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{job.description}</p>
                        </div>
                        <Link to="/contact" className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap flex-shrink-0 justify-center">
                          Apply Now <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="border border-border p-6 sm:p-8 lg:p-12 text-center">
              <h3 className="text-lg sm:text-xl font-bold mb-3">{content.talentPoolTitle}</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm sm:text-base">
                {content.talentPoolBody}
              </p>
              <Link to="/contact" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                {content.talentPoolButtonLabel} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}

        {activeTab === "internships" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 mb-12 sm:mb-16">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4">{content.internshipHeading}</h2>
                {content.internshipIntro.map((paragraph, index) => (
                  <p key={paragraph} className={index === 0 ? "text-muted-foreground text-base sm:text-lg leading-relaxed mb-4 sm:mb-6" : "text-muted-foreground leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base"}>
                    {paragraph}
                  </p>
                ))}

                {internOpenings.length > 0 && (
                  <div className="mb-6 sm:mb-8">
                    <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Open Internships</h3>
                    <div className="space-y-3">
                      {internOpenings.map(o => (
                        <div key={o.id} className="border border-border p-4">
                          <h4 className="font-semibold text-sm mb-1">{o.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{o.location} - {o.type}</p>
                          <p className="text-sm text-muted-foreground">{o.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-6 sm:mb-8">
                  <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">{content.preferredFieldsHeading}</h3>
                  <div className="flex flex-wrap gap-2">
                    {content.preferredFields.map(f => (
                      <span key={f} className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-border text-muted-foreground">{f}</span>
                    ))}
                  </div>
                </div>

                <Link to="/contact" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                  Apply for Internship <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                {content.internPerks.map((p, i) => {
                  const Icon = iconMap[p.iconName] || Rocket;
                  return (
                    <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }} className="border border-border p-5 sm:p-6 hover:border-primary/40 transition-colors">
                      <Icon className="w-6 sm:w-7 h-6 sm:h-7 text-primary mb-3 sm:mb-4" />
                      <h3 className="font-semibold text-base sm:text-lg mb-2">{p.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Careers;
