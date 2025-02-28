const prisma = require('../../models/prisma');
var cookieParser = require('cookie-parser');

const countComment = async (req, res) => {
    const resposta = await prisma.comment.count()
    res.json({quantidade: resposta})
}

module.exports = countComment;