const jwt = require('jsonwebtoken');

function auth_admin(req, res, next) {
    // Verifica se o usuário está autenticado
    if (!req.user) {
        return res.status(401).json({ 
            error: "Unauthorized", 
            message: "Você precisa estar autenticado para acessar esta rota." 
        });
    }

    // Verifica se o usuário é um admin
    if (!req.user.isadmin) {
        return res.status(403).json({ 
            error: "Forbidden", 
            message: "Acesso negado. Apenas administradores podem acessar esta rota." 
        });
    }

    next();
}

module.exports = { auth_admin };