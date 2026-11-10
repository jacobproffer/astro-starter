/**
 * Site-wide settings. Update this file first when starting a new project.
 */
export const site = {
  name: "Astro Starter",
  description: "Astro starter with TypeScript and Tailwind.",
  url: "https://www.example.com",
  lang: "en",
  locale: "en_US",
  socialImage: {
    src: "/images/social.jpg",
    alt: "Astro Starter",
    width: 1200,
    height: 800,
  },
};

export interface NavLink {
  label: string;
  href: string;
}

/** Primary navigation, shared by the header and footer. */
export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];
