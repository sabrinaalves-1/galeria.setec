const STORAGE_KEY = 'galeriaFotos_v3';
const galleries = [document.getElementById('gallery1'), document.getElementById('gallery2'), document.getElementById('gallery3')];
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

let items = JSON.parse(localStorage.getItem(STORAGE_KEY))||[];
render();

// Eventos principais
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
  for(const f of Array.from(ev.target.files||[])) await addFile(f);
  fileInput.value='';
});

// Drag & Drop
['dragenter','dragover'].forEach(ev=>dropzone.addEventListener(ev,e=>{ e.preventDefault(); dropzone.classList.add('drag'); }));
['dragleave','drop'].forEach(ev=>dropzone.addEventListener(ev,e=>{ e.preventDefault(); dropzone.classList.remove('drag'); }));
dropzone.addEventListener('drop', async (e)=>{
  for(const f of Array.from(e.dataTransfer.files||[])) await addFile(f);
});
dropzone.addEventListener('click', ()=>fileInput.click());

// Modal
modalBackdrop.addEventListener('click', closeModalFn);
zoomIn?.addEventListener('click', ()=>{ currentScale=Math.min(3,currentScale+0.2); modalImg.style.transform=`scale(${currentScale})`; });
zoomOut?.addEventListener('click', ()=>{ currentScale=Math.max(0.3,currentScale-0.2); modalImg.style.transform=`scale(${currentScale})`; });
window.addEventListener('keydown',(e)=>{ if(e.key==='Escape') closeModalFn(); });

function openModal(item){
  modalImg.src=item.dataUrl;
  modalDesc.textContent=item.desc||('Adicionada em '+new Date(item.createdAt).toLocaleString());
  currentScale=1; modalImg.style.transform='scale(1)';
  modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false');
}
function closeModalFn(){ modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); }

// Storage
function save(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(items)); }

// Adicionar arquivos
async function addFile(file){
  if(!file.type.startsWith('image/')) return;
  const dataUrl = await fileToDataURL(file);
  const watermarked = await applyWatermark(dataUrl);
  const dia = prompt('Qual o dia da imagem? (1,2 ou 3)', '1');
  const item = { id: randomId(), dataUrl: watermarked, desc:file.name, dia:Math.min(3,Math.max(1,parseInt(dia)||1)), createdAt: Date.now() };
  items.unshift(item); save(); render();
}
async function addImageFromUrl(url){
  const res = await fetch(url); if(!res.ok) throw new Error('Falha no download');
  const blob = await res.blob(); if(!blob.type.startsWith('image/')) throw new Error('Não é uma imagem');
  const dataUrl = await blobToDataURL(blob);
  const watermarked = await applyWatermark(dataUrl);
  const dia = prompt('Qual o dia da imagem? (1,2 ou 3)', '1');
  items.unshift({ id: randomId(), dataUrl: watermarked, desc:url, dia:Math.min(3,Math.max(1,parseInt(dia)||1)), createdAt: Date.now() });
  save(); render();
}

// Helpers
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

// Render
function render(){
  galleries.forEach(g=>g.innerHTML='');
  if(items.length===0){ galleries.forEach(g=>g.innerHTML='<p>Nenhuma imagem</p>'); return; }
  for(const item of items){
    const card=document.createElement('article'); card.className='card';
    const img=document.createElement('img'); img.src=item.dataUrl; img.alt=item.desc||''; img.addEventListener('click',()=>openModal(item));
    const desc=document.createElement('div'); desc.className='desc'; desc.textContent=item.desc||'';
    card.appendChild(img); card.appendChild(desc);
    galleries[item.dia-1].appendChild(card);
  }
}
