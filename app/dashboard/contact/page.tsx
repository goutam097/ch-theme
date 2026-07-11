import { EditorShell } from "@/components/dashboard/EditorShell";
import { ContactEditor } from "@/components/editors/ContactEditor";

export default function ContactContentPage() {
  return (
    <EditorShell title="Contact" description="How people reach you. Map-based variants use the embed URL.">
      <ContactEditor />
    </EditorShell>
  );
}
