const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

router.post('/', async (req, res) => {
    const { vehicleId, date, type, mileage, cost, notes, userId } = req.body;
    try {
        const newService = new Service({ vehicleId, date, type, mileage, cost, notes, userId });
        await newService.save();
        res.status(201).json(newService);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const services = await Service.find({ userId: req.params.userId }).populate('vehicleId');
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/admin', async (req, res) => {
    try {
        const services = await Service.find().populate('vehicleId');
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/vehicle/:vehicleId', async (req, res) => {
    try {
        const services = await Service.find({ vehicleId: req.params.vehicleId });
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate('vehicleId');
        if (!service) return res.status(404).json({ error: 'Service not found' });
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('vehicleId');
        if (!service) return res.status(404).json({ error: 'Service not found' });
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) return res.status(404).json({ error: 'Service not found' });
        res.json({ message: 'Service deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;