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

// Configuração do dotenv
dotenv.config();

// Inicializando o Express
const app = express();

// Configurar CORS para permitir cookies
// app.use(cors({
//   origin: 'http://localhost:3000', // Altere para a URL do seu front-end
//   credentials: true // Permite envio de cookies
// }));

// Middleware para JSON e URL encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Mostra onde estão os arquivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

// Usando as rotas

// Paginas estaticas
app.use('/relatorios', relatorioRoutes)
app.use('/', authRoutes, perfilRoutes, commentRoutes, feedRoutes);
// app.use('/feed', feedRoutes);  // Rotas do feed
// app.use('/perfil', perfilRoutes);  // Rotas de perfil

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});