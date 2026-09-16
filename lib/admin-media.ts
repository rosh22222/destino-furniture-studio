export const imageAccept = "image/jpeg,image/png,image/webp,image/avif";
export const videoAccept = "video/mp4,video/webm,video/ogg";
export const mediaAccept = `${imageAccept},${videoAccept}`;
export const maxUploadBytes = 25 * 1024 * 1024;

export function validateImageFile(file: { name: string; size: number; type: string }) {
  if (file.size > 5 * 1024 * 1024) return `${file.name}: image must be 5 MB or smaller.`;
  if (!imageAccept.split(",").includes(file.type)) return `${file.name}: use JPG, PNG, WebP or AVIF.`;
  return "";
}

export function validateMediaFile(file: { name: string; size: number; type: string }) {
  if (imageAccept.split(",").includes(file.type)) return validateImageFile(file);
  if (file.size > maxUploadBytes) return `${file.name}: video must be 25 MB or smaller.`;
  if (!videoAccept.split(",").includes(file.type)) return `${file.name}: use JPG, PNG, WebP, AVIF, MP4, WebM or OGG.`;
  return "";
}

export function isVideoMedia(src: string) {
  const clean = normalizeMediaUrl(src).split("?")[0]?.toLowerCase() || "";
  return /\.(mp4|webm|ogg|mov|m4v)$/.test(clean);
}

export function normalizeMediaUrl(value: string): string {
  let source = value.trim();
  for (let depth = 0; depth < 4; depth++) {
    try {
      const url = new URL(source, "http://localhost");
      if (url.pathname === "/_next/image" && url.searchParams.get("url")) {
        source = url.searchParams.get("url")!;
        continue;
      }
      if (["localhost", "127.0.0.1"].includes(url.hostname) && url.pathname.startsWith("/images/")) {
        return url.pathname + url.search;
      }
    } catch { return source; }
    break;
  }
  return source;
}

export function validMediaUrl(value: string) {
  if (!value) return true;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}
