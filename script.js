const STORAGE_KEY = 'galeriaFotos_v1';
const galleryEl = document.getElementById('gallery');
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const btnAdd = document.getElementById('btnAdd');
const btnCamera = document.getElementById('btnCamera');
const btnFromUrl = document.getElementById('btnFromUrl');
const btnClearAll = document.getElementById('btnClearAll');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalDesc = document.getElementById('modalDesc');
const modalBackdrop = document.getElementById('modalBackdrop');
const closeModal = document.getElementById('closeModal');
const zoomIn = document.getElementById('zoomIn');
const zoomOut = document.getElementById('zoomOut');
let currentScale = 1;

let items = load();
render();

btnAdd.addEventListener('click', ()=> fileInput.click());
btnCamera.addEventListener('click', ()=>{
  fileInput.setAttribute('capture','environment');
  fileInput.click();
});
btnFromUrl.addEventListener('click', async ()=>{
  const url = prompt('Cole a URL da imagem:');
  if(!url) return;
  try{
    const added = await addImageFromUrl(url);
    if(added) alert('Imagem adicionada!');
  }catch(e){ alert('Erro: '+e.message); }
});
btnClearAll.addEventListener('click', ()=>{
  if(confirm('Remover todas as imagens?')){ items = []; save(); render(); }
});

fileInput.addEventListener('change', async (ev)=>{
  const files = Array.from(ev.target.files||[]);
  for(const f of files){ await addFile(f); }
  fileInput.value='';
});

['dragenter','dragover'].forEach(ev=>
  dropzone.addEventListener(ev, e=>{e.preventDefault();dropzone.classList.add('drag')} )
);
['dragleave','drop'].forEach(ev=>
  dropzone.addEventListener(ev,e=>{e.preventDefault();dropzone.classList.remove('drag')} )
);
dropzone.addEventListener('drop', async (e)=>{
  const dt = e.dataTransfer; if(!dt) return;
  const files = Array.from(dt.files||[]);
  for(const f of files) await addFile(f);
});
dropzone.addEventListener('click', ()=> fileInput.click());

modalBackdrop.addEventListener('click', closeModalFn);
closeModal.addEventListener('click', closeModalFn);
zoomIn.addEventListener('click', ()=>{
  currentScale = Math.min(3, currentScale+0.2);
  modalImg.style.transform = `scale(${currentScale})`;
});
zoomOut.addEventListener('click', ()=>{
  currentScale = Math.max(0.3, currentScale-0.2);
  modalImg.style.transform = `scale(${currentScale})`;
});

function openModal(item){
  modalImg.src = item.dataUrl;
  modalDesc.textContent = item.desc || ('Adicionada em '+ new Date(item.createdAt).toLocaleString());
  currentScale = 1; modalImg.style.transform='scale(1)';
  modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false');
}
function closeModalFn(){ modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); }

function load(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }
  catch(e){ return [] }
}
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }

async function addFile(file){
  if(!file.type.startsWith('image/')) return;
  const dataUrl = await fileToDataURL(file);
  const watermarked = await applyWatermark(dataUrl);
  const item = {id: randomId(), dataUrl: watermarked, desc: file.name, createdAt: Date.now()};
  items.unshift(item); save(); render();
}

async function addImageFromUrl(url){
  const res = await fetch(url);
  if(!res.ok) throw new Error('Falha no download');
  const blob = await res.blob();
  if(!blob.type.startsWith('image/')) throw new Error('Não é uma imagem');
  const dataUrl = await blobToDataURL(blob);
  const watermarked = await applyWatermark(dataUrl);
  const item = {id: randomId(), dataUrl: watermarked, desc: url, createdAt: Date.now()};
  items.unshift(item); save(); render();
  return true;
}

function fileToDataURL(file){
  return new Promise((res,rej)=>{
    const r = new FileReader();
    r.onload = ()=>res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}
function blobToDataURL(blob){
  return new Promise((res,rej)=>{
    const r = new FileReader();
    r.onload = ()=>res(r.result);
    r.onerror = rej;
    r.readAsDataURL(blob);
  });
}

function applyWatermark(dataUrl){
  return new Promise((res)=>{
    const img = new Image(); img.crossOrigin='anonymous';
    img.onload = ()=>{
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img,0,0);
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(20, img.height-60, img.width-40, 50);
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = Math.round(Math.max(12, img.width*0.02)) + 'px sans-serif';
      ctx.fillText('Galeria • Barbosa', 30, img.height-30);
      res(canvas.toDataURL('image/jpeg',0.9));
    };
    img.onerror = ()=>res(dataUrl);
    img.src = dataUrl;
  });
}

function randomId(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,8); }

function render(){
  galleryEl.innerHTML='';
  if(items.length===0){ galleryEl.innerHTML='<p>Nenhuma imagem</p>'; return }
  for(const item of items){
    const card = document.createElement('article'); card.className='card';
    const img = document.createElement('img'); img.src=item.dataUrl; img.alt=item.desc||'';
    img.addEventListener('click', ()=>openModal(item));
    const desc = document.createElement('div'); desc.className='desc'; desc.textContent=item.desc||'';
    const actions = document.createElement('div'); actions.className='actions';
    const btnDownload = document.createElement('button'); btnDownload.textContent='⬇';
    btnDownload.addEventListener('click', ()=>downloadDataUrl(item.dataUrl, (item.desc||'imagem')+'.jpg'));
    const btnRemove = document.createElement('button'); btnRemove.textContent='✖';
    btnRemove.addEventListener('click', ()=>{
      if(confirm('Remover esta imagem?')){
        items = items.filter(i=>i.id!==item.id); save(); render();
      }
    });
    actions.appendChild(btnDownload); actions.appendChild(btnRemove);
    card.appendChild(img); card.appendChild(actions); card.appendChild(desc);
    galleryEl.appendChild(card);
  }
}

function downloadDataUrl(dataUrl, filename){
  const a = document.createElement('a');
  a.href=dataUrl; a.download=filename;
  document.body.appendChild(a); a.click(); a.remove();
}

window.addEventListener('keydown',(e)=>{ if(e.key==='Escape') closeModalFn(); });
