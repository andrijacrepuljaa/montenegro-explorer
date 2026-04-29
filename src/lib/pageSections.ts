import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import {
  defaultCareersPage,
  defaultCompanyContact,
  defaultExpertiseIntro,
  defaultHomeAbout,
  defaultHomeContactCta,
  defaultInternshipsPage,
  extractInternshipsPageContent,
  fetchSiteContent,
  fetchSiteContentWithLegacy,
  type CompanyContactContent,
  type HomeAboutContent,
  type IconContentItem,
  type SectionIntroContent,
  type StatItem,
} from "@/lib/cms";

export type PageSurface = "light" | "dark";

export const managedPages = [
  {
    slug: "home",
    label: "Homepage",
    path: "/",
    description: "Control the homepage sections, their visibility, and any extra flexible content blocks.",
    placements: [
      { value: "after-hero", label: "After Hero", defaultSurface: "light" as const, afterSectionId: "hero" },
      { value: "after-about", label: "After About", defaultSurface: "dark" as const, afterSectionId: "about" },
      { value: "after-expertise", label: "After Expertise", defaultSurface: "light" as const, afterSectionId: "expertise" },
      { value: "after-milestones", label: "After Milestones", defaultSurface: "dark" as const, afterSectionId: "milestones" },
      { value: "before-contact-cta", label: "Before Contact CTA", defaultSurface: "dark" as const, afterSectionId: "milestones" },
    ],
    builtInSections: [
      { id: "hero", label: "Hero", anchor: "hero", defaultVisible: true, defaultHeader: false, defaultFooter: false, surface: "dark" as const, pattern: "Immersive hero with stats" },
      { id: "about", label: "About", anchor: "about", defaultVisible: true, defaultHeader: true, defaultFooter: true, surface: "light" as const, pattern: "Split content with value cards", templateId: "home-about" },
      { id: "expertise", label: "Expertise", anchor: "expertise", defaultVisible: true, defaultHeader: true, defaultFooter: true, surface: "dark" as const, pattern: "Full-width services grid", templateId: "home-expertise" },
      { id: "milestones", label: "Milestones", anchor: "milestones", defaultVisible: true, defaultHeader: true, defaultFooter: true, surface: "light" as const, pattern: "Interactive timeline spotlight", templateId: "home-milestones" },
      { id: "contact", label: "Contact", anchor: "contact", defaultVisible: true, defaultHeader: false, defaultFooter: false, surface: "light" as const, pattern: "Centered CTA with contact cards", templateId: "home-contact" },
    ],
  },
  {
    slug: "careers",
    label: "Careers",
    path: "/careers",
    description: "Control the careers page blocks and add flexible sections between them.",
    placements: [
      { value: "after-hero", label: "After Hero", defaultSurface: "dark" as const, afterSectionId: "hero" },
      { value: "after-perks", label: "After Perks", defaultSurface: "dark" as const, afterSectionId: "perks" },
      { value: "after-openings", label: "After Openings", defaultSurface: "dark" as const, afterSectionId: "openings" },
      { value: "before-final-cta", label: "Before Final CTA", defaultSurface: "dark" as const, afterSectionId: "openings" },
    ],
    builtInSections: [
      { id: "hero", label: "Hero", anchor: "careers-hero", defaultVisible: true, defaultHeader: false, defaultFooter: false, surface: "light" as const, fixedSurface: "light" as const, pattern: "Page intro with side cross-link" },
      { id: "perks", label: "Why KGC", anchor: "career-perks", defaultVisible: true, defaultHeader: false, defaultFooter: false, surface: "light" as const, fixedSurface: "light" as const, pattern: "Icon card grid", templateId: "careers-perks" },
      { id: "openings", label: "Open Positions", anchor: "career-openings", defaultVisible: true, defaultHeader: false, defaultFooter: false, surface: "light" as const, fixedSurface: "light" as const, pattern: "Opportunity listing stack" },
      { id: "talent-pool", label: "Talent Pool CTA", anchor: "career-talent-pool", defaultVisible: true, defaultHeader: false, defaultFooter: false, surface: "light" as const, fixedSurface: "light" as const, pattern: "Centered CTA", templateId: "careers-talent-pool" },
    ],
  },
  {
    slug: "internships",
    label: "Internships",
    path: "/internships",
    description: "Control the internships page blocks and add flexible sections where they make sense.",
    placements: [
      { value: "after-hero", label: "After Hero", defaultSurface: "dark" as const, afterSectionId: "hero" },
      { value: "after-programme", label: "After Programme", defaultSurface: "dark" as const, afterSectionId: "programme" },
      { value: "after-openings", label: "After Openings", defaultSurface: "dark" as const, afterSectionId: "openings" },
      { value: "before-final-cta", label: "Before Final CTA", defaultSurface: "dark" as const, afterSectionId: "openings" },
    ],
    builtInSections: [
      { id: "hero", label: "Hero", anchor: "internships-hero", defaultVisible: true, defaultHeader: false, defaultFooter: false, surface: "light" as const, pattern: "Page intro with side cross-link" },
      { id: "programme", label: "Programme & Perks", anchor: "internship-programme", defaultVisible: true, defaultHeader: false, defaultFooter: false, surface: "light" as const, pattern: "Split overview with perks grid", templateId: "internships-perks" },
      { id: "openings", label: "Open Internships", anchor: "internship-openings", defaultVisible: true, defaultHeader: false, defaultFooter: false, surface: "light" as const, pattern: "Opportunity listing stack" },
      { id: "application-cta", label: "Application CTA", anchor: "internship-application-cta", defaultVisible: true, defaultHeader: false, defaultFooter: false, surface: "light" as const, pattern: "Centered CTA", templateId: "internships-application-cta" },
    ],
  },
  {
    slug: "contact",
    label: "Contact",
    path: "/contact",
    description: "Control the contact page intro and form block, then add more sections underneath if needed.",
    placements: [
      { value: "after-intro", label: "After Intro", defaultSurface: "dark" as const, afterSectionId: "intro" },
      { value: "after-contact-content", label: "After Contact Content", defaultSurface: "dark" as const, afterSectionId: "contact-content" },
    ],
    builtInSections: [
      { id: "intro", label: "Page Intro", anchor: "contact-intro", defaultVisible: true, defaultHeader: false, defaultFooter: false, surface: "light" as const, pattern: "Simple page intro" },
      { id: "contact-content", label: "Contact Form & Info", anchor: "contact-content", defaultVisible: true, defaultHeader: false, defaultFooter: false, surface: "light" as const, fixedSurface: "light" as const, pattern: "Contact info and form grid" },
    ],
  },
] as const;

export type ManagedPageSlug = (typeof managedPages)[number]["slug"];
export type PagePlacement = (typeof managedPages)[number]["placements"][number]["value"];
export type BuiltInSectionDefinition = (typeof managedPages)[number]["builtInSections"][number];

export type StructureSectionSettings = {
  id: string;
  label: string;
  anchor: string;
  visible: boolean;
  showInHeader: boolean;
  showInFooter: boolean;
  navLabel: string;
};

export type PageStructureContent = {
  sections: StructureSectionSettings[];
};

export const pageSectionTypes = [
  "rich_text",
  "card_grid",
  "timeline",
  "stats",
  "cta",
  "split_media",
  "media_banner",
  "testimonial_showcase",
  "faq_section",
  "about_split",
  "icon_cards",
  "services_grid",
  "milestones_spotlight",
  "contact_cta",
] as const;

export type PageSectionType = (typeof pageSectionTypes)[number];

export type CardGridItem = {
  eyebrow: string;
  title: string;
  description: string;
  linkLabel: string;
  linkHref: string;
};

export type TimelineItem = {
  year: string;
  title: string;
  description: string;
  highlights: string[];
};

export type TemplateServiceItem = {
  iconName: string;
  title: string;
  short: string;
  detail: string;
  benefits: string[];
  category: string;
};

export type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
  company: string;
  linkLabel: string;
  linkHref: string;
};

export type FaqItem = {
  question: string;
  answer: string;
  linkLabel: string;
  linkHref: string;
};

export type PageSectionRichTextContent = {
  body: string[];
};

export type PageSectionCardGridVariant = "feature" | "staggered";
export type PageSectionCardGridContent = {
  variant: PageSectionCardGridVariant;
  intro: string;
  items: CardGridItem[];
};

export type PageSectionTimelineContent = {
  intro: string;
  items: TimelineItem[];
};

export type PageSectionStatsContent = {
  intro: string;
  items: StatItem[];
};

export type PageSectionCtaContent = {
  variant: "centered" | "split";
  intro: string;
  buttonLabel: string;
  buttonHref: string;
  secondaryButtonLabel: string;
  secondaryButtonHref: string;
};

export type PageSectionSplitMediaVariant = "editorial" | "offset" | "spotlight";
export type PageSectionSplitMediaContent = {
  variant: PageSectionSplitMediaVariant;
  layout: "text-left" | "text-right";
  intro: string;
  body: string[];
  bullets: string[];
  primaryButtonLabel: string;
  primaryButtonHref: string;
  secondaryButtonLabel: string;
  secondaryButtonHref: string;
  imageSrc: string;
  imageAlt: string;
  imageCaption: string;
};

export type PageSectionMediaBannerVariant = "immersive" | "spotlight";
export type PageSectionMediaBannerContent = {
  variant: PageSectionMediaBannerVariant;
  intro: string;
  imageSrc: string;
  imageAlt: string;
  buttonLabel: string;
  buttonHref: string;
  secondaryButtonLabel: string;
  secondaryButtonHref: string;
};

export type PageSectionTestimonialVariant = "spotlight" | "mosaic";
export type PageSectionTestimonialShowcaseContent = {
  variant: PageSectionTestimonialVariant;
  intro: string;
  items: TestimonialItem[];
  primaryButtonLabel: string;
  primaryButtonHref: string;
};

export type PageSectionFaqVariant = "split" | "stacked";
export type PageSectionFaqContent = {
  variant: PageSectionFaqVariant;
  intro: string;
  items: FaqItem[];
  primaryButtonLabel: string;
  primaryButtonHref: string;
  secondaryButtonLabel: string;
  secondaryButtonHref: string;
};

export type PageSectionAboutSplitContent = HomeAboutContent;

export type PageSectionIconCardsContent = {
  headline: string;
  intro: string;
  items: IconContentItem[];
};

export type PageSectionServicesGridContent = {
  headline: string;
  intro: string;
  items: TemplateServiceItem[];
};

export type PageSectionMilestonesSpotlightContent = {
  headline: string;
  intro: string;
  items: TimelineItem[];
};

export type PageSectionContactCtaContent = {
  eyebrow: string;
  headline: string;
  intro: string;
  buttonLabel: string;
  buttonHref: string;
  contact: CompanyContactContent;
};

export type PageSectionContentMap = {
  rich_text: PageSectionRichTextContent;
  card_grid: PageSectionCardGridContent;
  timeline: PageSectionTimelineContent;
  stats: PageSectionStatsContent;
  cta: PageSectionCtaContent;
  split_media: PageSectionSplitMediaContent;
  media_banner: PageSectionMediaBannerContent;
  testimonial_showcase: PageSectionTestimonialShowcaseContent;
  faq_section: PageSectionFaqContent;
  about_split: PageSectionAboutSplitContent;
  icon_cards: PageSectionIconCardsContent;
  services_grid: PageSectionServicesGridContent;
  milestones_spotlight: PageSectionMilestonesSpotlightContent;
  contact_cta: PageSectionContactCtaContent;
};

type SectionMeta = {
  placement: string;
  navLabel: string;
  showInHeader: boolean;
  showInFooter: boolean;
};

type StorableSectionContent<T extends PageSectionType = PageSectionType> = PageSectionContentMap[T] & {
  __meta?: Partial<SectionMeta>;
};

export type PageSectionDraft<T extends PageSectionType = PageSectionType> = {
  id?: string;
  page_slug: ManagedPageSlug | string;
  section_key: string;
  section_type: T;
  title: string;
  eyebrow: string;
  sort_order: number;
  is_published: boolean;
  placement: string;
  nav_label: string;
  show_in_header: boolean;
  show_in_footer: boolean;
  content: PageSectionContentMap[T];
};

export type AutoNavigationItem = {
  location: "header" | "footer";
  label: string;
  href: string;
  is_external: false;
  sort_order: number;
  is_active: true;
};

const sectionTypeLabels: Record<PageSectionType, string> = {
  rich_text: "Rich Text",
  card_grid: "Card Grid",
  timeline: "Timeline / Milestones",
  stats: "Stats",
  cta: "CTA",
  split_media: "Text + Image",
  media_banner: "Image Banner",
  testimonial_showcase: "Testimonials",
  faq_section: "FAQ",
  about_split: "About Split",
  icon_cards: "Icon Cards",
  services_grid: "Services Grid",
  milestones_spotlight: "Milestones Spotlight",
  contact_cta: "Contact CTA",
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isPageSectionType = (value: string): value is PageSectionType =>
  pageSectionTypes.includes(value as PageSectionType);

const coerceStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

const coerceCardGridItems = (value: unknown): CardGridItem[] =>
  Array.isArray(value)
    ? value
        .map((item) =>
          isRecord(item)
            ? {
                eyebrow: typeof item.eyebrow === "string" ? item.eyebrow : "",
                title: typeof item.title === "string" ? item.title : "",
                description: typeof item.description === "string" ? item.description : "",
                linkLabel: typeof item.linkLabel === "string" ? item.linkLabel : "",
                linkHref: typeof item.linkHref === "string" ? item.linkHref : "",
              }
            : null,
        )
        .filter((item): item is CardGridItem => item !== null)
    : [];

const coerceTimelineItems = (value: unknown): TimelineItem[] =>
  Array.isArray(value)
    ? value
        .map((item) =>
          isRecord(item)
            ? {
                year: typeof item.year === "string" ? item.year : "",
                title: typeof item.title === "string" ? item.title : "",
                description: typeof item.description === "string" ? item.description : "",
                highlights: coerceStringArray(item.highlights),
              }
            : null,
        )
        .filter((item): item is TimelineItem => item !== null)
    : [];

const coerceStatsItems = (value: unknown): StatItem[] =>
  Array.isArray(value)
    ? value
        .map((item) =>
          isRecord(item)
            ? {
                value: typeof item.value === "string" ? item.value : "",
                label: typeof item.label === "string" ? item.label : "",
              }
            : null,
        )
        .filter((item): item is StatItem => item !== null)
    : [];

const coerceIconContentItems = (value: unknown): IconContentItem[] =>
  Array.isArray(value)
    ? value
        .map((item) =>
          isRecord(item)
            ? {
                iconName: typeof item.iconName === "string" ? item.iconName : "Target",
                title: typeof item.title === "string" ? item.title : "",
                description: typeof item.description === "string" ? item.description : "",
              }
            : null,
        )
        .filter((item): item is IconContentItem => item !== null)
    : [];

const coerceServiceTemplateItems = (value: unknown): TemplateServiceItem[] =>
  Array.isArray(value)
    ? value
        .map((item) =>
          isRecord(item)
            ? {
                iconName: typeof item.iconName === "string" ? item.iconName : "Network",
                title: typeof item.title === "string" ? item.title : "",
                short: typeof item.short === "string" ? item.short : "",
                detail: typeof item.detail === "string" ? item.detail : "",
                benefits: coerceStringArray(item.benefits),
                category: typeof item.category === "string" ? item.category : "",
              }
            : null,
        )
        .filter((item): item is TemplateServiceItem => item !== null)
    : [];

const coerceTestimonials = (value: unknown): TestimonialItem[] =>
  Array.isArray(value)
    ? value
        .map((item) =>
          isRecord(item)
            ? {
                quote: typeof item.quote === "string" ? item.quote : "",
                name: typeof item.name === "string" ? item.name : "",
                role: typeof item.role === "string" ? item.role : "",
                company: typeof item.company === "string" ? item.company : "",
                linkLabel: typeof item.linkLabel === "string" ? item.linkLabel : "",
                linkHref: typeof item.linkHref === "string" ? item.linkHref : "",
              }
            : null,
        )
        .filter((item): item is TestimonialItem => item !== null)
    : [];

const coerceFaqItems = (value: unknown): FaqItem[] =>
  Array.isArray(value)
    ? value
        .map((item) =>
          isRecord(item)
            ? {
                question: typeof item.question === "string" ? item.question : "",
                answer: typeof item.answer === "string" ? item.answer : "",
                linkLabel: typeof item.linkLabel === "string" ? item.linkLabel : "",
                linkHref: typeof item.linkHref === "string" ? item.linkHref : "",
              }
            : null,
        )
        .filter((item): item is FaqItem => item !== null)
    : [];

const coerceCompanyContact = (value: unknown): CompanyContactContent => {
  const safeValue = isRecord(value) ? value : {};
  return {
    email: typeof safeValue.email === "string" ? safeValue.email : defaultCompanyContact.email,
    officeName: typeof safeValue.officeName === "string" ? safeValue.officeName : defaultCompanyContact.officeName,
    street: typeof safeValue.street === "string" ? safeValue.street : defaultCompanyContact.street,
    city: typeof safeValue.city === "string" ? safeValue.city : defaultCompanyContact.city,
    country: typeof safeValue.country === "string" ? safeValue.country : defaultCompanyContact.country,
    linkedinUrl: typeof safeValue.linkedinUrl === "string" ? safeValue.linkedinUrl : defaultCompanyContact.linkedinUrl,
  };
};

const defaultRichTextContent = (): PageSectionRichTextContent => ({
  body: [],
});

const defaultCardGridContent = (): PageSectionCardGridContent => ({
  variant: "feature",
  intro: "",
  items: [
    { eyebrow: "", title: "", description: "", linkLabel: "", linkHref: "" },
    { eyebrow: "", title: "", description: "", linkLabel: "", linkHref: "" },
    { eyebrow: "", title: "", description: "", linkLabel: "", linkHref: "" },
  ],
});

const defaultTimelineContent = (): PageSectionTimelineContent => ({
  intro: "",
  items: [
    { year: "", title: "", description: "", highlights: [] },
    { year: "", title: "", description: "", highlights: [] },
  ],
});

const defaultStatsContent = (): PageSectionStatsContent => ({
  intro: "",
  items: [
    { value: "", label: "" },
    { value: "", label: "" },
    { value: "", label: "" },
  ],
});

const defaultCtaContent = (): PageSectionCtaContent => ({
  variant: "centered",
  intro: "",
  buttonLabel: "",
  buttonHref: "",
  secondaryButtonLabel: "",
  secondaryButtonHref: "",
});

const defaultSplitMediaContent = (): PageSectionSplitMediaContent => ({
  variant: "editorial",
  layout: "text-left",
  intro: "",
  body: [
    "Use this layout when you want to explain something with a little more room to breathe.",
  ],
  bullets: ["Add a short proof point", "Add a second highlight", "Link people to the next step"],
  primaryButtonLabel: "",
  primaryButtonHref: "",
  secondaryButtonLabel: "",
  secondaryButtonHref: "",
  imageSrc: "",
  imageAlt: "",
  imageCaption: "",
});

const defaultMediaBannerContent = (): PageSectionMediaBannerContent => ({
  variant: "immersive",
  intro: "",
  imageSrc: "",
  imageAlt: "",
  buttonLabel: "",
  buttonHref: "",
  secondaryButtonLabel: "",
  secondaryButtonHref: "",
});

const defaultTestimonialShowcaseContent = (): PageSectionTestimonialShowcaseContent => ({
  variant: "spotlight",
  intro: "",
  items: [
    { quote: "", name: "", role: "", company: "", linkLabel: "", linkHref: "" },
    { quote: "", name: "", role: "", company: "", linkLabel: "", linkHref: "" },
  ],
  primaryButtonLabel: "",
  primaryButtonHref: "",
});

const defaultFaqContent = (): PageSectionFaqContent => ({
  variant: "split",
  intro: "",
  items: [
    { question: "", answer: "", linkLabel: "", linkHref: "" },
    { question: "", answer: "", linkLabel: "", linkHref: "" },
    { question: "", answer: "", linkLabel: "", linkHref: "" },
  ],
  primaryButtonLabel: "",
  primaryButtonHref: "",
  secondaryButtonLabel: "",
  secondaryButtonHref: "",
});

const defaultAboutSplitContent = (): PageSectionAboutSplitContent => ({
  ...defaultHomeAbout,
  body: [...defaultHomeAbout.body],
  pillars: defaultHomeAbout.pillars.map((item) => ({ ...item })),
});

const defaultIconCardsContent = (): PageSectionIconCardsContent => ({
  headline: "",
  intro: "",
  items: [
    { iconName: "Rocket", title: "", description: "" },
    { iconName: "Users", title: "", description: "" },
    { iconName: "Target", title: "", description: "" },
  ],
});

const defaultServicesGridContent = (): PageSectionServicesGridContent => ({
  headline: defaultExpertiseIntro.headline,
  intro: defaultExpertiseIntro.intro,
  items: [],
});

const defaultMilestonesSpotlightContent = (): PageSectionMilestonesSpotlightContent => ({
  headline: "Milestones That Made Us KGC",
  intro: "From a solo founder to a growing international team, our journey year by year.",
  items: [],
});

const defaultContactCtaContent = (): PageSectionContactCtaContent => ({
  eyebrow: defaultHomeContactCta.eyebrow || "Contact",
  headline: defaultHomeContactCta.headline,
  intro: defaultHomeContactCta.intro,
  buttonLabel: defaultHomeContactCta.buttonLabel || "Start a Conversation",
  buttonHref: defaultHomeContactCta.buttonHref || "/contact",
  contact: { ...defaultCompanyContact },
});

export const getManagedPage = (slug: ManagedPageSlug) =>
  managedPages.find((page) => page.slug === slug) || managedPages[0];

export const getManagedPageLabel = (slug: ManagedPageSlug) => getManagedPage(slug).label;

export const getManagedPagePath = (slug: ManagedPageSlug) => getManagedPage(slug).path;

export const getPlacementOptions = (slug: ManagedPageSlug) => getManagedPage(slug).placements;

export const getPlacementDefinition = (slug: ManagedPageSlug, placement: string) =>
  getPlacementOptions(slug).find((option) => option.value === placement);

export const getPlacementLabel = (slug: ManagedPageSlug, placement: string) =>
  getPlacementOptions(slug).find((option) => option.value === placement)?.label || placement;

export const getBuiltInSectionDefinitions = (slug: ManagedPageSlug) => getManagedPage(slug).builtInSections;

export const getBuiltInSectionDefinition = (slug: ManagedPageSlug, sectionId: string) =>
  getBuiltInSectionDefinitions(slug).find((section) => section.id === sectionId);

export const getDefaultPageStructure = (slug: ManagedPageSlug): PageStructureContent => ({
  sections: getBuiltInSectionDefinitions(slug).map((section) => ({
    id: section.id,
    label: section.label,
    anchor: section.anchor,
    visible: section.defaultVisible,
    showInHeader: section.defaultHeader,
    showInFooter: section.defaultFooter,
    navLabel: section.label,
  })),
});

export const getStructureSection = (structure: PageStructureContent, sectionId: string) =>
  structure.sections.find((section) => section.id === sectionId);

export const getSectionTypeLabel = (type: PageSectionType) => sectionTypeLabels[type];

export const normalizeSectionKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeNavLabel = (value: string, fallback: string) => {
  const next = value.trim();
  return next || fallback;
};

export const invertPageSurface = (surface: PageSurface): PageSurface => (surface === "dark" ? "light" : "dark");

const getDefaultPlacement = (pageSlug: ManagedPageSlug) => getPlacementOptions(pageSlug)[0]?.value || "after-hero";

const getDefaultSectionMeta = (pageSlug: ManagedPageSlug, title: string): SectionMeta => ({
  placement: getDefaultPlacement(pageSlug),
  navLabel: title,
  showInHeader: false,
  showInFooter: false,
});

const extractSectionMeta = (pageSlug: ManagedPageSlug, title: string, content: unknown): SectionMeta => {
  const safeContent = isRecord(content) ? content : {};
  const meta = isRecord(safeContent.__meta) ? safeContent.__meta : {};
  return {
    placement: typeof meta.placement === "string" ? meta.placement : getDefaultPlacement(pageSlug),
    navLabel: normalizeNavLabel(typeof meta.navLabel === "string" ? meta.navLabel : "", title),
    showInHeader: Boolean(meta.showInHeader),
    showInFooter: Boolean(meta.showInFooter),
  };
};

const withSectionMeta = <T extends PageSectionType>(
  content: PageSectionContentMap[T],
  meta: SectionMeta,
): StorableSectionContent<T> => ({
  ...content,
  __meta: meta,
});

export const createEmptySectionContent = <T extends PageSectionType>(
  type: T,
): PageSectionContentMap[T] => {
  switch (type) {
    case "about_split":
      return defaultAboutSplitContent() as PageSectionContentMap[T];
    case "card_grid":
      return defaultCardGridContent() as PageSectionContentMap[T];
    case "split_media":
      return defaultSplitMediaContent() as PageSectionContentMap[T];
    case "media_banner":
      return defaultMediaBannerContent() as PageSectionContentMap[T];
    case "testimonial_showcase":
      return defaultTestimonialShowcaseContent() as PageSectionContentMap[T];
    case "faq_section":
      return defaultFaqContent() as PageSectionContentMap[T];
    case "icon_cards":
      return defaultIconCardsContent() as PageSectionContentMap[T];
    case "services_grid":
      return defaultServicesGridContent() as PageSectionContentMap[T];
    case "milestones_spotlight":
      return defaultMilestonesSpotlightContent() as PageSectionContentMap[T];
    case "timeline":
      return defaultTimelineContent() as PageSectionContentMap[T];
    case "stats":
      return defaultStatsContent() as PageSectionContentMap[T];
    case "cta":
      return defaultCtaContent() as PageSectionContentMap[T];
    case "contact_cta":
      return defaultContactCtaContent() as PageSectionContentMap[T];
    case "rich_text":
    default:
      return defaultRichTextContent() as PageSectionContentMap[T];
  }
};

const parseSectionContent = <T extends PageSectionType>(
  type: T,
  content: unknown,
): PageSectionContentMap[T] => {
  const safeContent = isRecord(content) ? content : {};

  switch (type) {
    case "about_split":
      return {
        ...defaultAboutSplitContent(),
        headline: typeof safeContent.headline === "string" ? safeContent.headline : defaultHomeAbout.headline,
        body: coerceStringArray(safeContent.body),
        pillars: coerceIconContentItems(safeContent.pillars),
      } as PageSectionContentMap[T];
    case "card_grid":
      return {
        ...defaultCardGridContent(),
        variant: safeContent.variant === "staggered" ? "staggered" : "feature",
        intro: typeof safeContent.intro === "string" ? safeContent.intro : "",
        items: coerceCardGridItems(safeContent.items),
      } as PageSectionContentMap[T];
    case "split_media":
      return {
        ...defaultSplitMediaContent(),
        variant:
          safeContent.variant === "offset"
            ? "offset"
            : safeContent.variant === "spotlight"
              ? "spotlight"
              : "editorial",
        layout: safeContent.layout === "text-right" ? "text-right" : "text-left",
        intro: typeof safeContent.intro === "string" ? safeContent.intro : "",
        body: coerceStringArray(safeContent.body),
        bullets: coerceStringArray(safeContent.bullets),
        primaryButtonLabel: typeof safeContent.primaryButtonLabel === "string" ? safeContent.primaryButtonLabel : "",
        primaryButtonHref: typeof safeContent.primaryButtonHref === "string" ? safeContent.primaryButtonHref : "",
        secondaryButtonLabel: typeof safeContent.secondaryButtonLabel === "string" ? safeContent.secondaryButtonLabel : "",
        secondaryButtonHref: typeof safeContent.secondaryButtonHref === "string" ? safeContent.secondaryButtonHref : "",
        imageSrc: typeof safeContent.imageSrc === "string" ? safeContent.imageSrc : "",
        imageAlt: typeof safeContent.imageAlt === "string" ? safeContent.imageAlt : "",
        imageCaption: typeof safeContent.imageCaption === "string" ? safeContent.imageCaption : "",
      } as PageSectionContentMap[T];
    case "media_banner":
      return {
        ...defaultMediaBannerContent(),
        variant: safeContent.variant === "spotlight" ? "spotlight" : "immersive",
        intro: typeof safeContent.intro === "string" ? safeContent.intro : "",
        imageSrc: typeof safeContent.imageSrc === "string" ? safeContent.imageSrc : "",
        imageAlt: typeof safeContent.imageAlt === "string" ? safeContent.imageAlt : "",
        buttonLabel: typeof safeContent.buttonLabel === "string" ? safeContent.buttonLabel : "",
        buttonHref: typeof safeContent.buttonHref === "string" ? safeContent.buttonHref : "",
        secondaryButtonLabel: typeof safeContent.secondaryButtonLabel === "string" ? safeContent.secondaryButtonLabel : "",
        secondaryButtonHref: typeof safeContent.secondaryButtonHref === "string" ? safeContent.secondaryButtonHref : "",
      } as PageSectionContentMap[T];
    case "testimonial_showcase":
      return {
        ...defaultTestimonialShowcaseContent(),
        variant: safeContent.variant === "mosaic" ? "mosaic" : "spotlight",
        intro: typeof safeContent.intro === "string" ? safeContent.intro : "",
        items: coerceTestimonials(safeContent.items),
        primaryButtonLabel: typeof safeContent.primaryButtonLabel === "string" ? safeContent.primaryButtonLabel : "",
        primaryButtonHref: typeof safeContent.primaryButtonHref === "string" ? safeContent.primaryButtonHref : "",
      } as PageSectionContentMap[T];
    case "faq_section":
      return {
        ...defaultFaqContent(),
        variant: safeContent.variant === "stacked" ? "stacked" : "split",
        intro: typeof safeContent.intro === "string" ? safeContent.intro : "",
        items: coerceFaqItems(safeContent.items),
        primaryButtonLabel: typeof safeContent.primaryButtonLabel === "string" ? safeContent.primaryButtonLabel : "",
        primaryButtonHref: typeof safeContent.primaryButtonHref === "string" ? safeContent.primaryButtonHref : "",
        secondaryButtonLabel: typeof safeContent.secondaryButtonLabel === "string" ? safeContent.secondaryButtonLabel : "",
        secondaryButtonHref: typeof safeContent.secondaryButtonHref === "string" ? safeContent.secondaryButtonHref : "",
      } as PageSectionContentMap[T];
    case "icon_cards":
      return {
        ...defaultIconCardsContent(),
        headline: typeof safeContent.headline === "string" ? safeContent.headline : "",
        intro: typeof safeContent.intro === "string" ? safeContent.intro : "",
        items: coerceIconContentItems(safeContent.items),
      } as PageSectionContentMap[T];
    case "services_grid":
      return {
        ...defaultServicesGridContent(),
        headline: typeof safeContent.headline === "string" ? safeContent.headline : defaultExpertiseIntro.headline,
        intro: typeof safeContent.intro === "string" ? safeContent.intro : defaultExpertiseIntro.intro,
        items: coerceServiceTemplateItems(safeContent.items),
      } as PageSectionContentMap[T];
    case "milestones_spotlight":
      return {
        ...defaultMilestonesSpotlightContent(),
        headline: typeof safeContent.headline === "string" ? safeContent.headline : "Milestones That Made Us KGC",
        intro: typeof safeContent.intro === "string" ? safeContent.intro : defaultMilestonesSpotlightContent().intro,
        items: coerceTimelineItems(safeContent.items),
      } as PageSectionContentMap[T];
    case "timeline":
      return {
        ...defaultTimelineContent(),
        intro: typeof safeContent.intro === "string" ? safeContent.intro : "",
        items: coerceTimelineItems(safeContent.items),
      } as PageSectionContentMap[T];
    case "stats":
      return {
        ...defaultStatsContent(),
        intro: typeof safeContent.intro === "string" ? safeContent.intro : "",
        items: coerceStatsItems(safeContent.items),
      } as PageSectionContentMap[T];
    case "cta":
      return {
        ...defaultCtaContent(),
        variant: safeContent.variant === "split" ? "split" : "centered",
        intro: typeof safeContent.intro === "string" ? safeContent.intro : "",
        buttonLabel: typeof safeContent.buttonLabel === "string" ? safeContent.buttonLabel : "",
        buttonHref: typeof safeContent.buttonHref === "string" ? safeContent.buttonHref : "",
        secondaryButtonLabel:
          typeof safeContent.secondaryButtonLabel === "string" ? safeContent.secondaryButtonLabel : "",
        secondaryButtonHref:
          typeof safeContent.secondaryButtonHref === "string" ? safeContent.secondaryButtonHref : "",
      } as PageSectionContentMap[T];
    case "contact_cta":
      return {
        ...defaultContactCtaContent(),
        eyebrow: typeof safeContent.eyebrow === "string" ? safeContent.eyebrow : defaultContactCtaContent().eyebrow,
        headline: typeof safeContent.headline === "string" ? safeContent.headline : defaultContactCtaContent().headline,
        intro: typeof safeContent.intro === "string" ? safeContent.intro : defaultContactCtaContent().intro,
        buttonLabel:
          typeof safeContent.buttonLabel === "string" ? safeContent.buttonLabel : defaultContactCtaContent().buttonLabel,
        buttonHref:
          typeof safeContent.buttonHref === "string" ? safeContent.buttonHref : defaultContactCtaContent().buttonHref,
        contact: coerceCompanyContact(safeContent.contact),
      } as PageSectionContentMap[T];
    case "rich_text":
    default:
      return {
        ...defaultRichTextContent(),
        body: coerceStringArray(safeContent.body),
      } as PageSectionContentMap[T];
  }
};

const nextSectionKey = (type: PageSectionType, existingKeys: string[]) => {
  const base = type.replace(/_/g, "-");
  let index = existingKeys.length + 1;
  let candidate = `${base}-${index}`;

  while (existingKeys.includes(candidate)) {
    index += 1;
    candidate = `${base}-${index}`;
  }

  return candidate;
};

export const createPageSection = <T extends PageSectionType>(
  type: T,
  pageSlug: ManagedPageSlug,
  sortOrder: number,
  existingKeys: string[] = [],
): PageSectionDraft<T> => {
  const title = getSectionTypeLabel(type);
  const meta = getDefaultSectionMeta(pageSlug, title);

  return {
    page_slug: pageSlug,
    section_key: nextSectionKey(type, existingKeys),
    section_type: type,
    title,
    eyebrow: "",
    sort_order: sortOrder,
    is_published: true,
    placement: meta.placement,
    nav_label: meta.navLabel,
    show_in_header: meta.showInHeader,
    show_in_footer: meta.showInFooter,
    content: createEmptySectionContent(type),
  };
};

export const parsePageSection = (section: Tables<"page_sections">): PageSectionDraft => {
  const pageSlug = section.page_slug as ManagedPageSlug;
  const sectionType = isPageSectionType(section.section_type) ? section.section_type : "rich_text";
  const title = section.title || getSectionTypeLabel(sectionType);
  const meta = extractSectionMeta(pageSlug, title, section.content);

  return {
    id: section.id,
    page_slug: section.page_slug,
    section_key: section.section_key,
    section_type: sectionType,
    title,
    eyebrow: section.eyebrow || "",
    sort_order: section.sort_order,
    is_published: section.is_published,
    placement: meta.placement,
    nav_label: meta.navLabel,
    show_in_header: meta.showInHeader,
    show_in_footer: meta.showInFooter,
    content: parseSectionContent(sectionType, section.content),
  };
};

export async function fetchPageSections(pageSlug: ManagedPageSlug) {
  const { data } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_slug", pageSlug)
    .eq("is_published", true)
    .order("sort_order");

  return (data || []).map(parsePageSection);
}

export async function fetchPageStructure(pageSlug: ManagedPageSlug) {
  const fallback = getDefaultPageStructure(pageSlug);
  const { data } = await supabase
    .from("site_content")
    .select("content")
    .eq("key", `${pageSlug}.structure`)
    .eq("is_published", true)
    .maybeSingle();

  if (!data?.content || !isRecord(data.content)) return fallback;

  const storedSections = Array.isArray(data.content.sections) ? data.content.sections : [];

  return {
    sections: fallback.sections.map((section) => {
      const stored = storedSections.find((item) => isRecord(item) && item.id === section.id);
      if (!isRecord(stored)) return section;
      return {
        id: section.id,
        label: typeof stored.label === "string" ? stored.label : section.label,
        anchor: typeof stored.anchor === "string" ? stored.anchor : section.anchor,
        visible: typeof stored.visible === "boolean" ? stored.visible : section.visible,
        showInHeader: typeof stored.showInHeader === "boolean" ? stored.showInHeader : section.showInHeader,
        showInFooter: typeof stored.showInFooter === "boolean" ? stored.showInFooter : section.showInFooter,
        navLabel: normalizeNavLabel(typeof stored.navLabel === "string" ? stored.navLabel : "", section.navLabel),
      };
    }),
  } satisfies PageStructureContent;
}

export const getSectionsForPlacement = (sections: PageSectionDraft[], placement: string) =>
  sections
    .filter((section) => section.placement === placement)
    .sort((left, right) => left.sort_order - right.sort_order);

export const getPlacementBaseSurface = (
  pageSlug: ManagedPageSlug,
  placement: string,
  structure: PageStructureContent = getDefaultPageStructure(pageSlug),
) => {
  const definition = getPlacementDefinition(pageSlug, placement);
  if (!definition) return "light" as const;

  const builtIns = getBuiltInSectionDefinitions(pageSlug);
  const anchorIndex = definition.afterSectionId
    ? builtIns.findIndex((section) => section.id === definition.afterSectionId)
    : -1;

  if (anchorIndex >= 0) {
    for (let index = anchorIndex; index >= 0; index -= 1) {
      const builtIn = builtIns[index];
      const structureSection = getStructureSection(structure, builtIn.id);
      if (structureSection?.visible === false) continue;
      return invertPageSurface(builtIn.surface);
    }
  }

  return definition.defaultSurface;
};

export const getFlexibleSectionSurfaceMap = (
  pageSlug: ManagedPageSlug,
  sections: PageSectionDraft[],
  structure: PageStructureContent = getDefaultPageStructure(pageSlug),
) => {
  const surfaceMap: Record<string, PageSurface> = {};
  const placements = getPlacementOptions(pageSlug);
  let previousSurface: PageSurface | null = null;

  const assignFlexibleSections = (placementValue: string) => {
    const placement = placements.find((item) => item.value === placementValue);
    const placementSections = getSectionsForPlacement(sections, placementValue);

    placementSections.forEach((section) => {
      const nextSurface = previousSurface
        ? invertPageSurface(previousSurface)
        : placement?.defaultSurface || "light";
      surfaceMap[section.id || section.section_key] = nextSurface;
      previousSurface = nextSurface;
    });
  };

  getBuiltInSectionDefinitions(pageSlug).forEach((builtInSection) => {
    const isVisible = getStructureSection(structure, builtInSection.id)?.visible !== false;

    if (isVisible) {
      const nextSurface =
        builtInSection.fixedSurface ||
        (previousSurface ? invertPageSurface(previousSurface) : builtInSection.surface);
      surfaceMap[builtInSection.id] = nextSurface;
      previousSurface = nextSurface;
    }

    placements
      .filter((placement) => placement.afterSectionId === builtInSection.id)
      .forEach((placement) => assignFlexibleSections(placement.value));
  });

  return surfaceMap;
};

export type SectionTemplateDefinition = {
  id: string;
  label: string;
  description: string;
  sectionType: PageSectionType;
  sourceLabel: string;
  preferredPlacement?: string;
};

export type SectionLayoutDefinition = {
  id: string;
  label: string;
  description: string;
  sectionType: PageSectionType;
  variant?: string;
  suggestedTitle: string;
  suggestedEyebrow?: string;
};

export const sectionTemplates: SectionTemplateDefinition[] = [
  {
    id: "home-about",
    label: "About Section",
    description: "The split About section with text on the left and value cards on the right.",
    sectionType: "about_split",
    sourceLabel: "Homepage / About",
    preferredPlacement: "after-about",
  },
  {
    id: "home-expertise",
    label: "Expertise Section",
    description: "The full-width services grid with service details and benefits.",
    sectionType: "services_grid",
    sourceLabel: "Homepage / Expertise",
    preferredPlacement: "after-expertise",
  },
  {
    id: "home-milestones",
    label: "Milestones Section",
    description: "The interactive milestone timeline with a highlighted active year.",
    sectionType: "milestones_spotlight",
    sourceLabel: "Homepage / Milestones",
    preferredPlacement: "after-milestones",
  },
  {
    id: "home-contact",
    label: "Contact CTA",
    description: "The homepage contact call-to-action with the three contact cards underneath.",
    sectionType: "contact_cta",
    sourceLabel: "Homepage / Contact CTA",
    preferredPlacement: "before-contact-cta",
  },
  {
    id: "careers-perks",
    label: "Careers Perks",
    description: "The icon card grid used in the Why KGC section.",
    sectionType: "icon_cards",
    sourceLabel: "Careers / Why KGC",
    preferredPlacement: "after-perks",
  },
  {
    id: "internships-perks",
    label: "Internship Perks",
    description: "The icon card grid used in the internships programme section.",
    sectionType: "icon_cards",
    sourceLabel: "Internships / Perks",
    preferredPlacement: "after-programme",
  },
  {
    id: "careers-talent-pool",
    label: "Talent Pool CTA",
    description: "The closing careers CTA that invites people to send their CV.",
    sectionType: "cta",
    sourceLabel: "Careers / Final CTA",
    preferredPlacement: "before-final-cta",
  },
  {
    id: "internships-application-cta",
    label: "Internship CTA",
    description: "The closing internships CTA with the main application button.",
    sectionType: "cta",
    sourceLabel: "Internships / Final CTA",
    preferredPlacement: "before-final-cta",
  },
  {
    id: "home-hero-stats",
    label: "Hero Stats",
    description: "The compact stats row used under the homepage hero.",
    sectionType: "stats",
    sourceLabel: "Homepage / Hero",
    preferredPlacement: "after-hero",
  },
];

export const sectionLayoutLibrary: SectionLayoutDefinition[] = [
  {
    id: "rich-text",
    label: "Editorial Text",
    description: "A clean two-column text layout for narrative sections, explainers, or context.",
    sectionType: "rich_text",
    suggestedTitle: "Section Title",
    suggestedEyebrow: "Overview",
  },
  {
    id: "split-editorial",
    label: "Editorial Split",
    description: "A calmer text-and-image section with roomy copy, bullets, and a measured visual balance.",
    sectionType: "split_media",
    variant: "editorial",
    suggestedTitle: "A Story Worth Explaining",
    suggestedEyebrow: "Featured",
  },
  {
    id: "split-offset",
    label: "Offset Story Panel",
    description: "A more expressive split with layered image framing and a stronger editorial rhythm.",
    sectionType: "split_media",
    variant: "offset",
    suggestedTitle: "What Changes When You Look Closer",
    suggestedEyebrow: "Insight",
  },
  {
    id: "split-spotlight",
    label: "Spotlight Split",
    description: "A darker, more dramatic split treatment for featured narratives, launches, or key messages.",
    sectionType: "split_media",
    variant: "spotlight",
    suggestedTitle: "A Closer Look At The Opportunity",
    suggestedEyebrow: "Spotlight",
  },
  {
    id: "banner-immersive",
    label: "Immersive Banner",
    description: "A full-width image-led banner with layered copy and strong calls to action.",
    sectionType: "media_banner",
    variant: "immersive",
    suggestedTitle: "Make the Next Step Clear",
    suggestedEyebrow: "Spotlight",
  },
  {
    id: "banner-spotlight",
    label: "Spotlight Banner",
    description: "A more composed media block with a framed text panel and a stronger premium feel.",
    sectionType: "media_banner",
    variant: "spotlight",
    suggestedTitle: "Put One Message In The Spotlight",
    suggestedEyebrow: "Featured",
  },
  {
    id: "card-feature",
    label: "Feature Grid",
    description: "A crisp grid with evenly weighted cards for case studies, offers, or proof points.",
    sectionType: "card_grid",
    variant: "feature",
    suggestedTitle: "Featured Work",
    suggestedEyebrow: "Highlights",
  },
  {
    id: "card-staggered",
    label: "Staggered Showcase",
    description: "A more dynamic card layout with a lead card and supporting stories around it.",
    sectionType: "card_grid",
    variant: "staggered",
    suggestedTitle: "Selected Stories",
    suggestedEyebrow: "Showcase",
  },
  {
    id: "icon-cards",
    label: "Icon Features",
    description: "Short feature cards with icons, good for values, perks, or service pillars.",
    sectionType: "icon_cards",
    suggestedTitle: "What Makes This Valuable",
    suggestedEyebrow: "Benefits",
  },
  {
    id: "stats",
    label: "Stats Strip",
    description: "Compact proof points for traction, impact, or credibility.",
    sectionType: "stats",
    suggestedTitle: "Proof In Numbers",
    suggestedEyebrow: "Metrics",
  },
  {
    id: "timeline",
    label: "Timeline",
    description: "Milestones, roadmap points, or process steps in a structured sequence.",
    sectionType: "timeline",
    suggestedTitle: "How It Unfolds",
    suggestedEyebrow: "Timeline",
  },
  {
    id: "testimonials-spotlight",
    label: "Quote Spotlight",
    description: "A lead testimonial with supporting quotes, designed to feel more premium and editorial.",
    sectionType: "testimonial_showcase",
    variant: "spotlight",
    suggestedTitle: "What People Say",
    suggestedEyebrow: "Testimonials",
  },
  {
    id: "testimonials-mosaic",
    label: "Testimonial Mosaic",
    description: "A denser wall of quotes with one highlighted story and supporting social proof around it.",
    sectionType: "testimonial_showcase",
    variant: "mosaic",
    suggestedTitle: "Trusted By People Who Needed Results",
    suggestedEyebrow: "Proof",
  },
  {
    id: "faq-split",
    label: "FAQ Split",
    description: "A structured FAQ with a strong intro panel on one side and expandable answers on the other.",
    sectionType: "faq_section",
    variant: "split",
    suggestedTitle: "Questions We Hear Often",
    suggestedEyebrow: "FAQ",
  },
  {
    id: "faq-stacked",
    label: "FAQ Stack",
    description: "A calmer stacked FAQ for simpler pages where the answers should stay front and center.",
    sectionType: "faq_section",
    variant: "stacked",
    suggestedTitle: "A Few Practical Questions",
    suggestedEyebrow: "FAQ",
  },
  {
    id: "cta-centered",
    label: "Action Block",
    description: "A focused action section for one or two calls when you want a clear close.",
    sectionType: "cta",
    variant: "centered",
    suggestedTitle: "Ready To Continue?",
    suggestedEyebrow: "Next Step",
  },
  {
    id: "cta-split",
    label: "Split Action Panel",
    description: "A more premium CTA with narrative on one side and a dedicated action panel on the other.",
    sectionType: "cta",
    variant: "split",
    suggestedTitle: "Turn Interest Into A Conversation",
    suggestedEyebrow: "Next Move",
  },
];

export const getSectionTemplate = (templateId: string) =>
  sectionTemplates.find((template) => template.id === templateId);

export const getSectionLayout = (layoutId: string) =>
  sectionLayoutLibrary.find((layout) => layout.id === layoutId);

export function createSectionFromLayout(
  layoutId: string,
  targetPageSlug: ManagedPageSlug,
  sortOrder: number,
  existingKeys: string[] = [],
): PageSectionDraft {
  const layout = getSectionLayout(layoutId);
  if (!layout) {
    throw new Error("That section layout could not be found.");
  }

  const draft = createPageSection(layout.sectionType, targetPageSlug, sortOrder, existingKeys);
  const suggestedTitle = layout.suggestedTitle.trim() || getSectionTypeLabel(layout.sectionType);

  return {
    ...draft,
    title: suggestedTitle,
    eyebrow: layout.suggestedEyebrow?.trim() || "",
    nav_label: suggestedTitle,
    content:
      layout.variant && "variant" in draft.content
        ? ({ ...draft.content, variant: layout.variant } as PageSectionDraft["content"])
        : draft.content,
  };
}

const sortNewestFirst = <T extends { year: string }>(items: T[]) =>
  [...items].sort((left, right) => Number.parseInt(right.year, 10) - Number.parseInt(left.year, 10));

const resolveTemplatePlacement = (pageSlug: ManagedPageSlug, preferredPlacement?: string) =>
  preferredPlacement && getPlacementOptions(pageSlug).some((option) => option.value === preferredPlacement)
    ? preferredPlacement
    : getDefaultPlacement(pageSlug);

const fetchTemplateServices = async (): Promise<TemplateServiceItem[]> => {
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  return (data || [])
    .filter((item) => item.title?.trim() && item.short?.trim() && item.detail?.trim())
    .map((item) => ({
      iconName: item.icon_name || "Network",
      title: item.title,
      short: item.short,
      detail: item.detail,
      benefits: (item.benefits || []).filter(Boolean),
      category: item.category || "",
    }));
};

const fetchTemplateMilestones = async (): Promise<TimelineItem[]> => {
  const { data } = await supabase
    .from("milestones")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  return sortNewestFirst(
    (data || []).map((item) => ({
      year: item.year,
      title: item.title,
      description: item.description,
      highlights: (item.highlights || []).filter(Boolean),
    })),
  );
};

export async function createSectionFromTemplate(
  templateId: string,
  targetPageSlug: ManagedPageSlug,
  sortOrder: number,
  existingKeys: string[] = [],
): Promise<PageSectionDraft> {
  const template = getSectionTemplate(templateId);
  if (!template) {
    throw new Error("That section template could not be found.");
  }

  const draft = createPageSection(template.sectionType, targetPageSlug, sortOrder, existingKeys);
  draft.placement = resolveTemplatePlacement(targetPageSlug, template.preferredPlacement);
  draft.title = template.label;
  draft.nav_label = template.label;

  switch (template.id) {
    case "home-about": {
      const about = await fetchSiteContent("home.about", defaultHomeAbout);
      return {
        ...draft,
        title: about.headline,
        nav_label: "About",
        content: {
          headline: about.headline,
          body: [...about.body],
          pillars: about.pillars.map((item) => ({ ...item })),
        },
      };
    }
    case "home-expertise": {
      const intro = await fetchSiteContent("home.expertise", defaultExpertiseIntro);
      const items = await fetchTemplateServices();
      return {
        ...draft,
        title: intro.headline,
        nav_label: "Expertise",
        content: {
          headline: intro.headline,
          intro: intro.intro,
          items,
        },
      };
    }
    case "home-milestones": {
      const items = await fetchTemplateMilestones();
      const content = defaultMilestonesSpotlightContent();
      return {
        ...draft,
        title: content.headline,
        nav_label: "Milestones",
        content: {
          ...content,
          items,
        },
      };
    }
    case "home-contact": {
      const cta = await fetchSiteContent("home.contact_cta", defaultHomeContactCta);
      const contact = await fetchSiteContent("company.contact", defaultCompanyContact);
      return {
        ...draft,
        title: cta.headline,
        nav_label: cta.eyebrow || "Contact",
        content: {
          eyebrow: cta.eyebrow || "Contact",
          headline: cta.headline,
          intro: cta.intro,
          buttonLabel: cta.buttonLabel || "Start a Conversation",
          buttonHref: cta.buttonHref || "/contact",
          contact,
        },
      };
    }
    case "careers-perks": {
      const careers = await fetchSiteContent("careers.page", defaultCareersPage);
      return {
        ...draft,
        title: careers.careersHeading,
        nav_label: careers.careersHeading,
        content: {
          headline: careers.careersHeading,
          intro: "",
          items: careers.careerPerks.map((item) => ({ ...item })),
        },
      };
    }
    case "internships-perks": {
      const internships = await fetchSiteContentWithLegacy(
        "internships.page",
        defaultInternshipsPage,
        { key: "careers.page", map: extractInternshipsPageContent },
      );
      return {
        ...draft,
        title: internships.perksHeading,
        nav_label: internships.perksHeading,
        content: {
          headline: internships.perksHeading,
          intro: "",
          items: internships.internPerks.map((item) => ({ ...item })),
        },
      };
    }
    case "careers-talent-pool": {
      const careers = await fetchSiteContent("careers.page", defaultCareersPage);
      return {
        ...draft,
        title: careers.talentPoolTitle,
        nav_label: careers.talentPoolTitle,
        content: {
          intro: careers.talentPoolBody,
          buttonLabel: careers.talentPoolButtonLabel,
          buttonHref: careers.talentPoolButtonHref,
          secondaryButtonLabel: "",
          secondaryButtonHref: "",
        },
      };
    }
    case "internships-application-cta": {
      const internships = await fetchSiteContentWithLegacy(
        "internships.page",
        defaultInternshipsPage,
        { key: "careers.page", map: extractInternshipsPageContent },
      );
      return {
        ...draft,
        title: internships.applicationCtaTitle,
        nav_label: internships.applicationCtaTitle,
        content: {
          intro: internships.applicationCtaBody,
          buttonLabel: internships.applyButtonLabel,
          buttonHref: internships.applyButtonHref,
          secondaryButtonLabel: "",
          secondaryButtonHref: "",
        },
      };
    }
    case "home-hero-stats": {
      const hero = await fetchSiteContent("home.hero", {
        headline: "",
        intro: "",
        primaryCtaLabel: "",
        primaryCtaHref: "",
        secondaryCtaLabel: "",
        secondaryCtaHref: "",
        stats: [],
      });
      return {
        ...draft,
        title: "Stats",
        nav_label: "Stats",
        content: {
          intro: "",
          items: hero.stats.map((item) => ({ ...item })),
        },
      };
    }
    default:
      return draft;
  }
}

export const getSectionHref = (pageSlug: ManagedPageSlug, anchor: string) => {
  const path = getManagedPagePath(pageSlug);
  return path === "/" ? `/#${anchor}` : `${path}#${anchor}`;
};

export const normalizeNavigationHref = (href: string) => (href.startsWith("#") ? `/${href}` : href);

export function mergeNavigationItems<T extends { href: string }>(manualItems: T[], autoItems: T[]) {
  const seen = new Set<string>();
  const merged: T[] = [];
  const items = [...manualItems, ...autoItems].sort((left, right) => {
    const leftOrder = "sort_order" in left && typeof left.sort_order === "number" ? left.sort_order : 0;
    const rightOrder = "sort_order" in right && typeof right.sort_order === "number" ? right.sort_order : 0;
    return leftOrder - rightOrder;
  });

  for (const item of items) {
    const key = normalizeNavigationHref(item.href);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }

  return merged;
}

export const buildAutoNavigation = (
  location: "header" | "footer",
  structures: Partial<Record<ManagedPageSlug, PageStructureContent>>,
  pageSections: Partial<Record<ManagedPageSlug, PageSectionDraft[]>>,
): AutoNavigationItem[] => {
  const items: AutoNavigationItem[] = [];

  managedPages.forEach((page, pageIndex) => {
    const structure = structures[page.slug] || getDefaultPageStructure(page.slug);
    const sections = [...(pageSections[page.slug] || [])].sort((left, right) => left.sort_order - right.sort_order);
    const placements = getPlacementOptions(page.slug);
    let visibleNavIndex = 0;

    const pushFlexibleItems = (placementValue: string, baseOrder: number) => {
      getSectionsForPlacement(sections, placementValue).forEach((section, sectionIndex) => {
        const shouldShow = location === "header" ? section.show_in_header : section.show_in_footer;
        if (!section.is_published || !shouldShow) return;
        items.push({
          location,
          label: normalizeNavLabel(section.nav_label, section.title),
          href: getSectionHref(page.slug, section.section_key),
          is_external: false,
          sort_order: pageIndex * 100 + baseOrder + sectionIndex * 0.01,
          is_active: true,
        });
      });
    };

    getBuiltInSectionDefinitions(page.slug).forEach((builtIn) => {
      const linkedPlacements = placements.filter((placement) => placement.afterSectionId === builtIn.id);
      const section = structure.sections.find((item) => item.id === builtIn.id);
      const shouldShow = section ? (location === "header" ? section.showInHeader : section.showInFooter) : false;
      const builtInOrder = visibleNavIndex;

      if (section) {
        if (section.visible && shouldShow) {
          items.push({
            location,
            label: normalizeNavLabel(section.navLabel, section.label),
            href: getSectionHref(page.slug, section.anchor),
            is_external: false,
            sort_order: pageIndex * 100 + builtInOrder,
            is_active: true,
          });
          visibleNavIndex += 1;
        }
      }

      linkedPlacements.forEach((placement, placementIndex) => {
        const baseOrder =
          section && section.visible && shouldShow
            ? builtInOrder + 0.5 + placementIndex * 0.1
            : visibleNavIndex - 0.5 + placementIndex * 0.1;
        pushFlexibleItems(placement.value, baseOrder);
      });
    });
  });

  return items;
};

export const createStorableSectionContent = <T extends PageSectionType>(section: PageSectionDraft<T>) =>
  withSectionMeta(section.content, {
    placement: section.placement,
    navLabel: normalizeNavLabel(section.nav_label, section.title || getSectionTypeLabel(section.section_type)),
    showInHeader: section.show_in_header,
    showInFooter: section.show_in_footer,
  });
