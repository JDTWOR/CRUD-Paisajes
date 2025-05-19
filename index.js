const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const path = require('path');
const connectDB = require('./config/database');
const paisajeRoutes = require('./routes/paisajeRoutes');
const expressLayouts = require('express-ejs-layouts');
const setActiveRoute = require('./middleware/setActiveRoute');
const session = require('express-session');
const createAdminUser = require('./config/setupAdmin');
const redirectMiddleware = require('./middleware/redirectMiddleware');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 8080;

// Conectar a la base de datos
connectDB();

// Crear usuario admin por defecto
createAdminUser();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(expressLayouts);
app.use(setActiveRoute);

app.use(session({
    secret: 'tu_secreto_aqui',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Cambia a true si usas HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Aplicar middleware de redirección
app.use(redirectMiddleware);

// Middleware para datos de usuario
app.use((req, res, next) => {
    res.locals.user = {
        isAuthenticated: !!req.session.userId,
        isAdmin: req.session.userRole === 'admin',
        username: req.session.username
    };
    next();
});

// Rutas de autenticación primero
app.use('/auth', authRoutes);

// Redirigir la ruta raíz al login
app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

// Otras rutas después
app.use('/paisajes', paisajeRoutes);

const uploadDir = path.join(__dirname, 'public/uploads');
if (!require('fs').existsSync(uploadDir)){
    require('fs').mkdirSync(uploadDir, { recursive: true });
}

// Configuración de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});