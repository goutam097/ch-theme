import type { SiteContent } from "@/types";

/**
 * Seed content used on first load and whenever a new site is created.
 *
 * The site ships with the five classic pages — Home, About, Services, Gallery,
 * Contact — but nothing about them is special: they are ordinary pages the user
 * can rename, reorder, hide from the menu, or delete (except Home), exactly
 * like a page they create themselves.
 *
 * HOME is a full landing page: it stacks a hero, about, services, gallery and
 * contact block, so the site works as a one-pager out of the box. The other
 * pages hold a deeper, standalone version of their own content.
 *
 * IDS ARE HARD-CODED here (not generated) so the server and client render the
 * same markup — see the note in `lib/blocks.ts`.
 */
export const DEFAULT_CONTENT: SiteContent = {
  header: {
    logoText: "MyWebsite",
    logoImage: "",
  },
  pages: [
    // ---------------------------------------------------------------- HOME --
    {
      id: "pg_home",
      label: "Home",
      slug: "",
      isHome: true,
      showInMenu: true,
      blocks: [
        {
          id: "blk_home_hero",
          type: "hero",
          data: {
            title: "Build a website you're proud of",
            subtitle: "No code. No drag-and-drop. Just content.",
            description:
              "Pick a template, fill in your details, preview instantly, and publish. Your content stays put even when you switch designs.",
            image:
              "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
            video:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            carousel: [
              "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
              "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
              "https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=1600&q=80",
            ],
            buttonText: "Get started",
            buttonLink: "#contact",
          },
        },
        {
          id: "blk_home_about",
          type: "about",
          data: {
            title: "About our studio",
            description:
              "We are a small team obsessed with craft. For over a decade we have helped businesses turn ideas into beautiful, fast, and reliable digital experiences that customers love to use.",
            image:
              "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
          },
        },
        {
          id: "blk_home_services",
          type: "services",
          data: [
            {
              title: "Brand strategy",
              description:
                "Positioning, messaging, and identity systems that make your brand impossible to ignore.",
              image:
                "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
            },
            {
              title: "Web design",
              description:
                "Conversion-focused interfaces designed pixel-perfect and built to perform on every device.",
              image:
                "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80",
            },
            {
              title: "Development",
              description:
                "Production-grade engineering with modern frameworks, accessibility, and speed baked in.",
              image:
                "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
            },
            {
              title: "Growth marketing",
              description:
                "Data-driven campaigns and SEO that turn your new website into a reliable growth engine.",
              image:
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
            },
          ],
        },
        {
          id: "blk_home_gallery",
          type: "gallery",
          data: [
            { image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80" },
            { image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=800&q=80" },
            { image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80" },
            { image: "https://images.unsplash.com/photo-1620287341056-49a2f1ab2fdc?auto=format&fit=crop&w=800&q=80" },
            { image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80" },
            { image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80" },
          ],
        },
        {
          id: "blk_home_contact",
          type: "contact",
          data: {
            phone: "+1 (555) 012-3456",
            email: "hello@yourstudio.com",
            address: "120 Market Street, Suite 400, San Francisco, CA",
            mapUrl:
              "https://www.google.com/maps?q=120+Market+Street+San+Francisco&output=embed",
          },
        },
      ],
    },

    // --------------------------------------------------------------- ABOUT --
    {
      id: "pg_about",
      label: "About",
      slug: "about",
      isHome: false,
      showInMenu: true,
      blocks: [
        {
          id: "blk_about_about",
          type: "about",
          data: {
            title: "The people behind the work",
            description:
              "We started in a spare room with two laptops and a stubborn belief that good software should feel effortless. Today we're a team of designers, engineers and strategists who still care about the same thing: shipping work we'd be happy to put our name on.",
            image:
              "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
          },
        },
        {
          id: "blk_about_gallery",
          type: "gallery",
          data: [
            { image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" },
            { image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80" },
            { image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" },
          ],
        },
      ],
    },

    // ------------------------------------------------------------ SERVICES --
    {
      id: "pg_services",
      label: "Services",
      slug: "services",
      isHome: false,
      showInMenu: true,
      blocks: [
        {
          id: "blk_services_services",
          type: "services",
          data: [
            {
              title: "Brand strategy",
              description:
                "Positioning, messaging, and identity systems that make your brand impossible to ignore.",
              image:
                "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
            },
            {
              title: "Web design",
              description:
                "Conversion-focused interfaces designed pixel-perfect and built to perform on every device.",
              image:
                "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80",
            },
            {
              title: "Development",
              description:
                "Production-grade engineering with modern frameworks, accessibility, and speed baked in.",
              image:
                "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
            },
            {
              title: "Growth marketing",
              description:
                "Data-driven campaigns and SEO that turn your new website into a reliable growth engine.",
              image:
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
            },
          ],
        },
        {
          id: "blk_services_contact",
          type: "contact",
          data: {
            phone: "+1 (555) 012-3456",
            email: "hello@yourstudio.com",
            address: "120 Market Street, Suite 400, San Francisco, CA",
            mapUrl:
              "https://www.google.com/maps?q=120+Market+Street+San+Francisco&output=embed",
          },
        },
      ],
    },

    // ------------------------------------------------------------- GALLERY --
    {
      id: "pg_gallery",
      label: "Gallery",
      slug: "gallery",
      isHome: false,
      showInMenu: true,
      blocks: [
        {
          id: "blk_gallery_gallery",
          type: "gallery",
          data: [
            { image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80" },
            { image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=800&q=80" },
            { image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80" },
            { image: "https://images.unsplash.com/photo-1620287341056-49a2f1ab2fdc?auto=format&fit=crop&w=800&q=80" },
            { image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80" },
            { image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80" },
          ],
        },
      ],
    },

    // ------------------------------------------------------------- CONTACT --
    {
      id: "pg_contact",
      label: "Contact",
      slug: "contact",
      isHome: false,
      showInMenu: true,
      blocks: [
        {
          id: "blk_contact_contact",
          type: "contact",
          data: {
            phone: "+1 (555) 012-3456",
            email: "hello@yourstudio.com",
            address: "120 Market Street, Suite 400, San Francisco, CA",
            mapUrl:
              "https://www.google.com/maps?q=120+Market+Street+San+Francisco&output=embed",
          },
        },
      ],
    },
  ],
};
