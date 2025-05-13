const express = require('express');
const router = express.Router();
const paisajeController = require('../controllers/paisajeController');

router.get('/', paisajeController.getAllPaisajes);
router.post('/', paisajeController.createPaisaje);
router.get('/:id', paisajeController.getPaisajeById);
router.put('/:id', paisajeController.updatePaisaje);
router.delete('/:id', paisajeController.deletePaisaje);

module.exports = router;