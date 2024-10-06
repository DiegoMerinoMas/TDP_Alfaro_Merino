const REPO_OWNER = "TU_NOMBRE_DE_USUARIO";
const REPO_NAME = "thesis-tracker";

let accessToken = null;

export function initGitHubAuth() {
  // Simular autenticación
  accessToken = "github_pat_TU_TOKEN_PERSONAL_AQUI";
  return true;
}

export async function saveToGitHub(content, course) {
  if (!accessToken) {
    alert("Por favor, autentícate primero.");
    return;
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
  } catch (error) {
    console.error("Error al guardar en GitHub:", error);
    alert("Error al guardar el contenido. Por favor, intenta de nuevo.");
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
