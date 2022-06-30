const express = require('express');
const routes = require('./routes/route');
const mongoose = require('mongoose');

const app = express();

const uri = "mongodb://Localhost:27017/friend";
mongoose.connect(uri, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to MongoDB');
    }
});

app.use(express.json());

app.get('/api', (req, res) => {
    res.send("hello world");
});

const port = process.env.port || 3000;

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})