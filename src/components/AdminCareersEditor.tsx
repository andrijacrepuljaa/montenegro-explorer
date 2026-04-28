import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Briefcase, FileText, GraduationCap, Rocket, Trash2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  defaultCareersPage,
  defaultInternshipsPage,
  extractInternshipsPageContent,
  hasLegacyInternshipContent,
  upsertSiteContent,
  type CareersPageContent,
  type IconContentItem,
  type InternshipsPageContent,
} from "@/lib/cms";
import { fetchCmsContent, fetchCmsContentWithLegacy, newCareer, type CareerDraft } from "@/lib/adminCms";
import { areaClass, clone, compactLines, fromLines, inputClass, mutedLabelClass, panelClass, toLines, useBeforeUnload, useScrollToPanel } from "@/lib/adminUi";
import { EmptyState, Field, LoadingPanel, SaveBar, ToggleField } from "@/components/AdminShared";
import { AdminIconPicker } from "@/components/AdminIconPicker";
import { CareersPagePreview, InternshipsPagePreview, OpeningsListPreview } from "@/components/AdminLivePreview";
import { SectionJumpBar } from "@/components/AdminPageMap";

type OpeningsTab = "careers" | "internships";

function OpeningsCard({
  item,
  index,
  title,
  activePanel,
  panel,
  onUpdate,
  onDelete,
}: {
  item: CareerDraft;
  index: number;
  title: string;
  activePanel?: string;
  panel: string;
  onUpdate: (index: number, patch: Partial<CareerDraft>) => void;
  onDelete: (index: number) => void;
}) {
  return (
    <div className={`rounded-md border p-4 ${activePanel === panel ? "border-primary/40" : "border-border"}`}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className={mutedLabelClass}>{title} #{index + 1}</p>
          <h3 className="mt-1 text-base font-semibold">{item.title || "Untitled opening"}</h3>
        </div>
        <div className="flex gap-2">
          <ToggleField label="Active" checked={item.is_active} onChange={(checked) => onUpdate(index, { is_active: checked })} />
          <button onClick={() => onDelete(index)} className="inline-flex items-center gap-2 rounded-md border border-destructive/30 px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Title"><input className={inputClass} value={item.title} onChange={(event) => onUpdate(index, { title: event.target.value })} /></Field>
        <Field label="Type"><input className={inputClass} value={item.type} onChange={(event) => onUpdate(index, { type: event.target.value })} /></Field>
        <Field label="Location"><input className={inputClass} value={item.location} onChange={(event) => onUpdate(index, { location: event.target.value })} /></Field>
        <Field label="Apply URL"><input className={inputClass} value={item.apply_url || ""} onChange={(event) => onUpdate(index, { apply_url: event.target.value })} /></Field>
        <Field label="Closing date"><input type="date" className={inputClass} value={item.closing_date || ""} onChange={(event) => onUpdate(index, { closing_date: event.target.value || null })} /></Field>
        <Field label="Sort order"><input type="number" className={inputClass} value={item.sort_order} onChange={(event) => onUpdate(index, { sort_order: Number(event.target.value) || 0 })} /></Field>
        <Field label="Description"><textarea className={areaClass} value={item.description} onChange={(event) => onUpdate(index, { description: event.target.value })} /></Field>
        <Field label="Requirements" hint="One requirement per line."><textarea className={areaClass} value={toLines(item.requirements)} onChange={(event) => onUpdate(index, { requirements: fromLines(event.target.value) })} /></Field>
      </div>
    </div>
  );
}

function PerkEditor({
  label,
  items,
  onAdd,
  onUpdate,
  onRemove,
}: {
  label: string;
  items: IconContentItem[];
  onAdd: () => void;
  onUpdate: (index: number, patch: Partial<IconContentItem>) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{label}</h3>
        <button onClick={onAdd} className="text-sm font-semibold text-primary">Add perk</button>
      </div>
      <div className="space-y-3">
        {items.map((perk, index) => (
          <div key={`${perk.title}-${index}`} className="rounded-md border border-border p-3">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Title"><input className={inputClass} value={perk.title} onChange={(event) => onUpdate(index, { title: event.target.value })} /></Field>
              <Field label="Icon"><AdminIconPicker value={perk.iconName} onChange={(value) => onUpdate(index, { iconName: value })} label={`${label} icon`} /></Field>
            </div>
            <div className="mt-3"><Field label="Description"><textarea className={areaClass} value={perk.description} onChange={(event) => onUpdate(index, { description: event.target.value })} /></Field></div>
            <button onClick={() => onRemove(index)} className="mt-3 text-xs font-semibold text-destructive">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

async function saveOpenings(items: CareerDraft[], tab: OpeningsTab) {
  const { data: existing, error: existingError } = await supabase.from("career_openings").select("id").eq("tab", tab);
  if (existingError) throw existingError;

  const currentIds = items.map((item) => item.id).filter(Boolean) as string[];
  const toDelete = (existing || []).filter((item) => !currentIds.includes(item.id));

  for (const item of toDelete) {
    const { error } = await supabase.from("career_openings").delete().eq("id", item.id);
    if (error) throw error;
  }

  for (const item of items) {
    const payload = {
      title: item.title.trim(),
      type: item.type.trim(),
      location: item.location.trim(),
      description: item.description.trim(),
      tab,
      requirements: item.requirements.map((requirement) => requirement.trim()).filter(Boolean),
      apply_url: item.apply_url?.trim() || null,
      closing_date: item.closing_date || null,
      is_active: item.is_active,
      sort_order: item.sort_order,
    };
    const result = item.id
      ? await supabase.from("career_openings").update(payload).eq("id", item.id)
      : await supabase.from("career_openings").insert(payload);
    if (result.error) throw result.error;
  }
}

function useOpeningsEditor(tab: OpeningsTab) {
  const [items, setItems] = useState<CareerDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  useBeforeUnload(dirty);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("career_openings").select("*").eq("tab", tab).order("sort_order");
      if (error) throw error;
      setItems((data || []).map(({ created_at, updated_at, ...item }) => item));
      setDirty(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Openings could not load.");
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    load();
  }, [load]);

  const updateItem = (index: number, patch: Partial<CareerDraft>) => {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
    setDirty(true);
  };

  const addOpening = () => {
    const next = newCareer(items.length);
    next.tab = tab;
    next.type = tab === "internships" ? "Internship" : "Full-time";
    setItems((current) => [...current, next]);
    setDirty(true);
  };

  const deleteItem = (index: number) => {
    if (!window.confirm("Remove this opening? It will be deleted when you save changes.")) return;
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await saveOpenings(items, tab);
      toast.success(tab === "internships" ? "Internship openings saved." : "Career openings saved.");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Openings could not save.");
    } finally {
      setSaving(false);
    }
  };

  return {
    items,
    loading,
    saving,
    dirty,
    updateItem,
    addOpening,
    deleteItem,
    save,
  };
}

export function CareersPageEditor({
  activePanel,
  onSelectPanel,
}: {
  activePanel?: string;
  onSelectPanel: (panel: string) => void;
}) {
  const [content, setContent] = useState<CareersPageContent>(clone(defaultCareersPage));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  useBeforeUnload(dirty);
  useScrollToPanel(activePanel);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const pageContent = await fetchCmsContent("careers.page", defaultCareersPage);
      setContent(pageContent);
      setDirty(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Careers page content could not load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updatePerk = (index: number, patch: Partial<IconContentItem>) => {
    setContent((current) => ({
      ...current,
      careerPerks: current.careerPerks.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const { data: rows, error } = await supabase.from("site_content").select("key, content").in("key", ["careers.page", "internships.page"]);
      if (error) throw error;

      const existingCareers = rows?.find((row) => row.key === "careers.page");
      const existingInternships = rows?.find((row) => row.key === "internships.page");

      if (!existingInternships && hasLegacyInternshipContent(existingCareers?.content)) {
        const migratedInternships = {
          ...defaultInternshipsPage,
          ...extractInternshipsPageContent(existingCareers?.content),
        };
        await upsertSiteContent(
          "internships.page",
          "Internships page copy",
          "Standalone internship programme page content.",
          migratedInternships,
        );
      }

      await upsertSiteContent("careers.page", "Careers page copy", "Standalone careers page content and CTAs.", content);
      setDirty(false);
      toast.success("Careers page content saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Careers page content could not save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingPanel />;

  return (
    <div>
      <SaveBar title="Careers Page" description="Edit the standalone careers page layout, perks, and cross-links." saving={saving} onSave={save} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_24rem]">
        <div className="space-y-6">
          <SectionJumpBar
            title="Page Map"
            description="Edit the hero, career perks, openings messages, and cross-page CTAs separately."
            activePanel={activePanel}
            onSelect={onSelectPanel}
            sections={[
              { panel: "careers-hero", label: "Hero", icon: FileText },
              { panel: "career-perks", label: "Perks", icon: Users },
              { panel: "career-positions", label: "Positions", icon: Briefcase },
              { panel: "career-ctas", label: "CTAs", icon: Rocket },
            ]}
          />

          <section className={panelClass} data-admin-panel="careers-hero">
            <p className={mutedLabelClass}>Hero</p>
            <div className="mt-4 grid gap-4">
              <Field label="Headline"><input className={inputClass} value={content.headline} onChange={(event) => { setContent({ ...content, headline: event.target.value }); setDirty(true); }} /></Field>
              <Field label="Intro"><textarea className={areaClass} value={content.intro} onChange={(event) => { setContent({ ...content, intro: event.target.value }); setDirty(true); }} /></Field>
            </div>
          </section>

          <section className={panelClass} data-admin-panel="career-perks">
            <p className={mutedLabelClass}>Perks</p>
            <div className="mt-4 grid gap-4">
              <Field label="Section heading"><input className={inputClass} value={content.careersHeading} onChange={(event) => { setContent({ ...content, careersHeading: event.target.value }); setDirty(true); }} /></Field>
              <PerkEditor
                label="Career perks"
                items={content.careerPerks}
                onAdd={() => { setContent({ ...content, careerPerks: [...content.careerPerks, { iconName: "Rocket", title: "", description: "" }] }); setDirty(true); }}
                onUpdate={updatePerk}
                onRemove={(index) => { setContent({ ...content, careerPerks: content.careerPerks.filter((_, itemIndex) => itemIndex !== index) }); setDirty(true); }}
              />
            </div>
          </section>

          <section className={panelClass} data-admin-panel="career-positions">
            <p className={mutedLabelClass}>Openings messaging</p>
            <div className="mt-4 grid gap-4">
              <Field label="Positions heading"><input className={inputClass} value={content.positionsHeading} onChange={(event) => { setContent({ ...content, positionsHeading: event.target.value }); setDirty(true); }} /></Field>
              <Field label="No openings title"><input className={inputClass} value={content.noOpeningsTitle} onChange={(event) => { setContent({ ...content, noOpeningsTitle: event.target.value }); setDirty(true); }} /></Field>
              <Field label="No openings body"><textarea className={areaClass} value={content.noOpeningsBody} onChange={(event) => { setContent({ ...content, noOpeningsBody: event.target.value }); setDirty(true); }} /></Field>
            </div>
          </section>

          <section className={panelClass} data-admin-panel="career-ctas">
            <p className={mutedLabelClass}>Calls to action</p>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Field label="Talent pool title"><input className={inputClass} value={content.talentPoolTitle} onChange={(event) => { setContent({ ...content, talentPoolTitle: event.target.value }); setDirty(true); }} /></Field>
              <Field label="Talent pool button label"><input className={inputClass} value={content.talentPoolButtonLabel} onChange={(event) => { setContent({ ...content, talentPoolButtonLabel: event.target.value }); setDirty(true); }} /></Field>
              <Field label="Talent pool body"><textarea className={areaClass} value={content.talentPoolBody} onChange={(event) => { setContent({ ...content, talentPoolBody: event.target.value }); setDirty(true); }} /></Field>
              <Field label="Talent pool button link"><input className={inputClass} value={content.talentPoolButtonHref} onChange={(event) => { setContent({ ...content, talentPoolButtonHref: event.target.value }); setDirty(true); }} /></Field>
              <Field label="Internships card title"><input className={inputClass} value={content.internshipsLinkTitle} onChange={(event) => { setContent({ ...content, internshipsLinkTitle: event.target.value }); setDirty(true); }} /></Field>
              <Field label="Internships button label"><input className={inputClass} value={content.internshipsLinkLabel} onChange={(event) => { setContent({ ...content, internshipsLinkLabel: event.target.value }); setDirty(true); }} /></Field>
              <div className="lg:col-span-2">
                <Field label="Internships card body"><textarea className={areaClass} value={content.internshipsLinkBody} onChange={(event) => { setContent({ ...content, internshipsLinkBody: event.target.value }); setDirty(true); }} /></Field>
              </div>
              <Field label="Internships button link"><input className={inputClass} value={content.internshipsLinkHref} onChange={(event) => { setContent({ ...content, internshipsLinkHref: event.target.value }); setDirty(true); }} /></Field>
            </div>
          </section>
        </div>

        <CareersPagePreview content={content} activePanel={activePanel} />
      </div>
    </div>
  );
}

export function InternshipsPageEditor({
  activePanel,
  onSelectPanel,
}: {
  activePanel?: string;
  onSelectPanel: (panel: string) => void;
}) {
  const [content, setContent] = useState<InternshipsPageContent>(clone(defaultInternshipsPage));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  useBeforeUnload(dirty);
  useScrollToPanel(activePanel);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const pageContent = await fetchCmsContentWithLegacy("internships.page", defaultInternshipsPage, {
        key: "careers.page",
        map: extractInternshipsPageContent,
      });
      setContent(pageContent);
      setDirty(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Internships page content could not load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updatePerk = (index: number, patch: Partial<IconContentItem>) => {
    setContent((current) => ({
      ...current,
      internPerks: current.internPerks.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...content,
        programIntro: compactLines(content.programIntro),
        preferredFields: compactLines(content.preferredFields),
      };
      await upsertSiteContent("internships.page", "Internships page copy", "Standalone internship programme page content.", payload);
      setContent(payload);
      setDirty(false);
      toast.success("Internships page content saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Internships page content could not save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingPanel />;

  return (
    <div>
      <SaveBar title="Internships Page" description="Edit the dedicated internship programme page and its cross-link back to careers." saving={saving} onSave={save} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_24rem]">
        <div className="space-y-6">
          <SectionJumpBar
            title="Page Map"
            description="Edit the hero, programme copy, internship perks, and cross-page CTAs separately."
            activePanel={activePanel}
            onSelect={onSelectPanel}
            sections={[
              { panel: "internships-hero", label: "Hero", icon: FileText },
              { panel: "internship-programme", label: "Programme", icon: GraduationCap },
              { panel: "internship-perks", label: "Perks", icon: Users },
              { panel: "internship-ctas", label: "CTAs", icon: Rocket },
            ]}
          />

          <section className={panelClass} data-admin-panel="internships-hero">
            <p className={mutedLabelClass}>Hero</p>
            <div className="mt-4 grid gap-4">
              <Field label="Headline"><input className={inputClass} value={content.headline} onChange={(event) => { setContent({ ...content, headline: event.target.value }); setDirty(true); }} /></Field>
              <Field label="Intro"><textarea className={areaClass} value={content.intro} onChange={(event) => { setContent({ ...content, intro: event.target.value }); setDirty(true); }} /></Field>
            </div>
          </section>

          <section className={panelClass} data-admin-panel="internship-programme">
            <p className={mutedLabelClass}>Programme</p>
            <div className="mt-4 grid gap-4">
              <Field label="Programme heading"><input className={inputClass} value={content.programHeading} onChange={(event) => { setContent({ ...content, programHeading: event.target.value }); setDirty(true); }} /></Field>
              <Field label="Programme intro" hint="One paragraph per line."><textarea className={areaClass} value={toLines(content.programIntro)} onChange={(event) => { setContent({ ...content, programIntro: fromLines(event.target.value) }); setDirty(true); }} /></Field>
              <Field label="Preferred fields heading"><input className={inputClass} value={content.preferredFieldsHeading} onChange={(event) => { setContent({ ...content, preferredFieldsHeading: event.target.value }); setDirty(true); }} /></Field>
              <Field label="Preferred fields" hint="One field per line."><textarea className={areaClass} value={toLines(content.preferredFields)} onChange={(event) => { setContent({ ...content, preferredFields: fromLines(event.target.value) }); setDirty(true); }} /></Field>
            </div>
          </section>

          <section className={panelClass} data-admin-panel="internship-perks">
            <p className={mutedLabelClass}>Perks</p>
            <div className="mt-4 grid gap-4">
              <Field label="Section heading"><input className={inputClass} value={content.perksHeading} onChange={(event) => { setContent({ ...content, perksHeading: event.target.value }); setDirty(true); }} /></Field>
              <PerkEditor
                label="Intern perks"
                items={content.internPerks}
                onAdd={() => { setContent({ ...content, internPerks: [...content.internPerks, { iconName: "Rocket", title: "", description: "" }] }); setDirty(true); }}
                onUpdate={updatePerk}
                onRemove={(index) => { setContent({ ...content, internPerks: content.internPerks.filter((_, itemIndex) => itemIndex !== index) }); setDirty(true); }}
              />
            </div>
          </section>

          <section className={panelClass} data-admin-panel="internship-ctas">
            <p className={mutedLabelClass}>Calls to action</p>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Field label="Openings heading"><input className={inputClass} value={content.positionsHeading} onChange={(event) => { setContent({ ...content, positionsHeading: event.target.value }); setDirty(true); }} /></Field>
              <Field label="Apply button label"><input className={inputClass} value={content.applyButtonLabel} onChange={(event) => { setContent({ ...content, applyButtonLabel: event.target.value }); setDirty(true); }} /></Field>
              <Field label="No openings title"><input className={inputClass} value={content.noOpeningsTitle} onChange={(event) => { setContent({ ...content, noOpeningsTitle: event.target.value }); setDirty(true); }} /></Field>
              <Field label="Apply button link"><input className={inputClass} value={content.applyButtonHref} onChange={(event) => { setContent({ ...content, applyButtonHref: event.target.value }); setDirty(true); }} /></Field>
              <div className="lg:col-span-2">
                <Field label="No openings body"><textarea className={areaClass} value={content.noOpeningsBody} onChange={(event) => { setContent({ ...content, noOpeningsBody: event.target.value }); setDirty(true); }} /></Field>
              </div>
              <Field label="Careers card title"><input className={inputClass} value={content.careersLinkTitle} onChange={(event) => { setContent({ ...content, careersLinkTitle: event.target.value }); setDirty(true); }} /></Field>
              <Field label="Careers button label"><input className={inputClass} value={content.careersLinkLabel} onChange={(event) => { setContent({ ...content, careersLinkLabel: event.target.value }); setDirty(true); }} /></Field>
              <div className="lg:col-span-2">
                <Field label="Careers card body"><textarea className={areaClass} value={content.careersLinkBody} onChange={(event) => { setContent({ ...content, careersLinkBody: event.target.value }); setDirty(true); }} /></Field>
              </div>
              <Field label="Careers button link"><input className={inputClass} value={content.careersLinkHref} onChange={(event) => { setContent({ ...content, careersLinkHref: event.target.value }); setDirty(true); }} /></Field>
            </div>
          </section>
        </div>

        <InternshipsPagePreview content={content} activePanel={activePanel} />
      </div>
    </div>
  );
}

export function CareerOpeningsEditor({
  activePanel,
  onSelectPanel,
}: {
  activePanel?: string;
  onSelectPanel: (panel: string) => void;
}) {
  const { items, loading, saving, updateItem, addOpening, deleteItem, save } = useOpeningsEditor("careers");
  useScrollToPanel(activePanel);

  if (loading) return <LoadingPanel />;

  return (
    <div>
      <SaveBar title="Career Openings" description="Add, sort, and publish full-time role listings separately from page copy." saving={saving} onSave={save} onAdd={addOpening} addLabel="Add role" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_24rem]">
        <div className="space-y-6">
          <SectionJumpBar
            title="Editor"
            description="All full-time role cards are managed here."
            activePanel={activePanel}
            onSelect={onSelectPanel}
            sections={[{ panel: "career-openings-list", label: "Career Roles", icon: Briefcase }]}
          />
          <section className={panelClass} data-admin-panel="career-openings-list">
            <p className={mutedLabelClass}>Career roles</p>
            <div className="mt-4 space-y-4">
              {items.length === 0 ? (
                <EmptyState title="No career roles yet" body="Add your first full-time opening, then save changes to publish it." />
              ) : (
                items.map((item, index) => (
                  <OpeningsCard
                    key={item.id || `career-${index}`}
                    item={item}
                    index={index}
                    title="Career role"
                    activePanel={activePanel}
                    panel="career-openings-list"
                    onUpdate={updateItem}
                    onDelete={deleteItem}
                  />
                ))
              )}
            </div>
          </section>
        </div>

        <OpeningsListPreview title="Career Openings" eyebrow="Career role" items={items} />
      </div>
    </div>
  );
}

export function InternshipOpeningsEditor({
  activePanel,
  onSelectPanel,
}: {
  activePanel?: string;
  onSelectPanel: (panel: string) => void;
}) {
  const { items, loading, saving, updateItem, addOpening, deleteItem, save } = useOpeningsEditor("internships");
  useScrollToPanel(activePanel);

  if (loading) return <LoadingPanel />;

  return (
    <div>
      <SaveBar title="Internship Openings" description="Manage internship listings separately from the internship page layout and supporting copy." saving={saving} onSave={save} onAdd={addOpening} addLabel="Add internship" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_24rem]">
        <div className="space-y-6">
          <SectionJumpBar
            title="Editor"
            description="All internship listings are managed here."
            activePanel={activePanel}
            onSelect={onSelectPanel}
            sections={[{ panel: "internship-openings-list", label: "Internships", icon: GraduationCap }]}
          />
          <section className={panelClass} data-admin-panel="internship-openings-list">
            <p className={mutedLabelClass}>Internship listings</p>
            <div className="mt-4 space-y-4">
              {items.length === 0 ? (
                <EmptyState title="No internships yet" body="Add your first internship opportunity, then save changes to publish it." />
              ) : (
                items.map((item, index) => (
                  <OpeningsCard
                    key={item.id || `internship-${index}`}
                    item={item}
                    index={index}
                    title="Internship"
                    activePanel={activePanel}
                    panel="internship-openings-list"
                    onUpdate={updateItem}
                    onDelete={deleteItem}
                  />
                ))
              )}
            </div>
          </section>
        </div>

        <OpeningsListPreview title="Internship Openings" eyebrow="Internship" items={items} />
      </div>
    </div>
  );
}
