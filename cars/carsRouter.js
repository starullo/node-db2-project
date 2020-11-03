const express = require('express');
const knex = require('knex');
const db = require('../data/config');

const router = express.Router();

//actions or whatever they're called
const Cars = {
    getAll() {
        return db('cars')
    },
    getByVIN(vin) {
        return db('cars').where({vin: vin}).first();
    },
    createCar(car) {
        return db('cars').insert(car)
    },
    updateCar(vin, car) {
        return db('cars').where({vin}).update(car);
    },
    deleteCar(vin) {
        return db('cars').where({vin}).del();
    }
}


//middleware
const validateVIN = (req, res, next) => {
    const vin = req.params.vin;
    Cars.getByVIN(vin)
    .then(data=>{
        if (data) {
            req.carInfo = data;
            next();
        } else {
            next({code: 404, message: 'the vin  ' + vin + ' is not found'})
        }
    })
    .catch(err=>{
        next({code: 500, message: 'something went wrong'})
    })
}

const validateNewCar = (req, res, next) => {
    if (req.body.vin.toString().length != 16) {
        next({code: 404, message: 'VIN must be 16 digits long'})
    } else if (!req.body.vin || !req.body.make || !req.body.model || !req.body.mileage) {
        next({code: 404, message: 'VIN, make model, and mileage are all required fields'})
    } else {
        next();
    }
}

router.get('/', (req, res, next)=>{
    Cars.getAll()
    .then(data=>{
        res.json(data)
    })
    .catch(err=>{
        res.status(500).json({message: err.message})
    })
})

router.get('/:vin', validateVIN, (req, res, next)=>{
    res.status(200).json(req.carInfo);
})

router.post('/', validateNewCar, (req, res, next)=>{
    Cars.createCar(req.body)
    .then(([data])=>{
        return Cars.getByVIN(data)
    })
    .then(car=>{
        res.status(201).json(car)
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({message: err.message})
    })
})

router.put('/:vin', [validateVIN, validateNewCar], (req, res, next)=>{
    Cars.updateCar(req.params.vin, req.body)
    .then(data=>{
        console.log(data)
        return Cars.getByVIN(req.params.vin)
    })
    .then(wow=>{
        res.status(200).json(wow)
    })
    .catch(err=>{
        res.status(500).json(err.message)
    })
})

router.delete('/:vin', validateVIN, (req, res, next)=>{
    Cars.deleteCar(req.params.vin)
    .then(data=>{
        if (data) {
            res.status(200).json({message: 'Car deleted successfully'})
        } else {
            res.status(404).json({message: 'No car with the vin of ' + req.params.vin})
        }
    })
    .catch(err=>{
        res.status(500).json({message: 'something went wrong'})
    })
})


//error handler middleware
router.use((err, req, res, next)=>{
    res.status(err.code).json({message: err.message})
})

module.exports = router;