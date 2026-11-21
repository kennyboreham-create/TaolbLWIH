/**
 * Learning with Lukey Buke — lightweight events (outbound_click, tool_start).
 * Measurement is not gated: there is no consent banner in this pass.
 */
(function (window, document) {
  "use strict";
  window.dataLayer = window.dataLayer || [];

  function path() { return window.location.pathname || ""; }

  function lwlEvent(name, params) {
    var payload = { event: name };
    if (params) Object.keys(params).forEach(function (k) { payload[k] = params[k]; });
    window.dataLayer.push(payload);
    if (typeof window.gtag === "function") window.gtag("event", name, params || {});
  }
  window.lwlEvent = lwlEvent;

  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a") : null;
    if (!a || !a.href) return;
    try {
      var url = new URL(a.href, window.location.href);
      if (url.protocol !== "http:" && url.protocol !== "https:") return;
      if (url.origin !== window.location.origin) {
        lwlEvent("outbound_click", { link_url: url.href, outbound: true });
      }
    } catch (err) {}
  }, true);

  function toolMeta(pathname) {
    var p = pathname || "";
    var name = (p.split("/").pop() || "").replace(/\.html$/i, "");
    if (/\/Tools\/KW\//.test(p)) return { tool_name: name || "reading_tool", tool_section: "reading" };
    if (/\/Tools\/BW\//.test(p)) return { tool_name: name || "math_tool", tool_section: "math" };
    if (/\/Tools\/Typing\//.test(p)) return { tool_name: name || "typing", tool_section: "typing" };
    return null;
  }
  function bindToolStart() {
    var meta = toolMeta(path());
    if (!meta) return;
    var key = "lwl-tool-start:" + path();
    try { if (sessionStorage.getItem(key)) return; } catch (e) {}
    function fire() {
      try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, "1"); } catch (e) {}
      lwlEvent("tool_start", meta);
      document.removeEventListener("click", fire, true);
      document.removeEventListener("keydown", fire, true);
    }
    document.addEventListener("click", fire, true);
    document.addEventListener("keydown", fire, true);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindToolStart);
  else bindToolStart();
})(window, document);
