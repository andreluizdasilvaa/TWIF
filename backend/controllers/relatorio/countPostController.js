const prisma = require('../../models/prisma');
var cookieParser = require('cookie-parser');

const countPost = async (req, res) => {
    try {
        const resposta = await prisma.post.count();
        res.json({quantidade: resposta});
    } catch (error) {
        console.log(error);
    }
}

module.exports = countPost;