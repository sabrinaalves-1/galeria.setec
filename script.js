// Adicionar imagem por link
function addPhoto() {
  const urlInput = document.getElementById('photoURL');
  const url = urlInput.value.trim();

  if (!url) {
    alert("Insira um link válido da imagem.");
    return;
  }

  let photos = JSON.parse(localStorage.getItem('photos')) || [];
  photos.push(url);
  localStorage.setItem('photos', JSON.stringify(photos));

  displayGallery();
  urlInput.value = '';
}

// Remover imagem
function removePhoto(url) {
  let photos = JSON.parse(localStorage.getItem('photos')) || [];
  photos = photos.filter(photo => photo !== url);
  localStorage.setItem('photos', JSON.stringify(photos));
  displayGallery();
}

// Exibir galeria
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

// Modal
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

// Tirar foto com a câmera ou galeria
function handleCameraPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const base64Image = e.target.result;

    let photos = JSON.parse(localStorage.getItem('photos')) || [];
    photos.push(base64Image);
    localStorage.setItem('photos
