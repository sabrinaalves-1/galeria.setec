const daySelect = document.getElementById("daySelect");
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxDesc = document.getElementById("lightbox-desc");
const closeBtn = document.querySelector(".lightbox .close");

// Função para criar card
function createCard(foto) {
  const gallery = document.getElementById("gallery" + foto.dia);

  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${foto.src}" alt="foto">
    <div class="desc">${foto.desc || "Sem descrição"}</div>
  `;

  // Lightbox ao clicar
  card.querySelector("img").addEventListener("click", () => {
    lightbox.style.display = "flex";
    lightboxImg.src = foto.src;
    lightboxDesc.textContent = foto.desc || "Sem descrição";
  });

  gallery.appendChild(card);
}

// Fechar lightbox
closeBtn.addEventListener("click", () => {
  lightbox.style.display = "none";
});

// Clicar fora da imagem fecha também
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = "none";
  }
});

// Exemplo de adicionar imagem (pode adaptar com câmera/URL como antes)
addBtn.addEventListener("click", () => {
  const dia = daySelect.value;
  const foto = {
    src: "https://via.placeholder.com/300x200.png?text=Imagem",
    desc: "Exemplo de imagem",
    dia
  };

  createCard(foto);

  // Salvar no localStorage
  let fotos = JSON.parse(localStorage.getItem("fotos")) || [];
  fotos.push(foto);
  localStorage.setItem("fotos", JSON.stringify(fotos));
});

// Limpar tudo
clearBtn.addEventListener("click", () => {
  localStorage.removeItem("fotos");
  document.querySelectorAll(".gallery").forEach(g => g.innerHTML = "");
});

// Carregar salvas
function loadImages() {
  let fotos = JSON.parse(localStorage.getItem("fotos")) || [];
  fotos.forEach(f => createCard(f));
}
loadImages();

