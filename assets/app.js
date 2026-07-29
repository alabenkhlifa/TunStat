const root = document.documentElement;
const themeToggle = document.querySelector("[data-theme-toggle]");
const mobileMenuButton = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const themeMeta = document.querySelector('meta[name="theme-color"]');

function preferredTheme() {
  const saved = localStorage.getItem("tunstat-theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  const dark = theme === "dark";
  root.classList.toggle("dark", dark);
  root.style.colorScheme = theme;
  localStorage.setItem("tunstat-theme", theme);
  themeToggle?.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} mode`);
  themeToggle?.setAttribute("aria-pressed", String(dark));
  if (themeMeta) themeMeta.content = dark ? "#0b1210" : "#fafaf9";
}

applyTheme(preferredTheme());

themeToggle?.addEventListener("click", () => {
  applyTheme(root.classList.contains("dark") ? "light" : "dark");
});

mobileMenuButton?.addEventListener("click", () => {
  const open = !mobileMenu.classList.contains("hidden");
  mobileMenu.classList.toggle("hidden", open);
  mobileMenuButton.setAttribute("aria-expanded", String(!open));
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    mobileMenuButton?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});
