import { EditorShell } from "@/components/dashboard/EditorShell";
import { HeaderEditor } from "@/components/editors/HeaderEditor";

export default function HeaderContentPage() {
  return (
    <EditorShell
      title="Header"
      description="Customize your site's navigation and branding. The logo and menu appear at the top of every page."
    >
      <HeaderEditor />
    </EditorShell>
  );
}
