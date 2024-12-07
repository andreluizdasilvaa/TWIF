var app = require('express').Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { networkInterfaces } = require('os');

const prisma = new PrismaClient();

async function auth_user(req, res, next) {
    const token = req.cookies['your-session'];

    if (!token) {
        return res.redirect('/?error=3');
    }

    jwt.verify(token, process.env.jwt_secret, async (err, decoded) => {
        if (err) {
            console.log(`${err} - ${err.message}`);
            return res.redirect('/?error=4');
        }

        // Verifica se o ID do usuário decodificado existe no banco de dados
        try {
            const user = await prisma.user.findUnique({
                 where: {
                     id: decoded.id 
                    } 
                }); 

            if (!user) {
                // Usuário não encontrado, token inválido
                // 'clearCookie' limpa o cookie your-session, de todas as rotas '/', e retorna o '/?erro=4'.
                return res.clearCookie('your-session', { path: '/' }).redirect('/?error=4');
            }

            req.user = decoded;
            next();
        } catch (dbError) {
            console.error('Erro ao verificar usuário no banco de dados:', dbError);
        }
    });
}




// Middleware de autenticação simulada
const authenticateUser = (req, res, next) => {
    const { email } = req.headers; // O e-mail será enviado nos headers da requisição
    const user = mockUsers.find((u) => u.email === email);

    if (!user) {
        return res.status(401).json({ msg: "Usuário não autenticado" });
    }

    req.user = user;  //Adiciona o usuário ao objeto `req` para acesso na próxima etapa
    next();
};

// app.get('/relatorios', authenticateUser, isAdmin, (req, res) => {
app.get('/', auth_user, (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'html', 'relatorio.html'));
});

app.get('/comentarios', auth_user, async (req, res) => {
    const resposta = await prisma.comment.count()
    res.json({quantidade: resposta})
});

app.get('/usuarios', auth_user, async (req, res) => {
    const resposta = await prisma.user.count()
    res.json({quantidade: resposta})
});

app.get('/curtidas', auth_user, async (req, res) => {
    const resposta = await prisma.like.count()
    res.json({quantidade: resposta})
});

app.get('/posts', auth_user, async (req, res) => {
    try {
        const resposta = await prisma.post.count()
        res.json({quantidade: resposta})

    } catch (error) {
        console.log(error)
    }
    
});

module.exports = app;