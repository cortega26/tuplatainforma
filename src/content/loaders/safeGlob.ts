import { fileURLToPath } from "node:url";
import { isAbsolute, normalize, resolve } from "node:path";
import { glob } from "astro/loaders";

type DuplicateWarningMatch = {
  id: string;
  warnedFilePath: string;
};

const DUPLICATE_ID_WARNING =
  /^Duplicate id "([^"]+)" found in (.+)\. Later items with the same id will overwrite earlier ones\.$/;

export function parseDuplicateIdWarning(
  message: string
): DuplicateWarningMatch | null {
  const match = message.match(DUPLICATE_ID_WARNING);
  if (!match) return null;
  return {
    id: match[1],
    warnedFilePath: match[2],
  };
}

export function shouldSuppressSameFileDuplicateWarning({
  message,
  existingFilePath,
  rootPath,
}: {
  message: string;
  existingFilePath?: string;
  rootPath: string;
}): boolean {
  const parsed = parseDuplicateIdWarning(message);
  if (!parsed || !existingFilePath) return false;

  const existingAbsolutePath = normalize(
    isAbsolute(existingFilePath)
      ? existingFilePath
      : resolve(rootPath, existingFilePath)
  );
  const warnedAbsolutePath = normalize(parsed.warnedFilePath);

  return existingAbsolutePath === warnedAbsolutePath;
}

export function safeGlob(
  ...args: Parameters<typeof glob>
): ReturnType<typeof glob> {
  const baseLoader = glob(...args);

  return {
    ...baseLoader,
    name: "safe-glob-loader",
    async load(context) {
      const originalWarn = context.logger.warn.bind(context.logger);
      const rootPath = fileURLToPath(context.config.root);

      context.logger.warn = ((message: string) => {
        const parsed = parseDuplicateIdWarning(message);
        if (parsed) {
          const existingEntry = context.store.get(parsed.id);
          if (
            shouldSuppressSameFileDuplicateWarning({
              message,
              existingFilePath: existingEntry?.filePath,
              rootPath,
            })
          ) {
            return;
          }
        }

        originalWarn(message);
      }) as typeof context.logger.warn;

      try {
        await baseLoader.load(context);
      } finally {
        context.logger.warn = originalWarn;
      }
    },
  };
}
