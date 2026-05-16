(function () {
  document.documentElement.classList.add("js");
  var topbar = document.querySelector(".topbar");
  var navToggle = document.querySelector("[data-nav-toggle]");
  var siteNav = document.querySelector("[data-site-nav]");
  var revealItems = document.querySelectorAll(".reveal");
  var forms = document.querySelectorAll("[data-demo-form]");
  var mediaTargets = [
    { selector: ".home-hero, .landing-hero, .catalog-hero, .collection-hero", property: "--hero-image", imageClass: "hero-media-image" },
    { selector: ".catalog-card-media", property: "--card-image", imageClass: "media-image" },
    { selector: ".collection-tile-media, .product-thumb, .product-rail-lead", property: "--tile-image", imageClass: "media-image" }
  ];

  function encodeFormData(formData) {
    return new URLSearchParams(formData).toString();
  }

  function prepareNetlifyFormData(form, extraFields) {
    var data = new FormData(form);
    var pageTitleField = form.querySelector('input[name="page_title"]');
    var pageUrlField = form.querySelector('input[name="page_url"]');

    if (pageTitleField) {
      data.set("page_title", document.title || pageTitleField.value || "");
    }

    if (pageUrlField) {
      data.set("page_url", window.location.href);
    }

    Object.keys(extraFields || {}).forEach(function (key) {
      data.set(key, extraFields[key]);
    });

    return data;
  }

  function submitNetlifyForm(form, extraFields) {
    return fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encodeFormData(prepareNetlifyFormData(form, extraFields))
    });
  }

  function resolveCssValue(source, value) {
    var resolved = (value || "").trim();
    var varMatch = resolved.match(/^var\((--[^,\s)]+)(?:,\s*(.+))?\)$/);

    if (!varMatch) {
      return resolved;
    }

    var varName = varMatch[1];
    var fallback = varMatch[2] || "";
    var scopedValue = getComputedStyle(source).getPropertyValue(varName).trim();
    var rootValue = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    var nextValue = scopedValue || rootValue || fallback;

    if (!nextValue || nextValue === resolved) {
      return nextValue;
    }

    return resolveCssValue(source, nextValue);
  }

  function buildNavGroup(label, variant, links) {
    var group = document.createElement("div");
    var heading = document.createElement("p");
    var grid = document.createElement("div");

    group.className = "nav-group nav-group-" + variant;
    heading.className = "nav-group-label";
    heading.textContent = label;
    grid.className = "nav-grid nav-grid-" + variant;

    links.forEach(function (link) {
      grid.appendChild(link);
    });

    group.appendChild(heading);
    group.appendChild(grid);
    return group;
  }

  function enhanceSiteNav() {
    if (!siteNav || siteNav.dataset.enhanced === "true") {
      return;
    }

    var routeOrder = [
      "./cabinet-catalog.html",
      "./countertop-catalog.html",
      "./furniture.html",
      "./designer.html"
    ];
    var navLinks = Array.from(siteNav.querySelectorAll("a"));
    var primaryLinks = [];
    var secondaryLinks = [];
    var actionLink = null;

    navLinks.forEach(function (link) {
      var href = (link.getAttribute("href") || "").trim();

      if (link.classList.contains("button")) {
        actionLink = link;
        return;
      }

      if (routeOrder.indexOf(href) !== -1) {
        primaryLinks.push(link);
        return;
      }

      secondaryLinks.push(link);
    });

    while (siteNav.firstChild) {
      siteNav.removeChild(siteNav.firstChild);
    }

    if (primaryLinks.length) {
      siteNav.appendChild(buildNavGroup("Browse", "primary", primaryLinks));
    }

    if (secondaryLinks.length) {
      siteNav.appendChild(buildNavGroup("Info", "secondary", secondaryLinks));
    }

    if (actionLink) {
      var actionZone = document.createElement("div");
      actionZone.className = "nav-cta-zone";
      actionZone.appendChild(actionLink);
      siteNav.appendChild(actionZone);
    }

    siteNav.dataset.enhanced = "true";
  }

  function getUrlFromCssValue(source, value) {
    var resolved = resolveCssValue(source, value);
    var urlMatch = resolved.match(/url\((['"]?)(.*?)\1\)/);
    return urlMatch ? urlMatch[2] : "";
  }

  function hydrateMediaImages() {
    mediaTargets.forEach(function (target) {
      document.querySelectorAll(target.selector).forEach(function (element) {
        if (element.classList.contains("media-background-only") || element.querySelector("." + target.imageClass)) {
          return;
        }

        var rawValue = element.style.getPropertyValue(target.property) ||
          getComputedStyle(element).getPropertyValue(target.property);
        var imageUrl = getUrlFromCssValue(element, rawValue);

        if (!imageUrl) {
          return;
        }

        var image = document.createElement("img");
        image.className = target.imageClass;
        image.src = imageUrl;
        image.alt = "";
        image.decoding = "async";

        var shouldPrioritize = target.property === "--hero-image" ||
          element.getBoundingClientRect().top < window.innerHeight * 1.35;

        if (shouldPrioritize) {
          image.fetchPriority = "high";
          image.loading = "eager";
        } else {
          image.loading = "lazy";
        }

        if ((element.style.backgroundSize || "").trim() === "contain") {
          image.classList.add("media-image-contain");
        }

        element.classList.add("has-media-image");
        element.insertBefore(image, element.firstChild);
      });
    });
  }

  function promotePriorityImages() {
    [
      ".asset-photo-card img",
      ".collection-finish-preview img",
      ".finish-option-thumb img",
      ".finish-display-media img"
    ].forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (image, index) {
        image.loading = "eager";

        if (index < 2) {
          image.fetchPriority = "high";
        }
      });
    });
  }

  function ensureBlogNavLink() {
    if (!siteNav) {
      return;
    }

    var path = window.location.pathname || "";
    var isBlogPage = /\/blog(?:\/|$)/.test(path);
    var blogHref = isBlogPage ? "../blog/" : "./blog/";
    var aboutLink = Array.from(siteNav.querySelectorAll("a")).find(function (link) {
      return link.getAttribute("href") === (isBlogPage ? "../about.html" : "./about.html");
    });
    var blogLink = Array.from(siteNav.querySelectorAll("a")).find(function (link) {
      return /\/blog\/?$/.test(link.getAttribute("href") || "");
    });

    if (!blogLink) {
      blogLink = document.createElement("a");
      blogLink.href = blogHref;
      blogLink.textContent = "Blog";

      if (aboutLink) {
        siteNav.insertBefore(blogLink, aboutLink);
      } else {
        siteNav.appendChild(blogLink);
      }
    } else {
      blogLink.href = blogHref;
    }

    if (isBlogPage) {
      siteNav.querySelectorAll("a.current").forEach(function (link) {
        link.classList.remove("current");
      });
      blogLink.classList.add("current");
    }
  }

  function normalizeSharedCopy() {
    var legacyDesignHelpLabels = [
      "Custom / Designer",
      "Custom and Design Help",
      "Custom and Designer Support",
      "Designer Support"
    ];

    document.querySelectorAll('.site-nav a[href$="designer.html"]').forEach(function (link) {
      if (legacyDesignHelpLabels.indexOf((link.textContent || "").trim()) !== -1) {
        link.textContent = "Design Help";
      }
    });

    document.querySelectorAll(".brand-sub").forEach(function (label) {
      if (legacyDesignHelpLabels.indexOf((label.textContent || "").trim()) !== -1) {
        label.textContent = "Design Help";
      }
    });
  }

  function enhanceFooter() {
    var footer = document.querySelector(".footer");
    var path = window.location.pathname || "";
    var isBlogPage = /\/blog(?:\/|$)/.test(path);
    var contactHref = isBlogPage ? "../contact.html" : "./contact.html";
    var faqHref = isBlogPage ? "../faq.html" : "./faq.html";

    if (!footer || footer.getAttribute("data-footer-enhanced") === "true") {
      return;
    }

    var footerSpans = footer.querySelectorAll("span");
    var pageLabel = footerSpans.length > 1 ? footerSpans[1].textContent.trim() : "";

    if (pageLabel === "Custom / Designer" ||
        pageLabel === "Custom and Design Help" ||
        pageLabel === "Custom and Designer Support" ||
        pageLabel === "Designer Support") {
      pageLabel = "Design Help";
    }

    footer.setAttribute("data-footer-enhanced", "true");
      footer.innerHTML =
      '<div class="footer-main">' +
        '<div class="footer-block footer-request">' +
          '<p class="footer-kicker">Asina Global</p>' +
          '<h2>Send project scope.</h2>' +
          '<p>Send the cabinet line, slab shortlist, drawings, room count, or finish questions. We will tell you what can be priced now and what still needs detail.</p>' +
          '<div class="footer-actions">' +
            '<a class="button primary" href="' + contactHref + '">Send Project Scope</a>' +
            '<a class="button secondary" href="' + faqHref + '">Read FAQ</a>' +
          '</div>' +
        '</div>' +
        '<div class="footer-block footer-contact">' +
          '<p class="footer-kicker">Contact</p>' +
          '<div class="footer-contact-list">' +
            '<div class="footer-contact-row">' +
              '<span>Email</span>' +
              '<a href="mailto:asinaglobal@gmail.com">asinaglobal@gmail.com</a>' +
            '</div>' +
            '<div class="footer-contact-row">' +
              '<span>Address</span>' +
              '<p>151 Sabal Palm Dr, Longwood, FL 32779</p>' +
            '</div>' +
            '<div class="footer-contact-row">' +
              '<span>Serving</span>' +
              '<p>Central Florida base with local walkthrough support and project supply nationwide.</p>' +
            '</div>' +
            '<div class="footer-contact-row">' +
              '<span>Best fit</span>' +
              '<p>Builders, developers, restaurant teams, and multi-room interiors.</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="footer-meta">' +
        '<span>Asina Global</span>' +
        '<span>' + (pageLabel || "Catalog") + '</span>' +
      '</div>';
  }

  function shouldEnableLeadModal() {
    return document.body.getAttribute("data-lead-modal") === "catalog";
  }

  function getLeadModalState() {
    try {
      return JSON.parse(localStorage.getItem("asinaLeadModalState") || "{}");
    } catch (error) {
      return {};
    }
  }

  function setLeadModalState(nextState) {
    try {
      localStorage.setItem("asinaLeadModalState", JSON.stringify(nextState));
    } catch (error) {
      // Ignore storage failures and keep the modal functional.
    }
  }

  function initLeadModal() {
    if (!shouldEnableLeadModal()) {
      return;
    }

    var state = getLeadModalState();
    var now = Date.now();
    var dismissCooldown = 3 * 24 * 60 * 60 * 1000;
    var submitCooldown = 30 * 24 * 60 * 60 * 1000;

    if ((state.dismissedAt && now - state.dismissedAt < dismissCooldown) ||
        (state.submittedAt && now - state.submittedAt < submitCooldown)) {
      return;
    }

    var modal = document.createElement("div");
    modal.className = "lead-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML =
      '<div class="lead-modal-backdrop" data-lead-close=""></div>' +
      '<div class="lead-modal-panel" role="dialog" aria-modal="true" aria-labelledby="leadModalTitle">' +
        '<button class="lead-modal-close" type="button" aria-label="Close lead form" data-lead-close="">Close</button>' +
        '<p class="lead-modal-kicker">Asina Global</p>' +
        '<h2 id="leadModalTitle">Get pricing and product guidance.</h2>' +
        '<p class="lead-modal-copy">Leave your name, email, and phone so we can follow up on cabinets, countertops, furniture, or design help.</p>' +
        '<form class="lead-modal-form" data-lead-modal-form="" data-netlify-form="" data-netlify="true" method="POST" name="catalog-lead">' +
          '<input name="form-name" type="hidden" value="catalog-lead"/>' +
          '<div class="field is-hidden">' +
            '<label for="leadModalBotField">Do not fill this out</label>' +
            '<input autocomplete="off" id="leadModalBotField" name="bot-field" tabindex="-1" type="text"/>' +
          '</div>' +
          '<input name="page_title" type="hidden" value="Catalog page"/>' +
          '<input name="page_url" type="hidden" value=""/>' +
          '<div class="field">' +
            '<label for="leadModalName">Name</label>' +
            '<input id="leadModalName" name="name" type="text" required=""/>' +
          '</div>' +
          '<div class="field">' +
            '<label for="leadModalEmail">Email</label>' +
            '<input id="leadModalEmail" name="email" type="email" required=""/>' +
          '</div>' +
          '<div class="field">' +
            '<label for="leadModalPhone">Phone</label>' +
            '<input id="leadModalPhone" name="phone" type="tel" required=""/>' +
          '</div>' +
          '<div class="lead-modal-actions">' +
            '<button class="button primary" type="submit">Request Follow-Up</button>' +
            '<button class="button secondary" type="button" data-lead-close="">Continue Browsing</button>' +
          '</div>' +
          '<div class="form-success" data-lead-modal-success="">Thanks. We received your request and will follow up shortly.</div>' +
        '</form>' +
      '</div>';

    document.body.appendChild(modal);

    var form = modal.querySelector("[data-lead-modal-form]");
    var success = modal.querySelector("[data-lead-modal-success]");
    var closeTargets = modal.querySelectorAll("[data-lead-close]");
    var hasShown = false;
    var interactionCount = 0;
    var scrollQualified = false;
    var timerQualified = false;
    var showTimer = window.setTimeout(function () {
      timerQualified = true;
      maybeShowModal();
    }, 42000);

    function openModal() {
      if (hasShown) {
        return;
      }

      hasShown = true;
      modal.classList.add("visible");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("lead-modal-open");

      var nameField = modal.querySelector("#leadModalName");
      if (nameField) {
        window.setTimeout(function () {
          nameField.focus();
        }, 140);
      }
    }

    function closeModal(markDismissed) {
      modal.classList.remove("visible");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lead-modal-open");

      if (markDismissed) {
        state.dismissedAt = Date.now();
        setLeadModalState(state);
      }
    }

    function maybeShowModal() {
      if (hasShown || !timerQualified || document.body.classList.contains("menu-open")) {
        return;
      }

      if (interactionCount >= 4 || (scrollQualified && interactionCount >= 2)) {
        openModal();
      }
    }

    function registerInteraction() {
      interactionCount += 1;
      maybeShowModal();
    }

    function handleScrollGate() {
      if (scrollQualified) {
        return;
      }

      var scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      if (scrollTop > Math.max(980, Math.round(window.innerHeight * 1.35))) {
        scrollQualified = true;
        maybeShowModal();
      }
    }

    document.addEventListener("click", function (event) {
      if (!event.target.closest("main a, main button")) {
        return;
      }
      registerInteraction();
    });

    window.addEventListener("scroll", handleScrollGate, { passive: true });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.classList.contains("visible")) {
        closeModal(true);
      }
    });

    closeTargets.forEach(function (target) {
      target.addEventListener("click", function () {
        closeModal(true);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submitNetlifyForm(form).then(function (response) {
        if (!response.ok) {
          throw new Error("Lead form submission failed");
        }

        state.submittedAt = Date.now();
        setLeadModalState(state);
        success.textContent = "Thanks. We received your request and will follow up shortly.";
        success.classList.add("visible");
        form.reset();
      }).catch(function () {
        success.textContent = "There was a problem sending the request. Please email asinaglobal@gmail.com.";
        success.classList.add("visible");
      });
    });
  }

  function primeRevealItems() {
    revealItems.forEach(function (item) {
      var rect = item.getBoundingClientRect();

      if (rect.top < window.innerHeight * 0.88) {
        item.classList.add("visible");
        item.classList.remove("is-entering");
      } else {
        item.classList.add("is-entering");
      }
    });
  }

  function syncVisibleReveals() {
    revealItems.forEach(function (item) {
      var rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        item.classList.add("visible");
        item.classList.remove("is-entering");
      }
    });
  }

  function renderFinishSwatches(container, rawValue) {
    if (!container) {
      return;
    }

    container.innerHTML = "";

    (rawValue || "").split("|").forEach(function (entry) {
      var parts = entry.split(":");
      var label = (parts[0] || "").trim();
      var color = (parts[1] || "").trim();

      if (!label || !color) {
        return;
      }

      var item = document.createElement("span");
      item.className = "finish-swatch";

      var dot = document.createElement("span");
      dot.className = "finish-swatch-dot";
      dot.style.backgroundColor = color;

      var text = document.createElement("span");
      text.textContent = label;

      item.appendChild(dot);
      item.appendChild(text);
      container.appendChild(item);
    });
  }

  function createFinishSwatchFragment(rawValue) {
    var fragment = document.createDocumentFragment();

    (rawValue || "").split("|").forEach(function (entry) {
      var parts = entry.split(":");
      var label = (parts[0] || "").trim();
      var color = (parts[1] || "").trim();

      if (!label || !color) {
        return;
      }

      var item = document.createElement("span");
      item.className = "finish-swatch";

      var dot = document.createElement("span");
      dot.className = "finish-swatch-dot";
      dot.style.backgroundColor = color;

      var text = document.createElement("span");
      text.textContent = label;

      item.appendChild(dot);
      item.appendChild(text);
      fragment.appendChild(item);
    });

    return fragment;
  }

  function createSpecPairs(data) {
    if (data.finishSpecs) {
      return data.finishSpecs.split("|").map(function (entry) {
        var parts = entry.split("::");
        return [(parts[0] || "").trim(), (parts.slice(1).join("::") || "").trim()];
      }).filter(function (pair) {
        return pair[0] && pair[1];
      });
    }

    return [
      ["Finish tone", data.finishTone || ""],
      ["Face / material", data.finishMaterial || ""],
      ["Box build", data.finishBox || ""],
      ["Panel / thickness", data.finishThickness || ""],
      ["Frame / overlay", data.finishFrame || ""],
      ["Hardware / use", data.finishHardware || ""]
    ].filter(function (pair) {
      return pair[1];
    });
  }

  function initFinishSelectors() {
    document.querySelectorAll("[data-finish-selector]").forEach(function (selector) {
      var buttons = Array.from(selector.querySelectorAll("[data-finish-trigger]"));
      if (buttons.length) {
        var series = document.createElement("div");
        series.className = "finish-series";

        buttons.forEach(function (button) {
          var data = button.dataset;
          var entry = document.createElement("article");
          entry.className = "finish-entry";

          var display = document.createElement("div");
          display.className = "finish-display";

          var mediaStack = document.createElement("div");
          mediaStack.className = "finish-display-media-stack";

          var sampleWrap = document.createElement("div");
          sampleWrap.className = "finish-display-media sample";
          var sampleImg = document.createElement("img");
          sampleImg.decoding = "async";
          sampleImg.loading = "eager";
          sampleImg.src = data.finishSampleImage || data.finishImage || "";
          sampleImg.alt = (data.finishName || "Cabinet finish") + " door sample";
          sampleImg.style.objectPosition = data.finishSamplePosition || "center center";
          sampleWrap.appendChild(sampleImg);

          var finishWrap = document.createElement("div");
          finishWrap.className = "finish-display-media";
          var finishImg = document.createElement("img");
          finishImg.decoding = "async";
          finishImg.loading = "eager";
          finishImg.src = data.finishImage || "";
          finishImg.alt = data.finishName || "Cabinet finish preview";
          finishWrap.appendChild(finishImg);

          mediaStack.appendChild(sampleWrap);
          mediaStack.appendChild(finishWrap);

          var copy = document.createElement("div");
          copy.className = "finish-display-copy";

          var family = document.createElement("p");
          family.className = "finish-display-kicker";
          family.textContent = data.finishFamily || "";

          var name = document.createElement("h3");
          name.textContent = data.finishName || "";

          var description = document.createElement("p");
          description.className = "finish-display-description";
          description.textContent = data.finishDescription || "";

          var swatches = document.createElement("div");
          swatches.className = "finish-swatch-strip";
          swatches.appendChild(createFinishSwatchFragment(data.finishSwatches || ""));

          var techGrid = document.createElement("div");
          techGrid.className = "finish-tech-grid";

          createSpecPairs(data).forEach(function (pair) {
            var tech = document.createElement("div");
            tech.className = "finish-tech";

            var label = document.createElement("strong");
            label.textContent = pair[0];

            var value = document.createElement("p");
            value.textContent = pair[1];

            tech.appendChild(label);
            tech.appendChild(value);
            techGrid.appendChild(tech);
          });

          copy.appendChild(family);
          copy.appendChild(name);
          copy.appendChild(description);
          swatches.childNodes.length && copy.appendChild(swatches);
          copy.appendChild(techGrid);

          if (data.finishFeatureTitle && data.finishFeatureBody) {
            var feature = document.createElement("div");
            feature.className = "finish-tech";

            var featureLabel = document.createElement("strong");
            featureLabel.textContent = data.finishFeatureTitle;

            var featureValue = document.createElement("p");
            featureValue.textContent = data.finishFeatureBody;

            feature.appendChild(featureLabel);
            feature.appendChild(featureValue);
            copy.appendChild(feature);
          }

          display.appendChild(mediaStack);
          display.appendChild(copy);
          entry.appendChild(display);
          series.appendChild(entry);
        });

        selector.innerHTML = "";
        selector.appendChild(series);
        return;
      }
    });
  }

  primeRevealItems();
  syncVisibleReveals();

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.remove("is-entering");
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.18,
      rootMargin: "0px 0px -6% 0px"
    });

    revealItems.forEach(function (item) {
      if (!item.classList.contains("visible")) {
        observer.observe(item);
      }
    });
  }

  enhanceSiteNav();
  hydrateMediaImages();
  initFinishSelectors();
  promotePriorityImages();
  ensureBlogNavLink();
  normalizeSharedCopy();
  enhanceFooter();
  initLeadModal();
  window.addEventListener("load", syncVisibleReveals);
  window.addEventListener("resize", syncVisibleReveals);

  var lastMobileScrollY = window.scrollY || document.documentElement.scrollTop || 0;
  var mobileHeaderTicking = false;

  function syncMobileTopbar() {
    if (!topbar) {
      return;
    }

    var scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    var isMobileViewport = window.innerWidth <= 860;
    var menuOpen = document.body.classList.contains("menu-open");
    var scrolled = scrollY > 18 || menuOpen;
    var compact = isMobileViewport && (menuOpen || scrollY > 20);
    var hidden = false;

    if (isMobileViewport && !menuOpen) {
      var delta = scrollY - lastMobileScrollY;
      var alreadyHidden = topbar.classList.contains("is-mobile-hidden");

      if (scrollY > 120 && delta > 8) {
        hidden = true;
      } else if (alreadyHidden && scrollY > 84 && delta > -6) {
        hidden = true;
      }
    }

    topbar.classList.toggle("is-scrolled", scrolled);
    topbar.classList.toggle("is-mobile-compact", compact);
    topbar.classList.toggle("is-mobile-hidden", hidden);
    lastMobileScrollY = scrollY;
  }

  function syncMobileMenuShell() {
    if (!topbar || !siteNav) {
      return;
    }

    if (window.innerWidth > 860 || !siteNav.classList.contains("open")) {
      topbar.style.setProperty("--mobile-menu-depth", "0px");
      return;
    }

    var shellDepth = Math.max(
      0,
      siteNav.offsetTop + siteNav.scrollHeight - topbar.offsetHeight + 18
    );

    topbar.style.setProperty("--mobile-menu-depth", shellDepth + "px");
  }

  function requestMobileTopbarSync() {
    if (mobileHeaderTicking) {
      return;
    }

    mobileHeaderTicking = true;
    window.requestAnimationFrame(function () {
      syncMobileTopbar();
      mobileHeaderTicking = false;
    });
  }

  syncMobileTopbar();
  window.addEventListener("scroll", requestMobileTopbarSync, { passive: true });
  window.addEventListener("resize", syncMobileTopbar);

  if (navToggle && siteNav) {
    var closedLabel = (navToggle.textContent || "Menu").trim();
    var openLabel = "Close";

    function setNavState(open) {
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.textContent = open ? openLabel : closedLabel;
      siteNav.classList.toggle("open", open);
      siteNav.setAttribute("aria-hidden", String(!open));
      document.body.classList.toggle("menu-open", open);
      syncMobileTopbar();
      window.requestAnimationFrame(syncMobileMenuShell);
    }

    setNavState(false);

    navToggle.addEventListener("click", function () {
      var expanded = navToggle.getAttribute("aria-expanded") === "true";
      setNavState(!expanded);
    });

    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavState(false);
      });
    });

    document.addEventListener("click", function (event) {
      if (!document.body.classList.contains("menu-open")) {
        return;
      }

      if (event.target.closest("[data-nav-toggle], [data-site-nav]")) {
        return;
      }

      setNavState(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
        setNavState(false);
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860 && document.body.classList.contains("menu-open")) {
        setNavState(false);
      }

      syncMobileTopbar();
      syncMobileMenuShell();
    });
  }

  forms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var successId = form.getAttribute("data-success-target");
      var success = successId ? document.getElementById(successId) : null;
      submitNetlifyForm(form).then(function (response) {
        if (!response.ok) {
          throw new Error("Form submission failed");
        }

        if (success) {
          success.classList.add("visible");
        }

        form.reset();
      }).catch(function () {
        if (success) {
          success.textContent = "There was a problem sending the form. Please email asinaglobal@gmail.com.";
          success.classList.add("visible");
        }
      });
    });
  });

})();
