const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Pasta para salvar imagens
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Habilitar CORS para todos os dispositivos
app.use(cors());

// Servir arquivos estáticos da pasta public e uploads
app.use(express.static('public'));
app.use('/uploads', express.static(UPLOAD_DIR));

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Rota para upload de imagem
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });

  const dia = parseInt(req.body.dia) || 1;
  const url = `/uploads/${req.file.filename}`;

  // Retorna a URL relativa para o frontend usar diretamente
  res.json({ url, dia, name: req.file.originalname });
});

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
