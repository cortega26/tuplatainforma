import { DEFAULT_LOCALE } from "./i18n/ui";

export const SITE = {
  website: "https://cortega26.github.io/tuplatainforma/",
  author: "Carlos Ortega",
  profile: "https://github.com/cortega26",
  desc: "Finanzas personales para chilenos. Guías sobre AFP, APV, impuestos, inversiones y calculadoras prácticas.",
  title: "Tu Plata Informa",
  ogImage: "tuplatainforma-og.jpg",
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
