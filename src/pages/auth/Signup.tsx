import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Users, Heart, Building2, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const roleOptions = [
  {
    id: "client",
    title: "I need care",
    description: "For yourself or a loved one",
    icon: Users,
    href: "/signup/client",
  },
  {
    id: "carer",
    title: "I'm a carer",
    description: "Self-employed professional",
    icon: Heart,
    href: "/signup/carer",
  },
  {
    id: "organisation",
    title: "Organisation",
    description: "Agencies, Care Hubs",
    icon: Building2,
    href: "/signup/organisation",
  },
];

const Signup = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redirect logged-in users to their dashboard
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const role = session.user.user_metadata?.role;
        if (role) {
          navigate(`/${role}/dashboard`, { replace: true });
        } else {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          navigate(`/${profile?.role || 'client'}/dashboard`, { replace: true });
        }
      }
    };
    checkUser();
  }, [navigate]);

  return (
    <AuthLayout
      title="Create account"
      subtitle="Choose your path with Heems"
    >
      <div className="space-y-4 animate-in-up">
        {/* Role Selection */}
        <div className="grid gap-2">
          {roleOptions.map((role) => (
            <div
              key={role.id}
              className={`group cursor-pointer p-5 rounded-2xl border transition-all duration-300 ${selectedRole === role.id
                ? "bg-[#111827] border-[#111827] shadow-lg"
                : "bg-white border-black/[0.05] hover:border-[#1a9e8c]/30"
                }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${selectedRole === role.id ? "bg-white/10" : "bg-slate-50 border border-black/5"
                  }`}>
                  <role.icon className={`w-5 h-5 ${selectedRole === role.id ? "text-[#1a9e8c]" : "text-[#111827]"}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-base font-black tracking-tight ${selectedRole === role.id ? "text-white" : "text-[#111827]"}`}>
                    {role.title}
                  </h3>
                  <p className={`text-[11px] font-bold leading-tight ${selectedRole === role.id ? "text-white/40" : "text-[#64748b]"}`}>
                    {role.description}
                  </p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${selectedRole === role.id
                  ? "border-[#1a9e8c] bg-[#1a9e8c]"
                  : "border-black/10 group-hover:border-[#1a9e8c]"
                  }`}>
                  {selectedRole === role.id && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <Button
          size="lg"
          className="w-full h-14 rounded-xl bg-[#111827] text-white font-black text-base hover:bg-[#1a9e8c] shadow-xl shadow-black/5 transition-all disabled:opacity-50"
          disabled={!selectedRole}
          asChild={!!selectedRole}
        >
          {selectedRole ? (
            <Link to={roleOptions.find((r) => r.id === selectedRole)?.href || "#"}>
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          ) : (
            <span>
              Select an option
            </span>
          )}
        </Button>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/[0.05]" />
          </div>
          <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
            <span className="bg-white px-4 text-[#94a3b8]">Verified Service</span>
          </div>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-sm font-bold text-[#475569]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#111827] font-black hover:text-[#1a9e8c] transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;
