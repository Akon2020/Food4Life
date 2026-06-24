// Sanitisation HTML légère (défense en profondeur pour le contenu riche des articles).
// Le contenu provient d'éditeurs/admins authentifiés, mais on neutralise tout de même
// les vecteurs XSS courants : <script>/<style>, gestionnaires on*, et URLs javascript:.
export function sanitizeHtml(html) {
  if (typeof html !== "string") return html;
  return html
    .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, "")
    .replace(/<\s*style[^>]*>[\s\S]*?<\s*\/\s*style\s*>/gi, "")
    .replace(/<\s*iframe[^>]*>[\s\S]*?<\s*\/\s*iframe\s*>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"');
}
