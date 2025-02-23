const prisma = require('../../models/prisma');
var cookieParser = require('cookie-parser');

const countAdminsUsers = async (req, res) => {
    try {
        const resposta = await prisma.user.count({
            where: {
                email: {
                    endsWith: '@ifsp.edu.br' // Conta usuários cujo email termina com @ifsp.edu.br
                }
            }
        });
        res.json({ quantidade: resposta });
    } catch (error) {
        console.error('Erro ao contar administradores:', error);
        res.status(500).json({ quantidade: 0 });
    }
}

module.exports = countAdminsUsers;