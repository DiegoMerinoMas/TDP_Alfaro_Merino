export function createEditor(course) {
  const editor = document.createElement("textarea");
  editor.id = "editor";
  editor.placeholder = "Escribe tu contenido en Markdown aquí...";

  const savedContent = localStorage.getItem(`editorContent-${course}`);
  if (savedContent) {
    editor.value = savedContent;
  } else {
    //editor.value
  }

  return editor;
}

function updatePreview() {
  const preview = document.getElementById("preview");
  const editorContent = document.getElementById("editor").value;
  preview.innerHTML = marked(editorContent);
}
