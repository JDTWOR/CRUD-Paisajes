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
        const { nombre, descripcion } = req.body;
        const nuevoPaisaje = new Paisaje({
            nombre,
            descripcion,
            imagen: req.file ? `/uploads/${req.file.filename}` : ''
        });

        await nuevoPaisaje.save();
        res.redirect('/paisajes?mensaje=Sitio turístico agregado correctamente&tipo=success');
    } catch (error) {
        console.error('Error al guardar:', error);
        res.redirect('/paisajes?mensaje=Error al agregar el sitio turístico&tipo=error');
    }
});

module.exports = router;