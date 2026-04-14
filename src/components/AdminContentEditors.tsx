import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  defaultCompanyContact,
  defaultContactPage,
  defaultExpertiseIntro,
  defaultHomeAbout,
  defaultHomeContactCta,
  defaultHomeHero,
  upsertSiteContent,
  type CompanyContactContent,
  type ContactPageContent,
  type HomeAboutContent,
  type HomeHeroContent,
  type IconContentItem,
  type SectionIntroContent,
  type StatItem,
} from "@/lib/cms";
import { fetchCmsContent } from "@/lib/adminCms";
import { areaClass, clone, fromLines, inputClass, mutedLabelClass, panelClass, toLines, useBeforeUnload } from "@/lib/adminUi";
import { Field, LoadingPanel, SaveBar } from "@/components/AdminShared";

export function HomepageEditor() {
  const [hero, setHero] = useState<HomeHeroContent>(clone(defaultHomeHero));
  const [about, setAbout] = useState<HomeAboutContent>(clone(defaultHomeAbout));
  const [expertise, setExpertise] = useState<SectionIntroContent>(clone(defaultExpertiseIntro));
  const [contactCta, setContactCta] = useState<SectionIntroContent>(clone(defaultHomeContactCta));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  useBeforeUnload(dirty);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [heroData, aboutData, expertiseData, contactData] = await Promise.all([
        fetchCmsContent("home.hero", defaultHomeHero),
        fetchCmsContent("home.about", defaultHomeAbout),
        fetchCmsContent("home.expertise", defaultExpertiseIntro),
        fetchCmsContent("home.contact_cta", defaultHomeContactCta),
      ]);
      setHero(heroData);
      setAbout(aboutData);
      setExpertise(expertiseData);
      setContactCta(contactData);
      setDirty(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Homepage content could not load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setSaving(true);
    try {
      await Promise.all([
        upsertSiteContent("home.hero", "Home hero", "Main homepage headline, intro, CTAs, and stats.", hero),
        upsertSiteContent("home.about", "Home about", "Homepage company introduction and value pillars.", about),
        upsertSiteContent("home.expertise", "Home expertise intro", "Heading and intro above service cards.", expertise),
        upsertSiteContent("home.contact_cta", "Home contact CTA", "Homepage contact call to action.", contactCta),
      ]);
      setDirty(false);
      toast.success("Homepage content saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Homepage content could not save.");
    } finally {
      setSaving(false);
    }
  };

  const markDirty = () => setDirty(true);
  const updateStat = (index: number, patch: Partial<StatItem>) => {
    setHero((current) => ({ ...current, stats: current.stats.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)) }));
    markDirty();
  };
  const updatePillar = (index: number, patch: Partial<IconContentItem>) => {
    setAbout((current) => ({ ...current, pillars: current.pillars.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)) }));
    markDirty();
  };

  if (loading) return <LoadingPanel />;

  return (
    <div>
      <SaveBar title="Homepage" description="Edit the main landing page copy, calls to action, stats, and value pillars." saving={saving} onSave={save} />
      <div className="space-y-6">
        <section className={panelClass}>
          <p className={mutedLabelClass}>Hero</p>
          <div className="mt-4 grid gap-4">
            <Field label="Headline"><input className={inputClass} value={hero.headline} onChange={(event) => { setHero({ ...hero, headline: event.target.value }); markDirty(); }} /></Field>
            <Field label="Intro"><textarea className={areaClass} value={hero.intro} onChange={(event) => { setHero({ ...hero, intro: event.target.value }); markDirty(); }} /></Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Primary CTA label"><input className={inputClass} value={hero.primaryCtaLabel} onChange={(event) => { setHero({ ...hero, primaryCtaLabel: event.target.value }); markDirty(); }} /></Field>
              <Field label="Primary CTA link"><input className={inputClass} value={hero.primaryCtaHref} onChange={(event) => { setHero({ ...hero, primaryCtaHref: event.target.value }); markDirty(); }} /></Field>
              <Field label="Secondary CTA label"><input className={inputClass} value={hero.secondaryCtaLabel} onChange={(event) => { setHero({ ...hero, secondaryCtaLabel: event.target.value }); markDirty(); }} /></Field>
              <Field label="Secondary CTA link"><input className={inputClass} value={hero.secondaryCtaHref} onChange={(event) => { setHero({ ...hero, secondaryCtaHref: event.target.value }); markDirty(); }} /></Field>
            </div>
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Hero stats</h3>
                <button onClick={() => { setHero({ ...hero, stats: [...hero.stats, { value: "", label: "" }] }); markDirty(); }} className="text-sm font-semibold text-primary">Add stat</button>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {hero.stats.map((stat, index) => (
                  <div key={`${stat.label}-${index}`} className="rounded-md border border-border p-3">
                    <Field label="Value"><input className={inputClass} value={stat.value} onChange={(event) => updateStat(index, { value: event.target.value })} /></Field>
                    <div className="mt-3"><Field label="Label"><input className={inputClass} value={stat.label} onChange={(event) => updateStat(index, { label: event.target.value })} /></Field></div>
                    <button onClick={() => { setHero({ ...hero, stats: hero.stats.filter((_, itemIndex) => itemIndex !== index) }); markDirty(); }} className="mt-3 text-xs font-semibold text-destructive">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={panelClass}>
          <p className={mutedLabelClass}>About</p>
          <div className="mt-4 grid gap-4">
            <Field label="Headline"><input className={inputClass} value={about.headline} onChange={(event) => { setAbout({ ...about, headline: event.target.value }); markDirty(); }} /></Field>
            <Field label="Body paragraphs" hint="One paragraph per line."><textarea className={areaClass} value={toLines(about.body)} onChange={(event) => { setAbout({ ...about, body: fromLines(event.target.value) }); markDirty(); }} /></Field>
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Value pillars</h3>
                <button onClick={() => { setAbout({ ...about, pillars: [...about.pillars, { iconName: "Target", title: "", description: "" }] }); markDirty(); }} className="text-sm font-semibold text-primary">Add pillar</button>
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                {about.pillars.map((pillar, index) => (
                  <div key={`${pillar.title}-${index}`} className="rounded-md border border-border p-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field label="Title"><input className={inputClass} value={pillar.title} onChange={(event) => updatePillar(index, { title: event.target.value })} /></Field>
                      <Field label="Icon name"><input className={inputClass} value={pillar.iconName} onChange={(event) => updatePillar(index, { iconName: event.target.value })} /></Field>
                    </div>
                    <div className="mt-3"><Field label="Description"><textarea className={areaClass} value={pillar.description} onChange={(event) => updatePillar(index, { description: event.target.value })} /></Field></div>
                    <button onClick={() => { setAbout({ ...about, pillars: about.pillars.filter((_, itemIndex) => itemIndex !== index) }); markDirty(); }} className="mt-3 text-xs font-semibold text-destructive">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={panelClass}>
          <p className={mutedLabelClass}>Expertise intro</p>
          <div className="mt-4 grid gap-4">
            <Field label="Headline"><input className={inputClass} value={expertise.headline} onChange={(event) => { setExpertise({ ...expertise, headline: event.target.value }); markDirty(); }} /></Field>
            <Field label="Intro"><textarea className={areaClass} value={expertise.intro} onChange={(event) => { setExpertise({ ...expertise, intro: event.target.value }); markDirty(); }} /></Field>
          </div>
        </section>

        <section className={panelClass}>
          <p className={mutedLabelClass}>Contact CTA</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Eyebrow"><input className={inputClass} value={contactCta.eyebrow || ""} onChange={(event) => { setContactCta({ ...contactCta, eyebrow: event.target.value }); markDirty(); }} /></Field>
            <Field label="Headline"><input className={inputClass} value={contactCta.headline} onChange={(event) => { setContactCta({ ...contactCta, headline: event.target.value }); markDirty(); }} /></Field>
            <Field label="Intro"><textarea className={areaClass} value={contactCta.intro} onChange={(event) => { setContactCta({ ...contactCta, intro: event.target.value }); markDirty(); }} /></Field>
            <div className="grid gap-4">
              <Field label="Button label"><input className={inputClass} value={contactCta.buttonLabel || ""} onChange={(event) => { setContactCta({ ...contactCta, buttonLabel: event.target.value }); markDirty(); }} /></Field>
              <Field label="Button link"><input className={inputClass} value={contactCta.buttonHref || ""} onChange={(event) => { setContactCta({ ...contactCta, buttonHref: event.target.value }); markDirty(); }} /></Field>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function ContactEditor() {
  const [company, setCompany] = useState<CompanyContactContent>(clone(defaultCompanyContact));
  const [page, setPage] = useState<ContactPageContent>(clone(defaultContactPage));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  useBeforeUnload(dirty);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [companyData, pageData] = await Promise.all([
        fetchCmsContent("company.contact", defaultCompanyContact),
        fetchCmsContent("contact.page", defaultContactPage),
      ]);
      setCompany(companyData);
      setPage(pageData);
      setDirty(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Contact content could not load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setSaving(true);
    try {
      await Promise.all([
        upsertSiteContent("company.contact", "Company contact details", "Shared email, office address, and social links used across the site.", company),
        upsertSiteContent("contact.page", "Contact page copy", "Contact page heading and helper copy.", page),
      ]);
      setDirty(false);
      toast.success("Contact content saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Contact content could not save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingPanel />;

  return (
    <div>
      <SaveBar title="Contact Info" description="Edit shared contact details and contact page copy." saving={saving} onSave={save} />
      <div className="grid gap-6 xl:grid-cols-2">
        <section className={panelClass}>
          <p className={mutedLabelClass}>Company details</p>
          <div className="mt-4 grid gap-4">
            <Field label="Email"><input className={inputClass} value={company.email} onChange={(event) => { setCompany({ ...company, email: event.target.value }); setDirty(true); }} /></Field>
            <Field label="Office name"><input className={inputClass} value={company.officeName} onChange={(event) => { setCompany({ ...company, officeName: event.target.value }); setDirty(true); }} /></Field>
            <Field label="Street"><input className={inputClass} value={company.street} onChange={(event) => { setCompany({ ...company, street: event.target.value }); setDirty(true); }} /></Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="City"><input className={inputClass} value={company.city} onChange={(event) => { setCompany({ ...company, city: event.target.value }); setDirty(true); }} /></Field>
              <Field label="Country"><input className={inputClass} value={company.country} onChange={(event) => { setCompany({ ...company, country: event.target.value }); setDirty(true); }} /></Field>
            </div>
            <Field label="LinkedIn URL"><input className={inputClass} value={company.linkedinUrl} onChange={(event) => { setCompany({ ...company, linkedinUrl: event.target.value }); setDirty(true); }} /></Field>
          </div>
        </section>
        <section className={panelClass}>
          <p className={mutedLabelClass}>Contact page</p>
          <div className="mt-4 grid gap-4">
            <Field label="Headline"><input className={inputClass} value={page.headline} onChange={(event) => { setPage({ ...page, headline: event.target.value }); setDirty(true); }} /></Field>
            <Field label="Intro"><textarea className={areaClass} value={page.intro} onChange={(event) => { setPage({ ...page, intro: event.target.value }); setDirty(true); }} /></Field>
            <Field label="Form helper"><textarea className={areaClass} value={page.formHelper} onChange={(event) => { setPage({ ...page, formHelper: event.target.value }); setDirty(true); }} /></Field>
            <Field label="Success title"><input className={inputClass} value={page.successTitle} onChange={(event) => { setPage({ ...page, successTitle: event.target.value }); setDirty(true); }} /></Field>
            <Field label="Success body"><textarea className={areaClass} value={page.successBody} onChange={(event) => { setPage({ ...page, successBody: event.target.value }); setDirty(true); }} /></Field>
          </div>
        </section>
      </div>
    </div>
  );
}
