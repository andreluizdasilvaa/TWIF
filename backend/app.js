// app.js
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');

// Importando rotas
// const pagesRoutes = require('./routes/pagesRoutes');
const feedRoutes = require('./routes/feedRoutes');
const commentRoutes = require('./routes/commentRoutes')
const authRoutes = require('./routes/authRoutes');
const perfilRoutes = require('./routes/perfilRoutes');
const relatorioRoutes = require('./routes/relatorioRoutes')

dotenv.config();
const app = express();

// Cors - config
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN_URL,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};

app.use(cors());

// Middleware para JSON e URL encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// Paginas estaticas
app.use('/auth', authRoutes);
app.use('/relatorios', relatorioRoutes);
app.use('/', perfilRoutes, commentRoutes, feedRoutes);
// app.use('/feed', feedRoutes);  // Rotas do feed
// app.use('/perfil', perfilRoutes);  // Rotas de perfil

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});