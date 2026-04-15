const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    const hidden = mobileMenu.classList.toggle("hidden");
    menuBtn.setAttribute("aria-expanded", String(!hidden));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll("[data-services-toggle]").forEach((button) => {
  const panel = button.nextElementSibling;
  const icon = button.querySelector("[data-services-icon]");

  if (!panel || !panel.hasAttribute("data-services-panel")) return;

  button.setAttribute("aria-expanded", "false");

  button.addEventListener("click", () => {
    const hidden = panel.classList.toggle("hidden");
    button.setAttribute("aria-expanded", String(!hidden));

    if (icon) {
      icon.classList.toggle("rotate-180", !hidden);
    }
  });
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
  );
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll(".validate-form").forEach((form) => {
  const message = form.querySelector(".form-message");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let valid = true;

    form.querySelectorAll("input, textarea").forEach((input) => {
      input.classList.remove("border-red-500");
      const value = input.value.trim();
      if (!value) {
        valid = false;
        input.classList.add("border-red-500");
        return;
      }
      if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        valid = false;
        input.classList.add("border-red-500");
      }
    });

    if (!message) return;

    if (!valid) {
      message.textContent = "Please complete all fields correctly.";
      message.classList.remove("hidden", "bg-emerald-50", "text-emerald-700");
      message.classList.add("bg-red-50", "text-red-700");
      return;
    }

    message.textContent = form.dataset.success || "Thanks! Your request is ready to be reviewed.";
    message.classList.remove("hidden", "bg-red-50", "text-red-700");
    message.classList.add("bg-emerald-50", "text-emerald-700");
    form.reset();
  });
});

document.querySelectorAll("[data-testimonial-carousel]").forEach((carousel) => {
  const track = carousel.querySelector("[data-carousel-track]");
  const originalSlides = Array.from(track?.children || []);
  if (!track || originalSlides.length < 2) return;

  let visibleCount = window.matchMedia("(min-width: 1024px)").matches ? 3 : 1;
  let index = visibleCount;
  let autoTimer = null;
  let startX = 0;
  let currentX = 0;
  let startTranslate = 0;
  let isDragging = false;
  let resizeTimer = null;

  const getCardWidth = () => {
    const firstCard = track.children[0];
    return firstCard ? firstCard.getBoundingClientRect().width : 0;
  };

  const updatePosition = (animate = true) => {
    const width = getCardWidth();
    track.style.transition = animate ? "transform .55s ease" : "none";
    track.style.transform = `translateX(-${index * width}px)`;
  };

  const rebuildTrack = () => {
    visibleCount = window.matchMedia("(min-width: 1024px)").matches ? 3 : 1;
    track.innerHTML = "";

    const prepend = originalSlides.slice(-visibleCount).map((slide) => {
      const clone = slide.cloneNode(true);
      clone.dataset.clone = "true";
      return clone;
    });

    const append = originalSlides.slice(0, visibleCount).map((slide) => {
      const clone = slide.cloneNode(true);
      clone.dataset.clone = "true";
      return clone;
    });

    [...prepend, ...originalSlides.map((slide) => slide.cloneNode(true)), ...append].forEach((slide) => {
      track.appendChild(slide);
    });

    index = visibleCount;
    updatePosition(false);
  };

  const setSlide = (nextIndex, animate = true) => {
    index = nextIndex;
    updatePosition(animate);
  };

  const startAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => setSlide(index + visibleCount), 3500);
  };

  const stopAuto = () => {
    clearInterval(autoTimer);
  };

  const pointerDown = (clientX) => {
    isDragging = true;
    startX = clientX;
    currentX = clientX;
    startTranslate = -index * getCardWidth();
    stopAuto();
    track.style.transition = "none";
  };

  const pointerMove = (clientX) => {
    if (!isDragging) return;
    currentX = clientX;
    const delta = currentX - startX;
    track.style.transform = `translateX(${startTranslate + delta}px)`;
  };

  const pointerUp = () => {
    if (!isDragging) return;
    isDragging = false;
    const delta = currentX - startX;
    if (Math.abs(delta) > 60) {
      setSlide(index + (delta < 0 ? visibleCount : -visibleCount));
    } else {
      setSlide(index);
    }
    startAuto();
  };

  track.addEventListener("transitionend", () => {
    const totalRealSlides = originalSlides.length;
    if (index >= totalRealSlides + visibleCount) {
      index = visibleCount;
      updatePosition(false);
    } else if (index < visibleCount) {
      index = totalRealSlides;
      updatePosition(false);
    }
  });

  carousel.addEventListener("mouseenter", stopAuto);
  carousel.addEventListener("mouseleave", startAuto);

  carousel.addEventListener("touchstart", (event) => {
    pointerDown(event.touches[0].clientX);
  }, { passive: true });

  carousel.addEventListener("touchmove", (event) => {
    pointerMove(event.touches[0].clientX);
  }, { passive: true });

  carousel.addEventListener("touchend", pointerUp);

  carousel.addEventListener("mousedown", (event) => {
    pointerDown(event.clientX);
  });

  window.addEventListener("mousemove", (event) => {
    pointerMove(event.clientX);
  });

  window.addEventListener("mouseup", pointerUp);

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      stopAuto();
      rebuildTrack();
      startAuto();
    }, 120);
  });

  rebuildTrack();
  startAuto();
});
