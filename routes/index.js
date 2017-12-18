var express = require('express');
var Router = express.Router();
var questionRoutes = require('./questionRoutes');

Router.use('/questions', questionRoutes);

module.exports = Router;