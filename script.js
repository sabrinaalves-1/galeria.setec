// Função para adicionar uma foto à galeria a partir de URL
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

// Função para remover uma imagem da galeria
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
    description.innerText = 'Descrição da foto'; // Aqui você pode personalizar

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
        // Criar container para vídeo e botões
        const cameraContainer = document.createElement('div');
        cameraContainer.style.position = 'fixed';
        cameraContainer.style.top = '50%';
        cameraContainer.style.left = '50%';
        cameraContainer.style.transform = 'translate(-50%, -50%)';
        cameraContainer.style.zIndex = '10000';
        cameraContainer.style.backgroundColor = '#000';
        cameraContainer.style.padding = '10px';
        cameraContainer.style.borderRadius = '10px';
        cameraContainer.style.textAlign = 'center';
        cameraContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        document.body.appendChild(cameraContainer);

        // Criar vídeo
        const video = document.createElement('video');
        video.autoplay = true;
        video.srcObject = stream;
        video.style.width = '320px';
        video.style.borderRadius = '8px';
        cameraContainer.appendChild(video);

        // Botão capturar foto
        const captureBtn = document.createElement('button');
        captureBtn.innerText = 'Capturar Foto';
        captureBtn.style.marginTop = '10px';
        captureBtn.style.padding = '10px 20px';
        captureBtn.style.fontSize = '16px';
        captureBtn.style.cursor = 'pointer';
        captureBtn.style.borderRadius = '5px';
        captureBtn.style.border = 'none';
        captureBtn.style.backgroundColor = '#5b33ab';
        captureBtn.style.color = '#fff';
        cameraContainer.appendChild(captureBtn);

        // Botão fechar câmera
        const closeBtn = document.createElement('button');
        closeBtn.innerText = 'Fechar';
        closeBtn.style.marginTop = '10px';
        closeBtn.style.marginLeft = '10px';
        closeBtn.style.padding = '10px 20px';
        closeBtn.style.fontSize = '16px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.borderRadius = '5px';
        closeBtn.style.border = 'none';
        closeBtn.style.backgroundColor = '#FF4081';
        closeBtn.style.color = '#fff';
        cameraContainer.appendChild(closeBtn);

        captureBtn.onclick = () => {
          // Criar canvas para capturar frame
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Transformar em base64
          const dataURL = canvas.toDataURL('image/png');

          // Salvar no localStorage e atualizar galeria
          let photos = JSON.parse(localStorage.getItem('photos')) || [];
          photos.push(dataURL);
          localStorage.setItem('photos', JSON.stringify(photos));
          displayGallery();

          // Parar a câmera e remover container
          stream.getTracks().forEach(track => track.stop());
          cameraContainer.remove();
        };

        closeBtn.onclick = () => {
          // Parar a câmera e remover container
          stream.getTracks().forEach(track => track.stop());
          cameraContainer.remove();
        };

      })
      .catch(function(error) {
        alert("Não foi possível acessar a câmera. Verifique as permissões.");
      });
  } else {
    alert("Câmera não suportada neste navegador.");
  }
}

// Inicializa a galeria ao carregar a página
window.onload = function() {
  displayGallery();
};

