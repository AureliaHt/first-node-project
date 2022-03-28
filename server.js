const express = require('express');
const userRoutes = require('./routes/user.routes');
require('dotenv').config({path: './config/.env'});
require('./config/db');
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/api/user', userRoutes);

// server 
app.listen(5000, () => {
    console.log(`listenning on port ${process.env.PORT}`);
})