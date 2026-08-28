/**
 * talk-skin-state.js — Latinoware 2026 deck
 * Applies stored or URL skin to <html> before first paint (no FOUC).
 * Uses the same keys as Velora Showcase for cross-demo consistency.
 */
(function () {
  const root = document.documentElement;
  const ls = localStorage;

  const ALLOWED_EDITORIAL = ["noir", "earth", "aethel", "meridian"];

  const EDITORIAL_META = {
    noir: { pack: "velora-noir", theme: "dark", themeColor: "#0d0f0c" },
    earth: { pack: "velora-earth", theme: "light", themeColor: "#fbf9f4" },
    aethel: { pack: "velora-aethel", theme: "dark", themeColor: "#000000" },
    meridian: { pack: "velora-meridian", theme: "dark", themeColor: "#0d100a" },
  };

  function sanitize(value, allowed, fallback) {
    return allowed.includes(value) ? value : fallback;
  }

  function applyEditorial(value) {
    const skin = sanitize(value, ALLOWED_EDITORIAL, "noir");
    const meta = EDITORIAL_META[skin];

    root.setAttribute("data-editorial-theme", skin);
    root.setAttribute("data-theme-pack", meta.pack);
    root.setAttribute("data-theme", meta.theme);

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute("content", meta.themeColor);
    }
  }

  const params = new URLSearchParams(window.location.search);
  const urlSkin = params.get("skin");
  const savedSkin = ls.getItem("vl-editorial-theme");

  if (urlSkin && ALLOWED_EDITORIAL.includes(urlSkin)) {
    applyEditorial(urlSkin);
  } else if (savedSkin && ALLOWED_EDITORIAL.includes(savedSkin)) {
    applyEditorial(savedSkin);
  }
})();
