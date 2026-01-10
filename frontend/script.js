let cars = JSON.parse(localStorage.getItem('cars')) || [];
let services = JSON.parse(localStorage.getItem('services')) || [];

const carsContainer = document.getElementById('cars-container');
const servicesContainer = document.getElementById('services-container');
const carModal = document.getElementById('car-modal');
const serviceModal = document.getElementById('service-modal');
const carForm = document.getElementById('car-form');
const serviceForm = document.getElementById('service-form');
const addCarBtn = document.getElementById('add-car-btn');
const addServiceBtn = document.getElementById('add-service-btn');
const carSelect = document.getElementById('car-select');

document.addEventListener('DOMContentLoaded', () => {
    renderCars();
    renderServices();
});

addCarBtn.addEventListener('click', () => {
    if (checkAuth()) {
        openCarModal();
    } else {
        alert('Please log in to add a vehicle');
        window.location.href = 'profile.html';
    }
});

addServiceBtn.addEventListener('click', () => {
    populateCarSelect();
    openServiceModal();
});

carForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveCar();
});

serviceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveService();
});

document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        closeCarModal();
        closeServiceModal();
    });
});

window.addEventListener('click', (e) => {
    if (e.target === carModal) closeCarModal();
    if (e.target === serviceModal) closeServiceModal();
});

function openCarModal(car = null) {
    document.getElementById('car-modal-title').textContent = car ? 'Edit Vehicle' : 'Add New Vehicle';
    if (car) {
        document.getElementById('car-id').value = car.id;
        document.getElementById('make').value = car.make;
        document.getElementById('model').value = car.model;
        document.getElementById('year').value = car.year;
        document.getElementById('vin').value = car.vin || '';
    } else {
        carForm.reset();
        document.getElementById('car-id').value = '';
    }
    carModal.style.display = 'block';
}

function closeCarModal() {
    carModal.style.display = 'none';
}

function saveCar() {
    const id = document.getElementById('car-id').value || Date.now().toString();
    const make = document.getElementById('make').value;
    const model = document.getElementById('model').value;
    const year = document.getElementById('year').value;
    const vin = document.getElementById('vin').value;

    const car = { id, make, model, year, vin };

    if (document.getElementById('car-id').value) {
        const index = cars.findIndex(c => c.id === id);
        if (index !== -1) {
            cars[index] = car;
        }
    } else {
        cars.push(car);
    }

    localStorage.setItem('cars', JSON.stringify(cars));
    renderCars();
    closeCarModal();
}

function deleteCar(id) {
    if (confirm('Are you sure you want to delete this vehicle and all its service records?')) {
        cars = cars.filter(car => car.id !== id);
        services = services.filter(service => service.carId !== id);
        localStorage.setItem('cars', JSON.stringify(cars));
        localStorage.setItem('services', JSON.stringify(services));
        renderCars();
        renderServices();
    }
}

function renderCars() {
    if (cars.length === 0) {
        carsContainer.innerHTML = `
            <div class="empty-state">
                <p>No vehicles added yet.</p>
                <button class="btn-primary" onclick="openCarModal()">Add Your First Vehicle</button>
            </div>
        `;
        return;
    }

    carsContainer.innerHTML = cars.map(car => `
        <div class="card">
            <div class="card-header">
                <div class="card-title">${car.make} ${car.model}</div>
                <div class="card-actions">
                    <button class="btn-edit" onclick='openCarModal(${JSON.stringify(car)})'>Edit</button>
                    <button class="btn-delete" onclick="deleteCar('${car.id}')">Delete</button>
                </div>
            </div>
            <div class="card-content">
                <p><strong>Year:</strong> ${car.year}</p>
                ${car.vin ? `<p><strong>VIN:</strong> ${car.vin}</p>` : ''}
            </div>
        </div>
    `).join('');
}

function openServiceModal(service = null) {
    document.getElementById('service-modal-title').textContent = service ? 'Edit Service' : 'Add New Service';
    if (service) {
        document.getElementById('service-id').value = service.id;
        document.getElementById('car-select').value = service.carId;
        document.getElementById('service-date').value = service.date;
        document.getElementById('service-type').value = service.type;
        document.getElementById('mileage').value = service.mileage;
        document.getElementById('cost').value = service.cost;
        document.getElementById('notes').value = service.notes || '';
    } else {
        serviceForm.reset();
        document.getElementById('service-id').value = '';
        document.getElementById('service-date').value = new Date().toISOString().split('T')[0];
    }
    serviceModal.style.display = 'block';
}

function closeServiceModal() {
    serviceModal.style.display = 'none';
}

function populateCarSelect() {
    if (cars.length === 0) {
        carSelect.innerHTML = '<option value="">No vehicles available. Add a vehicle first.</option>';
        return;
    }
    
    carSelect.innerHTML = cars.map(car => 
        `<option value="${car.id}">${car.make} ${car.model} (${car.year})</option>`
    ).join('');
}

function saveService() {
    const id = document.getElementById('service-id').value || Date.now().toString();
    const carId = document.getElementById('car-select').value;
    const date = document.getElementById('service-date').value;
    const type = document.getElementById('service-type').value;
    const mileage = document.getElementById('mileage').value;
    const cost = document.getElementById('cost').value;
    const notes = document.getElementById('notes').value;

    const service = { id, carId, date, type, mileage, cost, notes };

    if (document.getElementById('service-id').value) {
        const index = services.findIndex(s => s.id === id);
        if (index !== -1) {
            services[index] = service;
        }
    } else {
        services.push(service);
    }

    localStorage.setItem('services', JSON.stringify(services));
    renderServices();
    closeServiceModal();
}

function deleteService(id) {
    if (confirm('Are you sure you want to delete this service record?')) {
        services = services.filter(service => service.id !== id);
        localStorage.setItem('services', JSON.stringify(services));
        renderServices();
    }
}

function renderServices() {
    if (services.length === 0) {
        servicesContainer.innerHTML = `
            <div class="empty-state">
                <p>No service records added yet.</p>
                <button class="btn-primary" onclick="populateCarSelect(); openServiceModal()">Add Your First Service</button>
            </div>
        `;
        return;
    }

    const sortedServices = [...services].sort((a, b) => new Date(b.date) - new Date(a.date));

    servicesContainer.innerHTML = sortedServices.map(service => {
        const car = cars.find(c => c.id === service.carId);
        const carName = car ? `${car.make} ${car.model}` : 'Unknown Vehicle';
        
        return `
        <div class="card service-card">
            <div class="card-header">
                <div class="card-title">${service.type}</div>
                <div class="card-actions">
                    <button class="btn-edit" onclick='openServiceModal(${JSON.stringify(service)})'>Edit</button>
                    <button class="btn-delete" onclick="deleteService('${service.id}')">Delete</button>
                </div>
            </div>
            <div class="card-content">
                <p><strong>Vehicle:</strong> ${carName}</p>
                <p><strong>Date:</strong> ${formatDate(service.date)}</p>
                <p><strong>Mileage:</strong> ${parseInt(service.mileage).toLocaleString()} miles</p>
                <p><strong>Cost:</strong> £${parseFloat(service.cost).toFixed(2)}</p>
                ${service.notes ? `<p><strong>Notes:</strong> ${service.notes}</p>` : ''}
            </div>
        </div>
    `}).join('');
}

function checkAuth() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatCurrency(amount) {
    return 'AED ' + parseFloat(amount).toFixed(2);
}