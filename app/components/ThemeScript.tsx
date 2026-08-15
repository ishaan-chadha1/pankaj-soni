import { DEFAULT_THEME, THEME_KEY } from "@/lib/themes";

/**
 * Applies the stored palette to <html> before the browser paints.
 *
 * This has to be a blocking inline script in the document: if the theme were
 * applied in an effect, the page would paint once in the default palette and
 * then snap to the chosen one — the classic theme flash. Reading localStorage
 * synchronously here is the only way to avoid it, and it is cheap.
 */
export default function ThemeScript() {
  const js = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
    THEME_KEY
  )});var ok=["bone","porcelain","blush","sand","sage","alabaster"];document.documentElement.dataset.theme=ok.indexOf(t)>-1?t:${JSON.stringify(
    DEFAULT_THEME
  )};}catch(e){document.documentElement.dataset.theme=${JSON.stringify(
    DEFAULT_THEME
  )};}})();`;

  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
