import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import kgcLogo from "@/assets/kgc-logo.png";

const AdminSetup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await supabase.functions.invoke("create-admin", {
        body: { email, password },
      });
      if (res.error) throw new Error(res.error.message);
      if (res.data?.error) throw new Error(res.data.error);
      setSuccess(true);
      setTimeout(() => navigate("/admin/login"), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Setup failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src={kgcLogo} alt="KGC" className="h-10 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Admin Setup</h1>
          <p className="text-muted-foreground text-sm mt-2">Create your admin account</p>
        </div>
        {success ? (
          <div className="text-center p-6 border border-border">
            <p className="text-primary font-semibold mb-2">Account created!</p>
            <p className="text-sm text-muted-foreground">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSetup} className="space-y-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Admin email" className={inputClass} required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (min 6 chars)" className={inputClass} required minLength={6} />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
              {loading ? "Creating..." : "Create Admin Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminSetup;
