// Importa as bibliotecas necessárias
const express = require('express');
const session = require('express-session');
const { PrismaClient } = require('@prisma/client');
const path = require('path');

// Cria uma instância do Express e do Prisma Client
const app = express();
const prisma = new PrismaClient();

// Middleware para interpretar JSON e dados de formulário
app.use(express.json()); // Permite que o Express entenda requisições com corpo em JSON
app.use(express.urlencoded({ extended: true })); // Permite que o Express entenda dados de formulários HTML

// Middleware para servir arquivos estáticos (CSS, imagens, etc.)
app.use(express.static(path.join(__dirname, '..', '..', 'Frontend'))); // Define a pasta onde estão os arquivos estáticos

// Rota para carregar a página inicial
app.get('/', (req, res) => {
    // Envia o arquivo index.html quando a rota raiz ("/") é acessada
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'html', 'index.html'));
});

// Rota para carregar o formulário de cadastro
app.get('/register', (req, res) => {
    // Envia o arquivo cadastro-TESTE.html quando a rota "/register" é acessada
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'html', 'cadastro-TESTE.html'));
});

// Rota para processar o cadastro de um novo usuário
app.post('/register', async (req, res) => {
    console.log(req.body); // Imprime no console os dados recebidos do formulário para depuração

    const { email, senha, matricula, nome } = req.body; // Extrai dados do corpo da requisição

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
        return res.status(400).json({ message: 'Usuário ou número de matrícula já cadastrados' });
    }

    // Cria um novo usuário no banco de dados com os dados fornecidos
    const user = await prisma.user.create({
        data: {
            email,
            senha, // Nota: Armazenar senhas em texto simples não é seguro. Considere utilizar criptografia.
            matricula,
            nome // Inclui o campo nome
        },
    });

    // Após o cadastro, redireciona o usuário para a página inicial/Login
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'html', 'index.html'));
});

// Configuração do middleware express-session para gerenciar sessões de usuário
app.use(session({
    secret: 'senha-dificil123', 
    resave: false, 
    saveUninitialized: false,
    cookie: { secure: false } 
}));


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
