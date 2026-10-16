/*
 * vNext language preference (EN | PT-BR). State only, no animation runtime.
 *
 * Content is already in the HTML in both languages (see css/vnext/i18n.css), so
 * switching is a CSS change driven by <html data-lang>. This file only:
 *   - picks the language before first paint:  ?lang=pt|en  >  saved choice  >  browser language  >  en
 *   - keeps <html lang>, the header radios (name="vl-lang") and the saved choice in sync
 *   - swaps the few strings CSS cannot reach: aria-label, alt, title, placeholder, <option> and <title>
 *     (written in the markup as data-pt-aria-label, data-pt-alt, data-pt-title, data-pt-placeholder, data-pt)
 * Without this script the page stays in English and the radios still switch the content (CSS :has()).
 */
(() => {
  const root = document.documentElement;
  const KEY = "vl-lang";
  const ATTRS = ["aria-label", "alt", "title", "placeholder", "aria-description", "content"];

  const read = () => {
    try { return window.localStorage.getItem(KEY); } catch { return null; }
  };
  const write = (v) => {
    try { window.localStorage.setItem(KEY, v); } catch { /* storage unavailable: applies to this page only */ }
  };

  let fromUrl = null;
  try {
    const q = new URLSearchParams(window.location.search).get("lang");
    if (q === "pt" || q === "en") fromUrl = q;
  } catch { /* ignore */ }

  const saved = read();
  const browser = /^pt\b/i.test(navigator.language || "") ? "pt" : "en";
  let lang = fromUrl || (saved === "pt" || saved === "en" ? saved : browser);
  if (fromUrl) write(fromUrl);

  const applyRoot = () => {
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang === "pt" ? "pt-BR" : "en");
  };
  applyRoot();

  // Text attributes: remember the English value once, then switch.
  const applyStrings = () => {
    ATTRS.forEach((a) => {
      document.querySelectorAll(`[data-pt-${a}]`).forEach((el) => {
        if (!el.hasAttribute(`data-en-${a}`)) el.setAttribute(`data-en-${a}`, el.getAttribute(a) || "");
        el.setAttribute(a, el.getAttribute(lang === "pt" ? `data-pt-${a}` : `data-en-${a}`));
      });
    });
    document.querySelectorAll("[data-pt]").forEach((el) => {
      if (el.dataset.en === undefined) el.dataset.en = el.textContent;
      el.textContent = lang === "pt" ? el.dataset.pt : el.dataset.en;
    });
    const t = document.querySelector("title[data-pt]");
    if (t) document.title = lang === "pt" ? t.dataset.pt : t.dataset.en;
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('input[name="vl-lang"]').forEach((r) => {
      r.checked = r.value === lang;
      r.addEventListener("change", () => {
        if (!r.checked) return;
        lang = r.value === "pt" ? "pt" : "en";
        write(lang);
        applyRoot();
        applyStrings();
      });
    });
    applyStrings();
  });
})();
