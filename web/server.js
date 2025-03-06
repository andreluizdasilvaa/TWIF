import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

// Get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para servir arquivos estáticos como CSS, JS e imagens
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'html', 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'html', 'cadastre-se.html'));
});

app.get('/suporte', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'html', 'suporte.html'));
});

app.get('/sobrenos', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'html', 'sobrenos.html'));
});

app.get('/feed', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'html', 'feed.html'));
});

app.get('/perfil/:usernick', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'html', 'perfil.html'));
});

app.get('/comments', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'html', 'comments.html'));
});

app.get('/relatorios', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'html', 'relatorio.html'));
});

app.get('/user404', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'html', 'user_page_404.html'));
});

app.get('/notaccess', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'html', 'Page_acesso_negado.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'html', 'page_404.html'));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});