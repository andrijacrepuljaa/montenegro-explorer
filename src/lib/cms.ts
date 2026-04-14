import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export type JsonRecord = Record<string, unknown>;

export type StatItem = {
  value: string;
  label: string;
};

export type IconContentItem = {
  iconName: string;
  title: string;
  description: string;
};

export type CompanyContactContent = {
  email: string;
  officeName: string;
  street: string;
  city: string;
  country: string;
  linkedinUrl: string;
};

export type HomeHeroContent = {
  headline: string;
  intro: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  stats: StatItem[];
};

export type HomeAboutContent = {
  headline: string;
  body: string[];
  pillars: IconContentItem[];
};

export type SectionIntroContent = {
  eyebrow?: string;
  headline: string;
  intro: string;
  buttonLabel?: string;
  buttonHref?: string;
};

export type CareersPageContent = {
  headline: string;
  intro: string;
  careersHeading: string;
  positionsHeading: string;
  noOpeningsTitle: string;
  noOpeningsBody: string;
  talentPoolTitle: string;
  talentPoolBody: string;
  talentPoolButtonLabel: string;
  internshipHeading: string;
  internshipIntro: string[];
  preferredFieldsHeading: string;
  preferredFields: string[];
  careerPerks: IconContentItem[];
  internPerks: IconContentItem[];
};

export type ContactPageContent = {
  headline: string;
  intro: string;
  formHelper: string;
  successTitle: string;
  successBody: string;
};

export type NavigationItem = {
  id?: string;
  location: "header" | "footer";
  label: string;
  href: string;
  is_external: boolean;
  sort_order: number;
  is_active: boolean;
};

export type SeoPage = {
  slug: string;
  title: string;
  description: string;
  og_title: string | null;
  og_description: string | null;
  og_image_path: string | null;
  canonical_path: string | null;
  no_index: boolean;
  is_published: boolean;
};

export type MediaAsset = {
  id: string;
  bucket: string;
  path: string;
  alt_text: string | null;
  caption: string | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  size_bytes: number | null;
  created_at: string;
};

export const defaultCompanyContact: CompanyContactContent = {
  email: "info@kgc.co.me",
  officeName: "Arsenal Business Club",
  street: "Seljanovo B.B.",
  city: "Tivat",
  country: "Montenegro",
  linkedinUrl: "https://www.linkedin.com/in/velibor-kastratovic/",
};

export const defaultHomeHero: HomeHeroContent = {
  headline: "Execution-Ready Supply Chain and Growth Consulting",
  intro:
    "From Montenegro, KGC helps teams across Europe optimize operations, sharpen digital strategy, and deliver complex work with measurable momentum.",
  primaryCtaLabel: "Our Expertise",
  primaryCtaHref: "#expertise",
  secondaryCtaLabel: "Get in Touch",
  secondaryCtaHref: "/contact",
  stats: [
    { value: "7+", label: "Years of Excellence" },
    { value: "15+", label: "Countries Served" },
    { value: "50+", label: "Projects Delivered" },
  ],
};

export const defaultHomeAbout: HomeAboutContent = {
  headline: "Management Consulting from Montenegro to the World",
  body: [
    "KGC d.o.o. is a management consulting firm headquartered in Tivat, Montenegro. We specialize in supply chain consulting, digital marketing strategy, and project management, helping businesses across Europe and beyond optimize their operations and accelerate growth.",
    "Our team combines deep industry expertise with a hands-on, collaborative approach. We do not just advise; we embed ourselves in your challenges to deliver measurable, lasting results.",
  ],
  pillars: [
    {
      iconName: "Target",
      title: "Precision",
      description: "Data-driven strategies tailored to your unique challenges and market position.",
    },
    {
      iconName: "Lightbulb",
      title: "Innovation",
      description: "Blending proven methodologies with fresh thinking to unlock new opportunities.",
    },
    {
      iconName: "TrendingUp",
      title: "Impact",
      description: "Measurable results that drive sustainable growth and operational excellence.",
    },
    {
      iconName: "Users",
      title: "Partnership",
      description: "Collaborative engagement with your teams, not work done in isolation.",
    },
  ],
};

export const defaultExpertiseIntro: SectionIntroContent = {
  headline: "What We Deliver",
  intro:
    "Practical support across supply chain, project management, and digital marketing, shaped around the outcomes your team needs to deliver.",
};

export const defaultHomeContactCta: SectionIntroContent = {
  eyebrow: "Contact",
  headline: "Ready to Discuss a Project?",
  intro: "Share the challenge, timeline, and outcome you are aiming for. We will help you find the right next step.",
  buttonLabel: "Start a Conversation",
  buttonHref: "/contact",
};

export const defaultCareersPage: CareersPageContent = {
  headline: "Join Our Team",
  intro: "Build your career in management consulting with a team that values impact, growth, and collaboration.",
  careersHeading: "Why KGC?",
  positionsHeading: "Open Positions",
  noOpeningsTitle: "No active openings right now",
  noOpeningsBody:
    "We still review strong profiles in supply chain, project management, digital marketing, data analytics, and business strategy. Send your CV and a short note so we can keep you in mind for the right future role.",
  talentPoolTitle: "Don't see the right role?",
  talentPoolBody:
    "We're always looking for exceptional talent. Send us your CV and we'll keep you in mind for future openings.",
  talentPoolButtonLabel: "Send Your CV",
  internshipHeading: "KGC Internship Programme",
  internshipIntro: [
    "Our structured internship programme offers ambitious graduates the opportunity to gain real-world consulting experience alongside seasoned professionals.",
    "Interns at KGC work on live client projects, participate in training sessions, and receive dedicated mentorship. It's not an observation role; you'll be an active contributor from day one.",
  ],
  preferredFieldsHeading: "Preferred Fields",
  preferredFields: [
    "Supply Chain & Logistics",
    "Digital Marketing",
    "Project Management",
    "Data Analytics",
    "Business Strategy",
  ],
  careerPerks: [
    {
      iconName: "Rocket",
      title: "Challenging Projects",
      description: "Work on complex consulting engagements with Fortune 500 and mid-market clients across multiple industries.",
    },
    {
      iconName: "Globe",
      title: "International Exposure",
      description: "Collaborate with teams and clients across 15+ countries, gaining invaluable cross-cultural experience.",
    },
    {
      iconName: "Briefcase",
      title: "Career Growth",
      description: "Clear progression paths with mentorship from senior consultants who have decades of global experience.",
    },
    {
      iconName: "Coffee",
      title: "Flexible Environment",
      description: "Remote-first culture that values output and impact over hours spent at a desk.",
    },
  ],
  internPerks: [
    {
      iconName: "Rocket",
      title: "Real Projects",
      description: "Work on live consulting engagements, not busy work. Your contributions will have real impact.",
    },
    {
      iconName: "GraduationCap",
      title: "Structured Mentorship",
      description: "Learn directly from experienced consultants with dedicated 1:1 mentoring sessions.",
    },
    {
      iconName: "Globe",
      title: "Global Perspective",
      description: "Gain exposure to international business practices and cross-border consulting.",
    },
    {
      iconName: "Coffee",
      title: "Flexible & Remote",
      description: "Work remotely with flexible hours, designed to fit alongside your studies or other commitments.",
    },
  ],
};

export const defaultContactPage: ContactPageContent = {
  headline: "Let's Start a Conversation",
  intro: "Reach out to discuss how KGC can help transform your business operations.",
  formHelper: "This form opens a prepared email draft so you can review it before sending.",
  successTitle: "Email Draft Opened",
  successBody: "Your message is ready in your email app. Please review and send it from there.",
};

export const defaultHeaderNavigation: NavigationItem[] = [
  { location: "header", label: "About", href: "#about", is_external: false, sort_order: 0, is_active: true },
  { location: "header", label: "Expertise", href: "#expertise", is_external: false, sort_order: 1, is_active: true },
  { location: "header", label: "Milestones", href: "#milestones", is_external: false, sort_order: 2, is_active: true },
  { location: "header", label: "Careers", href: "/careers", is_external: false, sort_order: 3, is_active: true },
];

export const defaultFooterNavigation: NavigationItem[] = [
  { location: "footer", label: "About", href: "#about", is_external: false, sort_order: 0, is_active: true },
  { location: "footer", label: "Expertise", href: "#expertise", is_external: false, sort_order: 1, is_active: true },
  { location: "footer", label: "Milestones", href: "#milestones", is_external: false, sort_order: 2, is_active: true },
  { location: "footer", label: "Careers", href: "/careers", is_external: false, sort_order: 3, is_active: true },
  { location: "footer", label: "Contact", href: "/contact", is_external: false, sort_order: 4, is_active: true },
];

const isRecord = (value: unknown): value is JsonRecord => typeof value === "object" && value !== null && !Array.isArray(value);

const mergeContent = <T extends object>(fallback: T, content: unknown): T => {
  if (!isRecord(content)) return fallback;
  return { ...fallback, ...content } as T;
};

export async function fetchSiteContent<T extends object>(key: string, fallback: T): Promise<T> {
  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("key", key)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) return fallback;
  return mergeContent(fallback, data.content);
}

export async function upsertSiteContent<T extends object>(
  key: string,
  label: string,
  description: string,
  content: T,
) {
  return supabase.from("site_content").upsert(
    {
      key,
      label,
      description,
      content: content as unknown as Json,
      is_published: true,
    },
    { onConflict: "key" },
  );
}

export function getPublicMediaUrl(path: string, bucket = "site-media") {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
