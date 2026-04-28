import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import kgcLogo from "@/assets/kgc-logo.png";
import { defaultInternshipsPage, extractInternshipsPageContent } from "@/lib/cms";
import { useSiteContentWithLegacy } from "@/hooks/useSiteContent";
import { usePageSeo } from "@/hooks/usePageSeo";
import { getIconByName } from "@/lib/iconLibrary";
import { formatClosingDate } from "@/lib/openings";

interface InternshipOpening {
  id: string;
  title: string;
  type: string;
  location: string;
  description: string;
  requirements: string[] | null;
  apply_url: string | null;
  closing_date: string | null;
}

const internshipsSeo = {
  title: "Internships at KGC",
  description: "Explore the KGC internship programme and current internship opportunities.",
};

const isExternalHref = (href: string) => /^(https?:\/\/|mailto:|tel:)/i.test(href);
const isRouteHref = (href: string) => href.startsWith("/");

function ActionLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  if (isExternalHref(href)) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
  }

  return isRouteHref(href) ? (
    <Link to={href} className={className}>{children}</Link>
  ) : (
    <a href={href} className={className}>{children}</a>
  );
}

const Internships = () => {
  const [openings, setOpenings] = useState<InternshipOpening[]>([]);
  const content = useSiteContentWithLegacy(
    "internships.page",
    defaultInternshipsPage,
    "careers.page",
    extractInternshipsPageContent,
  );
  usePageSeo("internships", internshipsSeo);

  useEffect(() => {
    supabase
      .from("career_openings")
      .select("*")
      .eq("is_active", true)
      .eq("tab", "internships")
      .order("sort_order")
      .then(({ data }) => {
        if (data) setOpenings(data);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-12">
          <Link to="/" className="flex items-center">
            <img src={kgcLogo} alt="KGC" className="h-8" />
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-20 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start"
        >
          <div>
            <div className="accent-bar mb-6" />
            <h1 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl">{content.headline}</h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">{content.intro}</p>
          </div>

          <aside className="rounded-md border border-border bg-card p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Also exploring full-time roles?</p>
            <h2 className="mt-2 text-lg font-semibold">{content.careersLinkTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{content.careersLinkBody}</p>
            <ActionLink
              href={content.careersLinkHref}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              {content.careersLinkLabel} <ArrowRight className="h-4 w-4" />
            </ActionLink>
          </aside>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] sm:mt-16 sm:gap-16"
        >
          <div>
            <h2 className="mb-4 text-xl font-bold sm:text-2xl">{content.programHeading}</h2>
            <div className="space-y-4">
              {content.programIntro.map((paragraph, index) => (
                <p
                  key={`${paragraph}-${index}`}
                  className={index === 0 ? "text-base leading-relaxed text-muted-foreground sm:text-lg" : "text-sm leading-relaxed text-muted-foreground sm:text-base"}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8 sm:mt-10">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{content.preferredFieldsHeading}</h3>
              <div className="flex flex-wrap gap-2">
                {content.preferredFields.map((field) => (
                  <span key={field} className="rounded-md border border-border px-3 py-2 text-xs text-muted-foreground sm:px-4 sm:text-sm">
                    {field}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-6 text-xl font-bold sm:text-2xl">{content.perksHeading}</h2>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              {content.internPerks.map((perk, index) => {
                const Icon = getIconByName(perk.iconName);
                return (
                  <motion.div
                    key={perk.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + index * 0.06 }}
                    className="rounded-md border border-border p-5 transition-colors hover:border-primary/40 sm:p-6"
                  >
                    <Icon className="mb-3 h-6 w-6 text-primary sm:mb-4 sm:h-7 sm:w-7" />
                    <h3 className="mb-2 text-base font-semibold sm:text-lg">{perk.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{perk.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mt-12 sm:mt-16"
        >
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">{content.positionsHeading}</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Open internships appear here automatically when you add them in the CMS.
              </p>
            </div>
            <ActionLink
              href={content.applyButtonHref}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted"
            >
              {content.applyButtonLabel} <ArrowRight className="h-4 w-4" />
            </ActionLink>
          </div>

          {openings.length === 0 ? (
            <div className="rounded-md border border-border p-5 sm:p-6">
              <h3 className="mb-2 text-base font-semibold sm:text-lg">{content.noOpeningsTitle}</h3>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{content.noOpeningsBody}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {openings.map((internship, index) => {
                const applyHref = internship.apply_url || content.applyButtonHref;
                const closingDate = formatClosingDate(internship.closing_date);

                return (
                  <motion.div
                    key={internship.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 + index * 0.06 }}
                    className="rounded-md border border-border p-4 transition-colors hover:border-primary/30 sm:p-6"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="mb-2 text-base font-semibold sm:text-lg">{internship.title}</h3>
                        <div className="mb-2 flex flex-wrap gap-3 text-sm text-muted-foreground sm:gap-4">
                          <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {internship.type}</span>
                          <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {internship.location}</span>
                          {closingDate ? (
                            <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> Closes {closingDate}</span>
                          ) : null}
                        </div>
                        <p className="text-sm text-muted-foreground">{internship.description}</p>
                        {internship.requirements && internship.requirements.length > 0 ? (
                          <div className="mt-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Requirements</p>
                            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                              {internship.requirements.filter(Boolean).map((requirement) => (
                                <li key={requirement} className="flex items-start gap-2">
                                  <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                  <span>{requirement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                      <ActionLink
                        href={applyHref}
                        className="inline-flex flex-shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:px-6"
                      >
                        Apply Now <ArrowRight className="h-4 w-4" />
                      </ActionLink>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default Internships;
