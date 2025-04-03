const errorMiddleware = (err, req, res, next) => {
    console.error('Erro capturado pelo "errorMiddleware":', {
        message: err.message,
        stack: err.stack,
        additionalInfo: err.additionalInfo || null,
    });

    // Envia uma resposta generica 
    res.status(err.status || 500).json({
        message: err.clientMessage || 'Erro interno no servidor. Por favor, entre em contato com o suporte.',
    });
};

module.exports = errorMiddleware;
