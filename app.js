// app.js
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Importando rotas
const pagesRoutes = require('./routes/pagesRoutes');

const authRoutes = require('./routes/authRoutes');
const feedRoutes = require('./routes/feedRoutes');
const perfilRoutes = require('./routes/perfilRoutes');

// Configuração do dotenv
dotenv.config();

// Inicializando o Express
const app = express();

// Middleware para JSON e URL encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Mostra onde estão os arquivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

// Usando as rotas

// Paginas estaticas
app.use('/', pagesRoutes)
// app.use('/auth', authRoutes);  // Rotas de autenticação
// app.use('/feed', feedRoutes);  // Rotas do feed
// app.use('/perfil', perfilRoutes);  // Rotas de perfil

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});