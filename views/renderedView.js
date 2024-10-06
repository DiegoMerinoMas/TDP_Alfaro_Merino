export function renderRenderedView(content) {
  console.log("Renderizando vista con contenido:", content);

  const container = document.createElement("div");
  container.className = "rendered-view";

  const renderedContent = document.createElement("div");
  renderedContent.innerHTML = marked(content || "");
  console.log("HTML renderizado:", renderedContent.innerHTML);

  container.appendChild(renderedContent);

  return container;
}
