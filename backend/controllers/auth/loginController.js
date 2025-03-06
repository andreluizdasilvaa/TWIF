const bcrypt = require('bcrypt');
const { generate_token_user } = require('../../middlewares/index');
const prisma = require('../../models/prisma');

// Rota de processamento do login
const login = async (req, res) => {
    const { email, senha } = req.body;
    try {
        if (!email || !senha) {
            return res.status(400).json({ Erro: "Email ou senha não enviados" });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ Erro: "Credenciais inválidas" });
        }

        const isPasswordValid = await bcrypt.compare(senha, user.senha);
        if (!isPasswordValid) {
            return res.status(401).json({ Erro: "Credenciais inválidas" });
        }

        generate_token_user(user, req, res, () => {
            return res.status(200).json({ redirect: "/feed" });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ Erro: "Erro interno ao fazer login" });
    }
};

module.exports = login;