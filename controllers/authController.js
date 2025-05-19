const Usuario = require('../models/usuarioModel');

exports.showRegister = (req, res) => {
    res.render('auth/register', { 
        title: 'Registro',
        layout: 'layouts/authLayout'
    });
};

exports.showLogin = (req, res) => {
    // Si ya está autenticado, redirigir a paisajes
    if (req.session.userId) {
        return res.redirect('/paisajes');
    }
    res.render('auth/login', { 
        title: 'Iniciar Sesión',
        layout: 'layouts/authLayout'
    });
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const usuario = await Usuario.findOne({ username });

        if (!usuario || !(await usuario.comparePassword(password))) {
            return res.redirect('/auth/login?mensaje=Usuario o contraseña incorrectos&tipo=error');
        }

        req.session.userId = usuario._id;
        req.session.userRole = usuario.role;
        req.session.username = usuario.username;

        res.redirect('/paisajes');
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.redirect('/auth/login?mensaje=Error al iniciar sesión&tipo=error');
    }
};

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const existingUser = await Usuario.findOne({ username });
        if (existingUser) {
            return res.redirect('/auth/register?mensaje=El usuario ya existe&tipo=error');
        }

        const usuario = new Usuario({
            username,
            password,
            role: 'visitante'
        });

        await usuario.save();
        res.redirect('/auth/login?mensaje=Registro exitoso, ahora puedes iniciar sesión&tipo=success');
    } catch (error) {
        res.redirect('/auth/register?mensaje=Error al registrar usuario&tipo=error');
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.redirect('/paisajes?mensaje=Error al cerrar sesión&tipo=error');
        }
        res.redirect('/auth/login?mensaje=Sesión cerrada correctamente&tipo=success');
    });
};