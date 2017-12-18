const express = require('express');

const  Router = express.Router();
const  questionController = require('../controllers/questionController');


Router.post('/' , questionController.create);

module.exports = Router;