import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { areaClass, fromLines, inputClass, mutedLabelClass, panelClass, toLines, useBeforeUnload } from "@/lib/adminUi";
import { EmptyState, Field, LoadingPanel, SaveBar, ToggleField } from "@/components/AdminShared";
import { newMilestone, newService, type MilestoneDraft, type ServiceDraft } from "@/lib/adminCms";

export function ServicesEditor() {
  const [items, setItems] = useState<ServiceDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  useBeforeUnload(dirty);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("services").select("*").order("sort_order");
    if (error) toast.error(error.message);
    else {
      setItems((data || []).map(({ created_at, updated_at, ...item }) => item));
      setDirty(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateItem = (index: number, patch: Partial<ServiceDraft>) => {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const { data: existing, error: existingError } = await supabase.from("services").select("id");
      if (existingError) throw existingError;
      const currentIds = items.map((item) => item.id).filter(Boolean) as string[];
      const toDelete = (existing || []).filter((item) => !currentIds.includes(item.id));
      for (const item of toDelete) {
        const { error } = await supabase.from("services").delete().eq("id", item.id);
        if (error) throw error;
      }
      for (const item of items) {
        const payload = {
          title: item.title.trim(),
          short: item.short.trim(),
          detail: item.detail.trim(),
          category: item.category.trim(),
          icon_name: item.icon_name.trim() || "Network",
          benefits: item.benefits.map((benefit) => benefit.trim()).filter(Boolean),
          sort_order: item.sort_order,
          is_active: item.is_active,
        };
        const result = item.id
          ? await supabase.from("services").update(payload).eq("id", item.id)
          : await supabase.from("services").insert(payload);
        if (result.error) throw result.error;
      }
      toast.success("Services saved.");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Services could not save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingPanel />;

  return (
    <div>
      <SaveBar title="Services" description="Manage the service cards and detail modals shown on the homepage." saving={saving} onSave={save} onAdd={() => { setItems([...items, newService(items.length)]); setDirty(true); }} addLabel="Add service" />
      {items.length === 0 ? (
        <EmptyState title="No services yet" body="Add your first service, then save changes to publish it." />
      ) : (
        <div className="space-y-4">
          {items.map((service, index) => (
            <div key={service.id || `service-${index}`} className={panelClass}>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className={mutedLabelClass}>Service #{index + 1}</p>
                  <h3 className="mt-1 text-lg font-semibold">{service.title || "Untitled service"}</h3>
                </div>
                <div className="flex gap-2">
                  <ToggleField label="Active" checked={service.is_active} onChange={(checked) => updateItem(index, { is_active: checked })} />
                  <button onClick={() => { if (window.confirm("Remove this service? It will be deleted when you save changes.")) { setItems(items.filter((_, itemIndex) => itemIndex !== index)); setDirty(true); } }} className="inline-flex items-center gap-2 rounded-md border border-destructive/30 px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <Field label="Title"><input className={inputClass} value={service.title} onChange={(event) => updateItem(index, { title: event.target.value })} /></Field>
                <Field label="Category"><input className={inputClass} value={service.category} onChange={(event) => updateItem(index, { category: event.target.value })} /></Field>
                <Field label="Short description"><input className={inputClass} value={service.short} onChange={(event) => updateItem(index, { short: event.target.value })} /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Icon name"><input className={inputClass} value={service.icon_name} onChange={(event) => updateItem(index, { icon_name: event.target.value })} /></Field>
                  <Field label="Sort order"><input type="number" className={inputClass} value={service.sort_order} onChange={(event) => updateItem(index, { sort_order: Number(event.target.value) || 0 })} /></Field>
                </div>
                <Field label="Full detail"><textarea className={areaClass} value={service.detail} onChange={(event) => updateItem(index, { detail: event.target.value })} /></Field>
                <Field label="Benefits" hint="One benefit per line."><textarea className={areaClass} value={toLines(service.benefits)} onChange={(event) => updateItem(index, { benefits: fromLines(event.target.value) })} /></Field>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function MilestonesEditor() {
  const [items, setItems] = useState<MilestoneDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  useBeforeUnload(dirty);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("milestones").select("*").order("sort_order");
    if (error) toast.error(error.message);
    else {
      setItems((data || []).map(({ created_at, updated_at, ...item }) => item));
      setDirty(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateItem = (index: number, patch: Partial<MilestoneDraft>) => {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const { data: existing, error: existingError } = await supabase.from("milestones").select("id");
      if (existingError) throw existingError;
      const currentIds = items.map((item) => item.id).filter(Boolean) as string[];
      const toDelete = (existing || []).filter((item) => !currentIds.includes(item.id));
      for (const item of toDelete) {
        const { error } = await supabase.from("milestones").delete().eq("id", item.id);
        if (error) throw error;
      }
      for (const item of items) {
        const payload = {
          year: item.year.trim(),
          title: item.title.trim(),
          description: item.description.trim(),
          highlights: item.highlights.map((highlight) => highlight.trim()).filter(Boolean),
          team_size: item.team_size?.trim() || null,
          sort_order: item.sort_order,
          is_active: item.is_active,
        };
        const result = item.id
          ? await supabase.from("milestones").update(payload).eq("id", item.id)
          : await supabase.from("milestones").insert(payload);
        if (result.error) throw result.error;
      }
      toast.success("Milestones saved.");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Milestones could not save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingPanel />;

  return (
    <div>
      <SaveBar title="Milestones" description="Manage the timeline that tells the KGC story." saving={saving} onSave={save} onAdd={() => { setItems([...items, newMilestone(items.length)]); setDirty(true); }} addLabel="Add milestone" />
      <div className="space-y-4">
        {items.map((milestone, index) => (
          <div key={milestone.id || `milestone-${index}`} className={panelClass}>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className={mutedLabelClass}>Milestone #{index + 1}</p>
                <h3 className="mt-1 text-lg font-semibold">{milestone.year || "New year"} - {milestone.title || "Untitled milestone"}</h3>
              </div>
              <div className="flex gap-2">
                <ToggleField label="Active" checked={milestone.is_active} onChange={(checked) => updateItem(index, { is_active: checked })} />
                <button onClick={() => { if (window.confirm("Remove this milestone? It will be deleted when you save changes.")) { setItems(items.filter((_, itemIndex) => itemIndex !== index)); setDirty(true); } }} className="inline-flex items-center gap-2 rounded-md border border-destructive/30 px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <Field label="Year"><input className={inputClass} value={milestone.year} onChange={(event) => updateItem(index, { year: event.target.value })} /></Field>
              <Field label="Title"><input className={inputClass} value={milestone.title} onChange={(event) => updateItem(index, { title: event.target.value })} /></Field>
              <Field label="Team size"><input className={inputClass} value={milestone.team_size || ""} onChange={(event) => updateItem(index, { team_size: event.target.value })} /></Field>
              <div className="lg:col-span-2">
                <Field label="Description"><textarea className={areaClass} value={milestone.description} onChange={(event) => updateItem(index, { description: event.target.value })} /></Field>
              </div>
              <Field label="Sort order"><input type="number" className={inputClass} value={milestone.sort_order} onChange={(event) => updateItem(index, { sort_order: Number(event.target.value) || 0 })} /></Field>
              <div className="lg:col-span-3">
                <Field label="Highlights" hint="One highlight per line."><textarea className={areaClass} value={toLines(milestone.highlights)} onChange={(event) => updateItem(index, { highlights: fromLines(event.target.value) })} /></Field>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
