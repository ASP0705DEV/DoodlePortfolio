/**
 * Image Utilities & Google Drive URL Resolver
 * ASP0705DEV Doodle Portfolio CMS
 */

export const DEFAULT_DOODLE_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80";

/**
 * Extracts a Google Drive File ID from various sharing link formats.
 * Handles:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * - https://lh3.googleusercontent.com/d/FILE_ID
 * - https://drive.usercontent.google.com/download?id=FILE_ID
 */
export function extractGoogleDriveFileId(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null;

  const trimmed = url.trim();

  // Pattern 1: /file/d/FILE_ID
  const fileDPattern = /\/file\/d\/([a-zA-Z0-9_-]+)/;
  const matchD = trimmed.match(fileDPattern);
  if (matchD && matchD[1]) return matchD[1];

  // Pattern 2: id=FILE_ID in query params (e.g. open?id=xxx or uc?id=xxx)
  const idQueryPattern = /[?&]id=([a-zA-Z0-9_-]+)/;
  const matchId = trimmed.match(idQueryPattern);
  if (matchId && matchId[1]) return matchId[1];

  // Pattern 3: googleusercontent.com/d/FILE_ID
  const userContentPattern = /googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/;
  const matchUC = trimmed.match(userContentPattern);
  if (matchUC && matchUC[1]) return matchUC[1];

  return null;
}

/**
 * Returns true if the given string is a Google Drive URL format.
 */
export function isGoogleDriveUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  return (
    url.includes("drive.google.com") ||
    url.includes("googleusercontent.com/d/") ||
    url.includes("drive.usercontent.google.com")
  );
}

/**
 * Converts any image URL (including Google Drive sharing links) into a browser-renderable image source.
 * Converts Google Drive file IDs to high-performance direct CDN URLs:
 * https://lh3.googleusercontent.com/d/FILE_ID
 */
export function resolveImageUrl(
  url: string | null | undefined,
  fallback = DEFAULT_DOODLE_FALLBACK_IMAGE
): string {
  if (!url || typeof url !== "string" || !url.trim()) {
    return fallback;
  }

  const trimmed = url.trim();

  // Check if it's a Google Drive link
  const driveFileId = extractGoogleDriveFileId(trimmed);
  if (driveFileId) {
    return `https://lh3.googleusercontent.com/d/${driveFileId}`;
  }

  return trimmed;
}
