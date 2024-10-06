import { getAccessToken } from "./github-api.js";

export async function loadContent(course) {
  const fileName = course === "taller" ? "taller.md" : "seminario.md";
  const path = `content/${fileName}`;
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("No hay token de acceso. Se requiere autenticación.");
  }

  console.log(`Intentando cargar el archivo: ${path}`);

  try {
    const response = await fetch(
      `https://api.github.com/repos/diegomerinomas/thesis-tracker-Alfaro-Merino/contents/${path}`,
      {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: "application/vnd.github.v3.raw",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    console.log("Contenido cargado:", text.substring(0, 100) + "...");

    return text;
  } catch (error) {
    console.error("Error al cargar el contenido:", error);
    throw error;
  }
}
