import {
  initGitHubAuth,
  handleAuthCallback,
  isAuthenticated,
} from "./github-api.js";
import { renderEditView } from "../views/editView.js";
import { renderRenderedView } from "../views/renderedView.js";
import { loadContent } from "./content-loader.js";

const loginContainer = document.getElementById("login-container");
const contentContainer = document.getElementById("content-container");
const loginButton = document.getElementById("login-button");

let currentCourse = "taller";

async function init() {
  if (await handleAuthCallback()) {
    showContent();
  } else {
    showLogin();
  }
}

function showLogin() {
  loginContainer.style.display = "block";
  contentContainer.style.display = "none";
}

function showContent() {
  loginContainer.style.display = "none";
  contentContainer.style.display = "block";
  renderApp();
}

function renderApp() {
  contentContainer.innerHTML = `
        <nav>
            <button id="taller-btn">Taller de Desempeño Prof.</button>
            <button id="seminario-btn">Seminario de Inv. Académica II</button>
        </nav>
        <div id="view-buttons">
            <button id="view-btn">Ver</button>
            <button id="edit-btn">Editar</button>
        </div>
        <div id="content-area"></div>
    `;

  attachEventListeners();
  switchCourse(currentCourse);
}

function attachEventListeners() {
  document
    .getElementById("taller-btn")
    .addEventListener("click", () => switchCourse("taller"));
  document
    .getElementById("seminario-btn")
    .addEventListener("click", () => switchCourse("seminario"));
  document
    .getElementById("view-btn")
    .addEventListener("click", () => switchToRenderedView());
  document
    .getElementById("edit-btn")
    .addEventListener("click", () => switchToEditView());
}

async function switchCourse(course) {
  currentCourse = course;
  await switchToRenderedView();
}

async function switchToRenderedView() {
  const contentArea = document.getElementById("content-area");
  contentArea.innerHTML = "<p>Cargando contenido...</p>";

  try {
    const content = await loadContent(currentCourse);
    if (content) {
      contentArea.innerHTML = "";
      contentArea.appendChild(renderRenderedView(content));
    } else {
      contentArea.innerHTML = "<p>No se pudo cargar el contenido.</p>";
    }
  } catch (error) {
    contentArea.innerHTML = `<p>Error al cargar el contenido: ${error.message}</p>`;
  }
}

async function switchToEditView() {
  const contentArea = document.getElementById("content-area");
  contentArea.innerHTML = "<p>Cargando editor...</p>";

  try {
    const content = await loadContent(currentCourse);
    contentArea.innerHTML = "";
    contentArea.appendChild(renderEditView(content));
  } catch (error) {
    contentArea.innerHTML = `<p>Error al cargar el editor: ${error.message}</p>`;
  }
}

loginButton.addEventListener("click", initGitHubAuth);

document.addEventListener("DOMContentLoaded", init);
