export async function loadContent(course) {
  const fileName = course === "taller" ? "taller.md" : "seminario.md";
  // Usamos una ruta relativa al root del sitio
  const path = `/content/${fileName}`;

  try {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();

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
      try {
        const localResponse = await fetch(localPath);
        if (localResponse.ok) {
          const localText = await localResponse.text();
          return localText;
        }
      } catch (localError) {
        console.error("Error al cargar el contenido local:", localError);
      }
    }

    return null;
  }
}
