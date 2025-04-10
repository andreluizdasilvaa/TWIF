const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');

const feedRoutes = require('./routes/feedRoutes');
const commentRoutes = require('./routes/commentRoutes')
const authRoutes = require('./routes/authRoutes');
const perfilRoutes = require('./routes/perfilRoutes');
const relatorioRoutes = require('./routes/relatorioRoutes')

const errorHandler = require('./utils/errorHandler');

dotenv.config();
const app = express();

// Cors - config
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log('Passei pelo log');;
  next()
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);
app.use('/relatorios', relatorioRoutes);
app.use('/', perfilRoutes, commentRoutes, feedRoutes);

app.use(errorHandler);

module.exports = app;