import { Link } from "react-router-dom";
import kgcLogo from "@/assets/kgc-logo.png";

const AdminSetup = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6 sm:p-8">
        <div className="text-center mb-8">
          <img src={kgcLogo} alt="KGC" className="h-10 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Admin Setup</h1>
          <p className="text-muted-foreground text-sm mt-2">
            Admin accounts are created in Supabase Auth and granted access through the user_roles table.
          </p>
        </div>

        <div className="space-y-4 text-sm text-muted-foreground">
          <p>Use this SQL after creating a user in Supabase Authentication:</p>
          <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs text-foreground">
{`insert into public.user_roles (user_id, role)
values ('PASTE_AUTH_USER_ID_HERE', 'admin')
on conflict (user_id, role) do nothing;`}
          </pre>
          <p>
            This avoids exposing private service-role keys in the frontend.
          </p>
        </div>

        <Link to="/admin/login" className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
          Go to Admin Login
        </Link>
      </div>
    </div>
  );
};

export default AdminSetup;
