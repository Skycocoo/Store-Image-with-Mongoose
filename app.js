// modified by Yuxi Luo, July 2018

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');

//=====================================================================

var routes = require('./routes/imagefile');

// connect to mongodb with default port (27017)
mongoose.connect('mongodb://localhost/imagespath');

app.use(routes);

// URL : http://localhost:8000/images/
// To get all the images/files ids stored in MongoDB
app.get('/images', (req, res) => {

    // http://mongoosejs.com/docs/api.html#model_Model.create
    routes.getImages((err, docs) => {
        if (err) {
            throw err;
        }
        res.json(docs.map(doc => doc['_id']));
    });
});

//=====================================================================

var server = app.listen(8000, 'localhost', function () {
    console.log("Example app listening at localhost:8000");
});
