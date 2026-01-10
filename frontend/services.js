let cars = JSON.parse(localStorage.getItem('cars')) || [];
let services = JSON.parse(localStorage.getItem('services')) || [];

const servicesContainer = document.getElementById('services-container');
const serviceModal = document.getElementById('service-modal');
const serviceForm = document.getElementById('service-form');
const addServiceBtn = document.getElementById('add-service-btn');
const carSelect = document.getElementById('car-select');

document.addEventListener('DOMContentLoaded', () => {
    renderServices();
});

addServiceBtn.addEventListener('click', () => {
    if (checkAuth()) {
        populateCarSelect();
        openServiceModal();
    } else {
        alert('Please log in to add a service');
        window.location.href = 'profile.html';
    }
});

serviceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveService();
});

document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        closeServiceModal();
    });
});

window.addEventListener('click', (e) => {
    if (e.target === serviceModal) closeServiceModal();
});

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

function getVehicleLogo(make) {
    const logoMap = {
        'Audi': '/logos/audi.png',
        'BMW': '/logos/bmw.png',
        'Chevrolet': '/logos/chevrolet.png',
        'Ford': '/logos/ford.png',
        'Honda': '/logos/honda.png',
        'Hyundai': '/logos/hyundai.png',
        'Jeep': '/logos/jeep.png',
        'Kia': '/logos/kia.png',
        'Mercedes-Benz': '/logos/mercedes.png',
        'Nissan': '/logos/nissan.png',
        'Subaru': '/logos/subaru.png',
        'Tesla': '/logos/tesla.png',
        'Toyota': '/logos/toyota.png',
        'Volkswagen': '/logos/volkswagen.png',
        'Volvo': '/logos/volvo.png'
    };
    
    const logoFile = logoMap[make];
    if (logoFile) {
        return logoFile;
    }
    return '/logos/default.png';
}

function renderServices() {
    cars = JSON.parse(localStorage.getItem('cars')) || [];
    services = JSON.parse(localStorage.getItem('services')) || [];
    
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
        const carLogo = car ? getVehicleLogo(car.make) : '/logos/default.png';
        
        return `
        <div class="card service-card">
            <div class="card-header">
                <div class="card-title">
                    <div class="vehicle-logo">
                        <img src="${carLogo}" alt="${car ? car.make : 'Vehicle'} logo" onerror="this.src='/logos/default.png'">
                    </div>
                    ${service.type}
                </div>
                <div class="card-actions">
                    <button class="btn-edit" onclick='openServiceModal(${JSON.stringify(service)})'>Edit</button>
                    <button class="btn-delete" onclick="deleteService('${service.id}')">Delete</button>
                </div>
            </div>
            <div class="card-content">
                <p><strong>Vehicle:</strong> ${carName} (${car ? car.year : ''})</p>
                <p><strong>Date:</strong> ${formatDate(service.date)}</p>
                <p><strong>Mileage:</strong> ${parseInt(service.mileage).toLocaleString()} miles</p>
                <p><strong>Cost:</strong> ${formatCurrency(service.cost)}</p>
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