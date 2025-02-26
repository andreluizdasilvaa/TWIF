const prisma = require('../../models/prisma');
var cookieParser = require('cookie-parser');

const countLike = async (req, res) => {
    const resposta = await prisma.like.count()
    res.json({quantidade: resposta})
}

module.exports = countLike;