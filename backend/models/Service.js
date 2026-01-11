const mongoose = require('mongoose');

const originalModel = mongoose.model;

mongoose.model = function(name, schema) {
    if (typeof global.mockDatabase === 'undefined') {
        return originalModel.call(this, name, schema);
    }
    
    class MockService {
        constructor(data) {
            Object.assign(this, data);
            this._id = this._id || global.generateId();
            this.createdAt = this.createdAt || new Date();
            this.updatedAt = new Date();
        }
        
        save() {
            global.mockDatabase.services.push(this);
            return Promise.resolve(this);
        }
        
        static find(query = {}) {
            return Promise.resolve(global.mockDatabase.services.filter(service => {
                return Object.keys(query).every(key => service[key] === query[key]);
            }));
        }
        
        static findOne(query) {
            return Promise.resolve(global.mockDatabase.services.find(service => {
                return Object.keys(query).every(key => service[key] === query[key]);
            }));
        }
        
        static findById(id) {
            return Promise.resolve(global.mockDatabase.services.find(service => service._id === id));
        }
        
        static findByIdAndUpdate(id, updates) {
            const serviceIndex = global.mockDatabase.services.findIndex(service => service._id === id);
            if (serviceIndex === -1) return Promise.resolve(null);
            
            global.mockDatabase.services[serviceIndex] = { 
                ...global.mockDatabase.services[serviceIndex], 
                ...updates, 
                updatedAt: new Date() 
            };
            return Promise.resolve(global.mockDatabase.services[serviceIndex]);
        }
        
        static findByIdAndDelete(id) {
            const serviceIndex = global.mockDatabase.services.findIndex(service => service._id === id);
            if (serviceIndex === -1) return Promise.resolve(null);
            
            const deletedService = global.mockDatabase.services[serviceIndex];
            global.mockDatabase.services.splice(serviceIndex, 1);
            return Promise.resolve(deletedService);
        }
    }
    
    return MockService;
};

const ServiceSchema = new mongoose.Schema({
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    mileage: {
        type: Number,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    notes: {
        type: String
    },
    userId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Service', ServiceSchema);