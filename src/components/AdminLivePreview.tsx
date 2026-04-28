import type { ReactNode } from "react";
import { ArrowRight, Briefcase, CalendarDays, Mail, MapPin, Sparkles } from "lucide-react";
import type {
  CareersPageContent,
  CompanyContactContent,
  ContactPageContent,
  HomeAboutContent,
  HomeHeroContent,
  InternshipsPageContent,
  SectionIntroContent,
} from "@/lib/cms";
import type { MilestoneDraft, ServiceDraft } from "@/lib/adminCms";
import { mutedLabelClass, panelClass } from "@/lib/adminUi";
import { getIconByName } from "@/lib/iconLibrary";
import { formatClosingDate } from "@/lib/openings";
import { cn } from "@/lib/utils";

function PreviewFrame({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className={cn(panelClass, "xl:self-start xl:sticky xl:top-28")}>
      <p className={mutedLabelClass}>Live Preview</p>
      <h2 className="mt-1 text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function PreviewBlock({
  title,
  active,
  children,
}: {
  title: string;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-background p-4 transition-all",
        active && "border-primary/60 ring-2 ring-primary/20",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{title}</p>
        {active ? <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">Editing now</span> : null}
      </div>
      {children}
    </div>
  );
}

const hasFocus = (activePanel: string | undefined, panels: string[]) => panels.includes(activePanel || "");

export function HomepagePreview({
  hero,
  about,
  expertise,
  contactCta,
  activePanel,
}: {
  hero: HomeHeroContent;
  about: HomeAboutContent;
  expertise: SectionIntroContent;
  contactCta: SectionIntroContent;
  activePanel?: string;
}) {
  return (
    <PreviewFrame title="Homepage" description="A compact view of the sections your visitors will see on the landing page.">
      <PreviewBlock title="Hero" active={hasFocus(activePanel, ["hero"])}>
        <div className="overflow-hidden rounded-md border border-dark-border/70 bg-hero-bg text-hero-fg">
          <div className="px-5 py-6">
            <div className="mb-4 h-1.5 w-14 rounded-full bg-primary" />
            <h3 className="text-xl font-bold leading-tight">{hero.headline || "Hero headline"}</h3>
            <p className="mt-3 text-sm text-hero-fg/70">{hero.intro || "Hero intro copy"}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">{hero.primaryCtaLabel || "Primary CTA"}</span>
              <span className="rounded-md border border-hero-fg/20 px-3 py-2 text-xs font-semibold text-hero-fg">{hero.secondaryCtaLabel || "Secondary CTA"}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 border-t border-dark-border/70 bg-dark-surface/70">
            {hero.stats.filter((stat) => stat.value || stat.label).slice(0, 3).map((stat) => (
              <div key={`${stat.value}-${stat.label}`} className="px-4 py-3">
                <p className="text-lg font-bold text-primary">{stat.value || "--"}</p>
                <p className="text-[11px] uppercase tracking-wide text-hero-fg/55">{stat.label || "Label"}</p>
              </div>
            ))}
          </div>
        </div>
      </PreviewBlock>

      <PreviewBlock title="About" active={hasFocus(activePanel, ["about"])}>
        <h3 className="text-base font-semibold">{about.headline || "About headline"}</h3>
        <div className="mt-3 space-y-2 text-sm text-muted-foreground">
          {about.body.filter(Boolean).slice(0, 2).map((paragraph, index) => (
            <p key={`${paragraph}-${index}`}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-4 grid auto-rows-fr gap-3 sm:grid-cols-2">
          {about.pillars.slice(0, 4).map((pillar, index) => {
            const Icon = getIconByName(pillar.iconName);
            return (
              <div key={`${pillar.title}-${index}`} className="flex h-full min-h-[7.5rem] flex-col rounded-md border border-border bg-card p-3">
                <Icon className="h-4 w-4 text-primary" />
                <p className="mt-2 text-sm font-semibold">{pillar.title || "Value pillar"}</p>
                <p className="mt-1 text-xs text-muted-foreground">{pillar.description || "Short description"}</p>
              </div>
            );
          })}
        </div>
      </PreviewBlock>

      <PreviewBlock title="Expertise" active={hasFocus(activePanel, ["expertise"])}>
        <p className="text-base font-semibold">{expertise.headline || "Expertise headline"}</p>
        <p className="mt-2 text-sm text-muted-foreground">{expertise.intro || "Expertise intro copy"}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="rounded-md border border-dark-border/70 bg-hero-bg p-3 text-hero-fg">
              <Sparkles className="h-4 w-4 text-primary" />
              <div className="mt-3 h-2 w-16 rounded-full bg-primary/70" />
              <div className="mt-2 h-2 w-full rounded-full bg-hero-fg/15" />
              <div className="mt-1 h-2 w-3/4 rounded-full bg-hero-fg/15" />
            </div>
          ))}
        </div>
      </PreviewBlock>

      <PreviewBlock title="Contact CTA" active={hasFocus(activePanel, ["contact-cta"])}>
        <div className="rounded-md border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{contactCta.eyebrow || "Contact"}</p>
          <h3 className="mt-2 text-base font-semibold">{contactCta.headline || "Ready to discuss a project?"}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{contactCta.intro || "Contact CTA intro text"}</p>
          <span className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
            {contactCta.buttonLabel || "Start a conversation"} <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </PreviewBlock>
    </PreviewFrame>
  );
}

export function ServicesPreview({ items }: { items: ServiceDraft[] }) {
  const activeItems = items.filter((item) => item.is_active);

  return (
    <PreviewFrame title="Services Grid" description="A live snapshot of the service cards and modal content your homepage will use.">
      <PreviewBlock title={`${activeItems.length} active service${activeItems.length === 1 ? "" : "s"}`}>
        {activeItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active services yet. Enable a card to preview it here.</p>
        ) : (
          <div className="grid gap-3">
            {activeItems.slice(0, 4).map((service, index) => {
              const Icon = getIconByName(service.icon_name);
              return (
                <div key={service.id || `${service.title}-${index}`} className="rounded-md border border-dark-border/70 bg-hero-bg p-4 text-hero-fg">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{service.category || "Category"}</p>
                      <h3 className="mt-2 text-base font-semibold">{service.title || "Untitled service"}</h3>
                    </div>
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="mt-2 text-sm text-hero-fg/70">{service.short || "Short description"}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {service.benefits.filter(Boolean).slice(0, 3).map((benefit) => (
                      <span key={benefit} className="rounded-full border border-hero-fg/15 px-2.5 py-1 text-[11px] text-hero-fg/75">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PreviewBlock>
    </PreviewFrame>
  );
}

export function MilestonesPreview({ items }: { items: MilestoneDraft[] }) {
  const activeItems = items.filter((item) => item.is_active);

  return (
    <PreviewFrame title="Milestones Timeline" description="A compact timeline preview of the company story section.">
      <PreviewBlock title="Timeline">
        {activeItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">No milestones yet. Add one to preview the timeline here.</p>
        ) : (
          <div className="space-y-4">
            {activeItems.slice(0, 4).map((milestone, index) => (
              <div key={milestone.id || `${milestone.year}-${index}`} className="relative pl-5">
                <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                {index < Math.min(activeItems.length, 4) - 1 ? <span className="absolute left-[4px] top-4 h-[calc(100%+0.5rem)] w-px bg-border" /> : null}
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">{milestone.year || "Year"}</p>
                <h3 className="mt-1 text-sm font-semibold">{milestone.title || "Milestone title"}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{milestone.description || "Description"}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {milestone.highlights.filter(Boolean).slice(0, 3).map((highlight) => (
                    <span key={highlight} className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </PreviewBlock>
    </PreviewFrame>
  );
}

export function CareersPagePreview({
  content,
  activePanel,
}: {
  content: CareersPageContent;
  activePanel?: string;
}) {
  return (
    <PreviewFrame title="Careers Page" description="A focused preview of the full-time roles page and its cross-link to internships.">
      <PreviewBlock title="Hero" active={hasFocus(activePanel, ["careers-hero"])}>
        <div className="rounded-md border border-dark-border/70 bg-hero-bg p-5 text-hero-fg">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Careers</p>
          <h3 className="mt-2 text-xl font-bold">{content.headline || "Careers headline"}</h3>
          <p className="mt-2 text-sm text-hero-fg/70">{content.intro || "Careers intro copy"}</p>
        </div>
      </PreviewBlock>

      <PreviewBlock title="Career Perks" active={hasFocus(activePanel, ["career-perks"])}>
        <p className="mb-3 text-sm font-semibold">{content.careersHeading || "Why KGC?"}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {content.careerPerks.slice(0, 4).map((perk, index) => {
            const Icon = getIconByName(perk.iconName);
            return (
              <div key={`${perk.title}-${index}`} className="rounded-md border border-border bg-card p-3">
                <Icon className="h-4 w-4 text-primary" />
                <p className="mt-2 text-sm font-semibold">{perk.title || "Career perk"}</p>
                <p className="mt-1 text-xs text-muted-foreground">{perk.description || "Perk description"}</p>
              </div>
            );
          })}
        </div>
      </PreviewBlock>

      <PreviewBlock title="Page CTAs" active={hasFocus(activePanel, ["career-ctas"])}>
        <div className="space-y-3">
          <div className="rounded-md border border-border bg-card p-4">
            <p className="text-sm font-semibold">{content.talentPoolTitle || "Talent pool block"}</p>
            <p className="mt-2 text-sm text-muted-foreground">{content.talentPoolBody || "Talent pool body copy"}</p>
            <span className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
              {content.talentPoolButtonLabel || "Send your CV"} <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="rounded-md border border-border bg-card p-4">
            <p className="text-sm font-semibold">{content.internshipsLinkTitle || "Looking for internships?"}</p>
            <p className="mt-2 text-sm text-muted-foreground">{content.internshipsLinkBody || "Internship cross-link copy"}</p>
            <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-primary">
              {content.internshipsLinkLabel || "Explore internships"} <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </PreviewBlock>
    </PreviewFrame>
  );
}

export function InternshipsPagePreview({
  content,
  activePanel,
}: {
  content: InternshipsPageContent;
  activePanel?: string;
}) {
  return (
    <PreviewFrame title="Internships Page" description="A focused preview of the internship programme page and its link back to careers.">
      <PreviewBlock title="Hero" active={hasFocus(activePanel, ["internships-hero"])}>
        <div className="rounded-md border border-dark-border/70 bg-hero-bg p-5 text-hero-fg">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Internships</p>
          <h3 className="mt-2 text-xl font-bold">{content.headline || "Internships headline"}</h3>
          <p className="mt-2 text-sm text-hero-fg/70">{content.intro || "Internship page intro copy"}</p>
        </div>
      </PreviewBlock>

      <PreviewBlock title="Programme" active={hasFocus(activePanel, ["internship-programme"])}>
        <p className="text-sm font-semibold">{content.programHeading || "Programme heading"}</p>
        <div className="mt-2 space-y-2 text-sm text-muted-foreground">
          {content.programIntro.filter(Boolean).slice(0, 2).map((paragraph, index) => (
            <p key={`${paragraph}-${index}`}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {content.preferredFields.filter(Boolean).slice(0, 4).map((field) => (
            <span key={field} className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              {field}
            </span>
          ))}
        </div>
      </PreviewBlock>

      <PreviewBlock title="Internship Perks" active={hasFocus(activePanel, ["internship-perks"])}>
        <p className="mb-3 text-sm font-semibold">{content.perksHeading || "Why Intern at KGC?"}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {content.internPerks.slice(0, 4).map((perk, index) => {
            const Icon = getIconByName(perk.iconName);
            return (
              <div key={`${perk.title}-${index}`} className="rounded-md border border-border bg-card p-3">
                <Icon className="h-4 w-4 text-primary" />
                <p className="mt-2 text-sm font-semibold">{perk.title || "Intern perk"}</p>
                <p className="mt-1 text-xs text-muted-foreground">{perk.description || "Perk description"}</p>
              </div>
            );
          })}
        </div>
      </PreviewBlock>

      <PreviewBlock title="Page CTAs" active={hasFocus(activePanel, ["internship-ctas"])}>
        <div className="space-y-3">
          <div className="rounded-md border border-border bg-card p-4">
            <p className="text-sm font-semibold">{content.applicationCtaTitle || "Bottom CTA title"}</p>
            <p className="mt-2 text-sm text-muted-foreground">{content.applicationCtaBody || "Bottom CTA body copy"}</p>
            <span className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
              {content.applyButtonLabel || "Send your CV"} <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="rounded-md border border-border bg-card p-4">
            <p className="text-sm font-semibold">{content.careersLinkTitle || "Looking for a full-time role?"}</p>
            <p className="mt-2 text-sm text-muted-foreground">{content.careersLinkBody || "Careers cross-link copy"}</p>
            <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-primary">
              {content.careersLinkLabel || "Explore career roles"} <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </PreviewBlock>
    </PreviewFrame>
  );
}

export function OpeningsListPreview({
  title,
  eyebrow,
  items,
}: {
  title: string;
  eyebrow: string;
  items: Array<{
    id?: string;
    title: string;
    type: string;
    location: string;
    description: string;
    requirements?: string[] | null;
    closing_date?: string | null;
    is_active: boolean;
  }>;
}) {
  const activeItems = items.filter((item) => item.is_active);

  return (
    <PreviewFrame title={title} description="A compact preview of the active cards that will appear on the public page.">
      <PreviewBlock title={`${activeItems.length} active opening${activeItems.length === 1 ? "" : "s"}`}>
        {activeItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active openings yet. Enable or add one to preview it here.</p>
        ) : (
          <div className="space-y-3">
            {activeItems.slice(0, 3).map((item, index) => (
              <div key={item.id || `${item.title}-${index}`} className="rounded-md border border-border bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
                <h3 className="mt-1 text-sm font-semibold">{item.title || "Opening title"}</h3>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> {item.type || "Type"}</span>
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {item.location || "Location"}</span>
                  {item.closing_date ? (
                    <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> Closes {formatClosingDate(item.closing_date)}</span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.description || "Opening description"}</p>
                {item.requirements && item.requirements.filter(Boolean).length > 0 ? (
                  <div className="mt-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Requirements</p>
                    <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                      {item.requirements.filter(Boolean).slice(0, 4).map((requirement) => (
                        <li key={requirement} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </PreviewBlock>
    </PreviewFrame>
  );
}

export function ContactPreview({
  company,
  page,
  activePanel,
}: {
  company: CompanyContactContent;
  page: ContactPageContent;
  activePanel?: string;
}) {
  return (
    <PreviewFrame title="Contact Page" description="A side-by-side preview of the shared company details and contact page copy.">
      <PreviewBlock title="Company Details" active={hasFocus(activePanel, ["company-details"])}>
        <div className="rounded-md border border-border bg-card p-4">
          <p className="text-sm font-semibold">{company.officeName || "Office name"}</p>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {company.street || "Street"}, {company.city || "City"}, {company.country || "Country"}</p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0 text-primary" /> {company.email || "email@example.com"}</p>
          </div>
        </div>
      </PreviewBlock>

      <PreviewBlock title="Contact Form Copy" active={hasFocus(activePanel, ["contact-page-copy"])}>
        <div className="rounded-md border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Contact</p>
          <h3 className="mt-2 text-base font-semibold">{page.headline || "Contact headline"}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{page.intro || "Contact intro"}</p>
          <div className="mt-4 rounded-md bg-muted p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Form helper</p>
            <p className="mt-1 text-sm text-muted-foreground">{page.formHelper || "Helper copy"}</p>
          </div>
        </div>
      </PreviewBlock>
    </PreviewFrame>
  );
}
