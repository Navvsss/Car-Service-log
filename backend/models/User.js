const mongoose = require('mongoose');

const originalModel = mongoose.model;

mongoose.model = function(name, schema) {
    if (typeof global.mockDatabase === 'undefined') {
        return originalModel.call(this, name, schema);
    }
    
    class MockUser {
        constructor(data) {
            Object.assign(this, data);
            this._id = this._id || global.generateId();
            this.createdAt = this.createdAt || new Date();
            this.updatedAt = new Date();
        }
        
        save() {
            global.mockDatabase.users.push(this);
            return Promise.resolve(this);
        }
        
        static find(query = {}) {
            return Promise.resolve(global.mockDatabase.users.filter(user => {
                return Object.keys(query).every(key => user[key] === query[key]);
            }));
        }
        
        static findOne(query) {
            return Promise.resolve(global.mockDatabase.users.find(user => {
                return Object.keys(query).every(key => user[key] === query[key]);
            }));
        }
        
        static findById(id) {
            return Promise.resolve(global.mockDatabase.users.find(user => user._id === id));
        }
        
        static findByIdAndUpdate(id, updates) {
            const userIndex = global.mockDatabase.users.findIndex(user => user._id === id);
            if (userIndex === -1) return Promise.resolve(null);
            
            global.mockDatabase.users[userIndex] = { 
                ...global.mockDatabase.users[userIndex], 
                ...updates, 
                updatedAt: new Date() 
            };
            return Promise.resolve(global.mockDatabase.users[userIndex]);
        }
        
        static findByIdAndDelete(id) {
            const userIndex = global.mockDatabase.users.findIndex(user => user._id === id);
            if (userIndex === -1) return Promise.resolve(null);
            
            const deletedUser = global.mockDatabase.users[userIndex];
            global.mockDatabase.users.splice(userIndex, 1);
            return Promise.resolve(deletedUser);
        }
    }
    
    return MockUser;
};

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);