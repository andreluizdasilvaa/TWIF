const prisma = require('../../models/prisma');
var cookieParser = require('cookie-parser');

const countUser = async (req, res) => {
    const resposta = await prisma.user.count()
    res.json({quantidade: resposta})
}

module.exports = countUser;