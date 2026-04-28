import { useEffect } from "react";
import { fetchSiteContent } from "@/lib/cms";
import { applyThemePalette, defaultThemePalette, type ThemePalette } from "@/lib/themePalette";

export function useThemePalette() {
  useEffect(() => {
    let mounted = true;

    applyThemePalette(defaultThemePalette);

    fetchSiteContent<ThemePalette>("theme.palette", defaultThemePalette).then((palette) => {
      if (mounted) applyThemePalette(palette);
    });

    return () => {
      mounted = false;
    };
  }, []);
}
