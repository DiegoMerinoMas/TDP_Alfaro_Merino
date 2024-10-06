export function renderHeader() {
  const header = document.createElement("header");
  header.className = "slide-in";

  const title = document.createElement("h1");
  title.textContent = "Thesis Tracker";

  header.appendChild(title);
  return header;
}
