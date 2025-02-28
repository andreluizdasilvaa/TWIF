const { remove_session } = require('../../middlewares/index');

const removeSession = (req, res) => {
    try {
        remove_session(req, res);
    } catch (error) {
        console.error('Erro ao encerrar sessão do user, Erro: ', error);
        res.status(500).json({ message: 'Erro interno ao encerrar sessão, entre em contato com o suporte'});
    };
};

module.exports = removeSession;