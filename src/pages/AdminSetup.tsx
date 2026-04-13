import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import kgcLogo from "@/assets/kgc-logo.png";

const AdminSetup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: fnError } = await supabase.functions.invoke("create-admin", {
      body: { email, password },
    });

    if (fnError || data?.error) {
      setError(data?.error || fnError?.message || "Failed to create admin");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => navigate("/admin/login"), 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-6">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">Admin Created!</h1>
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src={kgcLogo} alt="KGC" className="h-10 mx-auto mb-4" />
          <h1 className="text-xl font-bold">Create Admin Account</h1>
          <p className="text-sm text-muted-foreground mt-1">One-time setup for the first admin</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="email" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password (min 8 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-50">
            {loading ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSetup;
