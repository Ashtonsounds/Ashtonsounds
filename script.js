/**
 * Ashton Sounds - Modern Interactive JavaScript
 * Lightbox, Scroll Reveal Animations, Back To Top, Progress Bar, Accessibility
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Preloader Fade Out
  initPreloader();

  // 2. Navigation & Mobile Menu Accessibility
  initNavigation();

  // 3. Scroll Progress Bar & Back-to-Top Button
  initScrollIndicators();

  // 4. Scroll Reveal Animations
  initScrollAnimations();

  // 5. Professional Lightbox Gallery
  initLightbox();

  // 6. Video Intersection Observer
  initVideoObserver();
});

/* ==========================================================================
   1. Preloader
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById("page-preloader");
  if (preloader) {
    const hidePreloader = () => {
      preloader.classList.add("fade-out");
      document.body.classList.remove("preloader-active");
      setTimeout(() => {
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 600);
    };

    // Fade out after 1.5s max or when page finishes loading
    if (document.readyState === "complete") {
      setTimeout(hidePreloader, 1200);
    } else {
      window.addEventListener("load", () => setTimeout(hidePreloader, 800));
      setTimeout(hidePreloader, 2500); // Fallback limit
    }
  }
}

/* ==========================================================================
   2. Accessible Navigation & Active Link Highlight
   ========================================================================== */
function initNavigation() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Toggle navigation menu");

    const toggleMenu = () => {
      const isActive = hamburger.classList.toggle("active");
      navLinks.classList.toggle("active");
      hamburger.setAttribute("aria-expanded", isActive ? "true" : "false");
    };

    hamburger.addEventListener("click", toggleMenu);

    // Close menu when clicking outside or pressing ESC
    document.addEventListener("click", (e) => {
      if (navLinks.classList.contains("active") && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("active")) {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });

    // Close mobile menu on nav link click
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Active page highlight check
  const currentPath = window.location.pathname.toLowerCase();
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href) {
      const cleanHref = href.replace("../", "").replace("./", "").toLowerCase();
      if (currentPath.endsWith(cleanHref) && cleanHref !== "index.html") {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else if ((currentPath === "/" || currentPath.endsWith("index.html")) && cleanHref === "index.html") {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    }
  });
}

/* ==========================================================================
   3. Scroll Progress Bar & Back To Top Button
   ========================================================================== */
function initScrollIndicators() {
  // Ensure Scroll Progress bar element exists
  let progressBar = document.getElementById("scroll-progress");
  if (!progressBar) {
    progressBar = document.createElement("div");
    progressBar.id = "scroll-progress";
    document.body.prepend(progressBar);
  }

  // Ensure Back To Top button element exists
  let backToTopBtn = document.getElementById("back-to-top");
  if (!backToTopBtn) {
    backToTopBtn = document.createElement("button");
    backToTopBtn.id = "back-to-top";
    backToTopBtn.setAttribute("aria-label", "Back to top");
    backToTopBtn.innerHTML = "↑";
    document.body.appendChild(backToTopBtn);
  }

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (scrollHeight > 0) {
      const progress = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }

    if (scrollTop > 300) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* ==========================================================================
   4. Scroll Reveal Animations (IntersectionObserver)
   ========================================================================== */
function initScrollAnimations() {
  // Add reveal classes to sections and cards automatically if not present
  const targetElements = document.querySelectorAll(
    ".service-card, .gallery-item, .about-grid, .ticket-card, section > .container > h2"
  );

  targetElements.forEach((el, index) => {
    if (!el.classList.contains("reveal") && !el.classList.contains("reveal-zoom")) {
      el.classList.add("reveal");
      el.style.transitionDelay = `${(index % 4) * 0.1}s`;
    }
  });

  const observerOptions = {
    threshold: 0.12,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal, .reveal-zoom").forEach((el) => {
    observer.observe(el);
  });
}

/* ==========================================================================
   5. Professional Lightbox Gallery
   ========================================================================== */
function initLightbox() {
  const galleryItems = Array.from(document.querySelectorAll(".gallery-item img"));
  if (galleryItems.length === 0) return;

  // Build Lightbox DOM if not present
  let lightbox = document.getElementById("lightbox-modal");
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "lightbox-modal";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-label", "Image Lightbox");
    lightbox.innerHTML = `
      <button class="lightbox-btn lightbox-close" aria-label="Close Lightbox">&times;</button>
      <button class="lightbox-btn lightbox-prev" aria-label="Previous Image">&#10094;</button>
      <button class="lightbox-btn lightbox-next" aria-label="Next Image">&#10095;</button>
      <div class="lightbox-counter"></div>
      <div class="lightbox-content">
        <div class="lightbox-img-wrapper">
          <img class="lightbox-img" src="" alt="Enlarged view">
        </div>
        <div class="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector(".lightbox-img");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");
  const lightboxCounter = lightbox.querySelector(".lightbox-counter");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const prevBtn = lightbox.querySelector(".lightbox-prev");
  const nextBtn = lightbox.querySelector(".lightbox-next");

  let currentIndex = 0;

  const updateLightboxContent = (index) => {
    currentIndex = index;
    const imgEl = galleryItems[currentIndex];
    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt || "Gallery Image";
    lightboxCaption.textContent = imgEl.alt || "";
    lightboxCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
  };

  const openLightbox = (index) => {
    updateLightboxContent(index);
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  };

  const showNext = () => {
    const nextIdx = (currentIndex + 1) % galleryItems.length;
    updateLightboxContent(nextIdx);
  };

  const showPrev = () => {
    const prevIdx = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightboxContent(prevIdx);
  };

  // Event Listeners on Gallery Items
  galleryItems.forEach((img, idx) => {
    img.closest(".gallery-item").addEventListener("click", () => openLightbox(idx));
  });

  // Controls Event Listeners
  closeBtn.addEventListener("click", closeLightbox);
  nextBtn.addEventListener("click", showNext);
  prevBtn.addEventListener("click", showPrev);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("lightbox-content") || e.target.classList.contains("lightbox-img-wrapper")) {
      closeLightbox();
    }
  });

  // Disable touch move / scrolling gestures in lightbox
  lightbox.addEventListener("touchmove", (e) => {
    e.preventDefault();
  }, { passive: false });

  // Keyboard Shortcuts
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });
}

/* ==========================================================================
   6. Video Intersection Observer
   ========================================================================== */
function initVideoObserver() {
  const videos = document.querySelectorAll(".scroll-video");
  if (videos.length === 0) return;

  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Autoplay blocked silently
          });
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.4 }
  );

  videos.forEach((video) => {
    video.preload = "metadata";
    videoObserver.observe(video);
  });
}
