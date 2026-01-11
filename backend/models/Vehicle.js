const mongoose = require('mongoose');

const originalModel = mongoose.model;

mongoose.model = function(name, schema) {
    if (typeof global.mockDatabase === 'undefined') {
        return originalModel.call(this, name, schema);
    }
    
    class MockVehicle {
        constructor(data) {
            Object.assign(this, data);
            this._id = this._id || global.generateId();
            this.createdAt = this.createdAt || new Date();
            this.updatedAt = new Date();
        }
        
        save() {
            global.mockDatabase.vehicles.push(this);
            return Promise.resolve(this);
        }
        
        static find(query = {}) {
            return Promise.resolve(global.mockDatabase.vehicles.filter(vehicle => {
                return Object.keys(query).every(key => vehicle[key] === query[key]);
            }));
        }
        
        static findOne(query) {
            return Promise.resolve(global.mockDatabase.vehicles.find(vehicle => {
                return Object.keys(query).every(key => vehicle[key] === query[key]);
            }));
        }
        
        static findById(id) {
            return Promise.resolve(global.mockDatabase.vehicles.find(vehicle => vehicle._id === id));
        }
        
        static findByIdAndUpdate(id, updates) {
            const vehicleIndex = global.mockDatabase.vehicles.findIndex(vehicle => vehicle._id === id);
            if (vehicleIndex === -1) return Promise.resolve(null);
            
            global.mockDatabase.vehicles[vehicleIndex] = { 
                ...global.mockDatabase.vehicles[vehicleIndex], 
                ...updates, 
                updatedAt: new Date() 
            };
            return Promise.resolve(global.mockDatabase.vehicles[vehicleIndex]);
        }
        
        static findByIdAndDelete(id) {
            const vehicleIndex = global.mockDatabase.vehicles.findIndex(vehicle => vehicle._id === id);
            if (vehicleIndex === -1) return Promise.resolve(null);
            
            const deletedVehicle = global.mockDatabase.vehicles[vehicleIndex];
            global.mockDatabase.vehicles.splice(vehicleIndex, 1);
            return Promise.resolve(deletedVehicle);
        }
    }
    
    return MockVehicle;
};

const VehicleSchema = new mongoose.Schema({
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    vin: {
        type: String
    },
    color: {
        type: String
    },
    mileage: {
        type: Number
    },
    userId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Vehicle', VehicleSchema);