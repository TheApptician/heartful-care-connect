import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Users, Heart, Building2, ArrowRight } from "lucide-react";

const roleOptions = [
  {
    id: "client",
    title: "I need care",
    description: "Find trusted carers for yourself or a loved one",
    icon: Users,
    href: "/signup/client",
    color: "primary",
  },
  {
    id: "carer",
    title: "I'm a carer",
    description: "Join as a self-employed care professional",
    icon: Heart,
    href: "/signup/carer",
    color: "secondary",
  },
  {
    id: "organisation",
    title: "I'm an organisation",
    description: "Agencies, hospitals, councils & care homes",
    icon: Building2,
    href: "/signup/organisation",
    color: "accent",
  },
];

const Signup = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Choose how you'd like to use Heems"
    >
      <div className="space-y-6">
        {/* Role Selection */}
        <div className="space-y-3">
          {roleOptions.map((role) => (
            <Card
              key={role.id}
              variant="interactive"
              className={`cursor-pointer transition-all ${
                selectedRole === role.id
                  ? "border-primary ring-2 ring-primary/20"
                  : ""
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-${role.color}/10 flex items-center justify-center shrink-0`}>
                  <role.icon className={`w-6 h-6 text-${role.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{role.title}</h3>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedRole === role.id
                    ? "border-primary bg-primary"
                    : "border-border"
                }`}>
                  {selectedRole === role.id && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <Button
          className="w-full"
          size="lg"
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
              Select an option to continue
            </span>
          )}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" type="button" disabled>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
          <Button variant="outline" type="button" disabled>
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
            </svg>
            Apple
          </Button>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;
