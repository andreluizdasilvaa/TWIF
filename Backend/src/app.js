const express = require('express');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
var cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
// importação do middleware para verificar a autenticação do token
const verifyjwt = require('./middlewares/verifyJwt')

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

// Rota para carregar a pagina sobre nós.
app.get("/sobrenos", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "..", "Frontend", "html", "sobrenos.html")
  );
});

// teste de rota privada a users logados ( só sera possivel entrar nela se o token estiver valido e presente )
app.get('/testetoken', verifyjwt, (req, res) => {
    console.log('Rota acessada!');
    res.status(200).json({ msg: "Rota acessada com sucesso!" });
});

// Rota para Erro 404 ( SEMPRE DEIXE ESSA ROTA POR ULTIMO, DE CIMA PARA BAIXO );
app.get("*", (req, res) => {
  // Envia o arquivo Page_404.html quando uma rota não declarada e feita
  res.status(404).sendFile(path.join(__dirname, "..", "..", "Frontend", "html", "Page_404.html"));
});

// | =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=| ROTAS POST |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= | 

// Rota para processar o cadastro de um novo usuário
app.post('/register', async (req, res) => {

    const { email, senha, matricula, nome } = req.body; // Extrai dados do corpo da requisição

    // VALIDAÇÃO

    try {
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

        // Criptografando a senha com proteção 8
        const senhaHash = await bcrypt.hash(senha, 8);

        // Cria um novo usuário no banco de dados com os dados fornecidos
        const user = await prisma.user.create({
            data: {
                nome,
                email,
                matricula,
                senha: senhaHash
            },select: {
                nome: true,
                email: true
            }
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
    const { emailCG, senha } = req.body;
    try {
        let user;

        // Verifica que é senha ou email fornecido
        if(emailCG.length === 7 && !isNaN(emailCG)) { 
            user = await prisma.user.findUnique({
                where: { 
                    matricula: emailCG 
                }
            });
        } else {
            user = await prisma.user.findUnique({
                where: {
                    email: emailCG
                }
            });
        };

        // verifica se o usuario existe
        if(!user) {
            return res.redirect('/?error=1');
        };

        // compara a senha fornecida com a senha que está armazenada no DB( Criptografada ), e se for a mesma retorna um true
        const IspasswordValid = await bcrypt.compare(senha, user.senha);

        // Verifica se a senha é valida
        if(!IspasswordValid) {
            return res.redirect('/?error=2');
        };

        // se a senha estiver correta, gera um token
        const token = jwt.sign({ id: user.id }, process.env.jwt_secret, { expiresIn: '1h' });

        // envia o token como um cookie valido por uma hora, e só sera acessado pelo servidor.
        res.cookie('your-session', token, { httpOnly: true, maxAge: 3600000 });

        res.redirect('/suporte');
    } catch(err) {
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