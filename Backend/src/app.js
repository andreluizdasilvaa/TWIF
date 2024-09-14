// Importa as bibliotecas necessárias
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const path = require('path');

// Cria uma instância do Express e do Prisma Client
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Permite que o Express entenda dados de formulários HTML ( url ex: /html/tal.html)

// Middleware para servir arquivos estáticos (CSS, imagens, etc.)
app.use(express.static(path.join(__dirname, '..', '..', 'Frontend'))); // Define a pasta onde estão os arquivos estáticos

// =-=-=-=-=-=-=-=-=-=-=-=-=-= ROTAS GET =-=-=-=-=-=-=-=-=-=-=-=-=-=

// Rota para carregar a página inicial
app.get('/', (req, res) => {
    // Envia o arquivo index.html quando a rota raiz ("/") é acessada
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'html', 'index.html'));
});

// Rota para carregar o formulário de cadastro
app.get('/register', (req, res) => {
    // Envia o arquivo cadastro-TESTE.html quando a rota "/register" é acessada
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'html', 'cadastre-se.html'));
});

// Rota para carregar o formulario de suporte
app.get("/suporte", (req, res) => {
  // Envia o arquivo suporte.html quando a rota "/suporte" é acessada
  res.sendFile(
    path.join(__dirname, "..", "..", "Frontend", "html", "suporte.html"));
});

// =-=-=-=-=-=-=-=-=-=-=-=-=-= ROTAS POST =-=-=-=-=-=-=-=-=-=-=-=-=-=

// Rota para processar o cadastro de um novo usuário
app.post('/register', async (req, res) => {
    console.log(req.body); // Imprime no console os dados recebidos do formulário para depuração

    const { email, senha, matricula, nome } = req.body; // Extrai dados do corpo da requisição

    // VALIDAÇÃO

    try{
        // Verifica se um usuário com o mesmo e-mail já existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        // Verifica se um usuário com o mesmo número de matrícula já existe
        const existingMatricula = await prisma.user.findUnique({
            where: { matricula }
        });

        // Se o e-mail ou matrícula já estiverem cadastrados, retorna um erro
        if (existingUser || existingMatricula) {
            return res.status(400).json({ msg: 'Email ou número de matrícula já cadastrados!' });
        }

        // Cria um novo usuário no banco de dados com os dados fornecidos
        const user = await prisma.user.create({
            data: {
                nome,
                email,
                matricula,
                senha
            },
        });

        res.redirect('/'); // Redireciona o usuário para a página inicial
    } catch (error) {
        // Se ocorrer um erro inesperado, retorna um erro 500 (Internal Server Error)
        console.error(error);
        res.status(500).json({ msg: 'Erro interno, entre em contato com o suporte' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});