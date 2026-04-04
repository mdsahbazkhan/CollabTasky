"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, User, Mail, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { signupUser } from "@/src/services/auth.service";
import { setAuthToken } from "@/src/lib/auth";
import { toast } from "sonner";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPasswordChecks(password: string) {
  return {
    length: password.length >= 8 && password.length <= 10,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
}

function isPasswordStrong(password: string) {
  const checks = getPasswordChecks(password);
  return Object.values(checks).every(Boolean);
}

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const passwordChecks = getPasswordChecks(form.password);
  const showPasswordHints = form.password.length > 0;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (!isPasswordStrong(form.password)) {
      newErrors.password = "Password does not meet all requirements";
    }

    if (!termsAccepted) {
      newErrors.terms = "You must accept the Terms of Service";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await signupUser({
        name: form.firstName.trim() + " " + form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      setAuthToken(res.token);
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Account created successfully");
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      const message =
        error?.response?.data?.message || "Failed to create account ❌";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const requirementItems = [
    { key: "length", label: "8–10 characters" },
    { key: "hasUppercase", label: "One uppercase letter (A–Z)" },
    { key: "hasLowercase", label: "One lowercase letter (a–z)" },
    { key: "hasNumber", label: "One number (0–9)" },
    { key: "hasSpecial", label: "One special character (!@#$%^&*...)" },
  ] as const;

  return (
    <div className="flex min-h-screen">
      {/* Left side - Decorative */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 via-primary/10 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="max-w-lg">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Start building amazing projects
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg overflow-hidden">
                    <Image
                      src="/favicon.svg"
                      alt="CollabTasky"
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      AI-Powered Insights
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Get intelligent suggestions and automate repetitive tasks
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Team Collaboration
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Work together in real-time with your entire team
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                    <Lock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Enterprise Security
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your data is protected with industry-leading security
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center gap-2 mb-8">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg">
              <Image
                src="/favicon.svg"
                alt="CollabTasky"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-2xl font-bold text-foreground">
              CollabTasky
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:text-primary/80"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    className={errors.firstName ? "border-destructive" : ""}
                    onChange={(e) => {
                      setForm({ ...form, firstName: e.target.value });
                      if (errors.firstName)
                        setErrors({ ...errors, firstName: "" });
                    }}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-destructive">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    className={errors.lastName ? "border-destructive" : ""}
                    onChange={(e) => {
                      setForm({ ...form, lastName: e.target.value });
                      if (errors.lastName)
                        setErrors({ ...errors, lastName: "" });
                    }}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-destructive">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    maxLength={10}
                    className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                    onChange={(e) => {
                      setForm({ ...form, password: e.target.value });
                      if (errors.password)
                        setErrors({ ...errors, password: "" });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Password strength requirements */}
                {showPasswordHints && (
                  <ul className="mt-2 space-y-1 rounded-md border bg-muted/40 px-3 py-2">
                    {requirementItems.map(({ key, label }) => {
                      const passed = passwordChecks[key];
                      return (
                        <li
                          key={key}
                          className={`flex items-center gap-2 text-xs ${
                            passed ? "text-green-600" : "text-muted-foreground"
                          }`}
                        >
                          {passed ? (
                            <Check className="h-3 w-3 shrink-0 text-green-600" />
                          ) : (
                            <X className="h-3 w-3 shrink-0 text-muted-foreground" />
                          )}
                          {label}
                        </li>
                      );
                    })}
                  </ul>
                )}

                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    className="mt-0.5"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => {
                      setTermsAccepted(!!checked);
                      if (errors.terms) setErrors({ ...errors, terms: "" });
                    }}
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm font-normal text-muted-foreground leading-snug"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {errors.terms && (
                  <p className="text-xs text-destructive pl-6">{errors.terms}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
