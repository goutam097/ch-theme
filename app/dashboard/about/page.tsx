import { EditorShell } from "@/components/dashboard/EditorShell";
import { AboutEditor } from "@/components/editors/AboutEditor";

export default function AboutContentPage() {
  return (
    <EditorShell title="About" description="Tell visitors who you are and what you stand for.">
      <AboutEditor />
    </EditorShell>
  );
}
