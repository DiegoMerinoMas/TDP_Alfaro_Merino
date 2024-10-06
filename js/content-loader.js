export async function loadContent(course) {
  const fileName = course === "taller" ? "taller.md" : "seminario.md";
  // Usamos una ruta relativa al root del sitio
  const path = `/content/${fileName}`;

  console.log(`Intentando cargar el archivo: ${path}`);

  try {
    const response = await fetch(path);
    console.log("Respuesta del fetch:", response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    console.log("Contenido cargado:", text.substring(0, 100) + "...");

    if (text.trim().length === 0) {
      console.warn("El archivo está vacío");
    }

    return text;
  } catch (error) {
    console.error("Error al cargar el contenido:", error);
    console.error("Detalles del error:", error.message);

    // Si estamos en desarrollo local, intentamos cargar desde una ruta relativa
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      const localPath = `../content/${fileName}`;
      console.log(`Intentando cargar desde ruta local: ${localPath}`);
      try {
        const localResponse = await fetch(localPath);
        if (localResponse.ok) {
          const localText = await localResponse.text();
          console.log(
            "Contenido local cargado:",
            localText.substring(0, 100) + "..."
          );
          return localText;
        }
      } catch (localError) {
        console.error("Error al cargar el contenido local:", localError);
      }
    }

    return null;
  }
}
