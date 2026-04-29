import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import kgcLogo from "@/assets/kgc-logo.png";

const getAuthErrorMessage = (message: string) => {
  if (/failed to fetch/i.test(message)) {
    return "Cannot reach Supabase from this local app. Check your local .env Supabase URL, project ID, and network/DNS setup.";
  }

  return message;
};

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(getAuthErrorMessage(error.message));
        setLoading(false);
      } else {
        navigate("/admin");
      }
    } catch (error) {
      setError(getAuthErrorMessage(error instanceof Error ? error.message : "Login failed."));
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src={kgcLogo} alt="KGC" className="h-10 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Admin Login</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className={inputClass} required />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className={inputClass} required />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
