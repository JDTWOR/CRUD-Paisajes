exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect('/auth/login?mensaje=Por favor inicia sesión&tipo=error');
};

exports.isAdmin = (req, res, next) => {
    if (req.session && req.session.userRole === 'admin') {
        return next();
    }
    res.redirect('/paisajes?mensaje=No tienes permisos para realizar esta acción&tipo=error');
};