import { useEffect, useState } from "react";
import { fetchSiteContent, fetchSiteContentWithLegacy, type NavigationItem } from "@/lib/cms";
import {
  buildAutoNavigation,
  fetchPageSections,
  fetchPageStructure,
  getDefaultPageStructure,
  managedPages,
  mergeNavigationItems,
  normalizeNavigationHref,
  type ManagedPageSlug,
  type PageSectionDraft,
  type PageStructureContent,
} from "@/lib/pageSections";
import { supabase } from "@/integrations/supabase/client";

export function useSiteContent<T extends object>(key: string, fallback: T) {
  const [content, setContent] = useState(fallback);

  useEffect(() => {
    let mounted = true;

    fetchSiteContent(key, fallback).then((nextContent) => {
      if (mounted) setContent(nextContent);
    });

    return () => {
      mounted = false;
    };
  }, [key, fallback]);

  return content;
}

export function useSiteContentWithLegacy<T extends object>(
  key: string,
  fallback: T,
  legacyKey: string,
  mapLegacy: (content: unknown) => Partial<T>,
) {
  const [content, setContent] = useState(fallback);

  useEffect(() => {
    let mounted = true;

    fetchSiteContentWithLegacy(key, fallback, { key: legacyKey, map: mapLegacy }).then((nextContent) => {
      if (mounted) setContent(nextContent);
    });

    return () => {
      mounted = false;
    };
  }, [fallback, key, legacyKey, mapLegacy]);

  return content;
}

export function useNavigationItems(location: "header" | "footer", fallback: NavigationItem[]) {
  const [items, setItems] = useState(fallback);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      supabase
        .from("navigation_items")
        .select("*")
        .eq("location", location)
        .eq("is_active", true)
        .order("sort_order"),
      Promise.all(managedPages.map(async (page) => [page.slug, await fetchPageStructure(page.slug)] as const)),
      Promise.all(managedPages.map(async (page) => [page.slug, await fetchPageSections(page.slug)] as const)),
    ]).then(([navResult, structureEntries, pageSectionEntries]) => {
      if (!mounted) return;

      const fallbackItems = fallback.filter((item) => !item.href.startsWith("#"));
      const manualItems = navResult.data && navResult.data.length > 0 ? navResult.data : fallbackItems;
      const structures = Object.fromEntries(structureEntries) as Partial<Record<ManagedPageSlug, PageStructureContent>>;
      const pageSections = Object.fromEntries(pageSectionEntries) as Partial<Record<ManagedPageSlug, PageSectionDraft[]>>;
      const autoItems = buildAutoNavigation(location, structures, pageSections);
      const autoHrefs = new Set(autoItems.map((item) => normalizeNavigationHref(item.href)));
      const extraManualItems = manualItems.filter((item) => !autoHrefs.has(normalizeNavigationHref(item.href)));

      setItems(mergeNavigationItems(extraManualItems, autoItems));
    });

    return () => {
      mounted = false;
    };
  }, [fallback, location]);

  return items;
}

export function usePageSections(pageSlug: ManagedPageSlug) {
  const [sections, setSections] = useState<PageSectionDraft[]>([]);

  useEffect(() => {
    let mounted = true;

    fetchPageSections(pageSlug).then((nextSections) => {
      if (mounted) setSections(nextSections);
    });

    return () => {
      mounted = false;
    };
  }, [pageSlug]);

  return sections;
}

export function usePageStructure(pageSlug: ManagedPageSlug) {
  const [structure, setStructure] = useState<PageStructureContent>(getDefaultPageStructure(pageSlug));

  useEffect(() => {
    let mounted = true;

    fetchPageStructure(pageSlug).then((nextStructure) => {
      if (mounted) setStructure(nextStructure);
    });

    return () => {
      mounted = false;
    };
  }, [pageSlug]);

  return structure;
}
