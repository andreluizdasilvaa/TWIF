const exp = require('constants');
const prisma = require('../models/prisma');
var cookieParser = require('cookie-parser');

const path = require('path');

exports.homeLogin = async (req, res) => {
    // Se o usuário estiver autenticado, redireciona para /feed
    const sessionCookie = req.cookies['your-session'];
    if (sessionCookie) {
        return res.redirect('/feed');
    };
    
    // Envia o arquivo index.html quando a rota raiz ("/") é acessada
    res.sendFile(path.join(__dirname,'..', 'public', 'html', 'index.html'));
};

exports.register = (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'public', 'html', 'cadastre-se.html'));
}

exports.feed = (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'public', 'html', 'feed.html'));
}

exports.notfound = (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'public', 'html', 'page_404.html'));
}

exports.support = (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'public', 'html', 'suporte.html'));
}

exports.about_us = (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'public', 'html', 'sobrenos.html'));
}

exports.semAcesso = (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'public', 'html', 'Page_acesso_negado.html'));
}

exports.userProfile = (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'public', 'html', 'perfil.html'));
}

exports.comments = (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'public', 'html', 'comments.html'));
}

exports.relatorios = (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'public', 'html', 'relatorio.html'));
}