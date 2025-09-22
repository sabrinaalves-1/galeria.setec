// Função para adicionar uma foto à galeria
function addPhoto() {
  const urlInput = document.getElementById('photoURL');
  const url = urlInput.value.trim();

  if (!url) {
    alert("Insira um link válido da imagem.");
    return;
  }

  // Salvar a nova URL no localStorage
  let photos = JSON.parse(localStorage.getItem('photos')) || [];
  photos.push(url);
  localStorage.setItem('photos', JSON.stringify(photos));

  // Atualizar a galeria
  displayGallery();

  // Limpar o campo de entrada
  urlInput.value = '';
}

// Função para remover uma imagem
function removePhoto(url) {
  let photos = JSON.parse(localStorage.getItem('photos')) || [];
  photos = photos.filter(photo => photo !== url); // Remove a URL da lista

  // Atualizar o localStorage
  localStorage.setItem('photos', JSON.stringify(photos));

  // Atualizar a galeria
  displayGallery();
}

// Função para exibir as fotos da galeria
function displayGallery() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = ''; // Limpa a galeria antes de repopular

  // Recuperar as fotos do localStorage
  const photos = JSON.parse(localStorage.getItem('photos')) || [];

  photos.forEach(url => {
    const container = document.createElement('div');
    container.className = 'photo-container';

    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Foto da galeria';
    img.crossOrigin = 'anonymous';

    // Clique para ampliar
    img.addEventListener('click', () => openModal(url));

    const watermark = document.createElement('div');
    watermark.className = 'watermark';
    watermark.innerText = '© MinhaGaleria';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.innerText = 'Remover';
    removeBtn.onclick = () => removePhoto(url);

    container.appendChild(img);
    container.appendChild(watermark);
    container.appendChild(removeBtn);
    gallery.appendChild(container);
  });
}

// Função para abrir a imagem no modal
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

// Inicializa a galeria ao carregar a página
window.onload = function() {
  displayGallery();
};
