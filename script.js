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

    // Adicionar descrição
    const description = document.createElement('p');
    description.textContent = 'Descrição da foto';

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

// Função para abrir a câmera (para capturar foto)
function openCamera() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function(stream) {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        document.body.appendChild(video);
      })
      .catch(function(error) {
        alert("Não foi possível acessar a câmera.");
      });
  } else {
    alert("Câmera não suportada neste navegador.");
  }
}

// Inicializa a galeria ao carregar a página
window.onload = function() {
  displayGallery();
};
