import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const steps = [
    { n: "1", title: "Select a template", desc: "Pick from professionally designed, fully unique layouts." },
    { n: "2", title: "Fill your content", desc: "One simple form per section - no design decisions needed." },
    { n: "3", title: "Preview instantly", desc: "See your site update live on desktop, tablet, and mobile." },
    { n: "4", title: "Publish", desc: "Go live at your own URL in one click." },
  ];

  return (
    <div className="flex flex-1 flex-col items-center bg-linear-to-b from-white to-zinc-50 px-6">
      <div className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center py-24 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm font-medium text-zinc-600">
          <Sparkles className="h-4 w-4 text-indigo-600" /> SiteForge
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-900 md:text-6xl">
          A website builder without the building.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-zinc-600">
          No drag-and-drop, no decisions to agonize over. Choose a template, fill
          in your content, and publish. Switch designs anytime - your content
          comes with you.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-7 py-3.5 font-semibold text-white shadow-lg transition hover:bg-indigo-700"
        >
          Open the dashboard <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="mt-20 grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="rounded-xl border border-zinc-200 bg-white p-5 text-left">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 font-bold text-indigo-600">
                {s.n}
              </div>
              <h3 className="mt-3 font-semibold text-zinc-900">{s.title}</h3>
              <p className="mt-1 text-sm text-zinc-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
