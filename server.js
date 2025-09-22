const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Pasta para salvar imagens
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(UPLOAD_DIR));

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Rota para upload
app.post('/upload', upload.single('image'), (req, res) => {
  const dia = parseInt(req.body.dia) || 1;
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  
  const url = `/uploads/${req.file.filename}`;
  res.json({ url, dia, name: req.file.originalname });
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));