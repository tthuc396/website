(function () {
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

        if (target.property === "--hero-image") {
          image.fetchPriority = "high";
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

  function enhanceFooter() {
    var footer = document.querySelector(".footer");
    var path = window.location.pathname || "";
    var isBlogPage = /\/blog(?:\/|$)/.test(path);
    var contactHref = isBlogPage ? "../contact.html" : "./contact.html";

    if (!footer || footer.getAttribute("data-footer-enhanced") === "true") {
      return;
    }

    var footerSpans = footer.querySelectorAll("span");
    var pageLabel = footerSpans.length > 1 ? footerSpans[1].textContent.trim() : "";

    footer.setAttribute("data-footer-enhanced", "true");
    footer.innerHTML =
      '<div class="footer-main">' +
        '<div class="footer-block footer-request">' +
          '<p class="footer-kicker">Asina Global</p>' +
          '<h2>Request more info.</h2>' +
          '<p>Send your product category, scope, room type, or finish direction and we will point you to the right catalog, quote path, or designer support.</p>' +
          '<div class="footer-actions">' +
            '<a class="button primary" href="' + contactHref + '">Request More Info</a>' +
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
              '<span>Coverage</span>' +
              '<p>Cabinets, countertops, furniture, and custom / designer support.</p>' +
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
        '<p class="lead-modal-copy">Leave your name, email, and phone so we can follow up on cabinets, countertops, furniture, or designer support.</p>' +
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
    }, 18000);

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
      if (hasShown || !timerQualified) {
        return;
      }

      if (interactionCount >= 2 || scrollQualified) {
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
      if (scrollTop > 480) {
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

  function syncVisibleReveals() {
    revealItems.forEach(function (item) {
      var rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        item.classList.add("visible");
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
          sampleImg.loading = "lazy";
          sampleImg.src = data.finishSampleImage || data.finishImage || "";
          sampleImg.alt = (data.finishName || "Cabinet finish") + " door sample";
          sampleImg.style.objectPosition = data.finishSamplePosition || "center center";
          sampleWrap.appendChild(sampleImg);

          var finishWrap = document.createElement("div");
          finishWrap.className = "finish-display-media";
          var finishImg = document.createElement("img");
          finishImg.decoding = "async";
          finishImg.loading = "lazy";
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

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.18,
      rootMargin: "0px 0px -6% 0px"
    });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  syncVisibleReveals();
  hydrateMediaImages();
  initFinishSelectors();
  ensureBlogNavLink();
  enhanceFooter();
  initLeadModal();
  window.addEventListener("load", syncVisibleReveals);
  window.addEventListener("resize", syncVisibleReveals);

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      siteNav.classList.toggle("open");
      document.body.classList.toggle("menu-open", !expanded);
    });

    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        siteNav.classList.remove("open");
        document.body.classList.remove("menu-open");
      });
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
