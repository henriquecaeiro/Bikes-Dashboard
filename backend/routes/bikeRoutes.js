const express = require('express');
const router = express.Router();
const bikesController = require('../controllers/bikes');
const upload = require("../middleware/upload");


//Rotas
router.post('/', (req, res, next) => {
    upload.any()(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message }); // Trata erros do multer aqui.
        }
        next();
    });
}, bikesController.createBike);

router.get('/', bikesController.listBikes);

/* router.put('/:id', updateBike);
router.get('/', listBikes);
router.delete('/:id/sell', sellBike);
router.post('/:id/exchange', exchangeBike); */

module.exports = router