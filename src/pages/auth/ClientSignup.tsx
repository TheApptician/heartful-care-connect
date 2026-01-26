import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ClientSignup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect logged-in users to their dashboard
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // User is logged in, get their role and redirect
        const role = session.user.user_metadata?.role;
        if (role) {
          navigate(`/${role}/dashboard`, { replace: true });
        } else {
          // Fetch role from profiles
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please check your credentials.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            role: 'client',
          }
        }
      });

      if (authError) {
        toast({
          title: "Signup failed",
          description: authError.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (authData.user) {
        // Wait for trigger to create profile
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Upsert profile with role
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            full_name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
            role: 'client',
          }, {
            onConflict: 'id'
          });

        if (profileError) {
          console.error('Profile upsert error:', profileError);
        }

        // Redirect to success page instead of login
        navigate("/signup/success", { state: { role: 'client' } });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Find Elite Care"
      subtitle="Connect with vetted professionals in minutes."
    >
      <form onSubmit={handleSubmit} className="space-y-4 animate-in-up">
        {/* Back Link */}
        <Link
          to="/signup"
          className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#111827] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to roles
        </Link>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">First Name</Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                name="firstName"
                placeholder="Sarah"
                value={formData.firstName}
                onChange={handleChange}
                className="pl-11 h-12 bg-slate-50 border-black/[0.05] rounded-xl text-sm"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Name</Label>
            <Input
              name="lastName"
              placeholder="Jenkins"
              value={formData.lastName}
              onChange={handleChange}
              className="h-12 bg-slate-50 border-black/[0.05] rounded-xl text-sm"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              name="email"
              type="email"
              placeholder="sarah@example.com"
              value={formData.email}
              onChange={handleChange}
              className="pl-11 h-12 bg-slate-50 border-black/[0.05] rounded-xl text-sm"
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              name="phone"
              type="tel"
              placeholder="+44 7700 900000"
              value={formData.phone}
              onChange={handleChange}
              className="pl-11 h-12 bg-slate-50 border-black/[0.05] rounded-xl text-sm"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Password</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="pl-11 pr-11 h-12 bg-slate-50 border-black/[0.05] rounded-xl text-sm"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#111827]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="pl-11 h-12 bg-slate-50 border-black/[0.05] rounded-xl text-sm"
              required
              minLength={8}
            />
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3 py-2">
          <Checkbox
            id="terms"
            checked={agreeTerms}
            onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
          />
          <Label htmlFor="terms" className="text-[11px] font-bold text-slate-500 leading-tight">
            I agree to the transactional introductory model and verified compliance standards of Heems.
          </Label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full h-14 rounded-xl bg-[#111827] text-white font-black hover:bg-[#1a9e8c] shadow-xl shadow-black/5"
          disabled={isLoading || !agreeTerms}
        >
          {isLoading ? "Creating Profile..." : "Create Account"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        <div className="p-4 rounded-2xl bg-[#1a9e8c]/5 border border-[#1a9e8c]/20 text-center">
          <p className="text-[10px] font-black text-[#1a9e8c] uppercase tracking-widest flex items-center justify-center gap-2">
            <ShieldCheck className="w-3 h-3" /> GDPR COMPLIANT
          </p>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-sm font-bold text-[#475569] pt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-[#111827] font-black hover:text-[#1a9e8c] transition-colors">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ClientSignup;
