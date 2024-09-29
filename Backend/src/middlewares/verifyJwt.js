const jwt = require('jsonwebtoken');

function verifyjwt(req, res, next) {
    console.log('teste-token');
    const token = req.cookies['your-session'];

    if (!token) {
        return res.redirect('/?error=3');
    }

    jwt.verify(token, process.env.jwt_secret, (err, decoded) => {
        if (err) {
            console.log(`${err} - ${err.message}`);
            return res.redirect('/?error=4');
        };

        // Adiciona os dados decodificados do token ao objeto `req`
        req.user = decoded;
        next();
    });
}

module.exports = verifyjwt;