import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  FileText,
  LayoutTemplate,
  LineChart,
  Map,
  Plus,
  Rocket,
  Trash2,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageSectionsRenderer } from "@/components/FlexibleSectionsRenderer";
import { AdminIconPicker } from "@/components/AdminIconPicker";
import { EmptyState, Field, LoadingPanel, SaveBar, ToggleField } from "@/components/AdminShared";
import { SectionJumpBar } from "@/components/AdminPageMap";
import { cn } from "@/lib/utils";
import {
  areaClass,
  compactLines,
  fromLines,
  inputClass,
  mutedLabelClass,
  panelClass,
  toLines,
  useBeforeUnload,
  useScrollToPanel,
} from "@/lib/adminUi";
import {
  createStorableSectionContent,
  createPageSection,
  createSectionFromLayout,
  createSectionFromTemplate,
  getBuiltInSectionDefinition,
  fetchPageStructure,
  getBuiltInSectionDefinitions,
  getDefaultPageStructure,
  getFlexibleSectionSurfaceMap,
  getManagedPageLabel,
  getPlacementLabel,
  getPlacementOptions,
  getSectionLayout,
  getSectionTypeLabel,
  getSectionTemplate,
  managedPages,
  normalizeSectionKey,
  parsePageSection,
  sectionLayoutLibrary,
  type SectionLayoutDefinition,
  type PageSurface,
  type PageStructureContent,
  type ManagedPageSlug,
  type PageSectionDraft,
  type PageSectionType,
} from "@/lib/pageSections";

type ManagedPageState = (typeof managedPages)[number] & {
  structure: PageStructureContent;
  sections: PageSectionDraft[];
};

const sectionMeta: Array<{
  type: PageSectionType;
  icon: typeof FileText;
  description: string;
  examples: string[];
}> = [
  { type: "rich_text", icon: FileText, description: "Long-form content with a heading and editable paragraphs.", examples: ["Contact intro", "Internship programme intro"] },
  { type: "split_media", icon: LayoutTemplate, description: "A narrative split layout with text, bullets, image, and action buttons.", examples: ["Service spotlight", "Case study intro", "Programme overview"] },
  { type: "media_banner", icon: LayoutTemplate, description: "A large media-led banner with layered copy and one or two clear calls to action.", examples: ["Campaign highlight", "Event spotlight", "Landing page bridge"] },
  { type: "card_grid", icon: LayoutTemplate, description: "A reusable card grid for case studies, offers, or highlighted work.", examples: ["About value cards", "Careers perks", "Internship perks"] },
  { type: "timeline", icon: Map, description: "A milestone-style timeline with years, descriptions, and highlight tags.", examples: ["Homepage milestones"] },
  { type: "stats", icon: LineChart, description: "Short metrics or proof points in a clean responsive row.", examples: ["Homepage hero stats"] },
  { type: "testimonial_showcase", icon: Users, description: "A quote-led social proof section with attribution and optional links.", examples: ["Client stories", "Partner feedback", "Alumni quotes"] },
  { type: "faq_section", icon: FileText, description: "An expandable FAQ block with optional follow-up links and next-step actions.", examples: ["Process questions", "Hiring questions", "Service FAQs"] },
  { type: "cta", icon: Rocket, description: "A focused call-to-action block with one or two buttons.", examples: ["Homepage contact CTA", "Careers talent pool CTA"] },
  { type: "about_split", icon: FileText, description: "A full About-style split layout with rich text and value cards.", examples: ["Homepage About"] },
  { type: "icon_cards", icon: Users, description: "A four-card perks or values grid with icons and short descriptions.", examples: ["Careers perks", "Internship perks"] },
  { type: "services_grid", icon: LayoutTemplate, description: "The full services grid with categories, detail copy, and benefit lists.", examples: ["Homepage Expertise"] },
  { type: "milestones_spotlight", icon: Map, description: "The interactive milestones layout with the active year spotlighted.", examples: ["Homepage Milestones"] },
  { type: "contact_cta", icon: Rocket, description: "A full contact CTA band with the three contact cards below it.", examples: ["Homepage Contact CTA"] },
];

const linkFieldHint = "Use /page, /#section, https://..., mailto:, or tel:.";

function CardGridEditor({
  items,
  onAdd,
  onUpdate,
  onRemove,
}: {
  items: PageSectionDraft<"card_grid">["content"]["items"];
  onAdd: () => void;
  onUpdate: (index: number, patch: Partial<PageSectionDraft<"card_grid">["content"]["items"][number]>) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Cards</p>
        <button type="button" onClick={onAdd} className="text-sm font-semibold text-primary">Add card</button>
      </div>
      {items.map((item, index) => (
        <div key={`card-${index}`} className="rounded-md border border-border p-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Label">
              <input className={inputClass} value={item.eyebrow} onChange={(event) => onUpdate(index, { eyebrow: event.target.value })} />
            </Field>
            <Field label="Title">
              <input className={inputClass} value={item.title} onChange={(event) => onUpdate(index, { title: event.target.value })} />
            </Field>
          </div>
          <div className="mt-3">
            <Field label="Description">
              <textarea className={areaClass} value={item.description} onChange={(event) => onUpdate(index, { description: event.target.value })} />
            </Field>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <Field label="Link label">
              <input className={inputClass} value={item.linkLabel} onChange={(event) => onUpdate(index, { linkLabel: event.target.value })} />
            </Field>
            <Field label="Link URL" hint={linkFieldHint}>
              <input className={inputClass} value={item.linkHref} onChange={(event) => onUpdate(index, { linkHref: event.target.value })} />
            </Field>
          </div>
          <button type="button" onClick={() => onRemove(index)} className="mt-3 text-xs font-semibold text-destructive">Remove</button>
        </div>
      ))}
    </div>
  );
}

function TimelineEditor({
  items,
  onAdd,
  onUpdate,
  onRemove,
}: {
  items: PageSectionDraft<"timeline">["content"]["items"];
  onAdd: () => void;
  onUpdate: (index: number, patch: Partial<PageSectionDraft<"timeline">["content"]["items"][number]>) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Timeline items</p>
        <button type="button" onClick={onAdd} className="text-sm font-semibold text-primary">Add milestone</button>
      </div>
      {items.map((item, index) => (
        <div key={`timeline-${index}`} className="rounded-md border border-border p-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Year / marker">
              <input className={inputClass} value={item.year} onChange={(event) => onUpdate(index, { year: event.target.value })} />
            </Field>
            <Field label="Title">
              <input className={inputClass} value={item.title} onChange={(event) => onUpdate(index, { title: event.target.value })} />
            </Field>
          </div>
          <div className="mt-3">
            <Field label="Description">
              <textarea className={areaClass} value={item.description} onChange={(event) => onUpdate(index, { description: event.target.value })} />
            </Field>
          </div>
          <div className="mt-3">
            <Field label="Highlights" hint="One highlight per line.">
              <textarea
                className={areaClass}
                value={toLines(item.highlights)}
                onChange={(event) => onUpdate(index, { highlights: fromLines(event.target.value) })}
              />
            </Field>
          </div>
          <button type="button" onClick={() => onRemove(index)} className="mt-3 text-xs font-semibold text-destructive">Remove</button>
        </div>
      ))}
    </div>
  );
}

function StatsEditor({
  items,
  onAdd,
  onUpdate,
  onRemove,
}: {
  items: PageSectionDraft<"stats">["content"]["items"];
  onAdd: () => void;
  onUpdate: (index: number, patch: Partial<PageSectionDraft<"stats">["content"]["items"][number]>) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Stats</p>
        <button type="button" onClick={onAdd} className="text-sm font-semibold text-primary">Add stat</button>
      </div>
      {items.map((item, index) => (
        <div key={`stat-${index}`} className="grid gap-3 rounded-md border border-border p-3 md:grid-cols-[0.8fr_1fr_auto] md:items-end">
          <Field label="Value">
            <input className={inputClass} value={item.value} onChange={(event) => onUpdate(index, { value: event.target.value })} />
          </Field>
          <Field label="Label">
            <input className={inputClass} value={item.label} onChange={(event) => onUpdate(index, { label: event.target.value })} />
          </Field>
          <button type="button" onClick={() => onRemove(index)} className="rounded-md border border-destructive/30 px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10">
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

function IconCardsEditor({
  items,
  onAdd,
  onUpdate,
  onRemove,
}: {
  items: PageSectionDraft<"icon_cards">["content"]["items"];
  onAdd: () => void;
  onUpdate: (index: number, patch: Partial<PageSectionDraft<"icon_cards">["content"]["items"][number]>) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Cards</p>
        <button type="button" onClick={onAdd} className="text-sm font-semibold text-primary">Add card</button>
      </div>
      {items.map((item, index) => (
        <div key={`icon-card-${index}`} className="rounded-md border border-border p-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Title">
              <input className={inputClass} value={item.title} onChange={(event) => onUpdate(index, { title: event.target.value })} />
            </Field>
            <Field label="Icon">
              <AdminIconPicker value={item.iconName} onChange={(value) => onUpdate(index, { iconName: value })} label="Card icon" />
            </Field>
          </div>
          <div className="mt-3">
            <Field label="Description">
              <textarea className={areaClass} value={item.description} onChange={(event) => onUpdate(index, { description: event.target.value })} />
            </Field>
          </div>
          <button type="button" onClick={() => onRemove(index)} className="mt-3 text-xs font-semibold text-destructive">Remove</button>
        </div>
      ))}
    </div>
  );
}

function ServicesGridEditor({
  items,
  onAdd,
  onUpdate,
  onRemove,
}: {
  items: PageSectionDraft<"services_grid">["content"]["items"];
  onAdd: () => void;
  onUpdate: (index: number, patch: Partial<PageSectionDraft<"services_grid">["content"]["items"][number]>) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Service cards</p>
        <button type="button" onClick={onAdd} className="text-sm font-semibold text-primary">Add service</button>
      </div>
      {items.map((item, index) => (
        <div key={`service-template-${index}`} className="rounded-md border border-border p-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Title">
              <input className={inputClass} value={item.title} onChange={(event) => onUpdate(index, { title: event.target.value })} />
            </Field>
            <Field label="Category">
              <input className={inputClass} value={item.category} onChange={(event) => onUpdate(index, { category: event.target.value })} />
            </Field>
            <Field label="Icon">
              <AdminIconPicker value={item.iconName} onChange={(value) => onUpdate(index, { iconName: value })} label="Service icon" />
            </Field>
            <Field label="Short description">
              <input className={inputClass} value={item.short} onChange={(event) => onUpdate(index, { short: event.target.value })} />
            </Field>
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <Field label="Full detail">
              <textarea className={areaClass} value={item.detail} onChange={(event) => onUpdate(index, { detail: event.target.value })} />
            </Field>
            <Field label="Benefits" hint="One benefit per line.">
              <textarea className={areaClass} value={toLines(item.benefits)} onChange={(event) => onUpdate(index, { benefits: fromLines(event.target.value) })} />
            </Field>
          </div>
          <button type="button" onClick={() => onRemove(index)} className="mt-3 text-xs font-semibold text-destructive">Remove</button>
        </div>
      ))}
    </div>
  );
}

function TestimonialsEditor({
  items,
  onAdd,
  onUpdate,
  onRemove,
}: {
  items: PageSectionDraft<"testimonial_showcase">["content"]["items"];
  onAdd: () => void;
  onUpdate: (index: number, patch: Partial<PageSectionDraft<"testimonial_showcase">["content"]["items"][number]>) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Testimonials</p>
        <button type="button" onClick={onAdd} className="text-sm font-semibold text-primary">Add testimonial</button>
      </div>
      {items.map((item, index) => (
        <div key={`testimonial-${index}`} className="rounded-md border border-border p-3">
          <Field label="Quote">
            <textarea className={areaClass} value={item.quote} onChange={(event) => onUpdate(index, { quote: event.target.value })} />
          </Field>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <Field label="Name">
              <input className={inputClass} value={item.name} onChange={(event) => onUpdate(index, { name: event.target.value })} />
            </Field>
            <Field label="Role">
              <input className={inputClass} value={item.role} onChange={(event) => onUpdate(index, { role: event.target.value })} />
            </Field>
            <Field label="Company">
              <input className={inputClass} value={item.company} onChange={(event) => onUpdate(index, { company: event.target.value })} />
            </Field>
            <Field label="Link label">
              <input className={inputClass} value={item.linkLabel} onChange={(event) => onUpdate(index, { linkLabel: event.target.value })} />
            </Field>
            <Field label="Link URL" hint={linkFieldHint}>
              <input className={inputClass} value={item.linkHref} onChange={(event) => onUpdate(index, { linkHref: event.target.value })} />
            </Field>
          </div>
          <button type="button" onClick={() => onRemove(index)} className="mt-3 text-xs font-semibold text-destructive">Remove</button>
        </div>
      ))}
    </div>
  );
}

function FaqItemsEditor({
  items,
  onAdd,
  onUpdate,
  onRemove,
}: {
  items: PageSectionDraft<"faq_section">["content"]["items"];
  onAdd: () => void;
  onUpdate: (index: number, patch: Partial<PageSectionDraft<"faq_section">["content"]["items"][number]>) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Questions</p>
        <button type="button" onClick={onAdd} className="text-sm font-semibold text-primary">Add question</button>
      </div>
      {items.map((item, index) => (
        <div key={`faq-${index}`} className="rounded-md border border-border p-3">
          <Field label="Question">
            <input className={inputClass} value={item.question} onChange={(event) => onUpdate(index, { question: event.target.value })} />
          </Field>
          <div className="mt-3">
            <Field label="Answer">
              <textarea className={areaClass} value={item.answer} onChange={(event) => onUpdate(index, { answer: event.target.value })} />
            </Field>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <Field label="Helper link label">
              <input className={inputClass} value={item.linkLabel} onChange={(event) => onUpdate(index, { linkLabel: event.target.value })} />
            </Field>
            <Field label="Helper link URL" hint={linkFieldHint}>
              <input className={inputClass} value={item.linkHref} onChange={(event) => onUpdate(index, { linkHref: event.target.value })} />
            </Field>
          </div>
          <button type="button" onClick={() => onRemove(index)} className="mt-3 text-xs font-semibold text-destructive">Remove</button>
        </div>
      ))}
    </div>
  );
}

function LayoutPreview({
  layout: { id },
}: {
  layout: SectionLayoutDefinition;
}) {
  if (id.startsWith("split-")) {
    return (
      <div className="grid h-full grid-cols-2 gap-2">
        <div className="space-y-2 rounded-md border border-border bg-background p-3">
          <div className="h-2 w-14 rounded bg-primary/50" />
          <div className="space-y-1.5">
            <div className="h-3 w-4/5 rounded bg-foreground/15" />
            <div className="h-3 w-3/5 rounded bg-foreground/15" />
          </div>
          <div className="space-y-1.5">
            <div className="h-2 w-full rounded bg-foreground/10" />
            <div className="h-2 w-5/6 rounded bg-foreground/10" />
            <div className="h-2 w-2/3 rounded bg-foreground/10" />
          </div>
          <div className="flex gap-2">
            <div className="h-7 w-20 rounded bg-primary/60" />
            <div className="h-7 w-16 rounded border border-border" />
          </div>
        </div>
        <div className={cn("rounded-md border border-border", id === "split-spotlight" ? "bg-primary/20" : "bg-muted/40")} />
      </div>
    );
  }

  if (id.startsWith("banner-")) {
    return (
      <div className="h-full rounded-md border border-border bg-muted/40 p-3">
        <div className="flex h-full min-h-[8rem] flex-col justify-end rounded-md border border-border/60 bg-background/60 p-3">
          <div className="h-2 w-14 rounded bg-primary/50" />
          <div className="mt-2 h-3 w-4/5 rounded bg-foreground/15" />
          <div className="mt-1 h-3 w-2/3 rounded bg-foreground/15" />
          <div className="mt-3 flex gap-2">
            <div className="h-7 w-20 rounded bg-primary/60" />
            <div className="h-7 w-16 rounded border border-border" />
          </div>
        </div>
      </div>
    );
  }

  if (id.startsWith("testimonials-")) {
    return (
      <div className="grid h-full gap-2">
        <div className="space-y-1">
          <div className="h-2 w-16 rounded bg-primary/50" />
          <div className="h-3 w-1/2 rounded bg-foreground/15" />
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={cn("rounded-md border border-border bg-background p-3", index === 0 && id === "testimonials-mosaic" && "sm:col-span-2")}>
              <div className="space-y-1.5">
                <div className="h-2 w-full rounded bg-foreground/10" />
                <div className="h-2 w-5/6 rounded bg-foreground/10" />
                <div className="h-2 w-3/4 rounded bg-foreground/10" />
              </div>
              <div className="mt-3 h-2 w-1/2 rounded bg-foreground/15" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (id.startsWith("faq-")) {
    return (
      <div className={cn("grid h-full gap-2", id === "faq-split" && "sm:grid-cols-[0.8fr_1.2fr]")}>
        {id === "faq-split" ? <div className="rounded-md border border-border bg-background p-3" /> : null}
        <div className="grid gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-md border border-border bg-background px-3 py-2.5">
              <div className="h-3 w-3/4 rounded bg-foreground/15" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (id === "card-feature" || id === "card-staggered" || id === "icon-cards") {
    return (
      <div className="grid h-full grid-cols-2 gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={cn("rounded-md border border-border bg-background p-3", id === "card-staggered" && index === 0 && "col-span-2")}>
            <div className="h-2 w-8 rounded bg-primary/50" />
            <div className="mt-2 h-3 w-3/4 rounded bg-foreground/15" />
            <div className="mt-2 space-y-1.5">
              <div className="h-2 w-full rounded bg-foreground/10" />
              <div className="h-2 w-2/3 rounded bg-foreground/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (id === "timeline") {
    return (
      <div className="grid h-full gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-md border border-border bg-background p-3">
            <div className="h-3 w-10 rounded bg-primary/50" />
            <div className="mt-2 h-3 w-2/3 rounded bg-foreground/15" />
            <div className="mt-2 h-2 w-full rounded bg-foreground/10" />
          </div>
        ))}
      </div>
    );
  }

  if (id === "stats") {
    return (
      <div className="grid h-full grid-cols-2 gap-2 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-md border border-border bg-background p-3">
            <div className="h-4 w-10 rounded bg-primary/50" />
            <div className="mt-2 h-2 w-12 rounded bg-foreground/10" />
          </div>
        ))}
      </div>
    );
  }

  if (id.startsWith("cta-")) {
    return (
      id === "cta-split" ? (
        <div className="grid h-full grid-cols-[1fr_0.7fr] gap-2">
          <div className="rounded-md border border-border bg-background p-3">
            <div className="h-2 w-12 rounded bg-primary/50" />
            <div className="mt-2 h-3 w-1/2 rounded bg-foreground/15" />
            <div className="mt-3 h-2 w-3/4 rounded bg-foreground/10" />
          </div>
          <div className="rounded-md bg-primary/20 p-3">
            <div className="mt-8 h-7 w-full rounded bg-primary/60" />
          </div>
        </div>
      ) : (
        <div className="flex h-full min-h-[8rem] flex-col items-center justify-center rounded-md border border-border bg-background p-3 text-center">
          <div className="h-2 w-12 rounded bg-primary/50" />
          <div className="mt-2 h-3 w-1/2 rounded bg-foreground/15" />
          <div className="mt-3 h-2 w-3/4 rounded bg-foreground/10" />
          <div className="mt-4 h-7 w-24 rounded bg-primary/60" />
        </div>
      )
    );
  }

  return (
    <div className="grid h-full gap-2">
      <div className="h-2 w-12 rounded bg-primary/50" />
      <div className="h-3 w-2/3 rounded bg-foreground/15" />
      <div className="space-y-1.5">
        <div className="h-2 w-full rounded bg-foreground/10" />
        <div className="h-2 w-5/6 rounded bg-foreground/10" />
        <div className="h-2 w-2/3 rounded bg-foreground/10" />
      </div>
    </div>
  );
}

function LayoutPreviewCard({
  layout,
  selected,
  onSelect,
  onCreate,
}: {
  layout: SectionLayoutDefinition;
  selected: boolean;
  onSelect: () => void;
  onCreate: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-md border p-4 transition-colors",
        selected ? "border-primary bg-primary/5" : "border-border bg-background",
      )}
    >
      <button type="button" onClick={onSelect} className="block w-full text-left">
        <div className="aspect-[1.35/1] overflow-hidden rounded-md border border-border bg-muted/30 p-3">
          <LayoutPreview layout={layout} />
        </div>
        <h3 className="mt-4 text-sm font-semibold">{layout.label}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{layout.description}</p>
      </button>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Type: {getSectionTypeLabel(layout.sectionType)}</p>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-muted"
        >
          <Plus className="h-4 w-4" />
          Use layout
        </button>
      </div>
    </div>
  );
}

function BuiltInSectionEditorCard({
  pageSlug,
  section,
  onUpdate,
  onCreateEditableCopy,
}: {
  pageSlug: ManagedPageSlug;
  section: PageStructureContent["sections"][number];
  onUpdate: (patch: Partial<PageStructureContent["sections"][number]>) => void;
  onCreateEditableCopy?: () => void;
}) {
  const definition = getBuiltInSectionDefinition(pageSlug, section.id);
  const template = definition?.templateId ? getSectionTemplate(definition.templateId) : null;

  return (
    <div className="rounded-md border border-border p-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-start">
        <div>
          <p className={mutedLabelClass}>Built-in section</p>
          <h3 className="mt-1 text-base font-semibold">{section.label}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Anchor: <span className="font-mono text-xs">{section.anchor}</span> on {getManagedPageLabel(pageSlug)}
          </p>
          {definition ? (
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full border border-border px-2.5 py-1">{definition.pattern}</span>
              <span className="rounded-full border border-border px-2.5 py-1">
                {definition.surface === "dark" ? "Dark section" : "Light section"}
              </span>
              {template ? (
                <span className="rounded-full border border-border px-2.5 py-1">
                  Template: {template.label}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="grid gap-2">
          <ToggleField label="Visible" checked={section.visible} onChange={(checked) => onUpdate({ visible: checked })} />
          {template && onCreateEditableCopy ? (
            <button
              type="button"
              onClick={onCreateEditableCopy}
              className="inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-muted"
            >
              Create editable copy
            </button>
          ) : null}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <ToggleField label="Header" checked={section.showInHeader} onChange={(checked) => onUpdate({ showInHeader: checked })} />
          <ToggleField label="Footer" checked={section.showInFooter} onChange={(checked) => onUpdate({ showInFooter: checked })} />
        </div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Field label="Navigation label">
          <input className={inputClass} value={section.navLabel} onChange={(event) => onUpdate({ navLabel: event.target.value })} />
        </Field>
        <Field label="Anchor ID">
          <input className={inputClass} value={section.anchor} onChange={(event) => onUpdate({ anchor: normalizeSectionKey(event.target.value) || section.anchor })} />
        </Field>
      </div>
    </div>
  );
}

function SectionEditorCard({
  pageSlug,
  section,
  index,
  surface,
  onUpdate,
  onDuplicate,
  onDelete,
}: {
  pageSlug: ManagedPageSlug;
  section: PageSectionDraft;
  index: number;
  surface: PageSurface;
  onUpdate: (patch: Partial<PageSectionDraft>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const meta = sectionMeta.find((item) => item.type === section.section_type);
  const SectionIcon = meta?.icon || FileText;

  return (
    <div className="rounded-md border border-border p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className={mutedLabelClass}>Section #{index + 1}</p>
          <div className="mt-1 flex items-center gap-2">
            <SectionIcon className="h-4 w-4 text-primary" />
            <h3 className="text-base font-semibold">{section.title || getSectionTypeLabel(section.section_type)}</h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{meta?.description}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Renders {getPlacementLabel(pageSlug, section.placement).toLowerCase()} as a {surface === "dark" ? "dark" : "light"} section.
          </p>
          {meta?.examples?.length ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Closest current examples: {meta.examples.join(", ")}.
            </p>
          ) : null}
        </div>
        <div className="flex gap-2">
          <ToggleField label="Published" checked={section.is_published} onChange={(checked) => onUpdate({ is_published: checked })} />
          <button type="button" onClick={onDuplicate} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-muted">
            Duplicate
          </button>
          <button type="button" onClick={onDelete} className="inline-flex items-center gap-2 rounded-md border border-destructive/30 px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Section type">
          <select
            className={inputClass}
            value={section.section_type}
            onChange={(event) => onUpdate({ section_type: event.target.value as PageSectionType })}
          >
            {sectionMeta.map((item) => (
              <option key={item.type} value={item.type}>{getSectionTypeLabel(item.type)}</option>
            ))}
          </select>
        </Field>
        <Field label="Sort order">
          <input
            type="number"
            className={inputClass}
            value={section.sort_order}
            onChange={(event) => onUpdate({ sort_order: Number(event.target.value) || 0 })}
          />
        </Field>
        <Field label="Placement">
          <select className={inputClass} value={section.placement} onChange={(event) => onUpdate({ placement: event.target.value })}>
            {getPlacementOptions(pageSlug).map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Section key" hint="Used as the anchor ID for this section.">
          <input className={inputClass} value={section.section_key} onChange={(event) => onUpdate({ section_key: event.target.value })} />
        </Field>
        <Field label="Eyebrow">
          <input className={inputClass} value={section.eyebrow} onChange={(event) => onUpdate({ eyebrow: event.target.value })} />
        </Field>
        <Field label="Navigation label">
          <input className={inputClass} value={section.nav_label} onChange={(event) => onUpdate({ nav_label: event.target.value })} />
        </Field>
        <div className="grid gap-2 sm:grid-cols-2">
          <ToggleField label="Header link" checked={section.show_in_header} onChange={(checked) => onUpdate({ show_in_header: checked })} />
          <ToggleField label="Footer link" checked={section.show_in_footer} onChange={(checked) => onUpdate({ show_in_footer: checked })} />
        </div>
        <div className="lg:col-span-2">
          <Field label="Heading">
            <input className={inputClass} value={section.title} onChange={(event) => onUpdate({ title: event.target.value })} />
          </Field>
        </div>
      </div>

      {section.section_type === "split_media" ? (
        <div className="mt-4">
          <Field label="Visual treatment">
            <select
              className={inputClass}
              value={section.content.variant}
              onChange={(event) => onUpdate({ content: { ...section.content, variant: event.target.value as "editorial" | "offset" | "spotlight" } })}
            >
              <option value="editorial">Editorial Split</option>
              <option value="offset">Offset Story Panel</option>
              <option value="spotlight">Spotlight Split</option>
            </select>
          </Field>
        </div>
      ) : null}

      {section.section_type === "media_banner" ? (
        <div className="mt-4">
          <Field label="Visual treatment">
            <select
              className={inputClass}
              value={section.content.variant}
              onChange={(event) => onUpdate({ content: { ...section.content, variant: event.target.value as "immersive" | "spotlight" } })}
            >
              <option value="immersive">Immersive Banner</option>
              <option value="spotlight">Spotlight Banner</option>
            </select>
          </Field>
        </div>
      ) : null}

      {section.section_type === "card_grid" ? (
        <div className="mt-4">
          <Field label="Visual treatment">
            <select
              className={inputClass}
              value={section.content.variant}
              onChange={(event) => onUpdate({ content: { ...section.content, variant: event.target.value as "feature" | "staggered" } })}
            >
              <option value="feature">Feature Grid</option>
              <option value="staggered">Staggered Showcase</option>
            </select>
          </Field>
        </div>
      ) : null}

      {section.section_type === "testimonial_showcase" ? (
        <div className="mt-4">
          <Field label="Visual treatment">
            <select
              className={inputClass}
              value={section.content.variant}
              onChange={(event) => onUpdate({ content: { ...section.content, variant: event.target.value as "spotlight" | "mosaic" } })}
            >
              <option value="spotlight">Quote Spotlight</option>
              <option value="mosaic">Testimonial Mosaic</option>
            </select>
          </Field>
        </div>
      ) : null}

      {section.section_type === "faq_section" ? (
        <div className="mt-4">
          <Field label="Visual treatment">
            <select
              className={inputClass}
              value={section.content.variant}
              onChange={(event) => onUpdate({ content: { ...section.content, variant: event.target.value as "split" | "stacked" } })}
            >
              <option value="split">FAQ Split</option>
              <option value="stacked">FAQ Stack</option>
            </select>
          </Field>
        </div>
      ) : null}

      {section.section_type === "cta" ? (
        <div className="mt-4">
          <Field label="Visual treatment">
            <select
              className={inputClass}
              value={section.content.variant}
              onChange={(event) => onUpdate({ content: { ...section.content, variant: event.target.value as "centered" | "split" } })}
            >
              <option value="centered">Centered Action Block</option>
              <option value="split">Split Action Panel</option>
            </select>
          </Field>
        </div>
      ) : null}

      {section.section_type === "rich_text" ? (
        <div className="mt-4">
          <Field label="Paragraphs" hint="One paragraph per line.">
            <textarea
              className={areaClass}
              value={toLines(section.content.body)}
              onChange={(event) => onUpdate({ content: { ...section.content, body: fromLines(event.target.value) } })}
            />
          </Field>
        </div>
      ) : null}

      {section.section_type === "split_media" ? (
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Layout">
              <select
                className={inputClass}
                value={section.content.layout}
                onChange={(event) => onUpdate({ content: { ...section.content, layout: event.target.value as "text-left" | "text-right" } })}
              >
                <option value="text-left">Text left, image right</option>
                <option value="text-right">Image left, text right</option>
              </select>
            </Field>
            <Field label="Intro">
              <textarea className={areaClass} value={section.content.intro} onChange={(event) => onUpdate({ content: { ...section.content, intro: event.target.value } })} />
            </Field>
          </div>
          <Field label="Body paragraphs" hint="One paragraph per line.">
            <textarea className={areaClass} value={toLines(section.content.body)} onChange={(event) => onUpdate({ content: { ...section.content, body: fromLines(event.target.value) } })} />
          </Field>
          <Field label="Bullets" hint="One bullet per line.">
            <textarea className={areaClass} value={toLines(section.content.bullets)} onChange={(event) => onUpdate({ content: { ...section.content, bullets: fromLines(event.target.value) } })} />
          </Field>
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Primary button label">
              <input className={inputClass} value={section.content.primaryButtonLabel} onChange={(event) => onUpdate({ content: { ...section.content, primaryButtonLabel: event.target.value } })} />
            </Field>
            <Field label="Primary button link" hint={linkFieldHint}>
              <input className={inputClass} value={section.content.primaryButtonHref} onChange={(event) => onUpdate({ content: { ...section.content, primaryButtonHref: event.target.value } })} />
            </Field>
            <Field label="Secondary button label">
              <input className={inputClass} value={section.content.secondaryButtonLabel} onChange={(event) => onUpdate({ content: { ...section.content, secondaryButtonLabel: event.target.value } })} />
            </Field>
            <Field label="Secondary button link" hint={linkFieldHint}>
              <input className={inputClass} value={section.content.secondaryButtonHref} onChange={(event) => onUpdate({ content: { ...section.content, secondaryButtonHref: event.target.value } })} />
            </Field>
            <Field label="Image URL">
              <input className={inputClass} value={section.content.imageSrc} onChange={(event) => onUpdate({ content: { ...section.content, imageSrc: event.target.value } })} />
            </Field>
            <Field label="Image alt text">
              <input className={inputClass} value={section.content.imageAlt} onChange={(event) => onUpdate({ content: { ...section.content, imageAlt: event.target.value } })} />
            </Field>
          </div>
          <Field label="Image caption">
            <input className={inputClass} value={section.content.imageCaption} onChange={(event) => onUpdate({ content: { ...section.content, imageCaption: event.target.value } })} />
          </Field>
        </div>
      ) : null}

      {section.section_type === "about_split" ? (
        <div className="mt-4 space-y-4">
          <Field label="Headline">
            <input className={inputClass} value={section.content.headline} onChange={(event) => onUpdate({ content: { ...section.content, headline: event.target.value } })} />
          </Field>
          <Field label="Body paragraphs" hint="One paragraph per line.">
            <textarea className={areaClass} value={toLines(section.content.body)} onChange={(event) => onUpdate({ content: { ...section.content, body: fromLines(event.target.value) } })} />
          </Field>
          <IconCardsEditor
            items={section.content.pillars}
            onAdd={() => onUpdate({ content: { ...section.content, pillars: [...section.content.pillars, { iconName: "Target", title: "", description: "" }] } })}
            onUpdate={(itemIndex, patch) =>
              onUpdate({
                content: {
                  ...section.content,
                  pillars: section.content.pillars.map((item, currentIndex) => (currentIndex === itemIndex ? { ...item, ...patch } : item)),
                },
              })
            }
            onRemove={(itemIndex) =>
              onUpdate({
                content: {
                  ...section.content,
                  pillars: section.content.pillars.filter((_, currentIndex) => currentIndex !== itemIndex),
                },
              })
            }
          />
        </div>
      ) : null}

      {section.section_type === "card_grid" ? (
        <div className="mt-4 space-y-4">
          <Field label="Intro">
            <textarea className={areaClass} value={section.content.intro} onChange={(event) => onUpdate({ content: { ...section.content, intro: event.target.value } })} />
          </Field>
          <CardGridEditor
            items={section.content.items}
            onAdd={() => onUpdate({ content: { ...section.content, items: [...section.content.items, { eyebrow: "", title: "", description: "", linkLabel: "", linkHref: "" }] } })}
            onUpdate={(itemIndex, patch) =>
              onUpdate({
                content: {
                  ...section.content,
                  items: section.content.items.map((item, currentIndex) => (currentIndex === itemIndex ? { ...item, ...patch } : item)),
                },
              })
            }
            onRemove={(itemIndex) =>
              onUpdate({
                content: {
                  ...section.content,
                  items: section.content.items.filter((_, currentIndex) => currentIndex !== itemIndex),
                },
              })
            }
          />
        </div>
      ) : null}

      {section.section_type === "media_banner" ? (
        <div className="mt-4 space-y-4">
          <Field label="Intro">
            <textarea className={areaClass} value={section.content.intro} onChange={(event) => onUpdate({ content: { ...section.content, intro: event.target.value } })} />
          </Field>
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Image URL">
              <input className={inputClass} value={section.content.imageSrc} onChange={(event) => onUpdate({ content: { ...section.content, imageSrc: event.target.value } })} />
            </Field>
            <Field label="Image alt text">
              <input className={inputClass} value={section.content.imageAlt} onChange={(event) => onUpdate({ content: { ...section.content, imageAlt: event.target.value } })} />
            </Field>
            <Field label="Primary button label">
              <input className={inputClass} value={section.content.buttonLabel} onChange={(event) => onUpdate({ content: { ...section.content, buttonLabel: event.target.value } })} />
            </Field>
            <Field label="Primary button link" hint={linkFieldHint}>
              <input className={inputClass} value={section.content.buttonHref} onChange={(event) => onUpdate({ content: { ...section.content, buttonHref: event.target.value } })} />
            </Field>
            <Field label="Secondary button label">
              <input className={inputClass} value={section.content.secondaryButtonLabel} onChange={(event) => onUpdate({ content: { ...section.content, secondaryButtonLabel: event.target.value } })} />
            </Field>
            <Field label="Secondary button link" hint={linkFieldHint}>
              <input className={inputClass} value={section.content.secondaryButtonHref} onChange={(event) => onUpdate({ content: { ...section.content, secondaryButtonHref: event.target.value } })} />
            </Field>
          </div>
        </div>
      ) : null}

      {section.section_type === "icon_cards" ? (
        <div className="mt-4 space-y-4">
          <Field label="Headline">
            <input className={inputClass} value={section.content.headline} onChange={(event) => onUpdate({ content: { ...section.content, headline: event.target.value } })} />
          </Field>
          <Field label="Intro">
            <textarea className={areaClass} value={section.content.intro} onChange={(event) => onUpdate({ content: { ...section.content, intro: event.target.value } })} />
          </Field>
          <IconCardsEditor
            items={section.content.items}
            onAdd={() => onUpdate({ content: { ...section.content, items: [...section.content.items, { iconName: "Rocket", title: "", description: "" }] } })}
            onUpdate={(itemIndex, patch) =>
              onUpdate({
                content: {
                  ...section.content,
                  items: section.content.items.map((item, currentIndex) => (currentIndex === itemIndex ? { ...item, ...patch } : item)),
                },
              })
            }
            onRemove={(itemIndex) =>
              onUpdate({
                content: {
                  ...section.content,
                  items: section.content.items.filter((_, currentIndex) => currentIndex !== itemIndex),
                },
              })
            }
          />
        </div>
      ) : null}

      {section.section_type === "testimonial_showcase" ? (
        <div className="mt-4 space-y-4">
          <Field label="Intro">
            <textarea className={areaClass} value={section.content.intro} onChange={(event) => onUpdate({ content: { ...section.content, intro: event.target.value } })} />
          </Field>
          <TestimonialsEditor
            items={section.content.items}
            onAdd={() => onUpdate({ content: { ...section.content, items: [...section.content.items, { quote: "", name: "", role: "", company: "", linkLabel: "", linkHref: "" }] } })}
            onUpdate={(itemIndex, patch) =>
              onUpdate({
                content: {
                  ...section.content,
                  items: section.content.items.map((item, currentIndex) => (currentIndex === itemIndex ? { ...item, ...patch } : item)),
                },
              })
            }
            onRemove={(itemIndex) =>
              onUpdate({
                content: {
                  ...section.content,
                  items: section.content.items.filter((_, currentIndex) => currentIndex !== itemIndex),
                },
              })
            }
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Section button label">
              <input className={inputClass} value={section.content.primaryButtonLabel} onChange={(event) => onUpdate({ content: { ...section.content, primaryButtonLabel: event.target.value } })} />
            </Field>
            <Field label="Section button link" hint={linkFieldHint}>
              <input className={inputClass} value={section.content.primaryButtonHref} onChange={(event) => onUpdate({ content: { ...section.content, primaryButtonHref: event.target.value } })} />
            </Field>
          </div>
        </div>
      ) : null}

      {section.section_type === "services_grid" ? (
        <div className="mt-4 space-y-4">
          <Field label="Headline">
            <input className={inputClass} value={section.content.headline} onChange={(event) => onUpdate({ content: { ...section.content, headline: event.target.value } })} />
          </Field>
          <Field label="Intro">
            <textarea className={areaClass} value={section.content.intro} onChange={(event) => onUpdate({ content: { ...section.content, intro: event.target.value } })} />
          </Field>
          <ServicesGridEditor
            items={section.content.items}
            onAdd={() => onUpdate({ content: { ...section.content, items: [...section.content.items, { iconName: "Network", title: "", short: "", detail: "", benefits: [], category: "" }] } })}
            onUpdate={(itemIndex, patch) =>
              onUpdate({
                content: {
                  ...section.content,
                  items: section.content.items.map((item, currentIndex) => (currentIndex === itemIndex ? { ...item, ...patch } : item)),
                },
              })
            }
            onRemove={(itemIndex) =>
              onUpdate({
                content: {
                  ...section.content,
                  items: section.content.items.filter((_, currentIndex) => currentIndex !== itemIndex),
                },
              })
            }
          />
        </div>
      ) : null}

      {section.section_type === "milestones_spotlight" ? (
        <div className="mt-4 space-y-4">
          <Field label="Headline">
            <input className={inputClass} value={section.content.headline} onChange={(event) => onUpdate({ content: { ...section.content, headline: event.target.value } })} />
          </Field>
          <Field label="Intro">
            <textarea className={areaClass} value={section.content.intro} onChange={(event) => onUpdate({ content: { ...section.content, intro: event.target.value } })} />
          </Field>
          <TimelineEditor
            items={section.content.items}
            onAdd={() => onUpdate({ content: { ...section.content, items: [...section.content.items, { year: "", title: "", description: "", highlights: [] }] } })}
            onUpdate={(itemIndex, patch) =>
              onUpdate({
                content: {
                  ...section.content,
                  items: section.content.items.map((item, currentIndex) => (currentIndex === itemIndex ? { ...item, ...patch } : item)),
                },
              })
            }
            onRemove={(itemIndex) =>
              onUpdate({
                content: {
                  ...section.content,
                  items: section.content.items.filter((_, currentIndex) => currentIndex !== itemIndex),
                },
              })
            }
          />
        </div>
      ) : null}

      {section.section_type === "faq_section" ? (
        <div className="mt-4 space-y-4">
          <Field label="Intro">
            <textarea className={areaClass} value={section.content.intro} onChange={(event) => onUpdate({ content: { ...section.content, intro: event.target.value } })} />
          </Field>
          <FaqItemsEditor
            items={section.content.items}
            onAdd={() => onUpdate({ content: { ...section.content, items: [...section.content.items, { question: "", answer: "", linkLabel: "", linkHref: "" }] } })}
            onUpdate={(itemIndex, patch) =>
              onUpdate({
                content: {
                  ...section.content,
                  items: section.content.items.map((item, currentIndex) => (currentIndex === itemIndex ? { ...item, ...patch } : item)),
                },
              })
            }
            onRemove={(itemIndex) =>
              onUpdate({
                content: {
                  ...section.content,
                  items: section.content.items.filter((_, currentIndex) => currentIndex !== itemIndex),
                },
              })
            }
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Primary button label">
              <input className={inputClass} value={section.content.primaryButtonLabel} onChange={(event) => onUpdate({ content: { ...section.content, primaryButtonLabel: event.target.value } })} />
            </Field>
            <Field label="Primary button link" hint={linkFieldHint}>
              <input className={inputClass} value={section.content.primaryButtonHref} onChange={(event) => onUpdate({ content: { ...section.content, primaryButtonHref: event.target.value } })} />
            </Field>
            <Field label="Secondary button label">
              <input className={inputClass} value={section.content.secondaryButtonLabel} onChange={(event) => onUpdate({ content: { ...section.content, secondaryButtonLabel: event.target.value } })} />
            </Field>
            <Field label="Secondary button link" hint={linkFieldHint}>
              <input className={inputClass} value={section.content.secondaryButtonHref} onChange={(event) => onUpdate({ content: { ...section.content, secondaryButtonHref: event.target.value } })} />
            </Field>
          </div>
        </div>
      ) : null}

      {section.section_type === "timeline" ? (
        <div className="mt-4 space-y-4">
          <Field label="Intro">
            <textarea className={areaClass} value={section.content.intro} onChange={(event) => onUpdate({ content: { ...section.content, intro: event.target.value } })} />
          </Field>
          <TimelineEditor
            items={section.content.items}
            onAdd={() => onUpdate({ content: { ...section.content, items: [...section.content.items, { year: "", title: "", description: "", highlights: [] }] } })}
            onUpdate={(itemIndex, patch) =>
              onUpdate({
                content: {
                  ...section.content,
                  items: section.content.items.map((item, currentIndex) => (currentIndex === itemIndex ? { ...item, ...patch } : item)),
                },
              })
            }
            onRemove={(itemIndex) =>
              onUpdate({
                content: {
                  ...section.content,
                  items: section.content.items.filter((_, currentIndex) => currentIndex !== itemIndex),
                },
              })
            }
          />
        </div>
      ) : null}

      {section.section_type === "stats" ? (
        <div className="mt-4 space-y-4">
          <Field label="Intro">
            <textarea className={areaClass} value={section.content.intro} onChange={(event) => onUpdate({ content: { ...section.content, intro: event.target.value } })} />
          </Field>
          <StatsEditor
            items={section.content.items}
            onAdd={() => onUpdate({ content: { ...section.content, items: [...section.content.items, { value: "", label: "" }] } })}
            onUpdate={(itemIndex, patch) =>
              onUpdate({
                content: {
                  ...section.content,
                  items: section.content.items.map((item, currentIndex) => (currentIndex === itemIndex ? { ...item, ...patch } : item)),
                },
              })
            }
            onRemove={(itemIndex) =>
              onUpdate({
                content: {
                  ...section.content,
                  items: section.content.items.filter((_, currentIndex) => currentIndex !== itemIndex),
                },
              })
            }
          />
        </div>
      ) : null}

      {section.section_type === "cta" ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <Field label="Intro">
              <textarea className={areaClass} value={section.content.intro} onChange={(event) => onUpdate({ content: { ...section.content, intro: event.target.value } })} />
            </Field>
          </div>
          <Field label="Primary button label">
            <input className={inputClass} value={section.content.buttonLabel} onChange={(event) => onUpdate({ content: { ...section.content, buttonLabel: event.target.value } })} />
          </Field>
          <Field label="Primary button link" hint={linkFieldHint}>
            <input className={inputClass} value={section.content.buttonHref} onChange={(event) => onUpdate({ content: { ...section.content, buttonHref: event.target.value } })} />
          </Field>
          <Field label="Secondary button label">
            <input className={inputClass} value={section.content.secondaryButtonLabel} onChange={(event) => onUpdate({ content: { ...section.content, secondaryButtonLabel: event.target.value } })} />
          </Field>
          <Field label="Secondary button link" hint={linkFieldHint}>
            <input className={inputClass} value={section.content.secondaryButtonHref} onChange={(event) => onUpdate({ content: { ...section.content, secondaryButtonHref: event.target.value } })} />
          </Field>
        </div>
      ) : null}

      {section.section_type === "contact_cta" ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Field label="Eyebrow">
            <input className={inputClass} value={section.content.eyebrow} onChange={(event) => onUpdate({ content: { ...section.content, eyebrow: event.target.value } })} />
          </Field>
          <Field label="Headline">
            <input className={inputClass} value={section.content.headline} onChange={(event) => onUpdate({ content: { ...section.content, headline: event.target.value } })} />
          </Field>
          <div className="lg:col-span-2">
            <Field label="Intro">
              <textarea className={areaClass} value={section.content.intro} onChange={(event) => onUpdate({ content: { ...section.content, intro: event.target.value } })} />
            </Field>
          </div>
          <Field label="Button label">
            <input className={inputClass} value={section.content.buttonLabel} onChange={(event) => onUpdate({ content: { ...section.content, buttonLabel: event.target.value } })} />
          </Field>
          <Field label="Button link" hint={linkFieldHint}>
            <input className={inputClass} value={section.content.buttonHref} onChange={(event) => onUpdate({ content: { ...section.content, buttonHref: event.target.value } })} />
          </Field>
          <Field label="Email">
            <input className={inputClass} value={section.content.contact.email} onChange={(event) => onUpdate({ content: { ...section.content, contact: { ...section.content.contact, email: event.target.value } } })} />
          </Field>
          <Field label="Office name">
            <input className={inputClass} value={section.content.contact.officeName} onChange={(event) => onUpdate({ content: { ...section.content, contact: { ...section.content.contact, officeName: event.target.value } } })} />
          </Field>
          <Field label="Street">
            <input className={inputClass} value={section.content.contact.street} onChange={(event) => onUpdate({ content: { ...section.content, contact: { ...section.content.contact, street: event.target.value } } })} />
          </Field>
          <Field label="City">
            <input className={inputClass} value={section.content.contact.city} onChange={(event) => onUpdate({ content: { ...section.content, contact: { ...section.content.contact, city: event.target.value } } })} />
          </Field>
          <Field label="Country">
            <input className={inputClass} value={section.content.contact.country} onChange={(event) => onUpdate({ content: { ...section.content, contact: { ...section.content.contact, country: event.target.value } } })} />
          </Field>
          <Field label="LinkedIn URL">
            <input className={inputClass} value={section.content.contact.linkedinUrl} onChange={(event) => onUpdate({ content: { ...section.content, contact: { ...section.content.contact, linkedinUrl: event.target.value } } })} />
          </Field>
        </div>
      ) : null}
    </div>
  );
}

const cloneSectionDraft = <T extends PageSectionDraft>(section: T): T => structuredClone(section);

const getNextSortOrder = (sections: PageSectionDraft[]) =>
  sections.reduce((highest, section) => Math.max(highest, section.sort_order), -1) + 1;

const normalizeSectionDraft = (
  section: PageSectionDraft,
  index: number,
): PageSectionDraft => {
  const baseSection = {
    ...section,
    title: section.title.trim(),
    eyebrow: section.eyebrow.trim(),
    section_key: normalizeSectionKey(section.section_key) || `${section.section_type.replace(/_/g, "-")}-${index + 1}`,
    sort_order: section.sort_order,
    placement: section.placement,
    nav_label: section.nav_label.trim() || section.title.trim() || getSectionTypeLabel(section.section_type),
    show_in_header: section.show_in_header,
    show_in_footer: section.show_in_footer,
  };

  switch (section.section_type) {
    case "rich_text":
      return {
        ...baseSection,
        content: {
          ...section.content,
          body: compactLines(section.content.body),
        },
      };
    case "split_media":
      return {
        ...baseSection,
        content: {
          ...section.content,
          variant: section.content.variant,
          layout: section.content.layout,
          intro: section.content.intro.trim(),
          body: compactLines(section.content.body),
          bullets: compactLines(section.content.bullets),
          primaryButtonLabel: section.content.primaryButtonLabel.trim(),
          primaryButtonHref: section.content.primaryButtonHref.trim(),
          secondaryButtonLabel: section.content.secondaryButtonLabel.trim(),
          secondaryButtonHref: section.content.secondaryButtonHref.trim(),
          imageSrc: section.content.imageSrc.trim(),
          imageAlt: section.content.imageAlt.trim(),
          imageCaption: section.content.imageCaption.trim(),
        },
      };
    case "about_split":
      return {
        ...baseSection,
        content: {
          ...section.content,
          headline: section.content.headline.trim(),
          body: compactLines(section.content.body),
          pillars: section.content.pillars.map((item) => ({
            iconName: item.iconName,
            title: item.title.trim(),
            description: item.description.trim(),
          })),
        },
      };
    case "card_grid":
      return {
        ...baseSection,
        content: {
          ...section.content,
          variant: section.content.variant,
          intro: section.content.intro.trim(),
          items: section.content.items.map((item) => ({
            eyebrow: item.eyebrow.trim(),
            title: item.title.trim(),
            description: item.description.trim(),
            linkLabel: item.linkLabel.trim(),
            linkHref: item.linkHref.trim(),
          })),
        },
      };
    case "media_banner":
      return {
        ...baseSection,
        content: {
          ...section.content,
          variant: section.content.variant,
          intro: section.content.intro.trim(),
          imageSrc: section.content.imageSrc.trim(),
          imageAlt: section.content.imageAlt.trim(),
          buttonLabel: section.content.buttonLabel.trim(),
          buttonHref: section.content.buttonHref.trim(),
          secondaryButtonLabel: section.content.secondaryButtonLabel.trim(),
          secondaryButtonHref: section.content.secondaryButtonHref.trim(),
        },
      };
    case "icon_cards":
      return {
        ...baseSection,
        content: {
          ...section.content,
          headline: section.content.headline.trim(),
          intro: section.content.intro.trim(),
          items: section.content.items.map((item) => ({
            iconName: item.iconName,
            title: item.title.trim(),
            description: item.description.trim(),
            })),
          },
        };
    case "testimonial_showcase":
      return {
        ...baseSection,
        content: {
          ...section.content,
          variant: section.content.variant,
          intro: section.content.intro.trim(),
          items: section.content.items.map((item) => ({
            quote: item.quote.trim(),
            name: item.name.trim(),
            role: item.role.trim(),
            company: item.company.trim(),
            linkLabel: item.linkLabel.trim(),
            linkHref: item.linkHref.trim(),
          })),
          primaryButtonLabel: section.content.primaryButtonLabel.trim(),
          primaryButtonHref: section.content.primaryButtonHref.trim(),
        },
      };
    case "services_grid":
      return {
        ...baseSection,
        content: {
          ...section.content,
          headline: section.content.headline.trim(),
          intro: section.content.intro.trim(),
          items: section.content.items.map((item) => ({
            iconName: item.iconName,
            title: item.title.trim(),
            short: item.short.trim(),
            detail: item.detail.trim(),
            benefits: compactLines(item.benefits),
            category: item.category.trim(),
          })),
        },
      };
    case "milestones_spotlight":
    case "timeline":
      return {
        ...baseSection,
        content: {
          ...section.content,
          intro: section.content.intro.trim(),
          items: section.content.items.map((item) => ({
            year: item.year.trim(),
            title: item.title.trim(),
            description: item.description.trim(),
            highlights: compactLines(item.highlights),
            })),
          },
        } as PageSectionDraft;
    case "faq_section":
      return {
        ...baseSection,
        content: {
          ...section.content,
          variant: section.content.variant,
          intro: section.content.intro.trim(),
          items: section.content.items.map((item) => ({
            question: item.question.trim(),
            answer: item.answer.trim(),
            linkLabel: item.linkLabel.trim(),
            linkHref: item.linkHref.trim(),
          })),
          primaryButtonLabel: section.content.primaryButtonLabel.trim(),
          primaryButtonHref: section.content.primaryButtonHref.trim(),
          secondaryButtonLabel: section.content.secondaryButtonLabel.trim(),
          secondaryButtonHref: section.content.secondaryButtonHref.trim(),
        },
      };
    case "stats":
      return {
        ...baseSection,
        content: {
          ...section.content,
          intro: section.content.intro.trim(),
          items: section.content.items.map((item) => ({
            value: item.value.trim(),
            label: item.label.trim(),
          })),
        },
      };
    case "contact_cta":
      return {
        ...baseSection,
        content: {
          ...section.content,
          eyebrow: section.content.eyebrow.trim(),
          headline: section.content.headline.trim(),
          intro: section.content.intro.trim(),
          buttonLabel: section.content.buttonLabel.trim(),
          buttonHref: section.content.buttonHref.trim(),
          contact: {
            email: section.content.contact.email.trim(),
            officeName: section.content.contact.officeName.trim(),
            street: section.content.contact.street.trim(),
            city: section.content.contact.city.trim(),
            country: section.content.contact.country.trim(),
            linkedinUrl: section.content.contact.linkedinUrl.trim(),
          },
        },
      };
    case "cta":
    default:
      return {
        ...baseSection,
        content: {
          ...section.content,
          variant: section.content.variant,
          intro: section.content.intro.trim(),
          buttonLabel: section.content.buttonLabel.trim(),
          buttonHref: section.content.buttonHref.trim(),
          secondaryButtonLabel: section.content.secondaryButtonLabel.trim(),
          secondaryButtonHref: section.content.secondaryButtonHref.trim(),
        },
      };
  }
};

export function PageSectionsEditor({
  activePanel,
  onSelectPanel,
}: {
  activePanel?: string;
  onSelectPanel: (panel: string) => void;
}) {
  const [pages, setPages] = useState<ManagedPageState[]>([]);
  const [selectedPageSlug, setSelectedPageSlug] = useState<ManagedPageSlug>("home");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [selectedLayoutId, setSelectedLayoutId] = useState(sectionLayoutLibrary[0]?.id || "");
  useBeforeUnload(dirty);
  useScrollToPanel(activePanel);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data, error }, structureEntries] = await Promise.all([
        supabase
          .from("page_sections")
          .select("*")
          .in("page_slug", managedPages.map((page) => page.slug))
          .order("page_slug")
          .order("sort_order"),
        Promise.all(managedPages.map(async (page) => [page.slug, await fetchPageStructure(page.slug)] as const)),
      ]);

      if (error) throw error;

      const rows = data || [];
      const structures = Object.fromEntries(structureEntries) as Record<ManagedPageSlug, PageStructureContent>;
      const nextPages = managedPages.map((page) => ({
        ...page,
        structure: structures[page.slug] || getDefaultPageStructure(page.slug),
        sections: rows
          .filter((row) => row.page_slug === page.slug)
          .map(parsePageSection)
          .sort((left, right) => left.sort_order - right.sort_order),
      }));

      setPages(nextPages);
      setDirty(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Page sections could not load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const selectedPage = useMemo(
    () => pages.find((page) => page.slug === selectedPageSlug) || null,
    [pages, selectedPageSlug],
  );
  const selectedLayout = useMemo(() => getSectionLayout(selectedLayoutId) || sectionLayoutLibrary[0] || null, [selectedLayoutId]);

  const previewSections = useMemo(
    () => (selectedPage ? [...selectedPage.sections].sort((left, right) => left.sort_order - right.sort_order) : []),
    [selectedPage],
  );
  const previewSurfaceMap = useMemo(
    () => (selectedPage ? getFlexibleSectionSurfaceMap(selectedPage.slug, previewSections, selectedPage.structure) : {}),
    [previewSections, selectedPage],
  );

  const updateSelectedStructureSection = (sectionId: string, patch: Partial<PageStructureContent["sections"][number]>) => {
    setPages((current) =>
      current.map((page) =>
        page.slug === selectedPageSlug
          ? {
              ...page,
              structure: {
                sections: page.structure.sections.map((section) =>
                  section.id === sectionId ? { ...section, ...patch } : section,
                ),
              },
            }
          : page,
      ),
    );
    setDirty(true);
  };

  const replaceSelectedSections = (nextSections: PageSectionDraft[]) => {
    setPages((current) =>
      current.map((page) => (page.slug === selectedPageSlug ? { ...page, sections: nextSections } : page)),
    );
    setDirty(true);
  };

  const updateSelectedSection = (sectionIndex: number, patch: Partial<PageSectionDraft>) => {
    setPages((current) =>
      current.map((page) => {
        if (page.slug !== selectedPageSlug) return page;

        const currentSection = page.sections[sectionIndex];
        const nextType = (patch.section_type || currentSection.section_type) as PageSectionType;
        const nextSection = {
          ...currentSection,
          ...patch,
          page_slug: page.slug,
          content:
            patch.section_type && patch.section_type !== currentSection.section_type
              ? createPageSection(nextType, page.slug, currentSection.sort_order, page.sections.map((section) => section.section_key)).content
              : patch.content || currentSection.content,
        } as PageSectionDraft;

        return {
          ...page,
          sections: page.sections.map((section, index) => (index === sectionIndex ? nextSection : section)),
        };
      }),
    );
    setDirty(true);
  };

  const addSectionFromLayout = (layoutId: string) => {
    if (!selectedPage || !layoutId) return;

    try {
      const nextSection = createSectionFromLayout(
        layoutId,
        selectedPage.slug,
        getNextSortOrder(selectedPage.sections),
        selectedPage.sections.map((section) => section.section_key),
      );
      replaceSelectedSections([...selectedPage.sections, nextSection]);
      const layout = getSectionLayout(layoutId);
      toast.success(`${layout?.label || "Layout"} added to ${selectedPage.label}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "That layout could not be created.");
    }
  };

  const addSectionFromTemplate = async (templateId: string) => {
    if (!selectedPage || !templateId) return;

    try {
      const nextSection = await createSectionFromTemplate(
        templateId,
        selectedPage.slug,
        getNextSortOrder(selectedPage.sections),
        selectedPage.sections.map((section) => section.section_key),
      );
      replaceSelectedSections([...selectedPage.sections, nextSection]);
      const template = getSectionTemplate(templateId);
      toast.success(`${template?.label || "Template"} added as an editable section.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "That template could not be created.");
    }
  };

  const duplicateSection = (sectionIndex: number) => {
    if (!selectedPage) return;

    const source = selectedPage.sections[sectionIndex];
    const duplicate = cloneSectionDraft(source);
    const baseTitle = source.title.trim() || getSectionTypeLabel(source.section_type);
    const existingKeys = selectedPage.sections.map((section) => section.section_key);
    const keyBase = normalizeSectionKey(`${source.section_key}-copy`) || `${source.section_type.replace(/_/g, "-")}-copy`;
    let candidateKey = keyBase;
    let suffix = 2;

    while (existingKeys.includes(candidateKey)) {
      candidateKey = `${keyBase}-${suffix}`;
      suffix += 1;
    }

    duplicate.id = undefined;
    duplicate.section_key = candidateKey;
    duplicate.sort_order = getNextSortOrder(selectedPage.sections);
    duplicate.title = `${baseTitle} Copy`;
    duplicate.nav_label = `${source.nav_label.trim() || baseTitle} Copy`;
    replaceSelectedSections([...selectedPage.sections, duplicate]);
  };

  const deleteSection = (sectionIndex: number) => {
    if (!selectedPage) return;
    if (!window.confirm("Delete this section?")) return;
    replaceSelectedSections(selectedPage.sections.filter((_, index) => index !== sectionIndex));
  };

  const save = async () => {
    setSaving(true);

    try {
      const normalizedPages = pages.map((page) => ({
        ...page,
        structure: {
          sections: page.structure.sections.map((section) => ({
            ...section,
            anchor: normalizeSectionKey(section.anchor) || section.id,
            navLabel: section.navLabel.trim() || section.label,
          })),
        },
        sections: page.sections
          .map((section, index) => normalizeSectionDraft({ ...section, page_slug: page.slug }, index))
          .sort((left, right) => left.sort_order - right.sort_order),
      }));

      for (const page of normalizedPages) {
        const seenSectionKeys = new Set<string>();
        const reservedAnchors = new Set(
          getBuiltInSectionDefinitions(page.slug).map((section) => page.structure.sections.find((item) => item.id === section.id)?.anchor || section.anchor),
        );
        for (const section of page.sections) {
          if (seenSectionKeys.has(section.section_key)) {
            throw new Error(`${getManagedPageLabel(page.slug)} has duplicate section keys. Please make them unique.`);
          }
          if (reservedAnchors.has(section.section_key)) {
            throw new Error(`${getManagedPageLabel(page.slug)} already uses "${section.section_key}" for a built-in section anchor. Choose a different section key.`);
          }
          seenSectionKeys.add(section.section_key);
        }
      }

      const managedSlugs = managedPages.map((page) => page.slug);
      const { error: deleteError } = await supabase.from("page_sections").delete().in("page_slug", managedSlugs);
      if (deleteError) throw deleteError;

      for (const page of normalizedPages) {
        const { error: structureError } = await supabase.from("site_content").upsert(
          {
            key: `${page.slug}.structure`,
            label: `${getManagedPageLabel(page.slug)} structure`,
            description: `Visibility, anchor, and navigation settings for the built-in sections on ${getManagedPageLabel(page.slug)}.`,
            content: page.structure,
            is_published: true,
          },
          { onConflict: "key" },
        );

        if (structureError) throw structureError;
      }

      const payload = normalizedPages.flatMap((page) =>
        page.sections.map((section) => ({
          page_slug: page.slug,
          section_key: section.section_key,
          section_type: section.section_type,
          title: section.title || null,
          eyebrow: section.eyebrow || null,
          content: createStorableSectionContent(section),
          sort_order: section.sort_order,
          is_published: section.is_published,
        })),
      );

      if (payload.length > 0) {
        const { error: insertError } = await supabase.from("page_sections").insert(payload);
        if (insertError) throw insertError;
      }

      toast.success("Page sections saved.");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Page sections could not save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingPanel />;

  return (
    <div>
      <SaveBar
        title="Page Sections"
        description="Add flexible sections to the existing website pages without creating new routes or rebuilding the page structure."
        saving={saving}
        onSave={save}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_24rem]">
        <div className="space-y-6">
          <SectionJumpBar
            title="Section Map"
            description="Choose a page first, then build and preview the flexible sections that should appear on it."
            activePanel={activePanel}
            onSelect={onSelectPanel}
            sections={[
              { panel: "page-sections-pages", label: "Pages", icon: FileText },
              { panel: "page-sections-existing", label: "Built-in", icon: FileText },
              { panel: "page-sections-builder", label: "Builder", icon: LayoutTemplate },
            ]}
          />

          <section className={panelClass} data-admin-panel="page-sections-pages">
            <p className={mutedLabelClass}>Pages</p>
            <p className="mt-1 text-sm text-muted-foreground">Pick the existing page where your new section should appear.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {pages.map((page) => (
                <button
                  key={page.slug}
                  type="button"
                  onClick={() => setSelectedPageSlug(page.slug)}
                  className={`rounded-md border p-4 text-left transition-colors ${
                    selectedPageSlug === page.slug ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                  }`}
                >
                  <p className={mutedLabelClass}>{page.slug}</p>
                  <h3 className="mt-1 text-base font-semibold">{page.label}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{page.description}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {page.sections.length} flexible section{page.sections.length === 1 ? "" : "s"}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {selectedPage ? (
            <>
              <section className={panelClass} data-admin-panel="page-sections-existing">
                <p className={mutedLabelClass}>Built-in sections</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Decide which existing sections on {selectedPage.label} are visible, and whether they should appear in header or footer navigation.
                </p>
                <div className="mt-4 space-y-4">
                  {selectedPage.structure.sections.map((section) => (
                    <BuiltInSectionEditorCard
                      key={section.id}
                      pageSlug={selectedPage.slug}
                      section={section}
                      onUpdate={(patch) => updateSelectedStructureSection(section.id, patch)}
                      onCreateEditableCopy={
                        getBuiltInSectionDefinition(selectedPage.slug, section.id)?.templateId
                          ? () => {
                              const templateId = getBuiltInSectionDefinition(selectedPage.slug, section.id)?.templateId;
                              if (!templateId) return;
                              void addSectionFromTemplate(templateId);
                            }
                          : undefined
                      }
                    />
                  ))}
                </div>
              </section>

              <section className={panelClass} data-admin-panel="page-sections-builder">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className={mutedLabelClass}>{selectedPage.label}</p>
                    <h2 className="mt-1 text-lg font-semibold">Flexible sections for {selectedPage.label}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Choose a layout from the mini library, add it to the page, then fine-tune the content below.
                    </p>
                  </div>
                  {selectedLayout ? (
                    <div className="rounded-md border border-border bg-muted/30 p-4 lg:max-w-md">
                      <p className={mutedLabelClass}>Selected layout</p>
                      <p className="mt-1 text-sm font-semibold">{selectedLayout.label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{selectedLayout.description}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Starts as {getSectionTypeLabel(selectedLayout.sectionType)} with editable actions and links ready to wire up.
                      </p>
                      <button
                        type="button"
                        onClick={() => addSectionFromLayout(selectedLayout.id)}
                        className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                      >
                        <LayoutTemplate className="h-4 w-4" />
                        Add selected layout
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="mt-6">
                  <p className={mutedLabelClass}>Layout library</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    These are UI structures, not content clones. Pick the presentation first, then edit the copy, images, and actions.
                  </p>
                  <div className="mt-4 grid gap-4 xl:grid-cols-2">
                    {sectionLayoutLibrary.map((layout) => (
                      <LayoutPreviewCard
                        key={layout.id}
                        layout={layout}
                        selected={selectedLayoutId === layout.id}
                        onSelect={() => setSelectedLayoutId(layout.id)}
                        onCreate={() => addSectionFromLayout(layout.id)}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-4 rounded-md border border-border bg-muted/30 p-4">
                  <p className={mutedLabelClass}>Current page patterns</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Use these built-in sections as your reference when you want to replicate an existing rhythm or visual treatment. The built-in cards above can create editable copies when a matching template exists.
                  </p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {getBuiltInSectionDefinitions(selectedPage.slug).map((definition) => (
                      <div key={definition.id} className="rounded-md border border-border bg-background p-3">
                        <p className="text-sm font-semibold">{definition.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{definition.pattern}</p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Surface: {definition.surface === "dark" ? "Dark" : "Light"}
                        </p>
                        {definition.templateId ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Template: {getSectionTemplate(definition.templateId)?.label}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedPage.sections.length === 0 ? (
                  <div className="mt-4">
                    <EmptyState
                      title="No flexible sections yet"
                      body="Choose a layout from the mini library above and it will appear here ready for editing. Use the built-in cards above whenever you want to duplicate an existing site section instead."
                    />
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    {selectedPage.sections.map((section, index) => (
                      <SectionEditorCard
                        key={section.id || `${section.section_key}-${index}`}
                        pageSlug={selectedPage.slug}
                        section={section}
                        index={index}
                        surface={previewSurfaceMap[section.id || section.section_key] || "light"}
                        onUpdate={(patch) => updateSelectedSection(index, patch)}
                        onDuplicate={() => duplicateSection(index)}
                        onDelete={() => deleteSection(index)}
                      />
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : null}
        </div>

        <div className="xl:sticky xl:top-28 xl:self-start">
          <div className="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
            <div className="border-b border-border px-4 py-3">
              <p className={mutedLabelClass}>Live Preview</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedPage ? `${selectedPage.label} flexible sections only` : "Select a page to preview its sections"}
              </p>
            </div>
            {selectedPage ? (
              <div className="max-h-[70vh] overflow-y-auto">
                {previewSections.length > 0 ? (
                  <PageSectionsRenderer sections={previewSections} preview surfaceMap={previewSurfaceMap} />
                ) : (
                  <div className="p-4">
                    <EmptyState title="Nothing to preview yet" body="Add a section to this page and it will appear here right away." />
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4">
                <EmptyState title="No page selected" body="Pick a page from the list, then build and preview the sections that belong to it." />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
