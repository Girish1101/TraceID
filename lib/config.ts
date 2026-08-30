export const VERCEL_BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_VERCEL_URL ||
  "";

export function getApiUrl(path: string): string {
  if (typeof window !== "undefined") {
    // If hosted on GitHub Pages (*.github.io), point to Vercel backend
    if (window.location.hostname.includes("github.io") && VERCEL_BACKEND_URL) {
      const baseUrl = VERCEL_BACKEND_URL.startsWith("http")
        ? VERCEL_BACKEND_URL
        : `https://${VERCEL_BACKEND_URL}`;
      return `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
    }
  }
  return path;
}
