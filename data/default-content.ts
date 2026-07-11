import type { SiteContent } from "@/types";

/**
 * Seed content used on first load and whenever a new site is created. Because
 * all templates share this single shape, switching templates never requires a
 * content migration — the same `SiteContent` flows into every variant.
 *
 * Image URLs use Unsplash source links so previews look real out of the box.
 */
export const DEFAULT_CONTENT: SiteContent = {
  header: {
    logoText: "MyWebsite",
    logoImage: "",
    menuItems: ["Home", "About", "Services", "Gallery", "Contact"],
  },
  hero: {
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
  about: {
    title: "About our studio",
    description:
      "We are a small team obsessed with craft. For over a decade we have helped businesses turn ideas into beautiful, fast, and reliable digital experiences that customers love to use.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  },
  services: [
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
  gallery: [
    { image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80" },
    { image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=800&q=80" },
    { image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80" },
    { image: "https://images.unsplash.com/photo-1620287341056-49a2f1ab2fdc?auto=format&fit=crop&w=800&q=80" },
    { image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80" },
    { image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80" },
  ],
  contact: {
    phone: "+1 (555) 012-3456",
    email: "hello@yourstudio.com",
    address: "120 Market Street, Suite 400, San Francisco, CA",
    mapUrl:
      "https://www.google.com/maps?q=120+Market+Street+San+Francisco&output=embed",
  },
};
