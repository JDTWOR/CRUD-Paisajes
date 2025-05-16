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
    const paisaje = new Paisaje(req.body);
    await paisaje.save();
    res.redirect('/paisajes');
  } catch (error) {
    res.status(400).json({ message: error.message });
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

exports.updatePaisaje = async (req, res) => {
  try {
    await Paisaje.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/paisajes');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePaisaje = async (req, res) => {
  try {
    await Paisaje.findByIdAndDelete(req.params.id);
    res.redirect('/paisajes');
  } catch (error) {
    res.status(400).json({ message: error.message });
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