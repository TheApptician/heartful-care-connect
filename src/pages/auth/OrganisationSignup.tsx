import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, ArrowLeft, Building2, MapPin, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PostcodeAddressLookup } from "@/components/shared/PostcodeAddressLookup";

const organisationTypes = [
  { value: "care_agency", label: "Care Agency" },
  { value: "local_council", label: "Local Council" },
  { value: "care_home", label: "Care Home" },
  { value: "hospital", label: "Private Hospital" },
  { value: "hospice", label: "Hospice" },
  { value: "other", label: "Other" },
];

const OrganisationSignup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    orgName: "",
    orgType: "",
    cqcNumber: "",
    postcode: "",
    address: "",
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
        const role = session.user.user_metadata?.role;
        if (role) {
          navigate(`/${role}/dashboard`, { replace: true });
        } else {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          navigate(`/${profile?.role || 'organisation'}/dashboard`, { replace: true });
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
            role: 'organisation',
          }
        }
      });

      if (authError) {
        toast({
          title: "Signup failed",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      if (authData.user) {
        // Wait for trigger to create profile
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Upsert profile with role
        await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
            role: 'organisation',
            postcode: formData.postcode,
            address: formData.address,
          }, {
            onConflict: 'id'
          });

        // Redirect to success page
        navigate("/signup/success", { state: { role: 'organisation' } });
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
      title={step === 1 ? "Partner Registration" : "Operational Setup"}
      subtitle={step === 1 ? "Infrastructure for Care Trusts" : "Configure your service area"}
    >
      <form onSubmit={handleSubmit} className="space-y-4 animate-in-up">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => (step === 1 ? navigate("/signup") : setStep(1))}
          className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#111827] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          {step === 1 ? "Exit Registration" : "Previous Step"}
        </button>

        {/* Improved Progress Bar */}
        <div className="flex gap-1.5 py-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? "bg-[#1a9e8c]" : "bg-slate-100"
                }`}
            />
          ))}
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin First Name</Label>
                <Input name="firstName" placeholder="Michael" value={formData.firstName} onChange={handleChange} className="h-12 bg-slate-50 border-black/[0.05] rounded-xl text-sm" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Name</Label>
                <Input name="lastName" placeholder="Chen" value={formData.lastName} onChange={handleChange} className="h-12 bg-slate-50 border-black/[0.05] rounded-xl text-sm" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Work Email (Corporate)</Label>
              <Input name="email" type="email" placeholder="name@care-agency.com" value={formData.email} onChange={handleChange} className="h-12 bg-slate-50 border-black/[0.05] rounded-xl text-sm" required />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Access Password</Label>
              <Input name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="h-12 bg-slate-50 border-black/[0.05] rounded-xl text-sm" required />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Confirm Access</Label>
              <Input name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className="h-12 bg-slate-50 border-black/[0.05] rounded-xl text-sm" required />
            </div>

            <Button type="button" className="w-full h-14 rounded-xl bg-[#111827] text-white font-black hover:bg-[#1a9e8c] shadow-xl" onClick={() => setStep(2)}>
              Configure Organisation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Organisation Legal Name</Label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input name="orgName" placeholder="Care Solutions Ltd" value={formData.orgName} onChange={handleChange} className="pl-11 h-12 bg-slate-50 border-black/[0.05] rounded-xl text-sm" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Type of Provider</Label>
              <Select value={formData.orgType} onValueChange={(v) => setFormData({ ...formData, orgType: v })}>
                <SelectTrigger className="h-12 bg-slate-50 border-black/[0.05] rounded-xl">
                  <SelectValue placeholder="Select Sector" />
                </SelectTrigger>
                <SelectContent>
                  {organisationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <PostcodeAddressLookup
                postcode={formData.postcode}
                onPostcodeChange={(pc) => setFormData({ ...formData, postcode: pc })}
                onAddressSelect={(addr) => setFormData({ ...formData, address: addr })}
                label="HQ Postcode"
                required
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#1a9e8c]/5 border border-[#1a9e8c]/20 my-4">
              <div className="flex gap-2 items-center text-[#1a9e8c] mb-1">
                <Globe className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Postcode Management</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 leading-tight">
                You can refine your service delivery zones and radius within the dashboard after account activation.
              </p>
            </div>

            <div className="flex items-start gap-3 py-2">
              <Checkbox id="terms" checked={agreeTerms} onCheckedChange={(c) => setAgreeTerms(!!c)} />
              <Label htmlFor="terms" className="text-[11px] font-bold text-slate-500 leading-tight">
                I agree to the transactional introductory model and verified compliance standards of Heems.
              </Label>
            </div>

            <Button type="submit" className="w-full h-14 rounded-xl bg-[#1a9e8c] text-white font-black hover:bg-[#15806c] shadow-xl shadow-[#1a9e8c]/20" disabled={isLoading || !agreeTerms}>
              {isLoading ? "Provisioning System..." : "Activate Organisation Account"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Phase 1: 10% Platform Fee • Dedicated Support
            </p>
          </div>
        )}

        {/* Sign In Link */}
        <p className="text-center text-sm font-bold text-[#475569] pt-4">
          Organisation already active?{" "}
          <Link to="/login" className="text-[#111827] font-black hover:text-[#1a9e8c] transition-colors">
            Sign in here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default OrganisationSignup;
