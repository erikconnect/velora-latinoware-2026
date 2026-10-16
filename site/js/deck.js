/*
 * Deck navigation only. No animation runs here: all motion is CSS (vl-* attributes).
 * Keys: → ↓ PageDown Space = next · ← ↑ PageUp = previous · Home/End · F = fullscreen.
 * The URL hash (#s4) follows the current slide, so any slide is linkable.
 */
(function () {
  "use strict";
  var deck = document.getElementById("deck");
  var slides = Array.prototype.slice.call(deck.querySelectorAll(".slide"));
  var cur = document.getElementById("cur");
  document.getElementById("tot").textContent = String(slides.length);
  var index = 0;

  function go(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    slides[i].scrollIntoView({ block: "start" });
  }

  // Theme: "auto" removes the override, light/dark set data-theme on <html>.
  var root = document.documentElement;
  Array.prototype.forEach.call(document.querySelectorAll('input[name="vl-theme"]'), function (r) {
    r.addEventListener("change", function () {
      if (r.value === "auto") root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", r.value);
    });
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      index = slides.indexOf(e.target);
      cur.textContent = String(index + 1);
      if (history.replaceState) history.replaceState(null, "", "#" + e.target.id);
    });
  }, { root: deck, threshold: 0.6 });
  slides.forEach(function (s) { io.observe(s); });

  document.addEventListener("keydown", function (ev) {
    if (ev.altKey || ev.ctrlKey || ev.metaKey) return;
    var t = ev.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
    var k = ev.key;
    if (k === "ArrowRight" || k === "ArrowDown" || k === "PageDown" || (k === " " && !ev.shiftKey)) { ev.preventDefault(); go(index + 1); }
    else if (k === "ArrowLeft" || k === "ArrowUp" || k === "PageUp" || (k === " " && ev.shiftKey)) { ev.preventDefault(); go(index - 1); }
    else if (k === "Home") { ev.preventDefault(); go(0); }
    else if (k === "End") { ev.preventDefault(); go(slides.length - 1); }
    else if ((k === "p" || k === "P") && slides[index].querySelector(".play")) { location.href = slides[index].querySelector(".play").href; }
    else if (k === "f" || k === "F") {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (root.requestFullscreen) root.requestFullscreen();
    }
  });

  if (location.hash) {
    var target = document.getElementById(location.hash.slice(1));
    if (target && slides.indexOf(target) > -1) {
      deck.style.scrollBehavior = "auto";
      target.scrollIntoView({ block: "start" });
      deck.style.scrollBehavior = "";
    }
  }
  deck.focus({ preventScroll: true });
})();
