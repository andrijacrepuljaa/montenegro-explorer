import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type FallbackSeo = {
  title: string;
  description: string;
};

const upsertMeta = (selector: string, create: () => HTMLMetaElement, value: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = create();
    document.head.appendChild(element);
  }
  element.content = value;
};

export function usePageSeo(slug: string, fallback: FallbackSeo) {
  useEffect(() => {
    let mounted = true;

    const applySeo = ({
      title,
      description,
      ogTitle,
      ogDescription,
      ogImage,
      noIndex,
    }: {
      title: string;
      description: string;
      ogTitle?: string | null;
      ogDescription?: string | null;
      ogImage?: string | null;
      noIndex?: boolean;
    }) => {
      document.title = title;
      upsertMeta("meta[name='description']", () => {
        const meta = document.createElement("meta");
        meta.name = "description";
        return meta;
      }, description);
      upsertMeta("meta[property='og:title']", () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:title");
        return meta;
      }, ogTitle || title);
      upsertMeta("meta[property='og:description']", () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:description");
        return meta;
      }, ogDescription || description);
      if (ogImage) {
        upsertMeta("meta[property='og:image']", () => {
          const meta = document.createElement("meta");
          meta.setAttribute("property", "og:image");
          return meta;
        }, ogImage);
      }
      let robots = document.head.querySelector<HTMLMetaElement>("meta[name='robots']");
      if (noIndex) {
        if (!robots) {
          robots = document.createElement("meta");
          robots.name = "robots";
          document.head.appendChild(robots);
        }
        robots.content = "noindex,nofollow";
      } else {
        robots?.remove();
      }
    };

    applySeo(fallback);

    supabase
      .from("seo_pages")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle()
      .then(({ data }) => {
        if (!mounted || !data) return;
        applySeo({
          title: data.title || fallback.title,
          description: data.description || fallback.description,
          ogTitle: data.og_title,
          ogDescription: data.og_description,
          ogImage: data.og_image_path,
          noIndex: data.no_index,
        });
      });

    return () => {
      mounted = false;
    };
  }, [fallback, slug]);
}
