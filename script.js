document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = Array.from(document.querySelectorAll(".navlinks a"));
  const sections = navLinks
    .map((link) => document.querySelector(link.hash))
    .filter(Boolean);

  if (!("IntersectionObserver" in window)) return;

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) =>
          link.classList.toggle("active", link.hash === "#" + entry.target.id)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((section) => spy.observe(section));

  const revealer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        revealer.unobserve(el);
        el.classList.add("in");
        const settle = () => el.classList.remove("reveal", "in");
        el.addEventListener("transitionend", settle, { once: true });
        setTimeout(settle, 700);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  document
    .querySelectorAll(".card, .stack-col, .tl-item, .panel-box, .contact-panel")
    .forEach((el) => {
      el.classList.add("reveal");
      revealer.observe(el);
    });

  // Filter project cards without requiring a page reload.
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      document.querySelectorAll(".filter-btn").forEach((item) => {
        const selected = item === button;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      document.querySelectorAll("#work .card").forEach((card) => {
        const categories = (card.dataset.category || "").split(/\s+/);
        card.hidden = filter !== "all" && !categories.includes(filter);
      });
    });
  });
});
