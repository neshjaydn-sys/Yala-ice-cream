import { menuItems } from "./menu-data.js";

/* =========================================================
   YOLO ICE CREAM — APP.JS
   Hero scroll-video · flavour theming · carousel · menu
   filters · mobile nav · header · reveals
   ========================================================= */

(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* =======================================================
     1. HERO — SCROLL-CONTROLLED VIDEO
     ======================================================= */

  const hero = $(".hero");
  const heroVideo = $("#hero-scroll-video");

  let videoFramePending = false;
  let heroInView = true;

  function updateHeroVideo() {
    videoFramePending = false;

    if (
      !hero ||
      !heroVideo ||
      !heroInView ||
      reducedMotion.matches ||
      !Number.isFinite(heroVideo.duration) ||
      heroVideo.duration <= 0 ||
      heroVideo.readyState < 2
    ) {
      return;
    }

    const rect = hero.getBoundingClientRect();
    const scrollDistance = Math.max(1, hero.offsetHeight - window.innerHeight);

    const progress = Math.min(1, Math.max(0, -rect.top / scrollDistance));
    const targetTime = progress * heroVideo.duration;

    if (Math.abs(heroVideo.currentTime - targetTime) > 0.035) {
      try {
        heroVideo.currentTime = targetTime;
      } catch {
        // Some browsers reject seeking until the video is ready; the next
        // scroll event retries automatically.
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
      // Poster image and gradient fallback remain visible underneath.
      heroVideo.style.display = "none";
      console.warn(
        "YOLO hero video could not load. Check videos/yolo_ice_cream_hero.mp4."
      );
    });

    // Only scrub while the hero is actually on screen.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        entries => {
          heroInView = entries[0]?.isIntersecting ?? true;
          if (heroInView) requestHeroVideoUpdate();
        },
        { threshold: 0 }
      ).observe(hero);
    }

    window.addEventListener("scroll", requestHeroVideoUpdate, {
      passive: true
    });
    window.addEventListener("resize", requestHeroVideoUpdate);

    if (!reducedMotion.matches) {
      requestHeroVideoUpdate();
    }
  }

  initialiseHeroVideo();

  /* =======================================================
     2. FLAVOUR SELECTOR — text + hero theming
     The selected flavour drives CSS custom properties via
     .hero[data-flavour], tinting the hero glow and headline.
     ======================================================= */

  const flavourMeta = {
    strawberry: { name: "Strawberry", tagline: "Bright, berry, unbothered." },
    chocolate: { name: "Chocolate", tagline: "Dark, rich, unapologetic." },
    mango: { name: "Mango", tagline: "Sunshine, served cold." },
    mint: { name: "Mint", tagline: "Cool, calm, completely fresh." },
    vanilla: { name: "Vanilla", tagline: "Soft, classic, always right." }
  };

  const heroFlavourName = $("#hero-flavour-name");
  const heroFlavourTagline = $("#hero-flavour-tagline");
  const flavourButtons = $$("[data-flavour-choice]");

  function selectFlavour(flavour) {
    const meta = flavourMeta[flavour];
    if (!meta) return;

    if (hero) hero.dataset.flavour = flavour;
    if (heroFlavourName) heroFlavourName.textContent = meta.name;
    if (heroFlavourTagline) heroFlavourTagline.textContent = meta.tagline;

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
     3. FLAVOURS CAROUSEL — drag, arrows, keyboard
     ======================================================= */

  const orbit = $("#yolo-orbit");
  const orbitPrev = $("#orbit-prev");
  const orbitNext = $("#orbit-next");

  function orbitStep() {
    const card = orbit?.querySelector(".orbit__item");
    if (!card) return 300;

    const styles = window.getComputedStyle(orbit);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;

    return card.getBoundingClientRect().width + gap;
  }

  function updateOrbitControls() {
    if (!orbit || !orbitPrev || !orbitNext) return;

    const maxScroll = orbit.scrollWidth - orbit.clientWidth;
    const atStart = orbit.scrollLeft <= 4;
    const atEnd = orbit.scrollLeft >= maxScroll - 4;

    orbitPrev.disabled = atStart;
    orbitNext.disabled = atEnd || maxScroll <= 0;
  }

  function scrollOrbit(direction) {
    orbit?.scrollBy({
      left: orbitStep() * direction,
      behavior: reducedMotion.matches ? "auto" : "smooth"
    });
  }

  orbitPrev?.addEventListener("click", () => scrollOrbit(-1));
  orbitNext?.addEventListener("click", () => scrollOrbit(1));

  orbit?.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollOrbit(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollOrbit(-1);
    }
  });

  /* Pointer drag-to-scroll (mouse, touch, pen). */
  if (orbit) {
    let dragStartX = 0;
    let dragStartScroll = 0;
    let dragging = false;

    orbit.addEventListener("pointerdown", event => {
      if (event.pointerType === "touch") return; // Native touch scrolling is better.
      dragging = true;
      dragStartX = event.clientX;
      dragStartScroll = orbit.scrollLeft;
      orbit.classList.add("is-dragging");
      orbit.setPointerCapture(event.pointerId);
    });

    orbit.addEventListener("pointermove", event => {
      if (!dragging) return;
      orbit.scrollLeft = dragStartScroll - (event.clientX - dragStartX);
    });

    const endDrag = event => {
      if (!dragging) return;
      dragging = false;
      orbit.classList.remove("is-dragging");
      if (orbit.hasPointerCapture(event.pointerId)) {
        orbit.releasePointerCapture(event.pointerId);
      }
    };

    orbit.addEventListener("pointerup", endDrag);
    orbit.addEventListener("pointercancel", endDrag);

    orbit.addEventListener("scroll", updateOrbitControls, { passive: true });
    window.addEventListener("resize", updateOrbitControls);
    updateOrbitControls();
  }

  /* =======================================================
     4. MENU — render from data + category filters
     ======================================================= */

  const menuGrid = $("#menu-grid");

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
    const categorySlug = escapeHTML((item.category || "").toLowerCase());
    const price = item.price
      ? `<p class="menu-card__price">${escapeHTML(item.price)}</p>`
      : "";
    const representativeNotice =
      item.imageType === "representative" || item.exactProductImage === false
        ? '<p class="menu-card__note">Representative image</p>'
        : "";

    return `
      <article class="menu-card" data-menu-category="${categorySlug}">
        ${
          image
            ? `<img src="${image}" alt="${escapeHTML(item.name)} — representative image" loading="lazy" decoding="async">`
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

  renderMenu();

  const menuFilters = $$("[data-menu-filter]");

  function applyMenuFilter(selectedCategory) {
    menuFilters.forEach(filter => {
      filter.setAttribute(
        "aria-pressed",
        String(filter.dataset.menuFilter === selectedCategory)
      );
    });

    const normalized = (selectedCategory || "all").toLowerCase();

    $$(".menu-card", menuGrid || document).forEach(card => {
      const cardCategory = (card.dataset.menuCategory || "").toLowerCase();
      const matches = normalized === "all" || cardCategory === normalized;
      card.hidden = !matches;
    });
  }

  menuFilters.forEach(button => {
    button.addEventListener("click", () => {
      applyMenuFilter(button.dataset.menuFilter);
    });
  });

  /* =======================================================
     5. MOBILE NAVIGATION
     ======================================================= */

  const navToggle = $("#nav-toggle");
  const mobileNav = $("#mobile-nav");

  function setMobileNavigation(open) {
    if (!navToggle || !mobileNav) return;

    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileNav.hidden = false;

    // Allow the browser one frame so the transition can play.
    window.requestAnimationFrame(() => {
      mobileNav.classList.toggle("is-open", open);
    });

    document.body.classList.toggle("nav-open", open);

    if (open) {
      $("a", mobileNav)?.focus({ preventScroll: true });
    }
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      setMobileNavigation(!isOpen);
    });

    $$("a", mobileNav).forEach(link => {
      link.addEventListener("click", () => setMobileNavigation(false));
    });

    document.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;
      if (navToggle.getAttribute("aria-expanded") !== "true") return;

      setMobileNavigation(false);
      navToggle.focus();
    });

    // Return focus to the toggle when the panel closes via any link.
    mobileNav.addEventListener("transitionend", () => {
      if (mobileNav.classList.contains("is-open")) return;
      mobileNav.hidden = true;
    });
  }

  /* =======================================================
     6. HEADER — scrolled state + reading progress
     ======================================================= */

  const header = $("#site-header");
  const scrollProgress = $("#scroll-progress");

  let headerFramePending = false;

  function updateHeader() {
    headerFramePending = false;

    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    }

    if (scrollProgress) {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      scrollProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    }
  }

  function requestHeaderUpdate() {
    if (headerFramePending) return;
    headerFramePending = true;
    window.requestAnimationFrame(updateHeader);
  }

  window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
  window.addEventListener("resize", requestHeaderUpdate);
  updateHeader();

  /* =======================================================
     7. SCROLL REVEALS
     ======================================================= */

  const revealElements = $$(".reveal, .menu-card");

  if (!reducedMotion.matches && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -35px 0px" }
    );

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(element => element.classList.add("is-visible"));
  }

  /* =======================================================
     8. IMAGE FALLBACKS
     ======================================================= */

  $$("img").forEach(image => {
    image.addEventListener(
      "error",
      () => {
        image.style.visibility = "hidden";
      },
      { once: true }
    );
  });

  /* =======================================================
     9. FOOTER YEAR
     ======================================================= */

  const yearElement = $("#current-year");
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  console.info("YOLO Ice Cream website initialized.");
})();
