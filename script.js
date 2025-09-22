const daySelect = document.getElementById("daySelect");
const addBtn = document.getElementById("addBtn");
const cameraBtn = document.getElementById("cameraBtn");
const urlBtn = document.getElementById("urlBtn");
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
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.style.display = "none";
});

// Salvar no localStorage
function saveFoto(foto) {
  let fotos = JSON.parse(localStorage.getItem("fotos")) || [];
  fotos.push(foto);
  localStorage.setItem("fotos", JSON.stringify(fotos));
}

// Adicionar imagem de exemplo
addBtn.addEventListener("click", () => {
  const dia = daySelect.value;
  const foto = {
    src: "https://via.placeholder.com/300x200.png?text=Imagem",
    desc: "Exemplo de imagem",
    dia
  };
  createCard(foto);
  saveFoto(foto);
});

// Adicionar por URL
urlBtn.addEventListener("click", () => {
  const url = prompt("Cole a URL da imagem:");
  if (!url) return;
  const desc = prompt("Digite uma descrição (opcional):");
  const dia = daySelect.value;
  const foto = { src: url, desc, dia };
  createCard(foto);
  saveFoto(foto);
});

// Captura da câmera
cameraBtn.addEventListener("click", async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Câmera não suportada neste dispositivo.");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.createElement("video");
    video.srcObject = stream;
    video.play();

    const capture = confirm("Aperte OK para capturar uma foto da câmera.");
    if (capture) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      const dia = daySelect.value;
      const foto = {
        src: canvas.toDataURL("image/png"),
        desc: "Foto da câmera",
        dia
      };
      createCard(foto);
      saveFoto(foto);
    }
    stream.getTracks().forEach(track => track.stop());
  } catch (err) {
    alert("Erro ao acessar a câmera: " + err);
  }
});

// Limpar tudo
clearBtn.addEventListener("click", () => {
  if (!confirm("Tem certeza que deseja limpar todas as fotos?")) return;
  localStorage.removeItem("fotos");
  document.querySelectorAll(".gallery").forEach(g => g.innerHTML = "");
});

// Carregar imagens salvas
function loadImages() {
  let fotos = JSON.parse(localStorage.getItem("fotos")) || [];
  fotos.forEach(f => createCard(f));
}
loadImages();
