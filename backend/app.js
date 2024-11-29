const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const bikesRoutes = require('./routes/bikeRoutes');

//Configuração do middleware
app.use(cors());
app.use(bodyParser.json());

//Definição das rotas
app.use('/api/bikes', bikesRoutes);


//Configuração do servidor 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server runing on port ${PORT}`);
});