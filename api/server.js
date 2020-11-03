const express = require('express');
const helmet = require('helmet');

const carsRouter = require('../cars/carsRouter');

const server = express();

server.use(helmet());
server.use(express.json());

server.use('/api/cars', carsRouter);

server.use('*', (req, res, next)=>{
    res.status(400).json({message: 'Page not found'})
})

module.exports = server;