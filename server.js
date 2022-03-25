//imports
const express = require('express');
require('dotenv').config({path: './config/.env'});
require('./config/db');
const app = express();

//config .env = configuration, variables environnement, avec la dépendance dotenv 
app.listen(process.env.PORT, () => {
    console.log(`listenning on port ${process.env.PORT}`);
});