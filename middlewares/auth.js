const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

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

        try {
            const user = await prisma.user.findUnique({
                where: { id: decoded.id }
            });

            if (!user) {
                return res.clearCookie('your-session', { path: '/' }).redirect('/?error=4');
            }

            req.user = decoded;
            next();
        } catch (dbError) {
            console.error('Erro ao verificar usuário no banco de dados:', dbError);
            return res.status(500).send('Erro interno');
        }
    });
}

module.exports = { auth_user };