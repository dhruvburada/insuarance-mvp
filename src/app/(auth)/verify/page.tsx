"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function VerifySuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          router.refresh();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full border-2 border-pine-950 shadow-xl text-center">
        <CardHeader className="space-y-4 pb-2">
          <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border border-emerald-200 shadow-sm animate-in zoom-in-50 duration-300">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>

          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-lime-100 text-pine-950 px-3 py-1 rounded-full border border-lime-300">
              Account Activated
            </span>
            <CardTitle className="text-2xl font-extrabold text-pine-950 mt-3">
              Email Verified Successfully!
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Your agent credentials have been validated. You are now logged in.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-pine-950">Redirecting to Agent Workspace...</p>
            <p className="text-slate-500">
              Entering dashboard in <strong className="font-mono text-pine-950">{countdown}s</strong>
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-0">
          <Button
            variant="lime"
            className="w-full"
            onClick={() => {
              router.push("/");
              router.refresh();
            }}
          >
            Enter Dashboard Now →
          </Button>

          <Link href="/login" className="text-xs text-slate-500 hover:text-pine-950 font-medium pt-1">
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
