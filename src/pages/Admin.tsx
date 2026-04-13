import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Trash2, Plus, LogOut, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import kgcLogo from "@/assets/kgc-logo.png";

type Tab = "milestones" | "services" | "careers";

interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  highlights: string[];
  team_size: string | null;
  sort_order: number;
}

interface Service {
  id: string;
  icon_name: string;
  title: string;
  short: string;
  detail: string;
  benefits: string[];
  category: string;
  sort_order: number;
}

interface CareerOpening {
  id: string;
  title: string;
  type: string;
  location: string;
  description: string;
  tab: string;
  is_active: boolean;
  sort_order: number;
}

const ICON_OPTIONS = ["Network", "Warehouse", "PackageSearch", "DollarSign", "ClipboardCheck", "ShieldAlert", "Megaphone", "Palette"];

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("milestones");
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [careers, setCareers] = useState<CareerOpening[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchAll();
    }
  }, [isAdmin]);

  const fetchAll = async () => {
    const [m, s, c] = await Promise.all([
      supabase.from("milestones").select("*").order("sort_order"),
      supabase.from("services").select("*").order("sort_order"),
      supabase.from("career_openings").select("*").order("sort_order"),
    ]);
    if (m.data) setMilestones(m.data);
    if (s.data) setServices(s.data);
    if (c.data) setCareers(c.data);
  };

  const startEdit = (item: any) => {
    setEditing(item.id);
    setFormData({ ...item });
  };

  const startNew = (tab: Tab) => {
    setEditing("new");
    if (tab === "milestones") {
      setFormData({ year: "", title: "", description: "", highlights: [], team_size: "", sort_order: milestones.length + 1 });
    } else if (tab === "services") {
      setFormData({ icon_name: "Network", title: "", short: "", detail: "", benefits: [], category: "Supply Chain", sort_order: services.length + 1 });
    } else {
      setFormData({ title: "", type: "Full-time", location: "Montenegro", description: "", tab: "careers", is_active: true, sort_order: careers.length + 1 });
    }
  };

  const save = async () => {
    setSaving(true);
    const table = activeTab === "milestones" ? "milestones" : activeTab === "services" ? "services" : "career_openings";
    const { id, created_at, updated_at, ...data } = formData;

    if (editing === "new") {
      await supabase.from(table).insert(data);
    } else {
      await supabase.from(table).update(data).eq("id", editing);
    }

    setEditing(null);
    setFormData({});
    setSaving(false);
    fetchAll();
  };

  const remove = async (table: string, id: string) => {
    if (!confirm("Are you sure?")) return;
    await supabase.from(table as any).delete().eq("id", id);
    fetchAll();
  };

  if (loading || !isAdmin) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;

  const tabs: { key: Tab; label: string }[] = [
    { key: "milestones", label: "Milestones" },
    { key: "services", label: "Services" },
    { key: "careers", label: "Careers" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <img src={kgcLogo} alt="KGC" className="h-6" />
            <span className="text-sm font-semibold text-muted-foreground">Content Manager</span>
          </div>
          <button onClick={() => signOut()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-background border border-border p-1 w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { setActiveTab(t.key); setEditing(null); }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === t.key ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Add button */}
        <button
          onClick={() => startNew(activeTab)}
          className="mb-6 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add {activeTab === "milestones" ? "Milestone" : activeTab === "services" ? "Service" : "Opening"}
        </button>

        {/* Edit form */}
        {editing && (
          <div className="bg-background border border-border p-6 mb-6 space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              {editing === "new" ? "New" : "Edit"} {activeTab === "careers" ? "Opening" : activeTab.slice(0, -1)}
            </h3>

            {activeTab === "milestones" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Year</label>
                    <Input value={formData.year || ""} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Team Size</label>
                    <Input value={formData.team_size || ""} onChange={(e) => setFormData({ ...formData, team_size: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Title</label>
                  <Input value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Description</label>
                  <textarea
                    className="w-full border border-input bg-background px-3 py-2 text-sm"
                    rows={3}
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Highlights (one per line)</label>
                  <textarea
                    className="w-full border border-input bg-background px-3 py-2 text-sm"
                    rows={4}
                    value={(formData.highlights || []).join("\n")}
                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value.split("\n").filter(Boolean) })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Sort Order</label>
                  <Input type="number" value={formData.sort_order || 0} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })} />
                </div>
              </>
            )}

            {activeTab === "services" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Icon</label>
                    <select
                      className="w-full border border-input bg-background px-3 py-2 text-sm h-10"
                      value={formData.icon_name || "Network"}
                      onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                    >
                      {ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Category</label>
                    <select
                      className="w-full border border-input bg-background px-3 py-2 text-sm h-10"
                      value={formData.category || "Supply Chain"}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option>Supply Chain</option>
                      <option>Project Management</option>
                      <option>Digital Marketing</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Title</label>
                  <Input value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Short Description</label>
                  <Input value={formData.short || ""} onChange={(e) => setFormData({ ...formData, short: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Full Detail</label>
                  <textarea
                    className="w-full border border-input bg-background px-3 py-2 text-sm"
                    rows={3}
                    value={formData.detail || ""}
                    onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Benefits (one per line)</label>
                  <textarea
                    className="w-full border border-input bg-background px-3 py-2 text-sm"
                    rows={4}
                    value={(formData.benefits || []).join("\n")}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value.split("\n").filter(Boolean) })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Sort Order</label>
                  <Input type="number" value={formData.sort_order || 0} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })} />
                </div>
              </>
            )}

            {activeTab === "careers" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Tab</label>
                    <select
                      className="w-full border border-input bg-background px-3 py-2 text-sm h-10"
                      value={formData.tab || "careers"}
                      onChange={(e) => setFormData({ ...formData, tab: e.target.value })}
                    >
                      <option value="careers">Careers</option>
                      <option value="internships">Internships</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Type</label>
                    <Input value={formData.type || ""} onChange={(e) => setFormData({ ...formData, type: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Title</label>
                  <Input value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Location</label>
                  <Input value={formData.location || ""} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Description</label>
                  <textarea
                    className="w-full border border-input bg-background px-3 py-2 text-sm"
                    rows={3}
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active ?? true}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <label className="text-sm">Active (visible on site)</label>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Sort Order</label>
                  <Input type="number" value={formData.sort_order || 0} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })} />
                </div>
              </>
            )}

            <div className="flex gap-2 pt-2">
              <button onClick={save} disabled={saving} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setEditing(null)} className="px-4 py-2 border border-border text-sm hover:bg-muted">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="space-y-2">
          {activeTab === "milestones" && milestones.map((m) => (
            <div key={m.id} className="bg-background border border-border p-4 flex items-center justify-between">
              <div>
                <span className="font-bold text-primary mr-2">{m.year}</span>
                <span className="font-medium">{m.title}</span>
                {m.team_size && <span className="text-xs text-muted-foreground ml-2">({m.team_size} people)</span>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(m)} className="p-2 hover:bg-muted"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove("milestones", m.id)} className="p-2 hover:bg-muted text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}

          {activeTab === "services" && services.map((s) => (
            <div key={s.id} className="bg-background border border-border p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-primary font-medium mr-2">{s.category}</span>
                <span className="font-medium">{s.title}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(s)} className="p-2 hover:bg-muted"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove("services", s.id)} className="p-2 hover:bg-muted text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}

          {activeTab === "careers" && careers.map((c) => (
            <div key={c.id} className="bg-background border border-border p-4 flex items-center justify-between">
              <div>
                <span className={`text-xs font-medium mr-2 ${c.is_active ? "text-green-600" : "text-red-500"}`}>
                  {c.is_active ? "Active" : "Inactive"}
                </span>
                <span className="font-medium">{c.title}</span>
                <span className="text-xs text-muted-foreground ml-2">{c.tab} · {c.type}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(c)} className="p-2 hover:bg-muted"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove("career_openings", c.id)} className="p-2 hover:bg-muted text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
