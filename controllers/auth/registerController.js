const bcrypt = require('bcrypt');

const prisma = require('../../models/prisma');

// Rota de processamento do cadastro
const register = async (req, res) => {
    const { email, senha, usernick, nome, profilePicture } = req.body;

    // VALIDAÇÃO

    // Inicializa isAdmin como false
    let isadmin = false;

    // VALIDAÇÃO DE DOMÍNIO DO EMAIL
    if (/^[a-zA-Z0-9._%+-]+@aluno\.ifsp\.edu\.br$/.test(email)) {
        isadmin = false; // E-mail de aluno
    } else if (/^[a-zA-Z0-9._%+-]+@ifsp\.edu\.br$/.test(email)) {
        isadmin = true; // E-mail adm
    } else {
        return res.status(400).json({ msg: 'Email inválido. Use um e-mail do domínio ifsp.edu.br' });
    }

    try {
        // Verifica se um usuário com o mesmo e-mail já existe
        const existingMail = await prisma.user.findUnique({
            where: { email },
        });

        // Verifica se o @user já existe no banco de dados
        const existingUser = await prisma.user.findUnique({
            where: { usernick },
        });

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
                profilePicture,
                isadmin: isadmin,
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
        res.status(500).json({ msg: 'Erro interno ao cadastrar usuario, entre em contato com o suporte' });
    }
}

module.exports = register;