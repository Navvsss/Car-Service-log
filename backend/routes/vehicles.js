const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

router.post('/', async (req, res) => {
    const { make, model, year, vin, color, mileage, userId } = req.body;
    try {
        const newVehicle = new Vehicle({ make, model, year, vin, color, mileage, userId });
        await newVehicle.save();
        res.status(201).json(newVehicle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ userId: req.params.userId });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/admin', async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/vehicle/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
        res.json({ message: 'Vehicle deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;