import { EditorShell } from "@/components/dashboard/EditorShell";
import { ServicesEditor } from "@/components/editors/ServicesEditor";

export default function ServicesContentPage() {
  return (
    <EditorShell title="Services" description="List what you offer. Add or remove items freely.">
      <ServicesEditor />
    </EditorShell>
  );
}
