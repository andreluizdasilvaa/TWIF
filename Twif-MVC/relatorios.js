var app = require('express').Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const { auth_admin, auth_user } = require('./middlewares/auth');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// app.get('/relatorios', authenticateUser, isAdmin, (req, res) => {
app.get('/', auth_user, auth_admin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'html', 'relatorio.html'));
});

app.get('/comentarios', auth_user, auth_admin, async (req, res) => {
    const resposta = await prisma.comment.count()
    res.json({quantidade: resposta})
});

app.get('/usuarios', auth_user, auth_admin, async (req, res) => {
    const resposta = await prisma.user.count()
    res.json({quantidade: resposta})
});

app.get('/curtidas', auth_user, auth_admin, async (req, res) => {
    const resposta = await prisma.like.count()
    res.json({quantidade: resposta})
});

app.get('/posts', auth_user, auth_admin, async (req, res) => {
    try {
        const resposta = await prisma.post.count();
        res.json({quantidade: resposta});
    } catch (error) {
        console.log(error);
    }
});

app.get('/usuarios/admins', auth_user, auth_admin, async (req, res) => {
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
});

module.exports = app;