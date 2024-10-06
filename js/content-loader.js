export async function loadContent(course) {
  const fileName = course === "taller" ? "taller.md" : "seminario.md";
  const path = `../content/${fileName}`;

  console.log(`Intentando cargar el archivo: ${path}`);

  try {
    const response = await fetch(path);
    console.log("Respuesta del fetch:", response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    console.log("Contenido cargado:", text.substring(0, 100) + "..."); // Muestra los primeros 100 caracteres

    if (text.trim().length === 0) {
      console.warn("El archivo está vacío");
    }

    return text;
  } catch (error) {
    console.error("Error al cargar el contenido:", error);
    console.error("Detalles del error:", error.message);
    return null;
  }
}
