/**
 * talk-skin-controls.js — Latinoware 2026 deck
 * Binds the skin panel and slide swatches to Velora editorial themes.
 */
(function () {
  const root = document.documentElement;
  const ls = localStorage;

  const EDITORIAL_KEY = "vl-editorial-theme";
  const THEME_KEY = "vl-theme";
  const ALLOWED_EDITORIAL = ["noir", "earth", "aethel", "meridian"];

  const EDITORIAL_META = {
    noir: { pack: "velora-noir", theme: "dark", themeColor: "#0d0f0c" },
    earth: { pack: "velora-earth", theme: "light", themeColor: "#fbf9f4" },
    aethel: { pack: "velora-aethel", theme: "dark", themeColor: "#000000" },
    meridian: { pack: "velora-meridian", theme: "dark", themeColor: "#0d100a" },
  };

  function applyEditorial(value) {
    const skin = ALLOWED_EDITORIAL.includes(value) ? value : "noir";
    const meta = EDITORIAL_META[skin];

    root.setAttribute("data-editorial-theme", skin);
    root.setAttribute("data-theme-pack", meta.pack);
    root.setAttribute("data-theme", meta.theme);

    ls.setItem(EDITORIAL_KEY, skin);
    ls.setItem(THEME_KEY, meta.theme);

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute("content", meta.themeColor);
    }

    document.querySelectorAll(".talk-skin-panel__select").forEach((sel) => {
      sel.value = skin;
    });

    document.querySelectorAll("[data-talk-skin]").forEach((btn) => {
      const active = btn.dataset.talkSkin === skin;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  const current = root.getAttribute("data-editorial-theme") || "noir";
  applyEditorial(current);

  document.querySelectorAll(".talk-skin-panel__select").forEach((sel) => {
    sel.addEventListener("change", (event) => {
      applyEditorial(event.target.value);
    });
  });

  document.querySelectorAll("[data-talk-skin]").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyEditorial(btn.dataset.talkSkin || "noir");
    });
  });
})();
