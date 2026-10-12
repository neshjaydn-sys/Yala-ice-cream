import { menuItems, YOLO_INTERIOR_IMAGE } from "./menu-data.js";

const flavours = ["strawberry", "chocolate", "mango", "mint", "vanilla"];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const hero = document.querySelector(".hero");
const heroScene = document.querySelector("#hero-scene");
const heroStageMotion = document.querySelector("#hero-stage-parallax");
const flavourName = document.querySelector("#hero-flavour-name");
const flavourButtons = [...document.querySelectorAll(".hero__flavour[data-flavour]")];
const flavourTagline = document.querySelector("#hero-flavour-tagline");
const flavourIndexLabel = document.querySelector("#hero-flavour-index");
const cycleBar = document.querySelector("#hero-cycle-bar");

const flavourMeta = {
  strawberry: "BRIGHT, BERRY, UNBOTHERED",
  chocolate: "DARK, RICH, UNAPOLOGETIC",
  mango: "SUNSHINE, SERVED COLD",
  mint: "COOL, CALM, COMPLETELY FRESH",
  vanilla: "SOFT, CLASSIC, ALWAYS RIGHT"
};

function observeReveals(root = document) {
  const elements = [...root.querySelectorAll(".reveal:not(.is-visible)")];
  if (!elements.length) return;

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  elements.forEach((element) => {
    element.classList.add("is-observed");
    observer.observe(element);
  });
}

function createMenuFallback(index) {
  const art = document.createElement("span");
  art.className = `menu-card__fallback menu-card__art menu-card__art--${index % 4 + 1} is-visible`;
  art.setAttribute("aria-hidden", "true");

  [
    ["menu-card__art-index", String(index + 1).padStart(2, "0")],
    ["menu-card__art-mark", "✳"],
    ["menu-card__art-word", "YOLO"],
    ["menu-card__art-caption", "MOOD STUDY"]
  ].forEach(([className, text]) => {
    const item = document.createElement("span");
    item.className = className;
    item.textContent = text;
    art.appendChild(item);
  });
  return art;
}

function showsRepresentativeImage(item) {
  return Boolean(item.image) && (Boolean(item.exactProductImage) || item.imageType === "representative");
}

function createProductCard(item, index) {
  const card = document.createElement("article");
  card.className = "menu-card reveal is-visible";

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "menu-card__trigger";
  trigger.dataset.productOpen = item.name;
  trigger.setAttribute("aria-label", `View ${item.name} menu details`);

  const media = document.createElement("span");
  media.className = "menu-card__media";
  const fallback = createMenuFallback(index);

  if (showsRepresentativeImage(item)) {
    const image = document.createElement("img");
    image.className = "menu-card__image";
    image.alt = item.exactProductImage
      ? `${item.name} from YOLO Ice Cream`
      : `Representative photo for ${item.name}`;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("load", () => fallback.classList.remove("is-visible"), { once: true });
    image.addEventListener("error", () => image.remove(), { once: true });
    image.src = item.image;
    media.append(image, fallback);
    if (image.complete && image.naturalWidth > 0) fallback.classList.remove("is-visible");
  } else {
    media.appendChild(fallback);
  }

  const details = document.createElement("span");
  details.className = "menu-card__details";
  const nameGroup = document.createElement("span");
  nameGroup.className = "menu-card__name-group";

  const category = document.createElement("span");
  category.className = "menu-card__category";
  category.textContent = item.category.toUpperCase();

  const name = document.createElement("span");
  name.className = "menu-card__name";
  name.textContent = item.name;
  nameGroup.append(category, name);

  const price = document.createElement("span");
  price.className = "menu-card__price";
  price.textContent = item.verifiedPrice ? item.price : "PRICE UNAVAILABLE";
  details.append(nameGroup, price);
  trigger.append(media, details);
  card.appendChild(trigger);
  return card;
}

const menuGrid = document.querySelector("#menu-grid");
const menuFilters = [...document.querySelectorAll("[data-menu-filter]")];

function renderMenu(category = "all") {
  const items = category === "all" ? menuItems : menuItems.filter((item) => item.category === category);
  menuGrid.replaceChildren(...items.map(createProductCard));
  const countLabel = document.querySelector("#menu-count");
  if (countLabel) countLabel.textContent = `${items.length} ${items.length === 1 ? "ITEM" : "ITEMS"}`;
}

function setMenuFilter(category) {
  menuFilters.forEach((button) => {
    const active = button.dataset.menuFilter === category;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  renderMenu(category);
}

menuFilters.forEach((button) => {
  button.addEventListener("click", () => setMenuFilter(button.dataset.menuFilter));
});
renderMenu();
observeReveals();

/* — Static hero stage: the campaign photograph with a graceful fallback — */
const stagePhoto = document.querySelector("#hero-stage-photo");

function handleStageFailure() {
  hero.classList.add("photo-failed");
}

if (stagePhoto) {
  stagePhoto.addEventListener("error", handleStageFailure, { once: true });
  if (stagePhoto.complete && stagePhoto.naturalWidth === 0) handleStageFailure();
}

const wallImage = document.querySelector("#wall-interior-image");
if (wallImage) {
  wallImage.addEventListener("error", () => wallImage.remove(), { once: true });
  wallImage.src = YOLO_INTERIOR_IMAGE;
}

const locationImage = document.querySelector("#location-interior-image");
if (locationImage) {
  locationImage.addEventListener("error", () => locationImage.remove(), { once: true });
  locationImage.src = YOLO_INTERIOR_IMAGE;
}

const productDialog = document.querySelector("#product-dialog");
const closeProductDialog = document.querySelector("#product-dialog-close");
let returnFocusTo = null;

function openProductDialog(name, trigger) {
  const product = menuItems.find((item) => item.name === name);
  if (!product) return;

  returnFocusTo = trigger;
  const index = menuItems.indexOf(product);
  const art = createMenuFallback(index);
  art.classList.add("product-dialog__visual");

  const artHolder = document.querySelector("#product-dialog-art");
  if (showsRepresentativeImage(product)) {
    const photo = document.createElement("img");
    photo.className = "product-dialog__image";
    photo.alt = "";
    photo.decoding = "async";
    photo.addEventListener("error", () => artHolder.replaceChildren(art), { once: true });
    photo.src = product.image;
    artHolder.replaceChildren(photo);
  } else {
    artHolder.replaceChildren(art);
  }
  document.querySelector("#product-dialog-category").textContent = product.category;
  document.querySelector("#product-dialog-title").textContent = product.name;
  const price = document.querySelector("#product-dialog-price");
  price.textContent = product.verifiedPrice ? product.price : "Price unavailable";

  if (typeof productDialog.showModal === "function") {
    productDialog.showModal();
  } else {
    productDialog.setAttribute("open", "");
  }
  closeProductDialog.focus();
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-product-open]");
  if (trigger) openProductDialog(trigger.dataset.productOpen, trigger);
});

closeProductDialog.addEventListener("click", () => productDialog.close());
productDialog.addEventListener("click", (event) => {
  if (event.target === productDialog) productDialog.close();
});
productDialog.addEventListener("close", () => {
  if (returnFocusTo?.isConnected) returnFocusTo.focus();
  returnFocusTo = null;
});
productDialog.querySelector("a[href^='#']").addEventListener("click", () => productDialog.close());

const creationTrack = document.querySelector("#creations-track");
document.querySelectorAll("[data-carousel-step]").forEach((button) => {
  button.addEventListener("click", () => {
    const card = creationTrack.querySelector(".creation-card");
    const gap = parseFloat(getComputedStyle(creationTrack).columnGap) || 20;
    const step = (card?.getBoundingClientRect().width ?? creationTrack.clientWidth * 0.8) + gap;
    creationTrack.scrollBy({
      left: Number(button.dataset.carouselStep) * step,
      behavior: reducedMotion.matches ? "auto" : "smooth"
    });
  });
});

let dragStartX = 0;
let dragStartScroll = 0;
let isDragging = false;
let dragged = false;

creationTrack.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "touch" || event.button !== 0) return;
  isDragging = true;
  dragged = false;
  dragStartX = event.clientX;
  dragStartScroll = creationTrack.scrollLeft;
  creationTrack.setPointerCapture(event.pointerId);
});

creationTrack.addEventListener("pointermove", (event) => {
  if (!isDragging) return;
  const delta = event.clientX - dragStartX;
  if (Math.abs(delta) > 5) dragged = true;
  if (dragged) {
    creationTrack.scrollLeft = dragStartScroll - delta;
    event.preventDefault();
  }
});

function endCreationDrag() {
  isDragging = false;
}
creationTrack.addEventListener("pointerup", endCreationDrag);
creationTrack.addEventListener("pointercancel", endCreationDrag);
creationTrack.addEventListener("click", (event) => {
  if (!dragged) return;
  event.preventDefault();
  event.stopPropagation();
  dragged = false;
}, true);

const creationDots = [...document.querySelectorAll("[data-creations-index]")];
const creationArrows = [...document.querySelectorAll("[data-carousel-step]")];
const creationCards = [...creationTrack.querySelectorAll(".creation-card")];
let creationFrame = 0;

function updateCreationState() {
  creationFrame = 0;
  const maxScroll = creationTrack.scrollWidth - creationTrack.clientWidth;
  const left = creationTrack.scrollLeft;
  creationArrows.forEach((button) => {
    const step = Number(button.dataset.carouselStep);
    button.disabled = step < 0 ? left <= 2 : left >= maxScroll - 2;
  });

  const trackLeft = creationTrack.getBoundingClientRect().left;
  let activeIndex = 0;
  let bestDistance = Infinity;
  creationCards.forEach((card, index) => {
    const distance = Math.abs(card.getBoundingClientRect().left - trackLeft);
    if (distance < bestDistance) {
      bestDistance = distance;
      activeIndex = index;
    }
  });
  creationDots.forEach((dot, index) => {
    const active = index === activeIndex;
    dot.classList.toggle("is-active", active);
    if (active) dot.setAttribute("aria-current", "true");
    else dot.removeAttribute("aria-current");
  });
}

function scheduleCreationState() {
  if (!creationFrame) creationFrame = window.requestAnimationFrame(updateCreationState);
}

creationTrack.addEventListener("scroll", scheduleCreationState, { passive: true });
window.addEventListener("resize", scheduleCreationState, { passive: true });

creationDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const card = creationCards[Number(dot.dataset.creationsIndex)];
    if (!card) return;
    const trackBounds = creationTrack.getBoundingClientRect();
    const cardBounds = card.getBoundingClientRect();
    creationTrack.scrollTo({
      left: creationTrack.scrollLeft + (cardBounds.left - trackBounds.left),
      behavior: reducedMotion.matches ? "auto" : "smooth"
    });
  });
});

updateCreationState();

const flavourButtonsAll = [...document.querySelectorAll(".hero__flavour")];
let flavourIndex = 0;
let flavourTimer = 0;
let resumeTimer = 0;

function stopFlavourCycle() {
  window.clearTimeout(flavourTimer);
  flavourTimer = 0;
  if (cycleBar) cycleBar.getAnimations().forEach((animation) => animation.cancel());
}

function scheduleFlavourCycle(delay = 9000) {
  stopFlavourCycle();
  if (reducedMotion.matches || document.hidden) return;
  if (cycleBar) {
    cycleBar.animate(
      [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
      { duration: delay, easing: "linear", fill: "forwards" }
    );
  }
  flavourTimer = window.setTimeout(() => {
    setFlavour((flavourIndex + 1) % flavours.length, false);
    scheduleFlavourCycle(9000);
  }, delay);
}

function setFlavour(index, resume = true) {
  flavourIndex = (index + flavours.length) % flavours.length;
  const flavour = flavours[flavourIndex];
  hero.dataset.flavour = flavour;
  flavourName.textContent = flavour.toUpperCase();
  if (flavourTagline) flavourTagline.textContent = flavourMeta[flavour] ?? "";
  if (flavourIndexLabel) {
    flavourIndexLabel.textContent =
      `${String(flavourIndex + 1).padStart(2, "0")} / ${String(flavours.length).padStart(2, "0")}`;
  }
  flavourButtonsAll.forEach((button) => {
    const active = button.dataset.flavour === flavour;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  if (resume) {
    window.clearTimeout(resumeTimer);
    scheduleFlavourCycle(9000);
  }
}

function pauseForInteraction() {
  stopFlavourCycle();
  window.clearTimeout(resumeTimer);
  if (!reducedMotion.matches && !document.hidden) {
    resumeTimer = window.setTimeout(() => scheduleFlavourCycle(9000), 4500);
  }
}

flavourButtons.forEach((button) => {
  button.addEventListener("click", () => {
    pauseForInteraction();
    setFlavour(flavours.indexOf(button.dataset.flavour), false);
  });
});

if (!reducedMotion.matches) scheduleFlavourCycle();

let swipeStartX = 0;
let swipeStartY = 0;
let swipeTracking = false;

heroScene.addEventListener("pointerdown", (event) => {
  if (event.pointerType !== "touch") return;
  swipeTracking = true;
  swipeStartX = event.clientX;
  swipeStartY = event.clientY;
}, { passive: true });

heroScene.addEventListener("pointerup", (event) => {
  if (!swipeTracking) return;
  swipeTracking = false;
  const deltaX = event.clientX - swipeStartX;
  const deltaY = event.clientY - swipeStartY;
  if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.4) return;
  pauseForInteraction();
  setFlavour(flavourIndex + (deltaX < 0 ? 1 : -1), false);
}, { passive: true });

heroScene.addEventListener("pointercancel", () => {
  swipeTracking = false;
}, { passive: true });

const menuToggle = document.querySelector(".menu-toggle");
const mobileLinks = document.querySelector("#mobile-links");
const mobileFirstLink = mobileLinks.querySelector("a");
const pageContent = [document.querySelector("main"), document.querySelector(".site-footer")];

function closeMobileMenu(restoreFocus = true) {
  if (mobileLinks.hidden) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  mobileLinks.hidden = true;
  document.body.classList.remove("menu-open");
  pageContent.forEach((element) => { element.inert = false; });
  if (restoreFocus) menuToggle.focus();
}

menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  mobileLinks.hidden = !open;
  document.body.classList.toggle("menu-open", open);
  pageContent.forEach((element) => { element.inert = open; });
  if (open) mobileFirstLink.focus();
});

mobileLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => closeMobileMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (productDialog.open && event.key === "Escape") {
    productDialog.close();
    return;
  }
  if (mobileLinks.hidden) return;

  if (event.key === "Escape") {
    closeMobileMenu();
  } else if (event.key === "Tab") {
    const focusable = [menuToggle, ...mobileLinks.querySelectorAll("a")];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

let resizeFrame = 0;
window.addEventListener("resize", () => {
  if (resizeFrame) return;
  resizeFrame = window.requestAnimationFrame(() => {
    resizeFrame = 0;
    if (window.innerWidth >= 900) closeMobileMenu(false);
  });
}, { passive: true });

const header = document.querySelector("#site-header");
const scrollProgress = document.querySelector(".scroll-progress");
let scrollFrame = 0;

const parallaxItems = [...document.querySelectorAll("[data-parallax]")].map((element) => ({
  element,
  speed: Number.parseFloat(element.dataset.parallax) || 0.06
}));

function updateParallax() {
  if (reducedMotion.matches) return;
  const viewportCenter = window.innerHeight / 2;
  const viewportEdge = window.innerHeight + 120;
  parallaxItems.forEach(({ element, speed }) => {
    const bounds = element.getBoundingClientRect();
    if (bounds.bottom < -120 || bounds.top > viewportEdge) return;
    const offset = -((bounds.top + bounds.height / 2) - viewportCenter) * speed;
    const clamped = Math.max(-46, Math.min(46, offset));
    element.style.setProperty("--par", `${clamped.toFixed(1)}px`);
  });
}

function updateScrollState() {
  scrollFrame = 0;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.transform = `scaleX(${maxScroll > 0 ? window.scrollY / maxScroll : 0})`;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
  updateParallax();
}

window.addEventListener("scroll", () => {
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollState);
}, { passive: true });

window.addEventListener("resize", () => {
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollState);
}, { passive: true });

updateScrollState();

let pointerTargetX = 0;
let pointerTargetY = 0;
let pointerX = 0;
let pointerY = 0;
let pointerFrame = 0;
let pointerActive = !reducedMotion.matches;

function animateStage() {
  pointerFrame = 0;
  if (!pointerActive || document.hidden) return;
  pointerX += (pointerTargetX - pointerX) * 0.14;
  pointerY += (pointerTargetY - pointerY) * 0.14;
  if (heroStageMotion) {
    heroStageMotion.style.transform = `translate3d(${(pointerX * 12).toFixed(2)}px, ${(pointerY * 9).toFixed(2)}px, 0)`;
  }
  hero.style.setProperty("--pointer-x", `${(50 + pointerX * 9).toFixed(2)}%`);
  hero.style.setProperty("--pointer-y", `${(45 + pointerY * 7).toFixed(2)}%`);
  if (Math.abs(pointerX - pointerTargetX) > 0.004 || Math.abs(pointerY - pointerTargetY) > 0.004) {
    pointerFrame = window.requestAnimationFrame(animateStage);
  }
}

heroScene.addEventListener("pointermove", (event) => {
  if (!pointerActive || event.pointerType === "touch") return;
  const bounds = heroScene.getBoundingClientRect();
  pointerTargetX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
  pointerTargetY = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));
  pauseForInteraction();
  if (!pointerFrame) pointerFrame = window.requestAnimationFrame(animateStage);
}, { passive: true });

heroScene.addEventListener("pointerleave", () => {
  pointerTargetX = 0;
  pointerTargetY = 0;
  if (pointerActive && !pointerFrame) pointerFrame = window.requestAnimationFrame(animateStage);
});

reducedMotion.addEventListener("change", (event) => {
  pointerActive = !event.matches;
  if (event.matches) {
    stopFlavourCycle();
    window.clearTimeout(resumeTimer);
    if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    if (heroStageMotion) heroStageMotion.style.transform = "";
    hero.style.removeProperty("--pointer-x");
    hero.style.removeProperty("--pointer-y");
    parallaxItems.forEach(({ element }) => element.style.removeProperty("--par"));
  } else {
    scheduleFlavourCycle();
  }
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopFlavourCycle();
    window.clearTimeout(resumeTimer);
    if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
  } else {
    if (!reducedMotion.matches) scheduleFlavourCycle();
    if (pointerActive && !pointerFrame) pointerFrame = window.requestAnimationFrame(animateStage);
  }
});

document.querySelector("#copyright-year").textContent = String(new Date().getFullYear());

/* — Supplied imagery: pinned mood stage, scrub zoom, graceful image fallbacks — */
const moodsSection = document.querySelector(".moods");
const moodsTrack = document.querySelector("#moods-track");
const moodsFrames = moodsSection ? [...moodsSection.querySelectorAll(".moods__frame")] : [];
const moodsCounter = document.getElementById("moods-counter");
const moodsBar = document.getElementById("moods-progress-bar");
let moodsActive = -1;

function updateMoods() {
  if (!moodsSection || !moodsSection.classList.contains("is-enhanced") || !moodsTrack || !moodsFrames.length) return;
  const travel = moodsTrack.offsetHeight - window.innerHeight;
  const passed = -moodsTrack.getBoundingClientRect().top;
  const progress = travel > 0 ? Math.min(1, Math.max(0, passed / travel)) : 0;
  const total = moodsFrames.length;
  const active = Math.min(total - 1, Math.floor(progress * total));

  moodsFrames.forEach((frame, index) => {
    frame.classList.toggle("is-active", index === active);
    const local = Math.min(1, Math.max(0, progress * total - index));
    frame.style.setProperty("--fp", local.toFixed(3));
  });

  if (active !== moodsActive) {
    moodsActive = active;
    if (moodsCounter) {
      moodsCounter.textContent = `${String(active + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
    }
  }
  if (moodsBar) moodsBar.style.transform = `scaleX(${progress.toFixed(4)})`;
}

function setMoodsMode(enabled) {
  if (!moodsSection) return;
  const on = enabled && !reducedMotion.matches;
  moodsSection.classList.toggle("is-enhanced", on);
  moodsActive = -1;

  if (on) {
    updateMoods();
  } else {
    moodsFrames.forEach((frame) => {
      frame.classList.remove("is-active");
      frame.style.removeProperty("--fp");
    });
    moodsFrames[0]?.classList.add("is-active");
    if (moodsBar) moodsBar.style.transform = "";
    if (moodsCounter) {
      moodsCounter.textContent = `01 / ${String(moodsFrames.length).padStart(2, "0")}`;
    }
  }
}

const scrubItems = [...document.querySelectorAll("[data-scrub-scale]")];

function updateScrubScale() {
  if (reducedMotion.matches) return;
  const viewport = window.innerHeight;
  scrubItems.forEach((element) => {
    const bounds = element.getBoundingClientRect();
    if (bounds.bottom < -80 || bounds.top > viewport + 80) return;
    const travel = (viewport - bounds.top) / (viewport + bounds.height);
    const progress = Math.min(1, Math.max(0, travel));
    element.style.setProperty("--scrub", (1.07 - 0.07 * progress).toFixed(4));
  });
}

let galleryFrame = 0;

function updateGallery() {
  galleryFrame = 0;
  updateScrubScale();
  updateMoods();
}

function scheduleGallery() {
  if (!galleryFrame) galleryFrame = window.requestAnimationFrame(updateGallery);
}

window.addEventListener("scroll", scheduleGallery, { passive: true });
window.addEventListener("resize", scheduleGallery, { passive: true });

reducedMotion.addEventListener("change", () => {
  setMoodsMode(!reducedMotion.matches);
  if (reducedMotion.matches) {
    scrubItems.forEach((element) => element.style.removeProperty("--scrub"));
  }
  scheduleGallery();
});

document.querySelectorAll("img[data-fallback]").forEach((image) => {
  const fail = () => {
    image.style.display = "none";
    const holder = image.closest(".shot__media, .moods__frame");
    if (holder) holder.classList.add("img-missing");
  };
  image.addEventListener("error", fail, { once: true });
  if (image.complete && image.naturalWidth === 0) fail();
});

setMoodsMode(true);
updateGallery();
