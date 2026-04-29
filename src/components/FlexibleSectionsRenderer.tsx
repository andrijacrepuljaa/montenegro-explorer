import { useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import MilestonesSection from "@/components/MilestonesSection";
import { getIconByName } from "@/lib/iconLibrary";
import type { PageSectionDraft, PageSurface } from "@/lib/pageSections";

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
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return isRouteHref(href) ? (
    <Link to={href} className={className}>
      {children}
    </Link>
  ) : (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

function ActionButtons({
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  isDark,
  align = "start",
}: {
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  isDark: boolean;
  align?: "start" | "center";
}) {
  if (!primaryLabel && !secondaryLabel) return null;

  return (
    <div className={cn("mt-6 flex flex-wrap gap-3", align === "center" && "justify-center")}>
      {primaryLabel && primaryHref ? (
        <ActionLink
          href={primaryHref}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {primaryLabel} <ArrowRight className="h-4 w-4" />
        </ActionLink>
      ) : null}
      {secondaryLabel && secondaryHref ? (
        <ActionLink
          href={secondaryHref}
          className={cn(
            "inline-flex items-center gap-2 rounded-md border px-5 py-3 text-sm font-semibold transition-colors",
            isDark ? "border-dark-border text-hero-fg hover:bg-hero-fg/10" : "border-border hover:bg-muted",
          )}
        >
          {secondaryLabel}
        </ActionLink>
      ) : null}
    </div>
  );
}

const sectionSpacing = (preview: boolean) => (preview ? "py-8" : "py-16 sm:py-20");
const containerClass = (preview: boolean, embedded: boolean) =>
  preview
    ? "mx-auto max-w-full px-4"
    : embedded
      ? "mx-auto max-w-full px-0"
      : "mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12";

const sectionClass = (preview: boolean, embedded: boolean, surface: PageSurface) =>
  cn(
    sectionSpacing(preview),
    surface === "dark" ? "section-dark" : "bg-background",
    embedded && surface === "dark" && "-mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-12 lg:px-12",
  );

function MediaFrame({
  src,
  alt,
  caption,
  preview,
  isDark,
  size = "standard",
}: {
  src: string;
  alt: string;
  caption?: string;
  preview: boolean;
  isDark: boolean;
  size?: "standard" | "banner";
}) {
  const frameHeight =
    size === "banner"
      ? preview
        ? "min-h-[12rem]"
        : "min-h-[20rem] sm:min-h-[26rem]"
      : preview
        ? "min-h-[11rem]"
        : "min-h-[20rem] sm:min-h-[26rem]";

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "relative overflow-hidden rounded-md border",
          frameHeight,
          isDark ? "border-dark-border bg-dark-surface" : "border-border bg-muted/30",
        )}
      >
        {src ? (
          <img src={src} alt={alt || ""} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div
            className={cn(
              "flex h-full items-center justify-center px-6 text-center text-sm",
              isDark ? "text-hero-fg/60" : "text-muted-foreground",
            )}
          >
            Add an image to bring this section to life.
          </div>
        )}
      </div>
      {caption ? (
        <p className={cn("text-sm", isDark ? "text-hero-fg/60" : "text-muted-foreground")}>{caption}</p>
      ) : null}
    </div>
  );
}

function SplitMediaSection({
  section,
  preview,
  embedded,
  surface,
}: {
  section: PageSectionDraft<"split_media">;
  preview: boolean;
  embedded: boolean;
  surface: PageSurface;
}) {
  const isDark = surface === "dark";
  const imageFirst = section.content.layout === "text-right";
  const body = section.content.body.filter(Boolean);
  const bullets = section.content.bullets.filter(Boolean);
  const variant = section.content.variant;

  const textColumn = (
    <div className="flex flex-col justify-center">
      {section.eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{section.eyebrow}</p> : null}
      {section.title ? (
        <h2 className={cn("mt-3 font-bold tracking-tight", preview ? "text-xl" : "text-2xl sm:text-4xl", isDark && "text-hero-fg")}>
          {section.title}
        </h2>
      ) : null}
      {section.content.intro ? (
        <p className={cn("mt-4", preview ? "text-sm" : "text-base sm:text-lg", isDark ? "text-hero-fg/75" : "text-muted-foreground")}>
          {section.content.intro}
        </p>
      ) : null}
      {body.length ? (
        <div className={cn("mt-5 space-y-4", isDark ? "text-hero-fg/70" : "text-muted-foreground")}>
          {body.map((paragraph, index) => (
            <p key={`${paragraph}-${index}`} className={preview ? "text-sm leading-relaxed" : "text-base leading-relaxed"}>
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}
      {bullets.length && variant !== "offset" ? (
        <ul className={cn("mt-6 space-y-2", isDark ? "text-hero-fg/75" : "text-foreground")}>
          {bullets.map((bullet, index) => (
            <li key={`${bullet}-${index}`} className="flex items-start gap-3 text-sm sm:text-base">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <ActionButtons
        primaryLabel={section.content.primaryButtonLabel}
        primaryHref={section.content.primaryButtonHref}
        secondaryLabel={section.content.secondaryButtonLabel}
        secondaryHref={section.content.secondaryButtonHref}
        isDark={isDark}
      />
    </div>
  );

  const mediaColumn = (
    <MediaFrame
      src={section.content.imageSrc}
      alt={section.content.imageAlt}
      caption={section.content.imageCaption}
      preview={preview}
      isDark={isDark}
    />
  );

  if (variant === "offset") {
    return (
      <section id={section.section_key} className={sectionClass(preview, embedded, surface)}>
        <div className={containerClass(preview, embedded)}>
          <div className={cn("grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]", !preview && "lg:gap-16")}>
            {imageFirst ? (
              <>
                <div className="relative">
                  <div className={cn("rounded-md border p-2", isDark ? "border-dark-border bg-dark-surface" : "border-border bg-background/80")}>
                    {mediaColumn}
                  </div>
                  {bullets.length ? (
                    <div
                      className={cn(
                        "relative mt-4 rounded-md border p-4 sm:max-w-xs lg:absolute lg:-bottom-8 lg:-left-8",
                        isDark ? "border-dark-border bg-background text-foreground" : "border-border bg-primary text-primary-foreground",
                      )}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">Key takeaways</p>
                      <ul className="mt-3 space-y-2 text-sm">
                        {bullets.slice(0, 3).map((bullet, index) => (
                          <li key={`${bullet}-${index}`} className="flex items-start gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
                <div className="lg:py-8">{textColumn}</div>
              </>
            ) : (
              <>
                <div className="lg:py-8">{textColumn}</div>
                <div className="relative">
                  <div className={cn("rounded-md border p-2", isDark ? "border-dark-border bg-dark-surface" : "border-border bg-background/80")}>
                    {mediaColumn}
                  </div>
                  {bullets.length ? (
                    <div
                      className={cn(
                        "relative mt-4 rounded-md border p-4 sm:max-w-xs lg:absolute lg:-bottom-8 lg:-right-8",
                        isDark ? "border-dark-border bg-background text-foreground" : "border-border bg-primary text-primary-foreground",
                      )}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">Key takeaways</p>
                      <ul className="mt-3 space-y-2 text-sm">
                        {bullets.slice(0, 3).map((bullet, index) => (
                          <li key={`${bullet}-${index}`} className="flex items-start gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "spotlight") {
    return (
      <section id={section.section_key} className={sectionClass(preview, embedded, surface)}>
        <div className={containerClass(preview, embedded)}>
          <div
            className={cn(
              "overflow-hidden rounded-md border",
              isDark ? "border-dark-border bg-dark-surface" : "border-border bg-background",
            )}
          >
            <div className={cn("grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]", imageFirst && "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]")}>
              <div className={cn("p-6 sm:p-8 lg:p-10", isDark ? "bg-dark-surface" : "bg-muted/20")}>{textColumn}</div>
              <div className="p-3 sm:p-4 lg:p-6">
                <MediaFrame
                  src={section.content.imageSrc}
                  alt={section.content.imageAlt}
                  caption={section.content.imageCaption}
                  preview={preview}
                  isDark={isDark}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={section.section_key} className={sectionClass(preview, embedded, surface)}>
      <div
        className={cn(
          containerClass(preview, embedded),
          "grid items-center gap-8 lg:grid-cols-2",
          !preview && "lg:gap-16",
        )}
      >
        {imageFirst ? (
          <>
            {mediaColumn}
            {textColumn}
          </>
        ) : (
          <>
            {textColumn}
            {mediaColumn}
          </>
        )}
      </div>
    </section>
  );
}

function MediaBannerSection({
  section,
  preview,
  embedded,
  surface,
}: {
  section: PageSectionDraft<"media_banner">;
  preview: boolean;
  embedded: boolean;
  surface: PageSurface;
}) {
  const isDark = surface === "dark";
  const variant = section.content.variant;

  if (variant === "spotlight") {
    return (
      <section id={section.section_key} className={sectionClass(preview, embedded, surface)}>
        <div className={containerClass(preview, embedded)}>
          <div className={cn("grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_22rem]", !preview && "lg:gap-6")}>
            <div className="rounded-md border border-border/60 bg-muted/40 p-3">
              <MediaFrame
                src={section.content.imageSrc}
                alt={section.content.imageAlt}
                preview={preview}
                isDark={isDark}
                size="banner"
              />
            </div>
            <div
              className={cn(
                "flex flex-col justify-between rounded-md border p-6 sm:p-8",
                isDark ? "border-dark-border bg-dark-surface" : "border-border bg-background",
              )}
            >
              <div>
                {section.eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{section.eyebrow}</p> : null}
                {section.title ? (
                  <h2 className={cn("mt-3 font-bold tracking-tight", preview ? "text-xl" : "text-2xl sm:text-3xl", isDark && "text-hero-fg")}>
                    {section.title}
                  </h2>
                ) : null}
                {section.content.intro ? (
                  <p className={cn("mt-4", preview ? "text-sm" : "text-base sm:text-lg", isDark ? "text-hero-fg/70" : "text-muted-foreground")}>
                    {section.content.intro}
                  </p>
                ) : null}
              </div>
              <ActionButtons
                primaryLabel={section.content.buttonLabel}
                primaryHref={section.content.buttonHref}
                secondaryLabel={section.content.secondaryButtonLabel}
                secondaryHref={section.content.secondaryButtonHref}
                isDark={isDark}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={section.section_key} className={sectionClass(preview, embedded, surface)}>
      <div className={containerClass(preview, embedded)}>
        <div
          className={cn(
            "relative overflow-hidden rounded-md border",
            preview ? "min-h-[15rem]" : "min-h-[24rem] sm:min-h-[30rem]",
            isDark ? "border-dark-border bg-dark-surface" : "border-border bg-muted/40",
          )}
        >
          {section.content.imageSrc ? (
            <img src={section.content.imageSrc} alt={section.content.imageAlt || ""} className="absolute inset-0 h-full w-full object-cover" />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/25" />
          <div className="relative z-10 flex h-full max-w-3xl flex-col justify-end p-6 sm:p-8 lg:p-12">
            {section.eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{section.eyebrow}</p> : null}
            {section.title ? (
              <h2 className={cn("mt-3 font-bold tracking-tight text-white", preview ? "text-xl" : "text-2xl sm:text-4xl")}>
                {section.title}
              </h2>
            ) : null}
            {section.content.intro ? (
              <p className={cn("mt-4 text-white/80", preview ? "text-sm" : "text-base sm:text-lg")}>{section.content.intro}</p>
            ) : null}
            {section.content.buttonLabel || section.content.secondaryButtonLabel ? (
              <div className="mt-6 flex flex-wrap gap-3">
                {section.content.buttonLabel && section.content.buttonHref ? (
                  <ActionLink
                    href={section.content.buttonHref}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    {section.content.buttonLabel} <ArrowRight className="h-4 w-4" />
                  </ActionLink>
                ) : null}
                {section.content.secondaryButtonLabel && section.content.secondaryButtonHref ? (
                  <ActionLink
                    href={section.content.secondaryButtonHref}
                    className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    {section.content.secondaryButtonLabel}
                  </ActionLink>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialShowcaseSection({
  section,
  preview,
  embedded,
  surface,
}: {
  section: PageSectionDraft<"testimonial_showcase">;
  preview: boolean;
  embedded: boolean;
  surface: PageSurface;
}) {
  const isDark = surface === "dark";
  const items = section.content.items.filter((item) => item.quote || item.name || item.company);
  const variant = section.content.variant;

  if (items.length === 0) return null;

  if (variant === "spotlight") {
    const lead = items[0];
    const supporting = items.slice(1);

    return (
      <section id={section.section_key} className={sectionClass(preview, embedded, surface)}>
        <div className={containerClass(preview, embedded)}>
          <div className={cn("grid gap-6", !preview && "lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8")}>
            <div
              className={cn(
                "rounded-md border p-6 sm:p-8 lg:p-10",
                isDark ? "border-dark-border bg-dark-surface" : "border-border bg-background",
              )}
            >
              {section.eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{section.eyebrow}</p> : null}
              {section.title ? (
                <h2 className={cn("mt-3 font-bold tracking-tight", preview ? "text-xl" : "text-2xl sm:text-4xl", isDark && "text-hero-fg")}>
                  {section.title}
                </h2>
              ) : null}
              {section.content.intro ? (
                <p className={cn("mt-4", preview ? "text-sm" : "text-base sm:text-lg", isDark ? "text-hero-fg/70" : "text-muted-foreground")}>
                  {section.content.intro}
                </p>
              ) : null}
              <p className={cn("mt-8 leading-relaxed", preview ? "text-base" : "text-xl sm:text-2xl", isDark ? "text-hero-fg" : "text-foreground")}>
                &ldquo;{lead.quote}&rdquo;
              </p>
              <div className="mt-6">
                <p className={cn("text-sm font-semibold", isDark && "text-hero-fg")}>{lead.name}</p>
                <p className={cn("mt-1 text-sm", isDark ? "text-hero-fg/60" : "text-muted-foreground")}>
                  {[lead.role, lead.company].filter(Boolean).join(", ")}
                </p>
              </div>
              {lead.linkLabel && lead.linkHref ? (
                <ActionLink
                  href={lead.linkHref}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  {lead.linkLabel} <ArrowRight className="h-4 w-4" />
                </ActionLink>
              ) : null}
            </div>
            <div className="grid gap-4">
              {supporting.map((item, index) => (
                <div
                  key={`${item.name}-${item.company}-${index}`}
                  className={cn(
                    "rounded-md border p-5 sm:p-6",
                    isDark ? "border-dark-border bg-dark-surface" : "border-border bg-background",
                  )}
                >
                  <p className={cn("text-sm leading-relaxed", isDark ? "text-hero-fg/80" : "text-foreground")}>&ldquo;{item.quote}&rdquo;</p>
                  <div className="mt-4">
                    <p className={cn("text-sm font-semibold", isDark && "text-hero-fg")}>{item.name}</p>
                    <p className={cn("mt-1 text-sm", isDark ? "text-hero-fg/60" : "text-muted-foreground")}>
                      {[item.role, item.company].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
              ))}
              {section.content.primaryButtonLabel && section.content.primaryButtonHref ? (
                <ActionLink
                  href={section.content.primaryButtonHref}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {section.content.primaryButtonLabel} <ArrowRight className="h-4 w-4" />
                </ActionLink>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={section.section_key} className={sectionClass(preview, embedded, surface)}>
      <div className={containerClass(preview, embedded)}>
        <div className={preview ? "max-w-full" : "mx-auto max-w-3xl text-center"}>
          {section.eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{section.eyebrow}</p> : null}
          {section.title ? (
            <h2 className={cn("mt-3 font-bold tracking-tight", preview ? "text-xl" : "text-2xl sm:text-4xl", isDark && "text-hero-fg")}>
              {section.title}
            </h2>
          ) : null}
          {section.content.intro ? (
            <p className={cn("mt-4", preview ? "text-sm" : "text-base sm:text-lg", isDark ? "text-hero-fg/70" : "text-muted-foreground")}>
              {section.content.intro}
            </p>
          ) : null}
        </div>
        <div className={cn("mt-8 grid gap-4", preview ? "" : "lg:grid-cols-3 sm:grid-cols-2 sm:gap-6")}>
          {items.map((item, index) => (
            <div
              key={`${item.name}-${item.company}-${index}`}
              className={cn(
                "flex h-full flex-col rounded-md border p-5 sm:p-6",
                index === 0 && !preview && "sm:col-span-2 lg:row-span-2 lg:min-h-[24rem]",
                isDark ? "border-dark-border bg-dark-surface" : "border-border bg-background",
              )}
            >
              <p className={cn(index === 0 && !preview ? "text-base sm:text-lg" : "text-sm", "leading-relaxed", isDark ? "text-hero-fg/80" : "text-foreground")}>&ldquo;{item.quote}&rdquo;</p>
              <div className="mt-5">
                <p className={cn("text-sm font-semibold", isDark && "text-hero-fg")}>{item.name}</p>
                <p className={cn("mt-1 text-sm", isDark ? "text-hero-fg/60" : "text-muted-foreground")}>
                  {[item.role, item.company].filter(Boolean).join(", ")}
                </p>
              </div>
              {item.linkLabel && item.linkHref ? (
                <ActionLink
                  href={item.linkHref}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  {item.linkLabel} <ArrowRight className="h-4 w-4" />
                </ActionLink>
              ) : null}
            </div>
          ))}
        </div>
        {section.content.primaryButtonLabel && section.content.primaryButtonHref ? (
          <div className={cn("mt-8", !preview && "text-center")}>
            <ActionLink
              href={section.content.primaryButtonHref}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {section.content.primaryButtonLabel} <ArrowRight className="h-4 w-4" />
            </ActionLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function FaqSection({
  section,
  preview,
  embedded,
  surface,
}: {
  section: PageSectionDraft<"faq_section">;
  preview: boolean;
  embedded: boolean;
  surface: PageSurface;
}) {
  const isDark = surface === "dark";
  const items = section.content.items.filter((item) => item.question || item.answer);
  const [openIndex, setOpenIndex] = useState(() => (items.length > 0 ? 0 : -1));
  const variant = section.content.variant;

  const faqItems = (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = index === openIndex;
        return (
          <div
            key={`${item.question}-${index}`}
            className={cn(
              "overflow-hidden rounded-md border",
              isDark ? "border-dark-border bg-dark-surface" : "border-border bg-background",
            )}
          >
            <button
              type="button"
              onClick={() => setOpenIndex((current) => (current === index ? -1 : index))}
              className={cn(
                "flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors sm:px-6",
                isDark ? "hover:bg-hero-fg/5" : "hover:bg-muted/40",
              )}
            >
              <span className={cn("text-sm font-semibold sm:text-base", isDark && "text-hero-fg")}>{item.question || "Question"}</span>
              <span className={cn("text-xs font-semibold uppercase tracking-wide", isDark ? "text-hero-fg/60" : "text-muted-foreground")}>
                {isOpen ? "Hide" : "Open"}
              </span>
            </button>
            {isOpen ? (
              <div className="border-t border-inherit px-5 py-4 sm:px-6">
                <p className={cn("text-sm leading-relaxed", isDark ? "text-hero-fg/75" : "text-muted-foreground")}>{item.answer}</p>
                {item.linkLabel && item.linkHref ? (
                  <ActionLink
                    href={item.linkHref}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    {item.linkLabel} <ArrowRight className="h-4 w-4" />
                  </ActionLink>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );

  if (variant === "split") {
    return (
      <section id={section.section_key} className={sectionClass(preview, embedded, surface)}>
        <div className={cn(containerClass(preview, embedded), "grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12")}>
          <div
            className={cn(
              "rounded-md border p-6 sm:p-8",
              isDark ? "border-dark-border bg-dark-surface" : "border-border bg-background",
            )}
          >
            {section.eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{section.eyebrow}</p> : null}
            {section.title ? (
              <h2 className={cn("mt-3 font-bold tracking-tight", preview ? "text-xl" : "text-2xl sm:text-4xl", isDark && "text-hero-fg")}>
                {section.title}
              </h2>
            ) : null}
            {section.content.intro ? (
              <p className={cn("mt-4", preview ? "text-sm" : "text-base sm:text-lg", isDark ? "text-hero-fg/70" : "text-muted-foreground")}>
                {section.content.intro}
              </p>
            ) : null}
            <ActionButtons
              primaryLabel={section.content.primaryButtonLabel}
              primaryHref={section.content.primaryButtonHref}
              secondaryLabel={section.content.secondaryButtonLabel}
              secondaryHref={section.content.secondaryButtonHref}
              isDark={isDark}
            />
          </div>
          <div>{faqItems}</div>
        </div>
      </section>
    );
  }

  return (
    <section id={section.section_key} className={sectionClass(preview, embedded, surface)}>
      <div className={containerClass(preview, embedded)}>
        <div className={preview ? "max-w-full" : "max-w-3xl"}>
          {section.eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{section.eyebrow}</p> : null}
          {section.title ? (
            <h2 className={cn("mt-3 font-bold tracking-tight", preview ? "text-xl" : "text-2xl sm:text-4xl", isDark && "text-hero-fg")}>
              {section.title}
            </h2>
          ) : null}
          {section.content.intro ? (
            <p className={cn("mt-4", preview ? "text-sm" : "text-base sm:text-lg", isDark ? "text-hero-fg/70" : "text-muted-foreground")}>
              {section.content.intro}
            </p>
          ) : null}
        </div>
        <div className="mt-8">{faqItems}</div>
        <ActionButtons
          primaryLabel={section.content.primaryButtonLabel}
          primaryHref={section.content.primaryButtonHref}
          secondaryLabel={section.content.secondaryButtonLabel}
          secondaryHref={section.content.secondaryButtonHref}
          isDark={isDark}
        />
      </div>
    </section>
  );
}

function IconCardsSection({
  section,
  preview,
  embedded,
  surface,
}: {
  section: PageSectionDraft<"icon_cards">;
  preview: boolean;
  embedded: boolean;
  surface: PageSurface;
}) {
  const items = section.content.items.filter((item) => item.title || item.description);
  const isDark = surface === "dark";
  const variant = section.content.variant;

  return (
    <section id={section.section_key} className={sectionClass(preview, embedded, surface)}>
      <div className={containerClass(preview, embedded)}>
        <div className={preview ? "max-w-full" : "max-w-3xl"}>
          {section.eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{section.eyebrow}</p> : null}
          {section.content.headline ? (
            <h2 className={cn("mt-3 font-bold tracking-tight", preview ? "text-xl" : "text-2xl sm:text-4xl", isDark && "text-hero-fg")}>
              {section.content.headline}
            </h2>
          ) : null}
          {section.content.intro ? (
            <p className={cn("mt-4", preview ? "text-sm" : "text-base sm:text-lg", isDark ? "text-hero-fg/70" : "text-muted-foreground")}>
              {section.content.intro}
            </p>
          ) : null}
        </div>
        <div className={cn("mt-8 grid gap-4", preview ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4 sm:gap-6")}>
          {items.map((item, index) => {
            const Icon = getIconByName(item.iconName);
            return (
              <div
                key={`${item.title}-${index}`}
                className={cn("rounded-md border p-5 sm:p-6", isDark ? "border-dark-border bg-dark-surface" : "border-border bg-background")}
              >
                <Icon className="mb-3 h-6 w-6 text-primary sm:mb-4 sm:h-7 sm:w-7" />
                <h3 className={cn("text-base font-semibold sm:text-lg", isDark && "text-hero-fg")}>{item.title}</h3>
                <p className={cn("mt-3 text-sm leading-relaxed", isDark ? "text-hero-fg/70" : "text-muted-foreground")}>{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RichTextSection({
  section,
  preview,
  embedded,
  surface,
}: {
  section: PageSectionDraft<"rich_text">;
  preview: boolean;
  embedded: boolean;
  surface: PageSurface;
}) {
  const isDark = surface === "dark";

  return (
    <section id={section.section_key} className={sectionClass(preview, embedded, surface)}>
      <div className={`${containerClass(preview, embedded)} grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-16`}>
        <div>
          {section.eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{section.eyebrow}</p> : null}
          {section.title ? (
            <h2 className={cn("mt-3 font-bold tracking-tight", preview ? "text-xl" : "text-2xl sm:text-4xl", isDark && "text-hero-fg")}>
              {section.title}
            </h2>
          ) : null}
        </div>
        <div className={cn("space-y-4", isDark ? "text-hero-fg/70" : "text-muted-foreground")}>
          {section.content.body.filter(Boolean).map((paragraph, index) => (
            <p key={`${paragraph}-${index}`} className={preview ? "text-sm leading-relaxed" : "text-base leading-relaxed sm:text-lg"}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function CardGridSection({
  section,
  preview,
  embedded,
  surface,
}: {
  section: PageSectionDraft<"card_grid">;
  preview: boolean;
  embedded: boolean;
  surface: PageSurface;
}) {
  const items = section.content.items.filter((item) => item.title || item.description);
  const isDark = surface === "dark";

  return (
    <section id={section.section_key} className={sectionClass(preview, embedded, surface)}>
      <div className={containerClass(preview, embedded)}>
        <div className={preview ? "max-w-full" : "max-w-3xl"}>
          {section.eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{section.eyebrow}</p> : null}
          {section.title ? (
            <h2 className={cn("mt-3 font-bold tracking-tight", preview ? "text-xl" : "text-2xl sm:text-4xl", isDark && "text-hero-fg")}>
              {section.title}
            </h2>
          ) : null}
          {section.content.intro ? (
            <p className={cn("mt-4", preview ? "text-sm" : "text-base sm:text-lg", isDark ? "text-hero-fg/70" : "text-muted-foreground")}>
              {section.content.intro}
            </p>
          ) : null}
        </div>
        <div
          className={cn(
            "mt-8 grid auto-rows-fr gap-4",
            preview ? "sm:grid-cols-2" : variant === "staggered" ? "sm:grid-cols-2 xl:grid-cols-3 sm:gap-6" : "sm:grid-cols-2 xl:grid-cols-3 sm:gap-6",
          )}
        >
          {items.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className={cn(
                "flex h-full flex-col rounded-md border p-5 sm:p-6",
                variant === "staggered" && !preview && index === 0 && "sm:col-span-2 xl:col-span-2 xl:min-h-[24rem] xl:justify-end",
                isDark ? "border-dark-border bg-dark-surface" : "border-border bg-background",
              )}
            >
              {item.eyebrow ? <p className="text-xs font-semibold uppercase tracking-wide text-primary">{item.eyebrow}</p> : null}
              <h3 className={cn("mt-2 font-semibold", index === 0 && variant === "staggered" && !preview ? "text-xl sm:text-2xl" : "text-base sm:text-lg", isDark && "text-hero-fg")}>
                {item.title}
              </h3>
              <p className={cn("mt-3 leading-relaxed", index === 0 && variant === "staggered" && !preview ? "text-base" : "text-sm", isDark ? "text-hero-fg/70" : "text-muted-foreground")}>
                {item.description}
              </p>
              {item.linkLabel && item.linkHref ? (
                <ActionLink
                  href={item.linkHref}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  {item.linkLabel} <ArrowRight className="h-4 w-4" />
                </ActionLink>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineSection({
  section,
  preview,
  embedded,
  surface,
}: {
  section: PageSectionDraft<"timeline">;
  preview: boolean;
  embedded: boolean;
  surface: PageSurface;
}) {
  const items = section.content.items.filter((item) => item.year || item.title || item.description);
  const isDark = surface === "dark";

  return (
    <section id={section.section_key} className={sectionClass(preview, embedded, surface)}>
      <div className={containerClass(preview, embedded)}>
        <div className={preview ? "max-w-full" : "max-w-3xl"}>
          {section.eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{section.eyebrow}</p> : null}
          {section.title ? (
            <h2 className={cn("mt-3 font-bold tracking-tight", preview ? "text-xl" : "text-2xl sm:text-4xl", isDark && "text-hero-fg")}>
              {section.title}
            </h2>
          ) : null}
          {section.content.intro ? (
            <p className={cn("mt-4", preview ? "text-sm" : "text-base sm:text-lg", isDark ? "text-hero-fg/70" : "text-muted-foreground")}>
              {section.content.intro}
            </p>
          ) : null}
        </div>
        <div className={`mt-8 grid gap-4 ${preview ? "" : "lg:grid-cols-2 sm:gap-6"}`}>
          {items.map((item, index) => (
            <div
              key={`${item.year}-${item.title}-${index}`}
              className={cn("rounded-md border p-5 sm:p-6", isDark ? "border-dark-border bg-dark-surface" : "border-border bg-background")}
            >
              {item.year ? <p className={`font-bold text-primary ${preview ? "text-2xl" : "text-3xl sm:text-4xl"}`}>{item.year}</p> : null}
              {item.title ? <h3 className={cn("mt-3 text-base font-semibold sm:text-lg", isDark && "text-hero-fg")}>{item.title}</h3> : null}
              {item.description ? <p className={cn("mt-3 text-sm leading-relaxed", isDark ? "text-hero-fg/70" : "text-muted-foreground")}>{item.description}</p> : null}
              {item.highlights.filter(Boolean).length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.highlights.filter(Boolean).map((highlight) => (
                    <span
                      key={highlight}
                      className={cn(
                        "rounded-md border px-3 py-1.5 text-xs",
                        isDark ? "border-dark-border text-hero-fg/70" : "border-border text-muted-foreground",
                      )}
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection({
  section,
  preview,
  embedded,
  surface,
}: {
  section: PageSectionDraft<"stats">;
  preview: boolean;
  embedded: boolean;
  surface: PageSurface;
}) {
  const items = section.content.items.filter((item) => item.value || item.label);
  const isDark = surface === "dark";

  return (
    <section id={section.section_key} className={sectionClass(preview, embedded, surface)}>
      <div className={containerClass(preview, embedded)}>
        <div className={preview ? "max-w-full" : "max-w-3xl"}>
          {section.eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{section.eyebrow}</p> : null}
          {section.title ? (
            <h2 className={cn("mt-3 font-bold tracking-tight", preview ? "text-xl" : "text-2xl sm:text-4xl", isDark && "text-hero-fg")}>
              {section.title}
            </h2>
          ) : null}
          {section.content.intro ? (
            <p className={cn("mt-4", preview ? "text-sm" : "text-base sm:text-lg", isDark ? "text-hero-fg/70" : "text-muted-foreground")}>
              {section.content.intro}
            </p>
          ) : null}
        </div>
        <div className={`mt-8 grid gap-4 ${preview ? "grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4 sm:gap-6"}`}>
          {items.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className={cn("rounded-md border p-5 sm:p-6", isDark ? "border-dark-border bg-dark-surface" : "border-border bg-background")}
            >
              <p className={`font-bold tracking-tight text-primary ${preview ? "text-2xl" : "text-3xl sm:text-4xl"}`}>{item.value || "0"}</p>
              <p className={cn("mt-2 text-sm", isDark ? "text-hero-fg/70" : "text-muted-foreground")}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection({
  section,
  preview,
  embedded,
  surface,
}: {
  section: PageSectionDraft<"cta">;
  preview: boolean;
  embedded: boolean;
  surface: PageSurface;
}) {
  const isDark = surface === "dark";
  const variant = section.content.variant;

  if (variant === "split") {
    return (
      <section id={section.section_key} className={sectionClass(preview, embedded, surface)}>
        <div className={containerClass(preview, embedded)}>
          <div className={cn("grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]", !preview && "lg:gap-6")}>
            <div
              className={cn(
                "rounded-md border p-6 sm:p-8 lg:p-10",
                isDark ? "border-dark-border bg-dark-surface" : "border-border bg-background",
              )}
            >
              {section.eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{section.eyebrow}</p> : null}
              {section.title ? (
                <h2 className={cn("mt-3 font-bold tracking-tight", preview ? "text-xl" : "text-2xl sm:text-4xl", isDark && "text-hero-fg")}>
                  {section.title}
                </h2>
              ) : null}
              {section.content.intro ? (
                <p className={cn("mt-4", preview ? "text-sm" : "text-base sm:text-lg", isDark ? "text-hero-fg/70" : "text-muted-foreground")}>
                  {section.content.intro}
                </p>
              ) : null}
            </div>
            <div
              className={cn(
                "flex flex-col justify-center rounded-md border p-6 sm:p-8",
                isDark ? "border-dark-border bg-background text-foreground" : "border-border bg-primary text-primary-foreground",
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">Take action</p>
              <p className="mt-3 text-sm leading-relaxed opacity-90">
                Use this tighter panel when you want the page to close with a more deliberate next step.
              </p>
              <ActionButtons
                primaryLabel={section.content.buttonLabel}
                primaryHref={section.content.buttonHref}
                secondaryLabel={section.content.secondaryButtonLabel}
                secondaryHref={section.content.secondaryButtonHref}
                isDark={isDark}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={section.section_key} className={sectionClass(preview, embedded, surface)}>
      <div className={containerClass(preview, embedded)}>
        <div className={cn("rounded-md border p-6 text-center sm:p-8 lg:p-12", isDark ? "border-dark-border bg-dark-surface" : "border-border bg-background")}>
          {section.eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{section.eyebrow}</p> : null}
          {section.title ? (
            <h2 className={cn("mt-3 font-bold tracking-tight", preview ? "text-xl" : "text-2xl sm:text-4xl", isDark && "text-hero-fg")}>
              {section.title}
            </h2>
          ) : null}
          {section.content.intro ? (
            <p className={cn("mx-auto mt-4 max-w-2xl", preview ? "text-sm" : "text-base sm:text-lg", isDark ? "text-hero-fg/70" : "text-muted-foreground")}>
              {section.content.intro}
            </p>
          ) : null}
          <ActionButtons
            primaryLabel={section.content.buttonLabel}
            primaryHref={section.content.buttonHref}
            secondaryLabel={section.content.secondaryButtonLabel}
            secondaryHref={section.content.secondaryButtonHref}
            isDark={isDark}
            align="center"
          />
        </div>
      </div>
    </section>
  );
}

export function PageSectionsRenderer({
  sections,
  preview = false,
  embedded = false,
  surfaceMap,
}: {
  sections: PageSectionDraft[];
  preview?: boolean;
  embedded?: boolean;
  surfaceMap?: Record<string, PageSurface>;
}) {
  if (sections.length === 0) return null;

  return (
    <div>
      {sections.map((section) => {
        const key = section.id || section.section_key;
        const surface = surfaceMap?.[key] || "light";
        const sectionNode =
          section.section_type === "about_split" ? (
            <AboutSection key={key} sectionId={section.section_key} content={section.content} surface={surface} embedded={embedded} />
          ) : section.section_type === "services_grid" ? (
            <ExpertiseSection
              key={key}
              sectionId={section.section_key}
              introContent={{ headline: section.content.headline, intro: section.content.intro }}
              servicesData={section.content.items}
              surface={surface}
              embedded={embedded}
            />
          ) : section.section_type === "milestones_spotlight" ? (
            <MilestonesSection
              key={key}
              sectionId={section.section_key}
              headline={section.content.headline}
              intro={section.content.intro}
              items={section.content.items}
              surface={surface}
              embedded={embedded}
            />
          ) : section.section_type === "contact_cta" ? (
            <ContactSection
              key={key}
              sectionId={section.section_key}
              ctaContent={section.content}
              contactContent={section.content.contact}
              surface={surface}
              embedded={embedded}
            />
          ) : section.section_type === "icon_cards" ? (
            <IconCardsSection key={key} section={section} preview={preview} embedded={embedded} surface={surface} />
          ) : section.section_type === "split_media" ? (
            <SplitMediaSection key={key} section={section} preview={preview} embedded={embedded} surface={surface} />
          ) : section.section_type === "media_banner" ? (
            <MediaBannerSection key={key} section={section} preview={preview} embedded={embedded} surface={surface} />
          ) : section.section_type === "testimonial_showcase" ? (
            <TestimonialShowcaseSection key={key} section={section} preview={preview} embedded={embedded} surface={surface} />
          ) : section.section_type === "faq_section" ? (
            <FaqSection key={key} section={section} preview={preview} embedded={embedded} surface={surface} />
          ) : section.section_type === "card_grid" ? (
            <CardGridSection key={key} section={section} preview={preview} embedded={embedded} surface={surface} />
          ) : section.section_type === "timeline" ? (
            <TimelineSection key={key} section={section} preview={preview} embedded={embedded} surface={surface} />
          ) : section.section_type === "stats" ? (
            <StatsSection key={key} section={section} preview={preview} embedded={embedded} surface={surface} />
          ) : section.section_type === "cta" ? (
            <CtaSection key={key} section={section} preview={preview} embedded={embedded} surface={surface} />
          ) : (
            <RichTextSection key={key} section={section} preview={preview} embedded={embedded} surface={surface} />
          );

        return section.is_published || !preview ? (
          sectionNode
        ) : (
          <div key={key} className="opacity-50">
            {sectionNode}
          </div>
        );
      })}
    </div>
  );
}
