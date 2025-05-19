const redirectMiddleware = (req, res, next) => {
    // Rutas públicas que no requieren redirección
    const publicRoutes = ['/auth/login', '/auth/register'];
    
    if (!req.session.userId && !publicRoutes.includes(req.path)) {
        return res.redirect('/auth/login');
    }
    next();
};

module.exports = redirectMiddleware;