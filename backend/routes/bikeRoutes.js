const express = require('express');
const router = express.Router();

//Controllers
const {createBike/* , updateBike, listBikes, deleteBike, sellBike, exchangeBike */} = require('../controllers/bikesController');

//Rotas
router.post('/', createBike);
/* router.put('/:id', updateBike);
router.get('/', listBikes);
router.delete('/:id/sell', sellBike);
router.post('/:id/exchange', exchangeBike);
 */
module.exports = router