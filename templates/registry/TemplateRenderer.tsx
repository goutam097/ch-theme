import { Fragment } from "react";
import { ThemeScope } from "../theme/ThemeScope";
import { getSectionComponent } from "./sectionRegistry";
import { getTemplate } from "./templateRegistry";
import { RENDER_ORDER, type SectionContentMap } from "./section-data";
import type { SiteContent } from "@/types";

interface TemplateRendererProps {
  templateId: string;
  content: SiteContent;
}

/**
 * DYNAMIC RENDERING ENGINE
 * ------------------------
 * Given a template id and the shared content, this:
 *   1. resolves the template config (which variant per section),
 *   2. looks up each section's component in the section registry,
 *   3. feeds it the matching slice of the master content model,
 *   4. wraps the whole output in <ThemeScope> so the template's theme applies.
 *
 * The same function powers the live preview, the standalone preview route, and
 * the published public site — guaranteeing pixel-identical output everywhere.
 */
export function TemplateRenderer({ templateId, content }: TemplateRendererProps) {
  console.log(content,'================')
  const template = getTemplate(templateId);

  const sectionData: SectionContentMap = {
    header: content.header,
    hero: content.hero,
    about: content.about,
    services: content.services,
    gallery: content.gallery,
    contact: content.contact,
  };

  return (
    <ThemeScope theme={template.theme}>
      {RENDER_ORDER.map((section) => {
        const variantId = template.home[section];
        const Section = getSectionComponent(variantId);
        if (!Section) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(`[TemplateRenderer] Missing variant "${variantId}"`);
          }
          return null;
        }
        return (
          <Fragment key={section}>
            <Section data={sectionData[section]} theme={template.theme} />
          </Fragment>
        );
      })}
    </ThemeScope>
  );
}
