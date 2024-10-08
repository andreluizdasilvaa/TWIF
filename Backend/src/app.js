const express = require('express');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
var cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
// importação do middleware para verificar a autenticação do token
const { auth_user, generate_token_user } = require('./middlewares/auth');

dotenv.config(); // mostra ao dotenv onde está o arq .env no
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Permite que o Express entenda dados de formulários HTML ( url ex: /html/tal.html)

// Middleware para servir arquivos estáticos (CSS, imagens, etc.)
app.use(express.static(path.join(__dirname, '..', '..', 'Frontend'))); // Define a pasta onde estão os arquivos estáticos
app.use(cookieParser()); // Para lidar com cookies

// | =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-| ROTAS GET |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= |

// Rota para carregar a página inicial
app.get('/', (req, res) => {
    // Se o usuário estiver autenticado, redireciona para /feed
    if (req.user) {
        return res.redirect('/feed');
    }
    // Envia o arquivo index.html quando a rota raiz ("/") é acessada
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'html', 'index.html'));
});

// Rota para carregar o formulário de cadastro
app.get('/register', (req, res) => {
    // Envia o arquivo cadastro-TESTE.html quando a rota "/register" é acessada
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'html', 'cadastre-se.html'));
});

// Rota para carregar o formulario de suporte
app.get('/suporte', (req, res) => {
    // Envia o arquivo suporte.html quando a rota "/suporte" é acessada
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'html', 'suporte.html'));
});

// Rota para carregar a pagina sobre nós.
app.get('/sobrenos', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'html', 'sobrenos.html'));
});

// Rota para carregar o feed
app.get('/feed' ,auth_user, (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'html', 'feed.html'));
});

// Rota para retornar todos os posts do DB
app.get('/feed/posts', auth_user, async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                user: {
                    select: { 
                        nome: true,
                        profilePicture: true
                    }
                },
                comments: true, // traz os comentários
                likes: true,    // traz as curtidas
            },
            orderBy: {
                // Ordena pela contagem de curtidas em ordem decrescente
                likes: {
                    _count: 'desc' 
                }
            }
        });
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Erro interno, entre em contato com o suporte',
        });
    }
});

// Rota para retornar todas as informações do usuario que está acessando a rota
app.get('/user/me', auth_user, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }, // Usa o userId do token
            select: {
                nome: true,
                profilePicture: true,
                posts: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true
                    }
                },
            },
        });

        if (user) {
            res.json(user);
        } else {
            res.status(404).send('Usuário não encontrado');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar o usuário');
    }
});

// Rota para Erro 404 ( SEMPRE DEIXE ESSA ROTA POR ULTIMO, DE CIMA PARA BAIXO );
app.get('*', (req, res) => {
    // Envia o arquivo Page_404.html quando uma rota não declarada e feita
    res.status(404).sendFile(path.join(__dirname, '..', '..', 'Frontend', 'html', 'Page_404.html'));
});

// | =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=| ROTAS POST |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= |

// Rota para processar o cadastro de um novo usuário
app.post('/register', async (req, res) => {
    const { email, senha, usernick, nome, profilePicture } = req.body; // Extrai dados do corpo da requisição

    // VALIDAÇÃO

    try {
        // Verifica se um usuário com o mesmo e-mail já existe
        const existingMail = await prisma.user.findUnique({
            where: { email },
        });

        // Verifica se o @user já existe no banco de dados
        const existingUser = await prisma.user.findUnique({
            where: { usernick }
        })

        // Se o e-mail ou matrícula já estiverem cadastrados, retorna um erro
        if (existingMail || existingUser) {
            return res.status(400).json({ msg: 'Email ou @user já cadastrados!' });
        }

        // Criptografando a senha com proteção 8
        const senhaHash = await bcrypt.hash(senha, 8);

        // Cria um novo usuário no banco de dados com os dados fornecidos
        const user = await prisma.user.create({
            data: {
                nome,
                email,
                usernick,
                senha: senhaHash,
                profilePicture
            },
            select: {
                nome: true,
                email: true,
            },
        });
        console.log(user);
        return res.redirect('/?success=true'); // Redireciona o usuário para a página inicial com um parâmetro de sucesso
    } catch (error) {
        // Se ocorrer um erro inesperado, retorna um erro 500 (Internal Server Error)
        console.error(error);
        res.status(500).json({ msg: 'Erro interno, entre em contato com o suporte' });
    }
});

// Rota para processar o login
app.post('/', async (req, res) => {
    const { email, senha } = req.body;
    try {
        let user;

        user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        // verifica se o usuario existe
        if (!user) {
            return res.redirect('/?error=1');
        }

        // compara a senha fornecida com a senha que está armazenada no DB( Criptografada ), e se for a mesma retorna um true
        const IspasswordValid = await bcrypt.compare(senha, user.senha);

        // Verifica se a senha é valida
        if (!IspasswordValid) {
            return res.redirect('/?error=2');
        }

        // Gere o token e configure o cookie
        generate_token_user(user, req, res, () => {
            res.redirect('/feed');
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Erro interno, entre em contato com o suporte',
        });
    }
});

// Rota para criar um post
app.post('/feed', auth_user, async (req, res) => {
    const { conteudo } = req.body;
    // console.log(`Conteudo Recebido: ${conteudo}`);
    try {
        if (!conteudo) {
            res.redirect('/feed?error=1');
            return;
        }

        // cadastro no DB
        const post = await prisma.post.create({
            data: {
                content: conteudo,
                userId: req.user.id
            },
        });

        res.status(201).json({msg: "Post criado com sucesso!"});
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Erro interno, entre em contato com o suporte',
        });
    };
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});