'use strict';

var http = require('http');
var fs = require('fs');
var zlib = require('zlib');

module.exports = function(app) {

    // Home route
    var index = require('../controllers/index');

    app.route('/').get(index.render);

};
