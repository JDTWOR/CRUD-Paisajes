const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const path = require('path');
const connectDB = require('./config/database');
const paisajeRoutes = require('./routes/paisajeRoutes');

const app = express();
const port = process.env.PORT || 8080;

// Conectar a la base de datos
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const uploadDir = path.join(__dirname, 'public/uploads');
if (!require('fs').existsSync(uploadDir)){
    require('fs').mkdirSync(uploadDir, { recursive: true });
}

// Configuración de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Rutas
app.use('/paisajes', paisajeRoutes);
app.get('/', (req, res) => {
  res.redirect('/paisajes');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});