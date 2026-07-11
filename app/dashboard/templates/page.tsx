import { TemplateGallery } from "@/components/dashboard/TemplateGallery";

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold text-zinc-900">Templates</h1>
      <p className="mt-1 max-w-2xl text-zinc-500">
        Choose a design. Switching templates keeps all of your content — every
        template uses the same data, so you can change the look anytime without
        losing a word.
      </p>
      <div className="mt-8">
        <TemplateGallery />
      </div>
    </div>
  );
}
