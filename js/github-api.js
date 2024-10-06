const CLIENT_ID = "Ov23liiB7IPy9NBPuIjt";
const REDIRECT_URI = "https://diegomerinomas.github.io/thesis_tracker_Alfaro_Merino/";
const REPO_OWNER = "DiegoMerinoMas";
const REPO_NAME = "thesis_tracker_Alfaro_Merino";

let accessToken = null;

export function initGitHubAuth() {
  const scopes = "repo";
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${scopes}`;
  window.location.href = authUrl;
}

export async function handleAuthCallback() {
  const code = new URLSearchParams(window.location.search).get("code");
  if (code) {
    try {
      // Aquí normalmente intercambiarías el código por un token de acceso
      // Como no tenemos un backend, simularemos este paso
      accessToken = "simulated_access_token";

      const hasAccess = await checkRepositoryAccess();
      if (hasAccess) {
        console.log(
          "Autenticación exitosa. Usuario tiene acceso al repositorio."
        );
        return true;
      } else {
        console.log("Usuario no tiene acceso al repositorio.");
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

async function checkRepositoryAccess() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`,
      {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      }
    );
    return response.ok;
  } catch (error) {
    console.error("Error al verificar acceso al repositorio:", error);
    return false;
  }
}

export function isAuthenticated() {
  return !!accessToken;
}

export function getAccessToken() {
  return accessToken;
}

export async function saveToGitHub(content, course) {
  if (!accessToken) {
    throw new Error("No hay token de acceso. Se requiere autenticación.");
  }

  const fileName = course === "taller" ? "taller.md" : "seminario.md";
  const path = `content/${fileName}`;

  try {
    const currentFile = await getFileContent(path);
    const sha = currentFile ? currentFile.sha : null;

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
          content: btoa(content),
          sha: sha,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save file");
    }

    console.log("Contenido guardado exitosamente en GitHub.");
    return true;
  } catch (error) {
    console.error("Error al guardar en GitHub:", error);
    throw error;
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
    throw error;
  }
}
