function addPhoto() {
  const urlInput = document.getElementById('photoURL');
  const url = urlInput.value.trim();

  if (!url) {
    alert("Insira um link válido da imagem.");
    return;
  }

  const gallery = document.getElementById('gallery');

  const container = document.createElement('div');
  container.className = 'photo-container';

  const img = document.createElement('img');
  img.src = url;
  img.alt = 'Foto da galeria';
  img.crossOrigin = 'anonymous'; // necessário para evitar problemas com CORS

  // clique para ampliar
  img.addEventListener('click', () => openModal(url));

  const watermark = document.createElement('div');
  watermark.className = 'watermark';
  watermark.innerText = '© MinhaGaleria';

  container.appendChild(img);
  container.appendChild(watermark);
  gallery.appendChild(container);

  urlInput.value = ''; // limpa o campo
}

// Modal para ampliar
const modal = document.createElement('div');
modal.className = 'modal';
modal.addEventListener('click', () => modal.style.display = 'none');

const modalImg = document.createElement('img');
modal.appendChild(modalImg);
document.body.appendChild(modal);

function openModal(url) {
  modalImg.src = url;
  modal.style.display = 'flex';
}
