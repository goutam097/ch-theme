"use client";

import Link from "next/link";
import { ArrowRight, LayoutTemplate, Eye, Globe } from "lucide-react";
import { useActiveTemplate, useSettings, useSiteContent } from "@/hooks/useSite";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardOverviewPage() {
  const template = useActiveTemplate();
  const settings = useSettings();
  const content = useSiteContent();

  // Content now lives in blocks spread across pages, so the checklist asks
  // "does the site have a filled-in block of this kind ANYWHERE?" rather than
  // reading a fixed section off the top of the content.
  const blocks = content.pages.flatMap((p) => p.blocks);
  const hasFilled = <T,>(type: string, isFilled: (data: T) => boolean) =>
    blocks.some((b) => b.type === type && isFilled(b.data as T));

  const checklist = [
    {
      label: "Hero headline set",
      done: hasFilled<{ title: string }>("hero", (d) => d.title.trim().length > 0),
    },
    {
      label: "About written",
      done: hasFilled<{ description: string }>(
        "about",
        (d) => d.description.trim().length > 20,
      ),
    },
    {
      label: "At least one service",
      done: hasFilled<unknown[]>("services", (d) => d.length > 0),
    },
    {
      label: "Gallery has images",
      done: hasFilled<unknown[]>("gallery", (d) => d.length > 0),
    },
    {
      label: "Contact email set",
      done: hasFilled<{ email: string }>("contact", (d) => /@/.test(d.email)),
    },
  ];
  const completed = checklist.filter((c) => c.done).length;

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Welcome back 👋</h1>
        <p className="mt-1 text-zinc-500">
          Pick a template, fill in your content, preview, and publish.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <LayoutTemplate className="h-4 w-4 text-indigo-600" /> Template
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{template.name}</p>
            <Link href="/dashboard/templates" className="mt-2 inline-flex items-center gap-1 text-sm text-indigo-600">
              Change <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4 text-indigo-600" /> Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold capitalize">{settings.status}</p>
            <p className="mt-1 text-sm text-zinc-500">
              {settings.publishedAt
                ? `Last published ${new Date(settings.publishedAt).toLocaleDateString()}`
                : "Not published yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Eye className="h-4 w-4 text-indigo-600" /> Completeness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{completed}/{checklist.length}</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full bg-indigo-600 transition-all"
                style={{ width: `${(completed / checklist.length) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Setup checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {checklist.map((c) => (
            <div key={c.label} className="flex items-center gap-3 text-sm">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                  c.done ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-400"
                }`}
              >
                {c.done ? "✓" : ""}
              </span>
              <span className={c.done ? "text-zinc-900" : "text-zinc-500"}>{c.label}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
