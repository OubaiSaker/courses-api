require('dotenv').config();

const express = require('express');

const cors = require('cors');

const path = require('path')

const coursesRouter = require('./routes/courses.route')

const usersRouter = require('./routes/users.route')

///////////////
const url = process.env.MONGO_URL;

const mongoose = require('mongoose')

mongoose.connect(url).then(() => {
    console.log("mongodb server start")
})
///////////////
const app = express();

app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(express.json());

app.use('/api/courses', coursesRouter)

app.use('/api/users', usersRouter)
///////////////
/// global middleware for not found rounts
app.all('*', (req, res, next) => {
    res.status(404).json({ status: "ERROR", message: 'this resource is not available' })
})
/// global error handler 
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        status: error.statusText,
        message: error.message,
        code: error.statusCode || 500,
        data: null
    })
})

app.listen(3000, () => {
    console.log("server listening on port 3000");
});
