export function renderNav() {
  const nav = document.createElement("nav");
  nav.className = "fade-in";

  const ul = document.createElement("ul");

  const items = [
    { text: "Ver", id: "viewButton", class: "active" },
    { text: "Editar", id: "editButton" },
    { text: "Guardar", id: "saveButton" },
  ];

  items.forEach((item) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.textContent = item.text;
    button.id = item.id;
    if (item.class) {
      button.classList.add(item.class);
    }
    li.appendChild(button);
    ul.appendChild(li);
  });

  nav.appendChild(ul);
  return nav;
}
