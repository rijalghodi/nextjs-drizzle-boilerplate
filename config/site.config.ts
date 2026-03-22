import { env } from "./env.config";

export const siteConfig = {
  name: "NextJS Boilerplate",
  url: "https://qlaris.vercel.app",
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/og.png`,
  tagline: "Nextjs Boilerplate built with Love",
  author: "Rijal Ghodi",
  authorUrl: "rijalghodi.xyz",
  description: "Nextjs Boilerplate built with Love",
  keywords: ["Nextjs", "Boilerplate", "Rijal Ghodi", "Rijal", "Ghodi"],
  links: {
    twitter: "https://twitter.com/rijalghodi.dev",
    github: "https://github.com/rijalghodi/nextjs-boilerplate",
    email: "mailto:rijalghodi.dev@gmail.com",
  },
};

export type SiteConfig = typeof siteConfig;
