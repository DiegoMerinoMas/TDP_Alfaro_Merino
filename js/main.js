import { renderEditView } from "../views/editView.js";
import { renderRenderedView } from "../views/renderedView.js";
import { updatePreview } from "./preview.js";
import {
  initGitHubAuth,
  handleAuthCallback,
  saveToGitHub,
} from "./github-api.js";
import { loadContent } from "./content-loader.js";

const contentArea = document.getElementById("content-area");
let currentCourse = "taller";
let isAuthenticated = false;

async function switchToEditView() {
  contentArea.innerHTML = "";

  try {
    const content = await loadContent(currentCourse);

    if (content === null) {
      throw new Error("No se pudo cargar el contenido");
    }

    contentArea.appendChild(renderEditView(content));
    updateButtonStates("edit");

    // Asegurarse de que la vista previa se actualice después de renderizar
    setTimeout(() => {
      const editor = document.getElementById("editor");
      if (editor) {
        updatePreview(editor.value);
      }
    }, 0);
  } catch (error) {
    console.error("Error al cambiar a vista de edición:", error);
    contentArea.innerHTML = `<p>Error al cargar el contenido: ${error.message}</p>`;
  }
}

async function switchToRenderedView() {
  contentArea.innerHTML = "";

  try {
    const content = await loadContent(currentCourse);

    if (content === null) {
      throw new Error("No se pudo cargar el contenido");
    }

    contentArea.appendChild(renderRenderedView(content));
    updateButtonStates("view");
  } catch (error) {
    console.error("Error al cambiar a vista renderizada:", error);
    contentArea.innerHTML = `<p>Error al cargar el contenido: ${error.message}</p>`;
  }
}

function updateButtonStates(activeView) {
  document.querySelectorAll("#sidebar button").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.getElementById(`${activeView}Button`).classList.add("active");
}

async function switchCourse(course) {
  currentCourse = course;
  localStorage.setItem("currentCourse", course);
  document.querySelectorAll("#course-selector button").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.getElementById(`${course}-btn`).classList.add("active");
  await switchToRenderedView();
}

document.addEventListener("DOMContentLoaded", async () => {
  const savedCourse = localStorage.getItem("currentCourse") || "taller";
  await switchCourse(savedCourse);

  const authCode = localStorage.getItem("github_auth_code");
  if (authCode) {
    localStorage.removeItem("github_auth_code");
    isAuthenticated = await handleAuthCallback(authCode);
    updateAuthUI();
  }
});

function updateAuthUI() {
  const saveButton = document.getElementById("saveButton");
  saveButton.textContent = isAuthenticated
    ? "Guardar"
    : "Guardar (requiere autenticación)";
  saveButton.disabled = false;
}

document
  .getElementById("editButton")
  .addEventListener("click", switchToEditView);
document
  .getElementById("viewButton")
  .addEventListener("click", switchToRenderedView);
document.getElementById("saveButton").addEventListener("click", async () => {
  const editor = document.getElementById("editor");
  if (editor) {
    await saveToGitHub(editor.value, currentCourse);
  } else {
    alert("No hay contenido para guardar.");
  }
});

document.getElementById("saveButton").addEventListener("click", async () => {
  if (!isAuthenticated) {
    // Iniciar el proceso de autenticación
    initGitHubAuth();
    return;
  }

  const editor = document.getElementById("editor");
  if (editor) {
    const success = await saveToGitHub(editor.value, currentCourse);
    if (success) {
      alert("Contenido guardado exitosamente.");
    }
  } else {
    alert("No hay contenido para guardar.");
  }
});

document
  .getElementById("taller-btn")
  .addEventListener("click", () => switchCourse("taller"));
document
  .getElementById("seminario-btn")
  .addEventListener("click", () => switchCourse("seminario"));

export { switchToEditView, switchToRenderedView, currentCourse };
