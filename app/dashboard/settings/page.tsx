import { SettingsEditor } from "@/components/editors/SettingsEditor";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
      <p className="mt-1 text-zinc-500">Site identity and SEO. These apply no matter which template is active.</p>
      <div className="mt-8">
        <SettingsEditor />
      </div>
    </div>
  );
}
