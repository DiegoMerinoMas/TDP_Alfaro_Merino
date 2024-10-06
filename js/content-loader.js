export async function loadContent(course) {
  const fileName = course === "taller" ? "taller.json" : "seminario.json";
  const path = `content/${fileName}`;

  console.log(`Intentando cargar el archivo: ${path}`);

  try {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const decodedContent = atob(data.content);
    console.log("Contenido cargado:", decodedContent.substring(0, 100) + "...");

    return decodedContent;
  } catch (error) {
    console.error("Error al cargar el contenido:", error);
    throw error;
  }
}
