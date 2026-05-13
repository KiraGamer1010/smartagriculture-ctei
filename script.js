const header = document.getElementById("siteHeader");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-menu a");
const backToTop = document.getElementById("backToTop");
const cursorLight = document.querySelector(".cursor-light");
const particleField = document.getElementById("particleField");
const revealElements = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");
const theoryToggles = document.querySelectorAll(".theory-toggle");

const setScrollState = () => {
  backToTop.classList.toggle("is-visible", window.scrollY > 520);
};

const closeMobileMenu = () => {
  if (!navToggle || !navMenu) return;
  navToggle.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navMenu.classList.remove("is-open");
  header.classList.remove("menu-active");
  document.body.classList.remove("menu-open");
};

const toggleMobileMenu = () => {
  const isOpen = navToggle.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navMenu.classList.toggle("is-open", isOpen);
  header.classList.toggle("menu-active", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
};

const createParticles = () => {
  if (!particleField) return;

  const particleCount = window.matchMedia("(max-width: 640px)").matches ? 14 : 28;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < particleCount; i += 1) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.setProperty("--duration", `${10 + Math.random() * 10}s`);
    particle.style.setProperty("--delay", `${Math.random() * -12}s`);
    particle.style.opacity = `${0.14 + Math.random() * 0.22}`;
    fragment.appendChild(particle);
  }

  particleField.replaceChildren(fragment);
};

const revealOnScroll = () => {
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -64px 0px",
    }
  );

  revealElements.forEach((element) => observer.observe(element));
};

const updateActiveLink = () => {
  const scrollPosition = window.scrollY + 160;
  let currentSection = "inicio";

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPosition) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentSection}`;
    link.classList.toggle("active", isActive);
  });
};

const setupCursorLight = () => {
  if (!cursorLight || window.matchMedia("(hover: none)").matches) return;

  let lightX = 0;
  let lightY = 0;
  let targetX = 0;
  let targetY = 0;

  const animateLight = () => {
    lightX += (targetX - lightX) * 0.18;
    lightY += (targetY - lightY) * 0.18;
    cursorLight.style.left = `${lightX}px`;
    cursorLight.style.top = `${lightY}px`;
    requestAnimationFrame(animateLight);
  };

  window.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    cursorLight.style.opacity = "1";
  });

  document.addEventListener("pointerleave", () => {
    cursorLight.style.opacity = "0";
  });

  animateLight();
};

const setupAccordions = () => {
  theoryToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const card = toggle.closest(".theory-card");
      const isOpen = card.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  });
};

const setupSoftPointerHighlights = () => {
  const interactiveItems = document.querySelectorAll(
    ".btn, .download-btn, .doc-card, .tech-card, .impact-card, .objective-card, .image-card, .architecture-node, .timeline-item, .resource-card, .fusion-card, .method-step, .matrix-card, .asset-card, .video-card"
  );

  interactiveItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      item.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
      item.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
    });
  });
};

if (navToggle) {
  navToggle.addEventListener("click", toggleMobileMenu);
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

window.addEventListener("scroll", () => {
  setScrollState();
  updateActiveLink();
}, { passive: true });

window.addEventListener("resize", () => {
  if (window.innerWidth >= 980) {
    closeMobileMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  setScrollState();
  createParticles();
  revealOnScroll();
  updateActiveLink();
  setupCursorLight();
  setupAccordions();
  setupSoftPointerHighlights();
});
