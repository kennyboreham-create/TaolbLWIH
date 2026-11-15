/**
 * Learning with Lukey Buke — Mailchimp signup, consent banner, and lightweight events.
 * Posts to audience 61d46ee02d. Never logs or stores a Mailchimp API key.
 */
(function (window, document) {
  "use strict";

  var MC_POST_JSON = "https://gmail.us16.list-manage.com/subscribe/post-json";
  var MC_U = "d8eb38a5761c5c5480c5ed388";
  var MC_ID = "61d46ee02d";
  var THANKS = "/Learning/thanks/free-mazes.html";
  var CONSENT_KEY = "lwl-consent-v1";

  window.dataLayer = window.dataLayer || [];

  function lwlEvent(name, params) {
    var payload = { event: name };
    if (params) {
      Object.keys(params).forEach(function (k) { payload[k] = params[k]; });
    }
    window.dataLayer.push(payload);
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params || {});
    }
  }
  window.lwlEvent = lwlEvent;

  /* ---------- Mailchimp JSONP submit ---------- */
  function serializeForm(form) {
    var fd = new FormData(form);
    var parts = [];
    fd.forEach(function (value, key) {
      parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    });
    return parts.join("&");
  }

  function stripTags(html) {
    var tmp = document.createElement("div");
    tmp.innerHTML = html || "";
    return (tmp.textContent || tmp.innerText || "").replace(/\s+/g, " ").trim();
  }

  function jsonp(url, callback) {
    var name = "lwlMc_" + Math.random().toString(36).slice(2);
    var script = document.createElement("script");
    var done = false;
    function finish(data) {
      if (done) return;
      done = true;
      try { delete window[name]; } catch (e) { window[name] = undefined; }
      if (script.parentNode) script.parentNode.removeChild(script);
      callback(data);
    }
    window[name] = function (data) { finish(data); };
    script.src = url + (url.indexOf("?") >= 0 ? "&" : "?") + "c=" + name;
    script.onerror = function () {
      finish({ result: "error", msg: "Something went wrong. Please try again." });
    };
    setTimeout(function () {
      finish({ result: "error", msg: "That took too long. Please try again." });
    }, 12000);
    document.body.appendChild(script);
  }

  function handleFormSubmit(e) {
    var form = e.target;
    if (!form || !form.classList.contains("lwl-mc-form")) return;
    e.preventDefault();
    var status = form.querySelector(".lwl-form-status");
    var btn = form.querySelector('[type="submit"]');
    if (btn) btn.disabled = true;
    if (status) {
      status.classList.remove("lwl-ok");
      status.textContent = "Sending…";
    }
    var url = MC_POST_JSON + "?u=" + MC_U + "&id=" + MC_ID + "&" + serializeForm(form);
    jsonp(url, function (data) {
      if (btn) btn.disabled = false;
      if (data && data.result === "success") {
        var lead = form.getAttribute("data-lead-type") || "maze_pack";
        window.location.href = THANKS + "?lead=" + encodeURIComponent(lead);
        return;
      }
      var msg = stripTags((data && data.msg) || "Something went wrong. Please try again.");
      if (status) status.textContent = msg || "Something went wrong. Please try again.";
    });
  }

  document.addEventListener("submit", handleFormSubmit, false);

  /* ---------- generate_lead on thank-you ---------- */
  function fireLeadIfThanks() {
    if (window.location.pathname.indexOf("/Learning/thanks/free-mazes.html") === -1) return;
    var params = new URLSearchParams(window.location.search);
    var lead = params.get("lead") || "maze_pack";
    lwlEvent("generate_lead", {
      lead_type: lead,
      page_path: window.location.pathname
    });
  }

  /* ---------- outbound clicks ---------- */
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

  /* ---------- tool_start (first interaction, once per tool path) ---------- */
  function toolMeta(pathname) {
    var p = pathname || "";
    var name = p.split("/").pop() || "";
    name = name.replace(/\.html$/i, "");
    if (/\/Tools\/KW\//.test(p)) return { tool_name: name || "reading_tool", tool_section: "reading" };
    if (/\/Tools\/BW\//.test(p)) return { tool_name: name || "math_tool", tool_section: "math" };
    if (/\/Tools\/Typing\//.test(p)) return { tool_name: name || "typing", tool_section: "typing" };
    return null;
  }

  function bindToolStart() {
    var meta = toolMeta(window.location.pathname);
    if (!meta) return;
    var key = "lwl-tool-start:" + window.location.pathname;
    if (sessionStorage.getItem(key)) return;
    function fire() {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
      lwlEvent("tool_start", meta);
      document.removeEventListener("click", fire, true);
      document.removeEventListener("keydown", fire, true);
    }
    document.addEventListener("click", fire, true);
    document.addEventListener("keydown", fire, true);
  }

  /* ---------- consent banner (advertising default off; GTM stays as measurement) ---------- */
  function readConsent() {
    try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || "null"); } catch (e) { return null; }
  }
  function writeConsent(obj) {
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(obj)); } catch (e) {}
  }

  function renderConsent() {
    if (readConsent()) return;
    if (document.getElementById("lwl-consent")) return;
    var bar = document.createElement("div");
    bar.id = "lwl-consent";
    bar.className = "lwl-consent";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", "Cookie preferences");
    bar.innerHTML =
      "<p>We use measurement tools to understand how the site is used. Advertising cookies stay off unless you turn them on. This banner never blocks the maze form.</p>" +
      "<div class=\"lwl-consent-actions\">" +
      "<button type=\"button\" data-accept>That's fine</button>" +
      "<button type=\"button\" data-ads-on>Allow advertising too</button>" +
      "<button type=\"button\" data-dismiss>Close</button>" +
      "<a href=\"/Learning/store/privacypolicy.html\">Privacy</a>" +
      "</div>";
    document.body.appendChild(bar);
    bar.querySelector("[data-accept]").addEventListener("click", function () {
      writeConsent({ measurement: true, advertising: false, at: Date.now() });
      bar.remove();
    });
    bar.querySelector("[data-ads-on]").addEventListener("click", function () {
      writeConsent({ measurement: true, advertising: true, at: Date.now() });
      bar.remove();
      // No Meta/Pinterest pixel IDs are configured yet (L1). Preference is stored only.
    });
    bar.querySelector("[data-dismiss]").addEventListener("click", function () {
      writeConsent({ measurement: true, advertising: false, at: Date.now() });
      bar.remove();
    });
  }

  /* ---------- comic last-page CTA hook (non-invasive) ---------- */
  function hookComicCta() {
    var cta = document.getElementById("lwl-comic-end-cta");
    if (!cta) return;
    var hiding = function () {
      try {
        if (typeof index === "number" && typeof pages !== "undefined" && pages.length) {
          cta.hidden = index < pages.length - 1;
        }
      } catch (e) {}
    };
    hiding();
    var _render = window.render;
    // pages/index are often function-local; observe the page label instead
    var label = document.getElementById("pageLabel");
    if (label && typeof MutationObserver !== "undefined") {
      var obs = new MutationObserver(function () {
        var text = (label.textContent || "").trim();
        var m = text.match(/(\d+)\s*\/\s*(\d+)/);
        if (m) cta.hidden = parseInt(m[1], 10) < parseInt(m[2], 10);
      });
      obs.observe(label, { childList: true, characterData: true, subtree: true });
    }
  }

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    fireLeadIfThanks();
    bindToolStart();
    renderConsent();
    hookComicCta();
  });
})(window, document);
