const Paisaje = require('../models/paisajeModel');

exports.getAllPaisajes = async (req, res) => {
  try {
    const paisajes = await Paisaje.find();
    res.render('paisajes/index', { paisajes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPaisaje = async (req, res) => {
    try {
        if (!req.file) {
            return res.redirect('/paisajes/agregar?mensaje=La imagen es obligatoria&tipo=error');
        }

        const nuevoPaisaje = new Paisaje({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            imagen: `/uploads/${req.file.filename}` // Asegúrate de que esta ruta sea correcta
        });

        await nuevoPaisaje.save();
        res.redirect('/paisajes?mensaje=Sitio turístico agregado correctamente&tipo=success');
    } catch (error) {
        console.error('Error:', error);
        res.redirect('/paisajes/agregar?mensaje=' + error.message + '&tipo=error');
    }
};
// Método para mostrar el formulario de edición
exports.editarPaisajeForm = async (req, res) => {
    try {
        const paisaje = await Paisaje.findById(req.params.id);
        if (!paisaje) {
            return res.redirect('/paisajes?mensaje=Sitio turístico no encontrado&tipo=error');
        }
        res.render('paisajes/editar', { paisaje });
    } catch (error) {
        console.error(error);
        res.redirect('/paisajes?mensaje=Error al cargar el formulario&tipo=error');
    }
};

// Método para procesar la actualización
exports.actualizarPaisaje = async (req, res) => {
    try {
        const { nombre, descripcion, precio } = req.body;
        const paisaje = await Paisaje.findById(req.params.id);

        if (!paisaje) {
            return res.redirect('/paisajes?mensaje=Sitio turístico no encontrado&tipo=error');
        }

        // Actualizar los campos básicos
        paisaje.nombre = nombre;
        paisaje.descripcion = descripcion;
        paisaje.precio = precio;

        // Si hay una nueva imagen, actualizarla
        if (req.file) {
            paisaje.imagen = `/uploads/${req.file.filename}`;
        }

        await paisaje.save();
        res.redirect('/paisajes?mensaje=Sitio turístico actualizado correctamente&tipo=success');
    } catch (error) {
        console.error(error);
        res.redirect('/paisajes?mensaje=Error al actualizar: ' + error.message + '&tipo=error');
    }
};

exports.deletePaisaje = async (req, res) => {
    try {
        const paisaje = await Paisaje.findByIdAndDelete(req.params.id);
        
        if (!paisaje) {
            return res.redirect('/paisajes?mensaje=Sitio turístico no encontrado&tipo=error');
        }

        // Si hay una imagen asociada, eliminarla del servidor
        if (paisaje.imagen) {
            const path = require('path');
            const fs = require('fs');
            const imagePath = path.join(__dirname, '..', 'public', paisaje.imagen);
            
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.redirect('/paisajes?mensaje=Sitio turístico eliminado correctamente&tipo=success');
    } catch (error) {
        console.error('Error al eliminar:', error);
        res.redirect('/paisajes?mensaje=Error al eliminar el sitio turístico&tipo=error');
    }
};

//metodo para ver informacion detallada del sitio
exports.verPaisaje = async (req, res) => {
    try {
        const paisaje = await Paisaje.findById(req.params.id);
        if (!paisaje) {
            return res.redirect('/paisajes?mensaje=Sitio turístico no encontrado&tipo=error');
        }
        res.render('paisajes/ver', { paisaje });
    } catch (error) {
        console.error(error);
        res.redirect('/paisajes?mensaje=Error al cargar los detalles&tipo=error');
    }
};

exports.getIndex = async (req, res) => {
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
};

exports.getAgregar = (req, res) => {
    res.render('paisajes/agregar', {
        activeRoute: 'agregar',
        title: 'Agregar Nuevo Sitio'
    });
};