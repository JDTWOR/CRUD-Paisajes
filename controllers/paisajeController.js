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

exports.getPaisajeById = async (req, res) => {
  try {
    const paisaje = await Paisaje.findById(req.params.id);
    res.render('paisajes/show', { paisaje });
  } catch (error) {
    res.status(404).json({ message: 'Paisaje no encontrado' });
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