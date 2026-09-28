/**
 * Tiny allow-list HTML sanitizer for the synopsis field.
 *
 * Synopses come back as HTML authored in the Checkin.no admin (a trusted source),
 * but we still scrub them before using dangerouslySetInnerHTML: drop scripts,
 * event handlers, and anything outside a small formatting allow-list.
 */
const ALLOWED_TAGS = new Set([
  "p", "br", "b", "strong", "i", "em", "u", "span", "ul", "ol", "li", "a", "blockquote",
]);

export function sanitizeHtml(input: string | null): string {
  if (!input) return "";

  let html = input
    // Remove whole <script>/<style> blocks including content.
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
    // Drop comments.
    .replace(/<!--[\s\S]*?-->/g, "");

  // Walk every tag; keep allowed ones (stripped of attributes except safe href),
  // and remove the rest while preserving their inner text.
  html = html.replace(/<\/?([a-zA-Z0-9]+)([^>]*)>/g, (_match, rawName: string, attrs: string) => {
    const name = rawName.toLowerCase();
    if (!ALLOWED_TAGS.has(name)) return "";

    const isClosing = _match.startsWith("</");
    if (isClosing) return `</${name}>`;

    if (name === "a") {
      const hrefMatch = attrs.match(/\shref\s*=\s*("([^"]*)"|'([^']*)')/i);
      const href = hrefMatch ? hrefMatch[2] ?? hrefMatch[3] ?? "" : "";
      // Only allow http(s)/mailto links.
      if (/^(https?:|mailto:)/i.test(href)) {
        const safe = href.replace(/"/g, "&quot;");
        return `<a href="${safe}" target="_blank" rel="noopener noreferrer">`;
      }
      return "<a>";
    }

    // All other allowed tags: render without any attributes.
    return `<${name}>`;
  });

  return html.trim();
}
