// Adiciona uma imagem via link
function addPhoto() {
  const urlInput = document.getElementById('photoURL');
  const url = urlInput.value.trim();

  if (!url) {
    alert("Insira um link válido da imagem.");
    return;
  }

  // Validação básica de extensão de imagem
  const isImage = url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);
  if (!isImage) {
    alert("O link precisa ser de uma imagem válida (jpg, png, gif...).");
    return;
  }

  // Testa se a imagem carrega antes de adicionar
  const testImg = new Image();
  testImg.onload = () => {
    let photos = JSON.parse(localStorage.getItem('photos')) || [];
    photos.push(url);
    localStorage.setItem('photos', JSON.stringify(photos));
    displayGallery();
    urlInput.value = '';
  };
  testImg.onerror = () => {
    alert("Não foi possível carregar a imagem. Verifique o link.");
  };
  testImg.src = url;
}

// Remove uma imagem da galeria
function removePhoto(url) {
  let photos = JSON.parse(localStorage.getItem('photos')) || [];
  photos = photos.filter(photo => photo !== url);
  localStorage.setItem('photos', JSON.stringify(photos));
  displayGallery();
}

// Exibe todas as imagens da galeria
function displayGallery() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

  const photos = JSON.parse(localStorage.getItem('photos')) || [];

  photos.forEach(url => {
    const container = document.createElement('div');
    container.className = 'photo-container';

    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Foto da galeria';
    img.crossOrigin = 'anonymous';
    img.addEventListener('click', () => openModal(url));

    const description = document.createElement('p');
    description.innerText = 'Descrição da foto';

    const watermark = document.createElement('div');
    watermark.className = 'watermark';
    watermark.innerText = '© MinhaGaleria';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.innerText = 'Remover';
    removeBtn.onclick = () => removePhoto(url);

    container.appendChild(img);
    container.appendChild(description);
    container.appendChild(watermark);
    container.appendChild(removeBtn);

    gallery.appendChild(container);
  });
}

// Cria o modal de visualização
const modal = document.createElement('div');
modal.className = 'modal';
modal.addEventListener('click', () => modal.style.display = 'none');

const modalImg = document.createElement('img');
modal.appendChild(modalImg);
document.body.appendChild(modal);

// Abre o modal com a imagem
function openModal(url) {
  modalImg.src = url;
  modal.style.display = 'flex';
}

// Lida com imagem tirada da câmera ou galeria
function handleCameraPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const base64Image = e.target.result;

    let photos = JSON.parse(localStorage.getItem('photos')) || [];
    photos.push(base64Image);
    localStorage.setItem('photos', JSON.stringify(photos));
    displayGallery();
  };

  reader.readAsDataURL(file);
}

// Inicializa a galeria ao carregar a página
window.onload = function () {
  displayGallery();
};

