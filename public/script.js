const STORAGE_KEY = 'galeriaFotos_v3';
const galleries = [
  document.getElementById('gallery1'),
  document.getElementById('gallery2'),
  document.getElementById('gallery3')
];
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
const closeModalBtn = document.getElementById('closeModal');
const zoomIn = document.getElementById('zoomIn');
const zoomOut = document.getElementById('zoomOut');

let currentScale = 1;
const maxScale = 3;
const minScale = 0.3;

let items = JSON.parse(localStorage.getItem(STORAGE_KEY))||[];
render();

// --- Eventos principais ---
btnAdd.addEventListener('click', ()=>fileInput.click());
btnCamera.addEventListener('click', ()=>{
  fileInput.setAttribute('capture','environment');
  fileInput.click();
});
btnFromUrl.addEventListener('click', async ()=>{
  const url = prompt('Cole a URL da imagem:');
  if(!url) return;
  try{ await addImageFromUrl(url); alert('Imagem adicionada!'); }catch(e){ alert('Erro: '+e.message); }
});
btnClearAll.addEventListener('click', ()=>{
  if(confirm('Remover todas as imagens?')){ items=[]; save(); render(); }
});

fileInput.addEventListener('change', async (ev)=>{
  for(const f of Array.from(ev.target.files||[])) await uploadFileToServer(f);
  fileInput.value='';
});

// Drag & Drop
['dragenter','dragover'].forEach(ev=>dropzone.addEventListener(ev,e=>{ e.preventDefault(); dropzone.classList.add('drag'); }));
['dragleave','drop'].forEach(ev=>dropzone.addEventListener(ev,e=>{ e.preventDefault(); dropzone.classList.remove('drag'); }));
dropzone.addEventListener('drop', async (e)=>{
  for(const f of Array.from(e.dataTransfer.files||[])) await uploadFileToServer(f);
});
dropzone.addEventListener('click', ()=>fileInput.click());

// Modal
modalBackdrop.addEventListener('click', closeModalFn);
closeModalBtn.addEventListener('click', closeModalFn);
zoomIn?.addEventListener('click', ()=>{ if(currentScale < maxScale){ currentScale += 0.2; updateZoom(); } });
zoomOut?.addEventListener('click', ()=>{ if(currentScale > minScale){ currentScale -= 0.2; updateZoom(); } });
window.addEventListener('keydown',(e)=>{ if(e.key==='Escape') closeModalFn(); });

function openModal(item){
  modalImg.src=item.dataUrl;
  modalDesc.textContent=item.desc||('Adicionada em '+new Date(item.createdAt).toLocaleString());
  currentScale=1; updateZoom();
  modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false');
}
function closeModalFn(){ modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); }
function updateZoom(){ modalImg.style.transform=`scale(${currentScale})`; }

// --- Storage ---
function save(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(items)); }

// --- Upload para Node.js ---
async function uploadFileToServer(file){
  if(!file.type.startsWith('image/')) return;
  const dia = prompt('Qual o dia da imagem? (1,2 ou 3)', '1');
  const form = new FormData();
  form.append('image', file);
  form.append('dia', dia);

  try{
    const res = await fetch('http://localhost:3000/upload', { method:'POST', body: form });
    const data = await res.json();
    const item = {
      id: randomId(),
      dataUrl: 'http://localhost:3000'+data.url, 
      desc: file.name,
      dia: Math.min(3, Math.max(1, parseInt(dia)||1)),
      createdAt: Date.now()
    };
    items.unshift(item);
    save();
    render();
  }catch(e){ alert('Erro no upload: '+e.message); }
}

// --- Adicionar por URL ---
async function addImageFromUrl(url){
  const res = await fetch(url); if(!res.ok) throw new Error('Falha no download');
  const blob = await res.blob(); if(!blob.type.startsWith('image/')) throw new Error('Não é uma imagem');
  const dataUrl = await blobToDataURL(blob);
  const watermarked = await applyWatermark(dataUrl);
  const dia = prompt('Qual o dia da imagem? (1,2 ou 3)', '1');
  items.unshift({ id: randomId(), dataUrl: watermarked, desc:url, dia:Math.min(3,Math.max(1,parseInt(dia)||1)), createdAt: Date.now() });
  save(); render();
}

// --- Helpers ---
function fileToDataURL(file){return new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(file); });}
function blobToDataURL(blob){return new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(blob); });}
function randomId(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,8); }
function applyWatermark(dataUrl){
  return new Promise((res)=>{
    const img=new Image(); img.crossOrigin='anonymous';
    img.onload = ()=>{
      const canvas=document.createElement('canvas'); canvas.width=img.width; canvas.height=img.height;
      const ctx=canvas.getContext('2d'); ctx.drawImage(img,0,0);
      ctx.fillStyle='rgba(0,0,0,0.18)'; ctx.fillRect(20,img.height-60,img.width-40,50);
      ctx.fillStyle='rgba(255,255,255,0.85)';
      ctx.font=Math.round(Math.max(12,img.width*0.02))+'px sans-serif';
      ctx.fillText('Galeria • Barbosa',30,img.height-30);
      res(canvas.toDataURL('image/jpeg',0.9));
    };
    img.onerror=()=>res(dataUrl);
    img.src=dataUrl;
  });
}

// --- Render ---
function render(){
  galleries.forEach(g=>g.innerHTML='');
  if(items.length===0){ galleries.forEach(g=>g.innerHTML='<p>Nenhuma imagem</p>'); return; }
  for(const item of items){
    const card=document.createElement('article'); card.className='card';
    const removeBtn=document.createElement('button');
    removeBtn.className='remove-btn';
    removeBtn.textContent='×';
    removeBtn.addEventListener('click',(e)=>{
      e.stopPropagation();
      items=items.filter(i=>i.id!==item.id);
      save(); render();
    });

    const img=document.createElement('img');
    img.src=item.dataUrl;
    img.alt=item.desc||'';
    img.addEventListener('click',()=>openModal(item));

    const desc=document.createElement('div');
    desc.className='desc';
    desc.textContent=item.desc||'';

    card.appendChild(removeBtn);
    card.appendChild(img);
    card.appendChild(desc);
    galleries[item.dia-1].appendChild(card);
  }
}
