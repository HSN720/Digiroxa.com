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
