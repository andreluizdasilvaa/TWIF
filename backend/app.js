const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');

// Rotas existentes
const feedRoutes = require('./routes/feedRoutes');
const commentRoutes = require('./routes/commentRoutes');
const authRoutes = require('./routes/authRoutes');
const perfilRoutes = require('./routes/perfilRoutes');
const relatorioRoutes = require('./routes/relatorioRoutes');

// Nova rota de suporte
const supportRoutes = require('./routes/supportRoutes');

const errorHandler = require('./utils/errorHandler');

dotenv.config();
const app = express();

// Configuração do CORS
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Servindo arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da aplicação
app.use('/auth', authRoutes);
app.use('/relatorios', relatorioRoutes);
app.use('/suporte', supportRoutes); // Nova rota de suporte
app.use('/', perfilRoutes, commentRoutes, feedRoutes);

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app;
