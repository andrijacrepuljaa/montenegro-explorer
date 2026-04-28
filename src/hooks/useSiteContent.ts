import { useEffect, useState } from "react";
import { fetchSiteContent, fetchSiteContentWithLegacy, type NavigationItem } from "@/lib/cms";
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

    supabase
      .from("navigation_items")
      .select("*")
      .eq("location", location)
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (mounted && data && data.length > 0) setItems(data);
      });

    return () => {
      mounted = false;
    };
  }, [location]);

  return items;
}
