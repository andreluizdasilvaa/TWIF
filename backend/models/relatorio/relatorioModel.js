const prisma = require('../prisma');

// Função para contar administradores
const countAdminsUsers = async () => {
    return await prisma.user.count({
        where: {
            email: {
                endsWith: '@ifsp.edu.br' // Conta usuários cujo email termina com @ifsp.edu.br
            }
        }
    });
};

// Função para contar usuários
const countUsers = async () => {
    return await prisma.user.count();
};

// Função para contar comentários
const countComments = async () => {
    return await prisma.comment.count();
};

// Função para contar posts
const countPosts = async () => {
    return await prisma.post.count();
};

// Função para contar curtidas
const countLikes = async () => {
    return await prisma.like.count();
};

module.exports = {
    countAdminsUsers,
    countUsers,
    countComments,
    countPosts,
    countLikes
};