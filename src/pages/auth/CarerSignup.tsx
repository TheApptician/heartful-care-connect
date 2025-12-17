import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, ArrowLeft, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const careTypes = [
  "Personal Care",
  "Companionship",
  "Dementia Care",
  "Palliative Care",
  "Learning Disabilities",
  "Mental Health",
  "Physical Disabilities",
  "Nursing Care",
];

const CarerSignup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    postcode: "",
    experience: "",
    careTypes: [] as string[],
    hasDBS: false,
    hasRightToWork: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleCareType = (type: string) => {
    setFormData({
      ...formData,
      careTypes: formData.careTypes.includes(type)
        ? formData.careTypes.filter((t) => t !== type)
        : [...formData.careTypes, type],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Registration functionality",
        description: "Connect Lovable Cloud to enable authentication.",
      });
    }, 1000);
  };

  return (
    <AuthLayout
      title={step === 1 ? "Join as a Carer" : "Tell us about yourself"}
      subtitle={step === 1 ? "Create your carer profile" : "Help us match you with clients"}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => (step === 1 ? navigate("/signup") : setStep(1))}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {step === 1 ? "Back to options" : "Back"}
        </button>

        {/* Progress */}
        <div className="flex gap-2">
          <div className={`h-1 flex-1 rounded ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
          <div className={`h-1 flex-1 rounded ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
        </div>

        {step === 1 ? (
          <>
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Jane"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Smith"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+44 7700 900000"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="button" className="w-full" size="lg" onClick={() => setStep(2)}>
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </>
        ) : (
          <>
            {/* Postcode */}
            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="postcode"
                  name="postcode"
                  placeholder="SW1A 1AA"
                  value={formData.postcode}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label>Years of experience</Label>
              <Select
                value={formData.experience}
                onValueChange={(value) => setFormData({ ...formData, experience: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">Less than 1 year</SelectItem>
                  <SelectItem value="1-3">1-3 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="5-10">5-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Care Types */}
            <div className="space-y-2">
              <Label>Care specialisms (select all that apply)</Label>
              <div className="grid grid-cols-2 gap-2">
                {careTypes.map((type) => (
                  <div
                    key={type}
                    onClick={() => toggleCareType(type)}
                    className={`p-2 text-sm rounded-lg border cursor-pointer transition-colors ${
                      formData.careTypes.includes(type)
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-border hover:border-primary/50"
                    }`}
                  >
                    {type}
                  </div>
                ))}
              </div>
            </div>

            {/* DBS & Right to Work */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="hasDBS"
                  checked={formData.hasDBS}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, hasDBS: checked as boolean })
                  }
                />
                <Label htmlFor="hasDBS" className="text-sm font-normal cursor-pointer">
                  I have a valid DBS certificate
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="hasRightToWork"
                  checked={formData.hasRightToWork}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, hasRightToWork: checked as boolean })
                  }
                />
                <Label htmlFor="hasRightToWork" className="text-sm font-normal cursor-pointer">
                  I have the right to work in the UK
                </Label>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading || !agreeTerms}
            >
              {isLoading ? "Creating account..." : "Create carer account"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </>
        )}

        {/* Sign In Link */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default CarerSignup;
