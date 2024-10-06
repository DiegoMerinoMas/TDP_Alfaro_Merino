const CLIENT_ID = "Ov23liiB7IPy9NBPuIjt";
const REDIRECT_URI = "https://tu-github-pages-url.com";
const REPO_OWNER = "DiegoMerinoMas";
const REPO_NAME = "thesis_tracker_Alfaro_Merino";

let accessToken = null;

export function initGitHubAuth() {
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo`;
  window.location.href = authUrl;
}

export async function handleAuthCallback() {
  const code = new URLSearchParams(window.location.search).get("code");
  if (code) {
    try {
      // Nota: Este paso normalmente requiere un backend por seguridad
      // Aquí simulamos la obtención del token
      accessToken = "simulated_access_token";

      const isCollaborator = await checkCollaboratorStatus();
      if (isCollaborator) {
        alert("Autenticación exitosa. Usuario autorizado.");
        return true;
      } else {
        alert("Usuario no es colaborador del repositorio.");
        accessToken = null;
        return false;
      }
    } catch (error) {
      console.error("Error en la autenticación:", error);
      return false;
    }
  }
  return false;
}

async function checkCollaboratorStatus() {
  const response = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/collaborators`,
    {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to check collaborator status");
  }
  const collaborators = await response.json();
  const user = await getAuthenticatedUser();
  return collaborators.some(
    (collaborator) => collaborator.login === user.login
  );
}

async function getAuthenticatedUser() {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to get user info");
  }
  return response.json();
}

export async function saveToGitHub(content, course) {
  if (!accessToken) {
    alert("Por favor, autentícate primero.");
    return false;
  }

  const fileName = course === "taller" ? "taller.md" : "seminario.md";
  const path = `content/${fileName}`;

  try {
    // Obtener el SHA del archivo existente
    const currentFile = await getFileContent(path);
    const sha = currentFile ? currentFile.sha : null;

    // Crear o actualizar el archivo
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Update ${fileName}`,
          content: btoa(content), // Codifica el contenido en base64
          sha: sha, // Necesario para actualizar un archivo existente
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save file");
    }

    alert("Contenido guardado exitosamente en GitHub.");
    return true;
  } catch (error) {
    console.error("Error al guardar en GitHub:", error);
    alert("Error al guardar el contenido. Por favor, intenta de nuevo.");
    return false;
  }
}

async function getFileContent(path) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
      {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      if (response.status === 404) {
        return null; // El archivo no existe
      }
      throw new Error("Failed to get file content");
    }
    return response.json();
  } catch (error) {
    console.error("Error al obtener el contenido del archivo:", error);
    return null;
  }
}
