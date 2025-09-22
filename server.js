const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Pasta para salvar uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Configuração do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname)
});
const upload = multer({ storage });

// Lista de imagens
let images = [];
const dbFile = path.join(__dirname, 'images.json');
if (fs.existsSync(dbFile)) {
  images = JSON.parse(fs.readFileSync(dbFile));
}

// Endpoint para upload de imagem
app.post('/upload', upload.single('image'), (req, res) => {
  const { dia } = req.body;
  if (!req.file) return res.status(400).send('Nenhuma imagem enviada');

  const img = {
    url: '/uploads/' + req.file.filename,
    desc: req.file.originalname,
    dia: parseInt(dia) || 1,
    createdAt: Date.now()
  };
  images.unshift(img);

  fs.writeFileSync(dbFile, JSON.stringify(images, null, 2));
  res.json(img);
});

// Endpoint para listar imagens
app.get('/images', (req, res) => {
  if (fs.existsSync(dbFile)) {
    images = JSON.parse(fs.readFileSync(dbFile));
  }
  res.json(images);
});

// Servir a pasta de uploads
app.use('/uploads', express.static(uploadDir));

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
