/**
 * Learning with Lukey Buke — Mailchimp signup, isolated end-of-game CTA, events. No consent banner.
 * Posts to audience 61d46ee02d. Never logs or stores a Mailchimp API key.
 */
(function (window, document) {
  "use strict";

  var MC_POST_JSON = "https://gmail.us16.list-manage.com/subscribe/post-json";
  var MC_U = "d8eb38a5761c5c5480c5ed388";
  var MC_ID = "61d46ee02d";
  var THANKS = "/Learning/thanks/free-mazes.html";
  var GROWNUP_NOTE = "For parents or guardians: please ask a grown-up to sign up.";
  var CTA_LINE = "Grown-ups: get 25 free printable mazes";
  var CTA_BTN = "Get the free 25-maze pack";

  window.dataLayer = window.dataLayer || [];

  function path() {
    return window.location.pathname || "";
  }



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

  document.addEventListener("submit", function (e) {
    var form = e.target;
    if (!form || !form.classList.contains("lwl-mc-form")) return;
    e.preventDefault();
    var status = form.querySelector(".lwl-form-status");
    var btn = form.querySelector('[type="submit"]');
    if (btn) btn.disabled = true;
    if (status) {
      status.classList.remove("lwl-ok");
      status.textContent = "Sending\u2026";
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
  }, false);

  function decorateForms() {
    var forms = document.querySelectorAll("form.lwl-mc-form");
    for (var i = 0; i < forms.length; i++) {
      var form = forms[i];
      var groups = form.querySelector(".input-group");
      if (groups && !groups.classList.contains("lwl-groups")) {
        groups.classList.add("lwl-groups");
        groups.classList.remove("input-group");
      }
      if (!form.querySelector(".lwl-grownup-note")) {
      var note = document.createElement("p");
      note.className = "lwl-grownup-note";
      note.textContent = GROWNUP_NOTE;
      var lead = form.querySelector(".lwl-form-lead");
      if (lead && lead.parentNode) {
        lead.parentNode.insertBefore(note, lead.nextSibling);
      } else if (form.firstElementChild) {
        form.firstElementChild.insertBefore(note, form.firstElementChild.firstChild);
      } else {
        form.insertBefore(note, form.firstChild);
      }
      }

      if (!form.querySelector(".lwl-check-email")) {
        var check = document.createElement("p");
        check.className = "lwl-check-email";
        check.textContent = "After you sign up, check your email for the maze pack.";
        var submitRow = form.querySelector(".clear") || form.querySelector('[type="submit"]');
        if (submitRow && submitRow.parentNode) {
          submitRow.parentNode.insertBefore(check, submitRow);
        } else {
          form.appendChild(check);
        }
      }
    }
  }

  /* ---------- generate_lead on thank-you ---------- */
  function fireLeadIfThanks() {
    if (path().indexOf("/Learning/thanks/free-mazes.html") === -1) return;
    var params = new URLSearchParams(window.location.search);
    var lead = params.get("lead") || "maze_pack";
    lwlEvent("generate_lead", { lead_type: lead, page_path: path() });
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

  /* ---------- Isolated end-of-game / last-page CTA ---------- */
  function isBookPage() {
    return /\/books\/(nyari|buck)[0-9]\.html$/i.test(path());
  }
  function isComicPage() {
    return /\/Comics\/comic/i.test(path());
  }
  function isTypingHub() {
    return /\/Tools\/Typing\/index\.html$/i.test(path());
  }
  function isWorksheetLike() {
    return /\/Tools\/KW\/(worksheet|template)\.html$/i.test(path());
  }
  function isLiveGame() {
    if (isTypingHub() || isWorksheetLike()) return false;
    if (/\/Tools\/(BW|KW|Typing|OnlineMaze)\//i.test(path())) return true;
    if (isBookPage() || isComicPage()) return true;
    return false;
  }
  function isGameHub() {
    return isTypingHub();
  }

  function ctaUtm() {
    if (isBookPage()) return "book-end";
    if (isComicPage()) return "comic-end";
    if (/\/Tools\//.test(path())) return "tool-bar";
    return "footer";
  }

  function ctaHref() {
    return "/Learning/free-mazes.html?utm_source=website&utm_medium=referral&utm_campaign=free-mazes&utm_content=" + ctaUtm();
  }

  function markGamePage() {
    if (document.documentElement) document.documentElement.classList.add("lwl-game-page");
    if (document.body) document.body.classList.add("lwl-game-page");
  }

  function ensureCtaHost() {
    var host = document.getElementById("lwl-end-cta-host");
    if (host) return host;
    host = document.createElement("div");
    host.id = "lwl-end-cta-host";
    host.setAttribute("aria-label", "Free maze pack");

    var comicMount = isComicPage() ? document.getElementById("lwl-comic-end-cta") : null;
    var hubMount = isGameHub() ? document.querySelector(".sidebar") : null;
    if (comicMount) {
      host.classList.add("lwl-in-flow");
      comicMount.appendChild(host);
    } else if (hubMount) {
      host.classList.add("lwl-in-flow");
      hubMount.appendChild(host);
    } else {
      /* Out of flow, appended after everything: the game layout never changes. */
      host.classList.add("lwl-below");
      document.body.appendChild(host);
    }
    return host;
  }

  /* Put the below-the-game CTA under the page's existing content. Measured while the
     host is hidden so it never counts itself. */
  function placeEndCta() {
    var host = document.getElementById("lwl-end-cta-host");
    if (!host || !host.classList.contains("lwl-below")) return;
    var wasOpen = host.classList.contains("lwl-open");
    host.classList.remove("lwl-open");
    var de = document.documentElement;
    var bottom = Math.max(de.scrollHeight, document.body ? document.body.scrollHeight : 0);
    host.style.top = bottom + "px";
    if (wasOpen) host.classList.add("lwl-open");
  }
  window.addEventListener("resize", function () { placeEndCta(); });

  function fillCta(host) {
    if (host.dataset.filled === "1" && host.shadowRoot) return;
    var shadow = host.shadowRoot || host.attachShadow({ mode: "open" });
    shadow.innerHTML =
      "<style>" +
      ":host { display: block; width: 100%; max-width: 100%; box-sizing: border-box; }" +
      ".wrap { all: initial; font-family: Heebo, Segoe UI, sans-serif; display: block; box-sizing: border-box; width: 100%; max-width: 100%; background: #f7f3ff; border-top: 3px solid #6222CC; padding: 16px 16px; text-align: center; color: #222; }" +
      ".wrap p { margin: 0 0 10px 0; font-size: 1.05rem; line-height: 1.4; color: #222; font-family: inherit; }" +
      "a.btn { display: inline-block; background: #FBA504; color: #3b1460; border-radius: 50rem; padding: 10px 22px; font-weight: 700; text-decoration: none; white-space: nowrap; font-family: inherit; font-size: 1rem; }" +
      "a.btn:hover { background: #e09404; }" +
      ":host(.lwl-in-flow) a.btn { white-space: normal; }" +
      "</style>" +
      "<div class=\"wrap\">" +
      "<p>" + CTA_LINE + "</p>" +
      "<a class=\"btn\" href=\"" + ctaHref() + "\">" + CTA_BTN + "</a>" +
      "</div>";
    host.dataset.filled = "1";
  }

  function showEndCta() {
    var host = ensureCtaHost();
    fillCta(host);
    if (!host.classList.contains("lwl-open")) placeEndCta();
    host.classList.add("lwl-open");
    host.removeAttribute("hidden");
    var wrap = document.getElementById("lwl-comic-end-cta");
    if (wrap) wrap.hidden = false;
  }
  function hideEndCta() {
    var host = document.getElementById("lwl-end-cta-host");
    if (host) {
      host.classList.remove("lwl-open");
      host.setAttribute("hidden", "");
    }
    var wrap = document.getElementById("lwl-comic-end-cta");
    if (wrap) wrap.hidden = true;
  }
  window.lwlShowMazeCta = showEndCta;

  /* Visible end-of-round text only. Skip hidden panels (e.g. #roundComplete) and mid-game "Try again" buttons. */
  var END_RE = /Game Over|Congratulations|You found all the words|You beat level|Level \d+ complete|You completed all|Round complete|Level complete|You win[.!]/i;

  function textLooksLikeEnd(text) {
    if (!text) return false;
    if (/find all \d+ to win/i.test(text) && !/congratulat|game over|complete/i.test(text)) return false;
    return END_RE.test(text);
  }

  function nodeIsHidden(el) {
    while (el && el !== document.documentElement) {
      if (el.nodeType !== 1) { el = el.parentElement; continue; }
      if (el.hidden || el.getAttribute("hidden") !== null) return true;
      var tag = el.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT" || tag === "TEMPLATE") return true;
      if (el.id === "lwl-end-cta-host" || (el.classList && el.classList.contains("lwl-cta-bar"))) return true;
      var st = el.style;
      if (st && (st.display === "none" || st.visibility === "hidden")) return true;
      try {
        var cs = window.getComputedStyle(el);
        if (cs && (cs.display === "none" || cs.visibility === "hidden")) return true;
      } catch (e) {}
      el = el.parentElement;
    }
    return false;
  }

  function visibleEndTextPresent() {
    if (!document.body) return false;
    var round = document.getElementById("roundComplete");
    if (round && !nodeIsHidden(round)) return true;
    if (typeof document.createTreeWalker !== "function") return false;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!textLooksLikeEnd(node.nodeValue || "")) return NodeFilter.FILTER_REJECT;
        if (nodeIsHidden(node.parentElement)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    return !!walker.nextNode();
  }

  function sentenceRoundDone() {
    if (!/\/sentence\.html$/i.test(path())) return false;
    var output = document.getElementById("output");
    if (!output || nodeIsHidden(output)) return false;
    var t = (output.textContent || "").trim();
    return !!(t && !/^oops/i.test(t) && !/^thinking/i.test(t) && t.length > 8);
  }

  function syncGameCta() {
    if (sentenceRoundDone() || visibleEndTextPresent()) showEndCta();
    else hideEndCta();
  }

  function hookGameEnd() {
    if (!isLiveGame() && !isGameHub()) return;
    markGamePage();

    if (isGameHub()) {
      showEndCta();
      return;
    }

    if (isComicPage()) {
      var label = document.getElementById("pageLabel");
      function syncComic() {
        var text = label ? (label.textContent || "").trim() : "";
        var m = text.match(/(\d+)\s*\/\s*(\d+)/);
        if (m && parseInt(m[1], 10) >= parseInt(m[2], 10)) showEndCta();
        else hideEndCta();
      }
      syncComic();
      if (label && typeof MutationObserver !== "undefined") {
        new MutationObserver(syncComic).observe(label, { childList: true, characterData: true, subtree: true });
      }
      return;
    }

    if (isBookPage()) {
      function syncBook(d) {
        if (d && typeof d.index === "number" && typeof d.total === "number" && d.total > 0 && d.index >= d.total - 1) {
          showEndCta();
        } else {
          hideEndCta();
        }
      }
      document.addEventListener("lwl-book-page", function (ev) {
        syncBook(ev.detail || {});
        setTimeout(placeEndCta, 350);
      });
      if (window.lwlBookPage) syncBook(window.lwlBookPage);
      return;
    }

    var timer = null;
    function schedule() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(syncGameCta, 60);
    }
    schedule();
    if (typeof MutationObserver !== "undefined" && document.body) {
      new MutationObserver(schedule).observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["hidden", "class", "style"]
      });
    }
  }

  /* ---------- back-to-top visibility (don't cover headings at the top) ---------- */
  function bindBackToTop() {
    var btn = document.querySelector("a.back-to-top");
    if (!btn) return;
    function sync() {
      if ((window.scrollY || document.documentElement.scrollTop || 0) > 160) {
        btn.classList.add("lwl-show");
      } else {
        btn.classList.remove("lwl-show");
      }
    }
    window.addEventListener("scroll", sync, { passive: true });
    sync();
  }

  function onReady(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  onReady(function () {
    decorateForms();
    fireLeadIfThanks();
    bindToolStart();
    hookGameEnd();
    bindBackToTop();
  });
})(window, document);
