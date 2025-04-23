const prisma = require('../prisma');
const createHttpError = require('http-errors');

const userMeModel = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, nome: true, profilePicture: true, usernick: true, isadmin: true, nascimento: true, course: true },
    });
    return user ? user : (() => { throw createHttpError(404, "Usuário não encontrado") })();
}
module.exports = userMeModel;