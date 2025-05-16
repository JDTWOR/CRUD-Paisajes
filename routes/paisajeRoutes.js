const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const Paisaje = require('../models/paisajeModel');

// Ruta para mostrar todos los paisajes
router.get('/', async (req, res) => {
    try {
        const paisajes = await Paisaje.find();
        res.render('paisajes/index', { 
            paisajes,
            mensaje: req.query.mensaje,
            tipo: req.query.tipo 
        });
    } catch (error) {
        res.status(500).send('Error al obtener los paisajes');
    }
});

// Ruta para mostrar el formulario de agregar
router.get('/agregar', (req, res) => {
    res.render('paisajes/agregar');
});

// Ruta para procesar el formulario
router.post('/agregar', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, descripcion, precio } = req.body;

        // Verificar que se haya subido una imagen
        if (!req.file) {
            throw new Error('La imagen es obligatoria');
        }

        // Crear el nuevo paisaje
        const nuevoPaisaje = new Paisaje({
            nombre,
            descripcion,
            precio: parseFloat(precio),
            imagen: `/uploads/${req.file.filename}` // Guardamos la ruta relativa
        });

        // Guardar en la base de datos
        await nuevoPaisaje.save();

        // Redireccionar con mensaje de éxito
        res.redirect('/paisajes?mensaje=Sitio turístico agregado correctamente&tipo=success');
    } catch (error) {
        console.error('Error al guardar:', error);
        res.redirect('/paisajes?mensaje=Error: ' + error.message + '&tipo=error');
    }
});

module.exports = router;