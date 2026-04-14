import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { defaultCareersPage, upsertSiteContent, type CareersPageContent, type IconContentItem } from "@/lib/cms";
import { fetchCmsContent, newCareer, type CareerDraft } from "@/lib/adminCms";
import { areaClass, clone, fromLines, inputClass, mutedLabelClass, panelClass, toLines, useBeforeUnload } from "@/lib/adminUi";
import { EmptyState, Field, LoadingPanel, SaveBar, ToggleField } from "@/components/AdminShared";

export function CareersEditor() {
  const [items, setItems] = useState<CareerDraft[]>([]);
  const [content, setContent] = useState<CareersPageContent>(clone(defaultCareersPage));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  useBeforeUnload(dirty);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [openings, pageContent] = await Promise.all([
        supabase.from("career_openings").select("*").order("sort_order"),
        fetchCmsContent("careers.page", defaultCareersPage),
      ]);
      if (openings.error) throw openings.error;
      setItems((openings.data || []).map(({ created_at, updated_at, ...item }) => item));
      setContent(pageContent);
      setDirty(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Careers content could not load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateItem = (index: number, patch: Partial<CareerDraft>) => {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
    setDirty(true);
  };

  const updatePerk = (kind: "careerPerks" | "internPerks", index: number, patch: Partial<IconContentItem>) => {
    setContent((current) => ({
      ...current,
      [kind]: current[kind].map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await upsertSiteContent("careers.page", "Careers page copy", "Careers and internship page intro copy.", content);
      const { data: existing, error: existingError } = await supabase.from("career_openings").select("id");
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
          tab: item.tab,
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
      toast.success("Careers content saved.");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Careers content could not save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingPanel />;

  return (
    <div>
      <SaveBar title="Careers" description="Edit careers page copy, perks, internships, and open roles." saving={saving} onSave={save} onAdd={() => { setItems([...items, newCareer(items.length)]); setDirty(true); }} addLabel="Add opening" />
      <div className="space-y-6">
        <section className={panelClass}>
          <p className={mutedLabelClass}>Page copy</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Field label="Page headline"><input className={inputClass} value={content.headline} onChange={(event) => { setContent({ ...content, headline: event.target.value }); setDirty(true); }} /></Field>
            <Field label="Page intro"><textarea className={areaClass} value={content.intro} onChange={(event) => { setContent({ ...content, intro: event.target.value }); setDirty(true); }} /></Field>
            <Field label="Careers heading"><input className={inputClass} value={content.careersHeading} onChange={(event) => { setContent({ ...content, careersHeading: event.target.value }); setDirty(true); }} /></Field>
            <Field label="Positions heading"><input className={inputClass} value={content.positionsHeading} onChange={(event) => { setContent({ ...content, positionsHeading: event.target.value }); setDirty(true); }} /></Field>
            <Field label="No openings title"><input className={inputClass} value={content.noOpeningsTitle} onChange={(event) => { setContent({ ...content, noOpeningsTitle: event.target.value }); setDirty(true); }} /></Field>
            <Field label="No openings body"><textarea className={areaClass} value={content.noOpeningsBody} onChange={(event) => { setContent({ ...content, noOpeningsBody: event.target.value }); setDirty(true); }} /></Field>
            <Field label="Talent pool title"><input className={inputClass} value={content.talentPoolTitle} onChange={(event) => { setContent({ ...content, talentPoolTitle: event.target.value }); setDirty(true); }} /></Field>
            <Field label="Talent pool body"><textarea className={areaClass} value={content.talentPoolBody} onChange={(event) => { setContent({ ...content, talentPoolBody: event.target.value }); setDirty(true); }} /></Field>
            <Field label="Talent pool button"><input className={inputClass} value={content.talentPoolButtonLabel} onChange={(event) => { setContent({ ...content, talentPoolButtonLabel: event.target.value }); setDirty(true); }} /></Field>
            <Field label="Internship heading"><input className={inputClass} value={content.internshipHeading} onChange={(event) => { setContent({ ...content, internshipHeading: event.target.value }); setDirty(true); }} /></Field>
            <Field label="Internship intro" hint="One paragraph per line."><textarea className={areaClass} value={toLines(content.internshipIntro)} onChange={(event) => { setContent({ ...content, internshipIntro: fromLines(event.target.value) }); setDirty(true); }} /></Field>
            <Field label="Preferred fields" hint="One field per line."><textarea className={areaClass} value={toLines(content.preferredFields)} onChange={(event) => { setContent({ ...content, preferredFields: fromLines(event.target.value) }); setDirty(true); }} /></Field>
          </div>
        </section>

        <section className={panelClass}>
          <div className="grid gap-6 xl:grid-cols-2">
            {(["careerPerks", "internPerks"] as const).map((kind) => (
              <div key={kind}>
                <div className="mb-3 flex items-center justify-between">
                  <p className={mutedLabelClass}>{kind === "careerPerks" ? "Career perks" : "Intern perks"}</p>
                  <button onClick={() => { setContent({ ...content, [kind]: [...content[kind], { iconName: "Rocket", title: "", description: "" }] }); setDirty(true); }} className="text-sm font-semibold text-primary">Add item</button>
                </div>
                <div className="space-y-3">
                  {content[kind].map((perk, index) => (
                    <div key={`${kind}-${index}`} className="rounded-md border border-border p-3">
                      <div className="grid gap-3 md:grid-cols-2">
                        <Field label="Title"><input className={inputClass} value={perk.title} onChange={(event) => updatePerk(kind, index, { title: event.target.value })} /></Field>
                        <Field label="Icon name"><input className={inputClass} value={perk.iconName} onChange={(event) => updatePerk(kind, index, { iconName: event.target.value })} /></Field>
                      </div>
                      <div className="mt-3"><Field label="Description"><textarea className={areaClass} value={perk.description} onChange={(event) => updatePerk(kind, index, { description: event.target.value })} /></Field></div>
                      <button onClick={() => { setContent({ ...content, [kind]: content[kind].filter((_, itemIndex) => itemIndex !== index) }); setDirty(true); }} className="mt-3 text-xs font-semibold text-destructive">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          {items.length === 0 ? (
            <EmptyState title="No openings yet" body="Add roles or internships only when you want them listed on the careers page." />
          ) : (
            items.map((career, index) => (
              <div key={career.id || `career-${index}`} className={panelClass}>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className={mutedLabelClass}>Opening #{index + 1}</p>
                    <h3 className="mt-1 text-lg font-semibold">{career.title || "Untitled opening"}</h3>
                  </div>
                  <div className="flex gap-2">
                    <ToggleField label="Active" checked={career.is_active} onChange={(checked) => updateItem(index, { is_active: checked })} />
                    <button onClick={() => { if (window.confirm("Remove this opening? It will be deleted when you save changes.")) { setItems(items.filter((_, itemIndex) => itemIndex !== index)); setDirty(true); } }} className="inline-flex items-center gap-2 rounded-md border border-destructive/30 px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <Field label="Title"><input className={inputClass} value={career.title} onChange={(event) => updateItem(index, { title: event.target.value })} /></Field>
                  <Field label="Tab">
                    <select className={inputClass} value={career.tab} onChange={(event) => updateItem(index, { tab: event.target.value })}>
                      <option value="careers">Careers</option>
                      <option value="internships">Internships</option>
                    </select>
                  </Field>
                  <Field label="Type"><input className={inputClass} value={career.type} onChange={(event) => updateItem(index, { type: event.target.value })} /></Field>
                  <Field label="Location"><input className={inputClass} value={career.location} onChange={(event) => updateItem(index, { location: event.target.value })} /></Field>
                  <Field label="Apply URL"><input className={inputClass} value={career.apply_url || ""} onChange={(event) => updateItem(index, { apply_url: event.target.value })} /></Field>
                  <Field label="Closing date"><input type="date" className={inputClass} value={career.closing_date || ""} onChange={(event) => updateItem(index, { closing_date: event.target.value || null })} /></Field>
                  <Field label="Description"><textarea className={areaClass} value={career.description} onChange={(event) => updateItem(index, { description: event.target.value })} /></Field>
                  <Field label="Requirements" hint="One requirement per line."><textarea className={areaClass} value={toLines(career.requirements)} onChange={(event) => updateItem(index, { requirements: fromLines(event.target.value) })} /></Field>
                  <Field label="Sort order"><input type="number" className={inputClass} value={career.sort_order} onChange={(event) => updateItem(index, { sort_order: Number(event.target.value) || 0 })} /></Field>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
