"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Mail, ArrowRight, ShieldCheck, RefreshCw, AlertCircle, Shield } from "lucide-react";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // Check if the user is already registered (identities is empty array when enumeration protection is active)
    if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
      setErrorMsg("An account with this email address already exists. Please sign in instead.");
      setLoading(false);
      return;
    }

    // If Supabase immediately authenticated the user (e.g. email confirmations off)
    if (data.session) {
      router.push("/");
      router.refresh();
    } else {
      // Show post-signup email verification card
      setIsSubmitted(true);
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResending(true);
    setResendSuccess(false);
    setErrorMsg(null);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setResending(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setResendSuccess(true);
    }
  };

  // POST-SIGNUP CONFIRMATION VIEW
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full border-2 border-pine-950 shadow-xl text-center">
          <CardHeader className="space-y-4 pb-2">
            <div className="mx-auto h-16 w-16 rounded-full bg-lime-100 flex items-center justify-center text-pine-950 border border-lime-300 shadow-sm animate-in zoom-in-50 duration-300">
              <Mail className="h-8 w-8 text-pine-950" />
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-lime-100 text-pine-950 px-3 py-1 rounded-full border border-lime-300">
                Verification Required
              </span>
              <CardTitle className="text-2xl font-extrabold text-pine-950 mt-3">
                Check Your Inbox
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-1">
                We sent a secure activation link to:
              </CardDescription>
              <p className="font-mono text-sm font-bold text-pine-950 mt-1 bg-slate-100 py-1 px-3 rounded-lg inline-block border border-slate-200">
                {email}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-left space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">1.</span>
                <span>Click the confirmation link inside the email.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">2.</span>
                <span>You will be automatically verified and logged into your workspace.</span>
              </div>
            </div>

            {resendSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2 rounded-lg text-xs font-semibold">
                ✓ Verification email resent successfully!
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs font-semibold">
                {errorMsg}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-0">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleResendVerification}
              disabled={resending}
            >
              <RefreshCw className={`h-4 w-4 ${resending ? "animate-spin" : ""}`} />
              {resending ? "Sending..." : "Resend Verification Email"}
            </Button>

            <Link
              href="/login"
              className="text-xs font-semibold text-pine-950 hover:underline"
            >
              Already verified? Sign in here →
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // STANDARD SIGNUP FORM VIEW
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full border border-slate-200 shadow-lg">
        <CardHeader className="space-y-2 text-center pb-4">
          <div className="mx-auto h-12 w-12 rounded-xl bg-pine-950 text-lime-400 flex items-center justify-center font-extrabold shadow-sm mb-1">
            <Shield className="h-6 w-6 fill-lime-400 text-lime-400" />
          </div>
          <CardTitle className="text-2xl font-extrabold text-pine-950">
            Create Agent Account
          </CardTitle>
          <CardDescription>
            Join InsureAgent to onboard clients and generate instant policy proposals
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-medium space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              {errorMsg.toLowerCase().includes("already exists") && (
                <Link
                  href="/login"
                  className="text-xs font-bold text-pine-950 underline hover:text-pine-800 block pl-6"
                >
                  Click here to sign in to your existing account →
                </Link>
              )}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Priya Sharma"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@agency.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              variant="lime"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Agent Account"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-2 border-t border-slate-100 text-center">
          <div className="text-xs text-slate-600">
            Already registered?{" "}
            <Link href="/login" className="font-bold text-pine-950 hover:underline">
              Sign in to workspace
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
