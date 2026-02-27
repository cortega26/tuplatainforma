export const DEFAULT_LOCALE = "es" as const;

export const UI_COPY = {
  es: {
    toc: {
      title: "Tabla de contenidos",
      toggleShow: "Mostrar tabla de contenidos",
    },
  },
} as const;

type SupportedLocale = keyof typeof UI_COPY;

const SUPPORTED_LOCALES = Object.keys(UI_COPY) as SupportedLocale[];

export function getUiCopyForLocale(locale: string | undefined = DEFAULT_LOCALE) {
  const normalizedLocale = locale?.toLowerCase() ?? DEFAULT_LOCALE;
  const resolvedLocale = normalizedLocale.startsWith("es")
    ? DEFAULT_LOCALE
    : undefined;

  if (!resolvedLocale) {
    throw new Error(
      `[i18n] Unsupported locale "${locale ?? "undefined"}". Supported locales: ${SUPPORTED_LOCALES.join(", ")}.`
    );
  }

  const copy = UI_COPY[resolvedLocale];
  if (!copy?.toc?.title || !copy?.toc?.toggleShow) {
    throw new Error(
      `[i18n] Missing required keys for "${resolvedLocale}": toc.title and toc.toggleShow.`
    );
  }

  return copy;
}
