// Função para adicionar uma foto à galeria
function addPhoto() {
  const urlInput = document.getElementById('photoURL');
  let url = urlInput.value.trim();

  if (!url) {
    alert("Insira um link válido da imagem.");
    return;
  }

  // Converter link do Google Drive para link direto
  const driveFileIdMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  const driveOpenIdMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);

  if (driveFileIdMatch) {
    const fileId = driveFileIdMatch[1];
    url = `https://drive.google.com/uc?export=view&id=${fileId}`;
  } else if (driveOpenIdMatch) {
    const fileId = driveOpenIdMatch[1];
    url = `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  // Validar se é um link de imagem válido (extensões comuns ou url com drive-storage)
  const isValidImage = /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i.test(url) || url.includes("drive-storage") || url.includes("drive.google.com/uc");

  if (!isValidImage) {
    alert("Por favor, insira um link válido de imagem.");
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

    const description = document.createElement('p');
    description.innerText = 'Descrição da foto'; // Você pode adaptar para ter descrição real

    container.appendChild(img);
    container.appendChild(description);
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

// Função para abrir a câmera (para capturar foto)
function openCamera() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function(stream) {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        video.style.position = 'fixed';
        video.style.top = '50%';
        video.style.left = '50%';
        video.style.transform = 'translate(-50%, -50%)';
        video.style.zIndex = '1000';
        video.style.width = '300px';
        video.style.borderRadius = '10px';
        document.body.appendChild(video);

        // Botão para capturar foto
        const captureBtn = document.createElement('button');
        captureBtn.innerText = 'Capturar Foto';
        captureBtn.style.position = 'fixed';
        captureBtn.style.top = 'calc(50% + 180px)';
        captureBtn.style.left = '50%';
        captureBtn.style.transform = 'translateX(-50%)';
        captureBtn.style.zIndex = '1000';
        captureBtn.style.padding = '10px 20px';
        captureBtn.style.backgroundColor = '#5b33ab';
        captureBtn.style.color = '#fff';
        captureBtn.style.border = 'none';
        captureBtn.style.borderRadius = '5px';
        captureBtn.style.cursor = 'pointer';
        document.body.appendChild(captureBtn);

        captureBtn.onclick = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataURL = canvas.toDataURL('image/png');

          // Salvar no localStorage e atualizar galeria
          let photos = JSON.parse(localStorage.getItem('photos')) || [];
          photos.push(dataURL);
          localStorage.setItem('photos', JSON.stringify(photos));
          displayGallery();

          // Parar vídeo e remover elementos
          stream.getTracks().forEach(track => track.stop());
          video.remove();
          captureBtn.remove();
        };
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
