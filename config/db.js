const mongoose = require('mongoose');

mongoose
    .connect('mongodb+srv://"+process.env.MONGODB_PASSWORD+"@cluster0.bru98.mongodb.net/mernProject',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
    )
    .then(() => console.log('Connectet to MongoDB'))
    .catch((err) => console.log('Failed to connect to MongoDB', err));