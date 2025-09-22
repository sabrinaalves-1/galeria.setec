const daySelect = document.getElementById("daySelect");
const fileInput = document.getElementById("fileInput");
const descInput = document.getElementById("descInput");
const addBtn = document.getElementById("addBtn");

// Função para criar card
function createCard(foto) {
  const gallery = document.getElementById("gallery" + foto.dia);

  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${foto.src}" alt="foto">
    <div class="desc">${foto.desc || "Sem descrição"}</div>
    <div class="actions">
      <button class="remove">🗑</button>
    </div>
  `;

  // Remover imagem
  card.querySelector(".remove").addEventListener("click", () => {
    card.remove();
    let fotos = JSON.parse(localStorage.getItem("fotos")) || [];
    fotos = fotos.filter(f => !(f.src === foto.src && f.dia === foto.dia));
    localStorage.setItem("fotos", JSON.stringify(fotos));
  });

  gallery.appendChild(card);
}

// Adicionar nova imagem
addBtn.addEventListener("click", () => {
  const file = fileInput.files[0];
  const desc = descInput.value;
  const dia = daySelect.value;

  if (!file) {
    alert("Selecione uma imagem primeiro!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const foto = { src: e.target.result, desc, dia };
    createCard(foto);

    // Salva no localStorage
    let fotos = JSON.parse(localStorage.getItem("fotos")) || [];
    fotos.push(foto);
    localStorage.setItem("fotos", JSON.stringify(fotos));

    // Limpa campos
    fileInput.value = "";
    descInput.value = "";
  };
  reader.readAsDataURL(file);
});

// Carregar imagens salvas
function loadImages() {
  let fotos = JSON.parse(localStorage.getItem("fotos")) || [];
  fotos.forEach(f => createCard(f));
}
loadImages();
