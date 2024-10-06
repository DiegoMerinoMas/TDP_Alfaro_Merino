export function renderRenderedView(content) {
  const container = document.createElement("div");
  container.className = "rendered-view";

  const renderedContent = document.createElement("div");
  renderedContent.innerHTML = marked(content || "");

  container.appendChild(renderedContent);

  return container;
}
