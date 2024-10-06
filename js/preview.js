export function updatePreview(content) {
  console.log("Actualizando vista previa con contenido:", content);

  const preview = document.getElementById("preview");
  if (!preview) {
    console.error("Elemento de vista previa no encontrado");
    return;
  }

  // Asegurarse de que content sea una cadena, incluso si está vacío
  const safeContent = (content || "").toString();

  // Usamos marked como una función global
  preview.innerHTML = marked(safeContent);
  console.log("HTML de la vista previa actualizado:", preview.innerHTML);
}
