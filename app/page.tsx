"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/v1";

function SSOFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Initializing SSO...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("value");

    if (!token) {
      setStatus("No SSO token found.");
      router.replace("/not-found");
      return;
    }

    const handleSSO = async () => {
      try {
        setStatus("Authenticating...");

        const authResponse = await axios.get(`${API_BASE_URL}/auth/user-token`, {
          params: { value: token },
          headers: { Accept: "application/json" },
        });

        const authData = authResponse.data ?? {};
        const accessToken = authData?.data;

        const profileResponse = await axios.get(`${API_BASE_URL}/user-profile/details`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const profileData = profileResponse.data ?? {};

        if (typeof window !== "undefined") {
          window.localStorage.setItem("auth_token", accessToken);
          window.localStorage.setItem("auth_profile", JSON.stringify(profileData));
          window.localStorage.setItem("auth_authenticated", "true");
        }

        setStatus("Signed in successfully.");
        router.replace("/dashboard");
      } catch (err: unknown) {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.error || err.message
          : err instanceof Error
            ? err.message
            : "Unable to complete sign-in.";

        setError(message);
        setStatus("Sign-in failed.");
      }
    };

    void handleSSO();
  }, [router, searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl">
        <div className="mb-4 h-3 w-3 animate-pulse rounded-full bg-emerald-400" />
        <h1 className="text-xl font-semibold">Single Sign-On</h1>
        <p className="mt-3 text-sm text-slate-300">{status}</p>
        {error ? <p className="mt-3 text-sm text-rose-400">{error}</p> : null}
      </div>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl">
            <p className="text-sm text-slate-300">Loading SSO...</p>
          </div>
        </main>
      }
    >
      <SSOFlow />
    </Suspense>
  );
}

