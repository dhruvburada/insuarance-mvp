"use client";

import { useState, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const searchParams = useSearchParams();
  const isVerified = searchParams.get("verified") === "true";

  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setResendSuccess(false);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        setErrorMsg("Email not confirmed. Please check your inbox or resend the verification link.");
      } else {
        setErrorMsg(error.message);
      }
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setErrorMsg("Please enter your email address above to resend verification.");
      return;
    }

    setResending(true);
    setResendSuccess(false);

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
      setErrorMsg(null);
    }
  };

  return (
    <Card className="max-w-md w-full border border-slate-200 shadow-lg">
      <CardHeader className="space-y-2 text-center pb-4">
        <div className="mx-auto h-12 w-12 rounded-xl bg-pine-950 text-lime-400 flex items-center justify-center font-extrabold text-xl shadow-sm mb-1">
          🛡️
        </div>
        <CardTitle className="text-2xl font-extrabold text-pine-950">
          Agent Sign In
        </CardTitle>
        <CardDescription>
          Enter your credentials to access your insurance underwriting desk
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {isVerified && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Email successfully confirmed! Please sign in to continue.</span>
          </div>
        )}

        {resendSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Verification email resent! Please check your inbox.</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-medium space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            {errorMsg.includes("Email not confirmed") && (
              <button
                type="button"
                onClick={handleResendEmail}
                disabled={resending}
                className="text-xs font-bold text-pine-950 underline hover:text-pine-800 block"
              >
                {resending ? "Resending..." : "Click here to resend verification email →"}
              </button>
            )}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@agency.com"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
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
            {loading ? "Signing In..." : "Sign In to Workspace"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-2 border-t border-slate-100 text-center">
        <div className="text-xs text-slate-600">
          Don&apos;t have an agent account?{" "}
          <Link href="/signup" className="font-bold text-pine-950 hover:underline">
            Register here
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-sm text-slate-500 font-medium">Loading sign-in...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
