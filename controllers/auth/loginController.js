const bcrypt = require('bcrypt');
const { generate_token_user } = require('../../middlewares/index');

const prisma = require('../../models/prisma');

// Rota de processamento do login
const login = async (req, res) => {
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
            return res.redirect('/?error=1');
        }

        // Gere o token e configure o cookie
        generate_token_user(user, req, res, () => {
            res.status(201).redirect('/feed');
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Erro interno ao Fazer login, entre em contato com o suporte',
        });
    }
}

module.exports = login;