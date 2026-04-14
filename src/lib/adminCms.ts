import { supabase } from "@/integrations/supabase/client";
import type { Json, Tables } from "@/integrations/supabase/types";
import type { NavigationItem, SeoPage } from "@/lib/cms";

export type ServiceDraft = Omit<Tables<"services">, "created_at" | "updated_at"> & { id?: string };
export type MilestoneDraft = Omit<Tables<"milestones">, "created_at" | "updated_at"> & { id?: string };
export type CareerDraft = Omit<Tables<"career_openings">, "created_at" | "updated_at"> & { id?: string };
export type NavigationDraft = NavigationItem;
export type SeoDraft = SeoPage;

export const toJson = <T extends object>(value: T) => value as unknown as Json;

export const mergeCmsContent = <T extends object>(fallback: T, content: unknown): T => {
  if (!content || typeof content !== "object" || Array.isArray(content)) return fallback;
  return { ...fallback, ...(content as Record<string, unknown>) } as T;
};

export async function fetchCmsContent<T extends object>(key: string, fallback: T) {
  const { data, error } = await supabase.from("site_content").select("content").eq("key", key).maybeSingle();
  if (error) throw error;
  return mergeCmsContent(fallback, data?.content);
}

export const newService = (sortOrder: number): ServiceDraft => ({
  title: "",
  short: "",
  detail: "",
  category: "Supply Chain",
  icon_name: "Network",
  benefits: [],
  sort_order: sortOrder,
  is_active: true,
});

export const newMilestone = (sortOrder: number): MilestoneDraft => ({
  year: "",
  title: "",
  description: "",
  highlights: [],
  team_size: null,
  sort_order: sortOrder,
  is_active: true,
});

export const newCareer = (sortOrder: number): CareerDraft => ({
  title: "",
  type: "Full-time",
  location: "Remote",
  description: "",
  tab: "careers",
  requirements: [],
  apply_url: null,
  closing_date: null,
  is_active: true,
  sort_order: sortOrder,
});

export const newNavigationItem = (location: "header" | "footer", sortOrder: number): NavigationDraft => ({
  location,
  label: "",
  href: "",
  is_external: false,
  sort_order: sortOrder,
  is_active: true,
});

export const newSeoPage = (): SeoDraft => ({
  slug: "",
  title: "",
  description: "",
  og_title: "",
  og_description: "",
  og_image_path: "",
  canonical_path: "",
  no_index: false,
  is_published: true,
});
