import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ExternalLink, FileText, Link2, Loader2, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getPublicMediaUrl, type MediaAsset } from "@/lib/cms";
import { newNavigationItem, newSeoPage, type NavigationDraft, type SeoDraft } from "@/lib/adminCms";
import { areaClass, inputClass, mutedLabelClass, panelClass, useBeforeUnload } from "@/lib/adminUi";
import { EmptyState, Field, LoadingPanel, SaveBar, ToggleField } from "@/components/AdminShared";

export function NavigationEditor() {
  const [items, setItems] = useState<NavigationDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  useBeforeUnload(dirty);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("navigation_items").select("*").order("location").order("sort_order");
    if (error) toast.error(error.message);
    else {
      setItems((data || []).map(({ created_at, updated_at, location, ...item }) => ({ ...item, location: location === "footer" ? "footer" : "header" })));
      setDirty(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateItem = (index: number, patch: Partial<NavigationDraft>) => {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const { data: existing, error: existingError } = await supabase.from("navigation_items").select("id");
      if (existingError) throw existingError;
      const currentIds = items.map((item) => item.id).filter(Boolean) as string[];
      const toDelete = (existing || []).filter((item) => !currentIds.includes(item.id));
      for (const item of toDelete) {
        const { error } = await supabase.from("navigation_items").delete().eq("id", item.id);
        if (error) throw error;
      }
      for (const item of items) {
        const payload = {
          location: item.location,
          label: item.label.trim(),
          href: item.href.trim(),
          is_external: item.is_external,
          sort_order: item.sort_order,
          is_active: item.is_active,
        };
        const result = item.id
          ? await supabase.from("navigation_items").update(payload).eq("id", item.id)
          : await supabase.from("navigation_items").insert(payload);
        if (result.error) throw result.error;
      }
      toast.success("Navigation saved.");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Navigation could not save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingPanel />;

  return (
    <div>
      <SaveBar title="Navigation" description="Manage header and footer links." saving={saving} onSave={save} onAdd={() => { setItems([...items, newNavigationItem("header", items.length)]); setDirty(true); }} addLabel="Add link" />
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id || `nav-${index}`} className={panelClass}>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className={mutedLabelClass}>{item.location} link</p>
                <h3 className="mt-1 text-lg font-semibold">{item.label || "Untitled link"}</h3>
              </div>
              <div className="flex gap-2">
                <ToggleField label="Active" checked={item.is_active} onChange={(checked) => updateItem(index, { is_active: checked })} />
                <button onClick={() => { if (window.confirm("Remove this navigation item?")) { setItems(items.filter((_, itemIndex) => itemIndex !== index)); setDirty(true); } }} className="inline-flex items-center gap-2 rounded-md border border-destructive/30 px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-5">
              <Field label="Location">
                <select className={inputClass} value={item.location} onChange={(event) => updateItem(index, { location: event.target.value as "header" | "footer" })}>
                  <option value="header">Header</option>
                  <option value="footer">Footer</option>
                </select>
              </Field>
              <Field label="Label"><input className={inputClass} value={item.label} onChange={(event) => updateItem(index, { label: event.target.value })} /></Field>
              <div className="lg:col-span-2"><Field label="Link"><input className={inputClass} value={item.href} onChange={(event) => updateItem(index, { href: event.target.value })} /></Field></div>
              <Field label="Sort order"><input type="number" className={inputClass} value={item.sort_order} onChange={(event) => updateItem(index, { sort_order: Number(event.target.value) || 0 })} /></Field>
              <ToggleField label="External link" checked={item.is_external} onChange={(checked) => updateItem(index, { is_external: checked })} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SeoEditor() {
  const [items, setItems] = useState<SeoDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  useBeforeUnload(dirty);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("seo_pages").select("*").order("slug");
    if (error) toast.error(error.message);
    else {
      setItems(data || []);
      setDirty(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateItem = (index: number, patch: Partial<SeoDraft>) => {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      for (const item of items) {
        const { error } = await supabase.from("seo_pages").upsert(
          {
            slug: item.slug.trim(),
            title: item.title.trim(),
            description: item.description.trim(),
            og_title: item.og_title?.trim() || null,
            og_description: item.og_description?.trim() || null,
            og_image_path: item.og_image_path?.trim() || null,
            canonical_path: item.canonical_path?.trim() || null,
            no_index: item.no_index,
            is_published: item.is_published,
          },
          { onConflict: "slug" },
        );
        if (error) throw error;
      }
      toast.success("SEO settings saved.");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "SEO settings could not save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingPanel />;

  return (
    <div>
      <SaveBar title="SEO" description="Manage search snippets and social sharing content for key pages." saving={saving} onSave={save} onAdd={() => { setItems([...items, newSeoPage()]); setDirty(true); }} addLabel="Add page" />
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.slug || `seo-${index}`} className={panelClass}>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className={mutedLabelClass}>SEO page</p>
                <h3 className="mt-1 text-lg font-semibold">{item.slug || "new-page"}</h3>
              </div>
              <div className="flex gap-2">
                <ToggleField label="Published" checked={item.is_published} onChange={(checked) => updateItem(index, { is_published: checked })} />
                <ToggleField label="No index" checked={item.no_index} onChange={(checked) => updateItem(index, { no_index: checked })} />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <Field label="Slug"><input className={inputClass} value={item.slug} onChange={(event) => updateItem(index, { slug: event.target.value })} /></Field>
              <Field label="Canonical path"><input className={inputClass} value={item.canonical_path || ""} onChange={(event) => updateItem(index, { canonical_path: event.target.value })} /></Field>
              <Field label="Meta title"><input className={inputClass} value={item.title} onChange={(event) => updateItem(index, { title: event.target.value })} /></Field>
              <Field label="Meta description"><textarea className={areaClass} value={item.description} onChange={(event) => updateItem(index, { description: event.target.value })} /></Field>
              <Field label="Open Graph title"><input className={inputClass} value={item.og_title || ""} onChange={(event) => updateItem(index, { og_title: event.target.value })} /></Field>
              <Field label="Open Graph description"><textarea className={areaClass} value={item.og_description || ""} onChange={(event) => updateItem(index, { og_description: event.target.value })} /></Field>
              <Field label="Open Graph image path"><input className={inputClass} value={item.og_image_path || ""} onChange={(event) => updateItem(index, { og_image_path: event.target.value })} /></Field>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MediaEditor() {
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("media_assets").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const upload = async () => {
    if (!file) {
      toast.error("Choose a file first.");
      return;
    }
    setUploading(true);
    try {
      const safeName = file.name.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
      const path = `uploads/${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from("site-media").upload(path, file, { cacheControl: "3600", upsert: false });
      if (uploadError) throw uploadError;
      const { error: insertError } = await supabase.from("media_assets").insert({
        bucket: "site-media",
        path,
        alt_text: altText.trim() || null,
        mime_type: file.type || null,
        size_bytes: file.size,
      });
      if (insertError) throw insertError;
      setFile(null);
      setAltText("");
      toast.success("Media uploaded.");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Media could not upload.");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (item: MediaAsset) => {
    if (!window.confirm("Delete this media asset? This removes it from storage and the CMS list.")) return;
    const { error: storageError } = await supabase.storage.from(item.bucket).remove([item.path]);
    if (storageError) {
      toast.error(storageError.message);
      return;
    }
    const { error } = await supabase.from("media_assets").delete().eq("id", item.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Media deleted.");
      load();
    }
  };

  return (
    <div>
      <SaveBar title="Media" description="Upload assets for pages, SEO images, and future content blocks." />
      <section className={panelClass}>
        <p className={mutedLabelClass}>Upload</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <Field label="File"><input type="file" className={inputClass} onChange={(event) => setFile(event.target.files?.[0] || null)} /></Field>
          <Field label="Alt text"><input className={inputClass} value={altText} onChange={(event) => setAltText(event.target.value)} placeholder="Describe the image for accessibility" /></Field>
          <button onClick={upload} disabled={uploading} className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload
          </button>
        </div>
      </section>
      <section className="mt-6">
        {loading ? (
          <LoadingPanel />
        ) : items.length === 0 ? (
          <EmptyState title="No media yet" body="Upload images here once you need editable visuals or social sharing images." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const url = getPublicMediaUrl(item.path, item.bucket);
              return (
                <div key={item.id} className={panelClass}>
                  {item.mime_type?.startsWith("image/") ? (
                    <img src={url} alt={item.alt_text || ""} className="mb-4 aspect-video w-full rounded-md object-cover" />
                  ) : (
                    <div className="mb-4 flex aspect-video items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <FileText className="h-8 w-8" />
                    </div>
                  )}
                  <p className="break-all text-sm font-semibold">{item.path}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.alt_text || "No alt text"}</p>
                  <div className="mt-4 flex gap-2">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-muted">
                      <ExternalLink className="h-4 w-4" />
                      Open
                    </a>
                    <button onClick={() => navigator.clipboard.writeText(item.path).then(() => toast.success("Path copied."))} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-muted">
                      <Link2 className="h-4 w-4" />
                      Copy path
                    </button>
                    <button onClick={() => remove(item)} className="ml-auto inline-flex items-center gap-2 rounded-md border border-destructive/30 px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export function SettingsEditor({ userEmail }: { userEmail?: string }) {
  return (
    <div>
      <SaveBar title="Settings" description="Admin notes and current account state." />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className={panelClass}>
          <p className={mutedLabelClass}>Signed in as</p>
          <h2 className="mt-2 text-lg font-semibold">{userEmail || "Admin user"}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Access is controlled by Supabase Auth plus the public.user_roles table. Only users with the admin role can edit content.
          </p>
        </section>
        <section className={panelClass}>
          <p className={mutedLabelClass}>Secrets</p>
          <h2 className="mt-2 text-lg font-semibold">Keep .env local</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Do not commit Supabase keys or Vercel environment values. The migration file is safe to keep in the repository, but .env should remain local.
          </p>
        </section>
      </div>
    </div>
  );
}
