import { DEFAULT_LOCALE } from "./i18n/ui";

export const SITE = {
  website: "https://monedario.cl/",
  author: "Carlos Ortega",
  authorFullName: "Carlos Ortega González",
  authorImage: "/images/author/carlos-ortega.jpg",
  authorLinkedIn: "https://www.linkedin.com/in/cortega26/",
  profile: "https://github.com/cortega26",
  desc: "Finanzas personales para chilenos. Guías sobre AFP, APV, impuestos, inversiones y calculadoras prácticas.",
  title: "Monedario",
  ogImage: "monedario-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 6,
  postPerPage: 8,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Editar página",
    url: "https://github.com/cortega26/tuplatainforma/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: DEFAULT_LOCALE, // html lang code. Set this empty and default will be "en"
  timezone: "America/Santiago", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
