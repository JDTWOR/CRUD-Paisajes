const setActiveRoute = (req, res, next) => {
    // Establece una ruta activa por defecto
    res.locals.activeRoute = 'home';
    
    // Determina la ruta activa basada en la URL actual
    if (req.path.includes('/agregar')) {
        res.locals.activeRoute = 'agregar';
    }
    
    next();
};

module.exports = setActiveRoute;