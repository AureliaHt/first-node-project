const mongoose = require('mongoose');

mongoose
    .connect(
        "mongodb+srv://" + process.env.DB_USER_PASS + "@cluster0.bru98.mongodb.net/first-mern-project",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
    )
    .then(() => console.log('connected to mongoDB'))
    .catch((err) => console.log('failed to connect to mongoDB', err));