// IMPORTS
const express = require('express');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
require('dotenv').config({path: './config/.env'});
require('./config/db');
const app = express();

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//ROUTES
app.use('/api/user', userRoutes);

// SERVER
app.listen(5000, () => {
    console.log(`listenning on port ${process.env.PORT}`);
})