import { useEffect, useState } from "react";
import { Briefcase, FileText, Image, Milestone, Search, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { mutedLabelClass, panelClass } from "@/lib/adminUi";
import { LoadingPanel, SaveBar } from "@/components/AdminShared";

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    services: 0,
    milestones: 0,
    careers: 0,
    siteContent: 0,
    seo: 0,
    media: 0,
  });

  useEffect(() => {
    Promise.all([
      supabase.from("services").select("id", { count: "exact", head: true }),
      supabase.from("milestones").select("id", { count: "exact", head: true }),
      supabase.from("career_openings").select("id", { count: "exact", head: true }),
      supabase.from("site_content").select("key", { count: "exact", head: true }),
      supabase.from("seo_pages").select("slug", { count: "exact", head: true }),
      supabase.from("media_assets").select("id", { count: "exact", head: true }),
    ])
      .then(([services, milestones, careers, siteContent, seo, media]) => {
        setStats({
          services: services.count ?? 0,
          milestones: milestones.count ?? 0,
          careers: careers.count ?? 0,
          siteContent: siteContent.count ?? 0,
          seo: seo.count ?? 0,
          media: media.count ?? 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Services", value: stats.services, icon: Sparkles },
    { label: "Milestones", value: stats.milestones, icon: Milestone },
    { label: "Openings", value: stats.careers, icon: Briefcase },
    { label: "Content Blocks", value: stats.siteContent, icon: FileText },
    { label: "SEO Pages", value: stats.seo, icon: Search },
    { label: "Media Assets", value: stats.media, icon: Image },
  ];

  return (
    <div>
      <SaveBar title="Dashboard" description="A quick pulse check on the content powering the website." />
      {loading ? (
        <LoadingPanel />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <div key={card.label} className={panelClass}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className={mutedLabelClass}>{card.label}</p>
                  <p className="mt-2 text-3xl font-bold">{card.value}</p>
                </div>
                <div className="rounded-md bg-primary/10 p-3 text-primary">
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className={panelClass}>
          <p className={mutedLabelClass}>Recommended flow</p>
          <h2 className="mt-2 text-lg font-semibold">Edit content in small passes</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Update one section, save it, then check the live page. The public site keeps code fallbacks, so a missing CMS record will not blank the page.
          </p>
        </div>
        <div className={panelClass}>
          <p className={mutedLabelClass}>Publishing</p>
          <h2 className="mt-2 text-lg font-semibold">Vercel reads directly from Supabase</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Most copy and data edits are visible after refresh. Code or layout changes still need a Git push and Vercel deployment.
          </p>
        </div>
      </div>
    </div>
  );
}
