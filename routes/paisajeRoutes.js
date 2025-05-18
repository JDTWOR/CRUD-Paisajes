const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const Paisaje = require('../models/paisajeModel');
const paisajeModel = require('../models/paisajeModel');
const paisajeController = require('../controllers/paisajeController');

// Ruta para mostrar todos los paisajes
router.get('/', async (req, res) => {
    try {
        const paisajes = await Paisaje.find();
        res.render('paisajes/index', {
            paisajes,
            activeRoute: 'home',
            title: 'Listado de Sitios Turísticos'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los paisajes');
    }
});

// Ruta para mostrar el formulario de agregar
router.get('/agregar', (req, res) => {
    res.render('paisajes/agregar', {
        activeRoute: 'agregar',
        title: 'Agregar Nuevo Sitio'
    });
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

//Ruta para ver la información detallada de los sitios
router.get('/ver/:id', async (req, res) => {
    try {
        const paisaje = await Paisaje.findById(req.params.id);
        
        if (!paisaje) {
            return res.status(404).redirect('/paisajes?mensaje=Paisaje no encontrado&tipo=error');
        }

        res.render('paisajes/ver', {
            paisaje,
            activeRoute: 'ver',
            title: `Detalles de ${paisaje.nombre}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).redirect('/paisajes?mensaje=Error al cargar el paisaje&tipo=error');
    }
});

// Rutas para edición
router.get('/editar/:id', paisajeController.editarPaisajeForm);
router.post('/editar/:id', upload.single('imagen'), paisajeController.actualizarPaisaje);

// Ruta para eliminar un paisaje
router.get('/eliminar/:id', paisajeController.deletePaisaje);

module.exports = router;
