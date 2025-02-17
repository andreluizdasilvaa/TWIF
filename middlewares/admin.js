function auth_admin(req, res, next) {
    if (!req.user) {
        return res.redirect('/?error=4');
    }

    if (!req.user.isadmin) {
        return res.redirect('/notaccess');
    }

    next();
}

module.exports = { auth_admin };