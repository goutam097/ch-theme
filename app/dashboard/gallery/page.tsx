import { EditorShell } from "@/components/dashboard/EditorShell";
import { GalleryEditor } from "@/components/editors/GalleryEditor";

export default function GalleryContentPage() {
  return (
    <EditorShell title="Gallery" description="Showcase your work with a set of images.">
      <GalleryEditor />
    </EditorShell>
  );
}
