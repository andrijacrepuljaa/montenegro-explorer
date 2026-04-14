import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Trash2, Save, LogOut, ArrowLeft, GripVertical } from "lucide-react";
import kgcLogo from "@/assets/kgc-logo.png";

type Tab = "milestones" | "services" | "careers";

interface Milestone {
  id?: string;
  year: string;
  title: string;
  description: string;
  highlights: string[];
  team_size: string;
  sort_order: number;
}

interface Service {
  id?: string;
  title: string;
  short: string;
  detail: string;
  category: string;
  icon_name: string;
  benefits: string[];
  sort_order: number;
}

interface Career {
  id?: string;
  title: string;
  type: string;
  location: string;
  description: string;
  tab: string;
  is_active: boolean;
  sort_order: number;
}

const BulletEditor = ({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) => {
  const text = value.join("\n");
  return (
    <textarea
      value={text}
      onChange={(e) => onChange(e.target.value.split("\n"))}
      placeholder={placeholder || "One item per line (press Enter for new bullet)"}
      rows={5}
      className="w-full px-3 py-2 border border-border bg-background text-sm resize-y focus:outline-none focus:border-primary transition-colors"
    />
  );
};

const inputClass = "w-full px-3 py-2 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors";

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("milestones");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // Data
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);

  const fetchAll = useCallback(async () => {
    const [m, s, c] = await Promise.all([
      supabase.from("milestones").select("*").order("sort_order"),
      supabase.from("services").select("*").order("sort_order"),
      supabase.from("career_openings").select("*").order("sort_order"),
    ]);
    if (m.data) setMilestones(m.data.map(d => ({ ...d, team_size: d.team_size || "" })));
    if (s.data) setServices(s.data);
    if (c.data) setCareers(c.data);
  }, []);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/admin/login");
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) fetchAll();
  }, [isAdmin, fetchAll]);

  const showMsg = (text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 3000);
  };

  // Milestones CRUD
  const saveMilestones = async () => {
    setSaving(true);
    // Delete removed items
    const { data: existing } = await supabase.from("milestones").select("id");
    const currentIds = milestones.filter(m => m.id).map(m => m.id!);
    const toDelete = (existing || []).filter(e => !currentIds.includes(e.id));
    for (const d of toDelete) await supabase.from("milestones").delete().eq("id", d.id);

    for (const m of milestones) {
      const payload = { year: m.year, title: m.title, description: m.description, highlights: m.highlights.filter(h => h.trim()), team_size: m.team_size || null, sort_order: m.sort_order };
      if (m.id) {
        await supabase.from("milestones").update(payload).eq("id", m.id);
      } else {
        const { data } = await supabase.from("milestones").insert(payload).select().single();
        if (data) m.id = data.id;
      }
    }
    setSaving(false);
    showMsg("Milestones saved!");
    fetchAll();
  };

  const saveServices = async () => {
    setSaving(true);
    const { data: existing } = await supabase.from("services").select("id");
    const currentIds = services.filter(s => s.id).map(s => s.id!);
    const toDelete = (existing || []).filter(e => !currentIds.includes(e.id));
    for (const d of toDelete) await supabase.from("services").delete().eq("id", d.id);

    for (const s of services) {
      const payload = { title: s.title, short: s.short, detail: s.detail, category: s.category, icon_name: s.icon_name, benefits: s.benefits.filter(b => b.trim()), sort_order: s.sort_order };
      if (s.id) {
        await supabase.from("services").update(payload).eq("id", s.id);
      } else {
        const { data } = await supabase.from("services").insert(payload).select().single();
        if (data) s.id = data.id;
      }
    }
    setSaving(false);
    showMsg("Services saved!");
    fetchAll();
  };

  const saveCareers = async () => {
    setSaving(true);
    const { data: existing } = await supabase.from("career_openings").select("id");
    const currentIds = careers.filter(c => c.id).map(c => c.id!);
    const toDelete = (existing || []).filter(e => !currentIds.includes(e.id));
    for (const d of toDelete) await supabase.from("career_openings").delete().eq("id", d.id);

    for (const c of careers) {
      const payload = { title: c.title, type: c.type, location: c.location, description: c.description, tab: c.tab, is_active: c.is_active, sort_order: c.sort_order };
      if (c.id) {
        await supabase.from("career_openings").update(payload).eq("id", c.id);
      } else {
        const { data } = await supabase.from("career_openings").insert(payload).select().single();
        if (data) c.id = data.id;
      }
    }
    setSaving(false);
    showMsg("Careers saved!");
    fetchAll();
  };

  const handleSave = () => {
    if (tab === "milestones") saveMilestones();
    else if (tab === "services") saveServices();
    else saveCareers();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border sticky top-0 z-50 bg-background">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={kgcLogo} alt="KGC" className="h-7" />
            <span className="text-sm font-semibold hidden sm:inline">Content Manager</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Site
            </Link>
            <button onClick={handleLogout} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 ml-4">
              <LogOut className="w-3 h-3" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
        {/* Status message */}
        {msg && (
          <div className="mb-4 px-4 py-2 bg-primary/10 text-primary text-sm font-medium">
            {msg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-0 border-b border-border mb-6 overflow-x-auto">
          {(["milestones", "services", "careers"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 sm:px-6 py-3 text-sm font-semibold capitalize whitespace-nowrap border-b-2 -mb-px transition-colors ${
                tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Save button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Milestones Editor */}
        {tab === "milestones" && (
          <div className="space-y-4">
            {milestones.map((m, i) => (
              <div key={m.id || i} className="border border-border p-4 sm:p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GripVertical className="w-4 h-4" />
                    <span className="text-xs font-medium">#{i + 1}</span>
                  </div>
                  <button onClick={() => setMilestones(ms => ms.filter((_, j) => j !== i))} className="text-destructive hover:opacity-70">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Year</label>
                    <input value={m.year} onChange={e => { const v = [...milestones]; v[i].year = e.target.value; setMilestones(v); }} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Title</label>
                    <input value={m.title} onChange={e => { const v = [...milestones]; v[i].title = e.target.value; setMilestones(v); }} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Team Size</label>
                    <input value={m.team_size} onChange={e => { const v = [...milestones]; v[i].team_size = e.target.value; setMilestones(v); }} className={inputClass} placeholder="e.g. 15 team members" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Description</label>
                  <textarea value={m.description} onChange={e => { const v = [...milestones]; v[i].description = e.target.value; setMilestones(v); }} className={`${inputClass} resize-none`} rows={2} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Highlights (one per line)</label>
                  <BulletEditor value={m.highlights} onChange={val => { const v = [...milestones]; v[i].highlights = val; setMilestones(v); }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Sort Order</label>
                    <input type="number" value={m.sort_order} onChange={e => { const v = [...milestones]; v[i].sort_order = parseInt(e.target.value) || 0; setMilestones(v); }} className={inputClass} />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => setMilestones(ms => [...ms, { year: "", title: "", description: "", highlights: [], team_size: "", sort_order: ms.length }])}
              className="w-full py-3 border border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center gap-2 justify-center"
            >
              <Plus className="w-4 h-4" /> Add Milestone
            </button>
          </div>
        )}

        {/* Services Editor */}
        {tab === "services" && (
          <div className="space-y-4">
            {services.map((s, i) => (
              <div key={s.id || i} className="border border-border p-4 sm:p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GripVertical className="w-4 h-4" />
                    <span className="text-xs font-medium">#{i + 1}</span>
                  </div>
                  <button onClick={() => setServices(ss => ss.filter((_, j) => j !== i))} className="text-destructive hover:opacity-70">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Title</label>
                    <input value={s.title} onChange={e => { const v = [...services]; v[i].title = e.target.value; setServices(v); }} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Category</label>
                    <input value={s.category} onChange={e => { const v = [...services]; v[i].category = e.target.value; setServices(v); }} className={inputClass} placeholder="e.g. Supply Chain" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Short Description</label>
                  <input value={s.short} onChange={e => { const v = [...services]; v[i].short = e.target.value; setServices(v); }} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Full Detail</label>
                  <textarea value={s.detail} onChange={e => { const v = [...services]; v[i].detail = e.target.value; setServices(v); }} className={`${inputClass} resize-none`} rows={3} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Icon Name</label>
                    <select value={s.icon_name} onChange={e => { const v = [...services]; v[i].icon_name = e.target.value; setServices(v); }} className={inputClass}>
                      {["Network", "Warehouse", "PackageSearch", "DollarSign", "ClipboardCheck", "ShieldAlert", "Megaphone", "Palette", "BarChart3", "Target", "Lightbulb", "TrendingUp"].map(ic => (
                        <option key={ic} value={ic}>{ic}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Sort Order</label>
                    <input type="number" value={s.sort_order} onChange={e => { const v = [...services]; v[i].sort_order = parseInt(e.target.value) || 0; setServices(v); }} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Benefits (one per line)</label>
                  <BulletEditor value={s.benefits} onChange={val => { const v = [...services]; v[i].benefits = val; setServices(v); }} />
                </div>
              </div>
            ))}
            <button
              onClick={() => setServices(ss => [...ss, { title: "", short: "", detail: "", category: "", icon_name: "Network", benefits: [], sort_order: ss.length }])}
              className="w-full py-3 border border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center gap-2 justify-center"
            >
              <Plus className="w-4 h-4" /> Add Service
            </button>
          </div>
        )}

        {/* Careers Editor */}
        {tab === "careers" && (
          <div className="space-y-4">
            {careers.map((c, i) => (
              <div key={c.id || i} className="border border-border p-4 sm:p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GripVertical className="w-4 h-4" />
                    <span className="text-xs font-medium">#{i + 1}</span>
                  </div>
                  <button onClick={() => setCareers(cs => cs.filter((_, j) => j !== i))} className="text-destructive hover:opacity-70">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Title</label>
                    <input value={c.title} onChange={e => { const v = [...careers]; v[i].title = e.target.value; setCareers(v); }} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Tab</label>
                    <select value={c.tab} onChange={e => { const v = [...careers]; v[i].tab = e.target.value; setCareers(v); }} className={inputClass}>
                      <option value="careers">Careers</option>
                      <option value="internships">Internships</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Type</label>
                    <input value={c.type} onChange={e => { const v = [...careers]; v[i].type = e.target.value; setCareers(v); }} className={inputClass} placeholder="Full-time / Part-time / Internship" />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Location</label>
                    <input value={c.location} onChange={e => { const v = [...careers]; v[i].location = e.target.value; setCareers(v); }} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Description</label>
                  <textarea value={c.description} onChange={e => { const v = [...careers]; v[i].description = e.target.value; setCareers(v); }} className={`${inputClass} resize-none`} rows={2} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Sort Order</label>
                    <input type="number" value={c.sort_order} onChange={e => { const v = [...careers]; v[i].sort_order = parseInt(e.target.value) || 0; setCareers(v); }} className={inputClass} />
                  </div>
                  <div className="flex items-end gap-2 pb-0.5">
                    <label className="text-xs font-medium flex items-center gap-2">
                      <input type="checkbox" checked={c.is_active} onChange={e => { const v = [...careers]; v[i].is_active = e.target.checked; setCareers(v); }} className="accent-primary" />
                      Active (visible on site)
                    </label>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => setCareers(cs => [...cs, { title: "", type: "Full-time", location: "Remote", description: "", tab: "careers", is_active: true, sort_order: cs.length }])}
              className="w-full py-3 border border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center gap-2 justify-center"
            >
              <Plus className="w-4 h-4" /> Add Opening
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
