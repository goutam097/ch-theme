import { EditorShell } from "@/components/dashboard/EditorShell";
import { HeroEditor } from "@/components/editors/HeroEditor";

export default function HomeContentPage() {
  return (
    <EditorShell
      title="Home / Hero"
      description="The first thing visitors see. Fields you don't need are simply ignored by the active template's hero variant."
    >
      <HeroEditor />
    </EditorShell>
  );
}
