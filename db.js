const mongoose = require('mongoose');
require('dotenv').config();

const db = mongoose
            .connect(process.env.DB)
            .then( () => {
                console.log("Database is connected successfully.")
            })
            .catch( (error) => {
                console.log("Error Connection to database ", error);
            });

module.exports = db;