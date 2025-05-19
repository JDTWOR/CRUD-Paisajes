const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const Paisaje = require('../models/paisajeModel');
const paisajeModel = require('../models/paisajeModel');
const paisajeController = require('../controllers/paisajeController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Rutas públicas
router.get('/', paisajeController.getIndex);
router.get('/ver/:id', isAuthenticated, paisajeController.verPaisaje);

// Ruta para mostrar el formulario de agregar
router.get('/agregar', isAdmin, paisajeController.getAgregar);

// Ruta para procesar el formulario
router.post('/agregar', isAdmin, upload.single('imagen'), paisajeController.createPaisaje);

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
router.get('/editar/:id', isAdmin, paisajeController.editarPaisajeForm);
router.post('/editar/:id', isAdmin, upload.single('imagen'), paisajeController.actualizarPaisaje);

// Ruta para eliminar un paisaje
router.get('/eliminar/:id', isAdmin, paisajeController.deletePaisaje);

module.exports = router;
