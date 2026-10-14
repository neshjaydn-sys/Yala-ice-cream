```javascript
import { menuItems, YOLO_INTERIOR_IMAGE } from "./menu-data.js";

/* =========================================================
   YOLO ICE CREAM — APP.JS
   Hero video, flavour selector, carousel, menu, gallery
   ========================================================= */

(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const flavours = ["strawberry", "chocolate", "mango", "mint", "vanilla"];

  const flavourMeta = {
    strawberry: {
      name: "Strawberry",
      tagline: "Bright, berry, unbothered."
    },
    chocolate: {
      name: "Chocolate",
      tagline: "Dark, rich, unapologetic."
    },
    mango: {
      name: "Mango",
      tagline: "Sunshine, served cold."
    },
    mint: {
      name: "Mint",
      tagline: "Cool, calm, completely fresh."
    },
    vanilla: {
      name: "Vanilla",
      tagline: "Soft, classic, always right."
    }
  };

  /* =======================================================
     1. HERO — SCROLL-CONTROLLED VIDEO
     ======================================================= */

  const hero = $("#top") || $(".hero");
  const heroVideo = $("#hero-scroll-video");
  const heroFlavourName = $("#hero-flavour-name");
  const heroFlavourTagline = $("#hero-flavour-tagline");
  const flavourButtons = $$("[data-flavour-choice]");

  let videoFramePending = false;

  function updateHeroVideo() {
    videoFramePending = false;

    if (
      !hero ||
      !heroVideo ||
      reducedMotion.matches ||
      !Number.isFinite(heroVideo.duration) ||
      heroVideo.duration <= 0 ||
      heroVideo.readyState < 2
    ) {
      return;
    }

    const rect = hero.getBoundingClientRect();
    const scrollDistance = Math.max(1, hero.offsetHeight - window.innerHeight);

    const progress = Math.min(
      1,
      Math.max(0, -rect.top / scrollDistance)
    );

    const targetTime = progress * heroVideo.duration;

    if (Math.abs(heroVideo.currentTime - targetTime) > 0.035) {
      try {
        heroVideo.currentTime = targetTime;
      } catch {
        // Some browsers may reject seeking until the video is ready.
      }
    }
  }

  function requestHeroVideoUpdate() {
    if (videoFramePending) return;

    videoFramePending = true;
    window.requestAnimationFrame(updateHeroVideo);
  }

  function initialiseHeroVideo() {
    if (!heroVideo) return;

    heroVideo.pause();
    heroVideo.removeAttribute("autoplay");

    heroVideo.addEventListener("loadedmetadata", requestHeroVideoUpdate);
    heroVideo.addEventListener("loadeddata", requestHeroVideoUpdate);

    heroVideo.addEventListener("error", () => {
      heroVideo.style.display = "none";
      console.warn(
        "YOLO hero video could not load. Check videos/yolo_ice_cream_hero.mp4."
      );
    });

    window.addEventListener("scroll", requestHeroVideoUpdate, {
      passive: true
    });

    window.addEventListener("resize", requestHeroVideoUpdate);

    if (reducedMotion.matches) {
      heroVideo.pause();
    } else {
      requestHeroVideoUpdate();
    }
  }

  initialiseHeroVideo();

  /* =======================================================
     2. FLAVOUR SELECTOR
     ======================================================= */

  function selectFlavour(flavour) {
    if (!flavours.includes(flavour)) return;

    const meta = flavourMeta[flavour];

    if (hero) {
      hero.dataset.flavour = flavour;
    }

    if (heroFlavourName) {
      heroFlavourName.textContent = meta.name;
    }

    if (heroFlavourTagline) {
      heroFlavourTagline.textContent = meta.tagline;
    }

    flavourButtons.forEach(button => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.flavourChoice === flavour)
      );
    });
  }

  flavourButtons.forEach(button => {
    button.addEventListener("click", () => {
      selectFlavour(button.dataset.flavourChoice);
    });
  });

  /* =======================================================
     3. 3D CIRCULAR CAROUSEL
     ======================================================= */

  const orbit = $("#yolo-orbit");
  const orbitRing = $("#yolo-orbit-ring");
  const orbitPauseButton = $("#orbit-pause");
  const orbitReverseButton = $("#orbit-reverse");

  let orbitPaused = reducedMotion.matches;
  let orbitReversed = false;

  function updateOrbitControls() {
    if (!orbitRing) return;

    orbitRing.style.animationPlayState = orbitPaused
      ? "paused"
      : "running";

    orbitRing.style.animationDirection = orbitReversed
      ? "reverse"
      : "normal";

    if (orbitPauseButton) {
      orbitPauseButton.setAttribute(
        "aria-pressed",
        String(orbitPaused)
      );

      orbitPauseButton.setAttribute(
        "aria-label",
        orbitPaused
          ? "Resume carousel rotation"
          : "Pause carousel rotation"
      );

      orbitPauseButton.textContent = orbitPaused ? "▶" : "Ⅱ";
    }
  }

  orbitPauseButton?.addEventListener("click", () => {
    orbitPaused = !orbitPaused;
    updateOrbitControls();
  });

  orbitReverseButton?.addEventListener("click", () => {
    orbitReversed = !orbitReversed;
    updateOrbitControls();
  });

  orbit?.addEventListener("mouseenter", () => {
    if (orbitRing) {
      orbitRing.style.animationPlayState = "paused";
    }
  });

  orbit?.addEventListener("mouseleave", () => {
    updateOrbitControls();
  });

  orbit?.addEventListener("focusin", () => {
    if (orbitRing) {
      orbitRing.style.animationPlayState = "paused";
    }
  });

  orbit?.addEventListener("focusout", () => {
    updateOrbitControls();
  });

  updateOrbitControls();

  /* =======================================================
     4. MENU RENDERING
     ======================================================= */

  const menuGrid = $("#menu-grid") || $(".menu-grid");

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };

      return entities[character];
    });
  }

  function createMenuCard(item) {
    const name = escapeHTML(item.name);
    const category = escapeHTML(item.category || "");
    const image = escapeHTML(item.image || "");
    const price = item.price
      ? `<p class="menu-card__price">${escapeHTML(item.price)}</p>`
      : "";

    const representativeNotice =
      item.imageType === "representative" ||
      item.exactProductImage === false
        ? '<p class="menu-card__note">Representative image</p>'
        : "";

    return `
      <article class="menu-card" data-menu-category="${category}">
        ${
          image
            ? `<img src="${image}" alt="${name}" loading="lazy"
                 onerror="this.style.display='none'">`
            : ""
        }
        <div class="menu-card__body">
          <p class="menu-card__category">${category}</p>
          <h3>${name}</h3>
          ${price}
          ${representativeNotice}
        </div>
      </article>
    `;
  }

  function renderMenu(items = menuItems) {
    if (!menuGrid || !Array.isArray(items)) return;

    menuGrid.innerHTML = items.map(createMenuCard).join("");
  }

  /*
   * The supplied HTML already includes three sample menu cards.
   * Render the full menu only when the page explicitly provides
   * a dedicated #menu-grid element, avoiding duplicate cards.
   */
  if ($("#menu-grid")) {
    renderMenu();
  }

  /* Optional category filters for compatible existing markup. */
  const menuFilterButtons = $$("[data-menu-filter]");

  menuFilterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const selectedCategory = button.dataset.menuFilter;

      menuFilterButtons.forEach(filter => {
        filter.setAttribute(
          "aria-pressed",
          String(filter === button)
        );
      });

      const cards = $$(".menu-card", menuGrid || document);

      cards.forEach(card => {
        const cardCategory = card.dataset.menuCategory || "";
        const matches =
          selectedCategory === "all" ||
          !selectedCategory ||
          cardCategory.toLowerCase() === selectedCategory.toLowerCase();

        card.hidden = !matches;
      });
    });
  });

  /* =======================================================
     5. INTERIOR IMAGES
     ======================================================= */

  if (YOLO_INTERIOR_IMAGE) {
    [
      "#wall-interior-image",
      "#location-interior-image"
    ].forEach(selector => {
      const image = $(selector);

      if (!image) return;

      image.src = YOLO_INTERIOR_IMAGE;

      image.addEventListener(
        "error",
        () => {
          image.style.display = "none";
        },
        { once: true }
      );
    });
  }

  /* =======================================================
     6. SCROLL REVEAL ANIMATIONS
     ======================================================= */

  const revealElements = $$(
    "[data-reveal], .reveal, .story, .section-heading, .menu-card"
  );

  if (!reducedMotion.matches && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible", "in");
          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach(element => {
      element.classList.add("will-reveal");
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(element => {
      element.classList.add("is-visible", "in");
    });
  }

  /* =======================================================
     7. HEADER SCROLL STATE
     ======================================================= */

  const header = $(".site-header");
  let headerFramePending = false;

  function updateHeader() {
    headerFramePending = false;

    if (!header) return;

    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }

  function requestHeaderUpdate() {
    if (headerFramePending) return;

    headerFramePending = true;
    window.requestAnimationFrame(updateHeader);
  }

  window.addEventListener("scroll", requestHeaderUpdate, {
    passive: true
  });

  updateHeader();

  /* =======================================================
     8. MOBILE NAVIGATION SUPPORT
     ======================================================= */

  const menuToggle = $(
    "[data-menu-toggle], .menu-toggle, #menu-toggle"
  );

  const mobileNavigation = $(
    "[data-mobile-nav], .mobile-nav, #mobile-nav"
  );

  function setMobileNavigation(open) {
    if (!menuToggle || !mobileNavigation) return;

    menuToggle.setAttribute("aria-expanded", String(open));
    mobileNavigation.classList.toggle("is-open", open);
    mobileNavigation.hidden = !open;
  }

  if (menuToggle && mobileNavigation) {
    setMobileNavigation(false);

    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      setMobileNavigation(!isOpen);
    });

    $$("a", mobileNavigation).forEach(link => {
      link.addEventListener("click", () => {
        setMobileNavigation(false);
      });
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        setMobileNavigation(false);
      }
    });
  }

  /* =======================================================
     9. GENERIC CAROUSEL SUPPORT
     For existing creation/gallery controls
     ======================================================= */

  const creationTrack = $("#creations-track");
  const creationDots = $("#creations-dots");
  const creationPrevious = $("[data-carousel-prev]");
  const creationNext = $("[data-carousel-next]");
  const creationStepButtons = $$("[data-carousel-step]");

  function getCreationStep() {
    if (!creationTrack) return 0;

    const firstCard = creationTrack.firstElementChild;

    if (!firstCard) return 0;

    const trackStyles = getComputedStyle(creationTrack);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;

    return firstCard.getBoundingClientRect().width + gap;
  }

  function scrollCreations(direction) {
    if (!creationTrack) return;

    creationTrack.scrollBy({
      left: getCreationStep() * direction,
      behavior: reducedMotion.matches ? "auto" : "smooth"
    });
  }

  creationPrevious?.addEventListener("click", () => {
    scrollCreations(-1);
  });

  creationNext?.addEventListener("click", () => {
    scrollCreations(1);
  });

  creationStepButtons.forEach(button => {
    button.addEventListener("click", () => {
      const direction = Number(button.dataset.carouselStep) || 1;
      scrollCreations(direction);
    });
  });

  if (creationTrack && creationDots) {
    const dotButtons = $$("[data-creations-index]", creationDots);

    function updateCreationDots() {
      if (!dotButtons.length) return;

      const step = getCreationStep();

      if (!step) return;

      const activeIndex = Math.round(creationTrack.scrollLeft / step);

      dotButtons.forEach((button, index) => {
        button.classList.toggle("is-active", index === activeIndex);
        button.setAttribute(
          "aria-current",
          index === activeIndex ? "true" : "false"
        );
      });
    }

    dotButtons.forEach(button => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.creationsIndex);

        if (!Number.isFinite(index)) return;

        creationTrack.scrollTo({
          left: getCreationStep() * index,
          behavior: reducedMotion.matches ? "auto" : "smooth"
        });
      });
    });

    creationTrack.addEventListener("scroll", updateCreationDots, {
      passive: true
    });

    window.addEventListener("resize", updateCreationDots);

    updateCreationDots();
  }

  /* =======================================================
     10. GALLERY IMAGE FALLBACKS
     ======================================================= */

  $$("img[data-fallback]").forEach(image => {
    image.addEventListener(
      "error",
      () => {
        const fallback = image.dataset.fallback;

        if (fallback && image.src !== fallback) {
          image.src = fallback;
        } else {
          image.style.visibility = "hidden";
        }
      },
      { once: true }
    );
  });

  /* =======================================================
     11. CURRENT YEAR
     ======================================================= */

  $$("[data-current-year]").forEach(element => {
    element.textContent = String(new Date().getFullYear());
  });

  /* =======================================================
     12. INITIAL STATE
     ======================================================= */

  if (hero && !hero.dataset.flavour) {
    hero.dataset.flavour = "strawberry";
  }

  requestHeroVideoUpdate();

  console.info("YOLO Ice Cream website initialized.");
})();
```