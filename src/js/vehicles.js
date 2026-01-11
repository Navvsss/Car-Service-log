let cars = JSON.parse(localStorage.getItem('cars')) || [];

const carsContainer = document.getElementById('cars-container');
const carModal = document.getElementById('car-modal');
const carForm = document.getElementById('car-form');
const addCarBtn = document.getElementById('add-car-btn');

document.addEventListener('DOMContentLoaded', () => {
    renderCars();
});

addCarBtn.addEventListener('click', () => {
    if (checkAuth()) {
        openCarModal();
    } else {
        alert('Please log in to add a vehicle');
        window.location.href = 'profile.html';
    }
});

carForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveCar();
});

document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        closeCarModal();
    });
});

window.addEventListener('click', (e) => {
    if (e.target === carModal) closeCarModal();
});

function openCarModal(car = null) {
    document.getElementById('car-modal-title').textContent = car ? 'Edit Vehicle' : 'Add New Vehicle';
    if (car) {
        document.getElementById('car-id').value = car.id;
        document.getElementById('make').value = car.make;
        document.getElementById('model').value = car.model;
        document.getElementById('year').value = car.year;
        document.getElementById('vin').value = car.vin || '';
        document.getElementById('color').value = car.color || '';
        document.getElementById('mileage').value = car.mileage || '';
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
    const color = document.getElementById('color').value;
    const mileage = document.getElementById('mileage').value;

    const car = { id, make, model, year, vin, color, mileage };

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
        let services = JSON.parse(localStorage.getItem('services')) || [];
        services = services.filter(service => service.carId !== id);
        localStorage.setItem('cars', JSON.stringify(cars));
        localStorage.setItem('services', JSON.stringify(services));
        renderCars();
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
                <div class="card-title">
                    <div class="vehicle-logo">
                        <img src="${getVehicleLogo(car.make)}" alt="${car.make} logo" onerror="this.src='/logos/default.png'">
                    </div>
                    ${car.make} ${car.model}
                </div>
                <div class="card-actions">
                    <button class="btn-edit" onclick='openCarModal(${JSON.stringify(car)})'>Edit</button>
                    <button class="btn-delete" onclick="deleteCar('${car.id}')">Delete</button>
                </div>
            </div>
            <div class="card-content">
                <p><strong>Year:</strong> ${car.year}</p>
                ${car.color ? `<p><strong>Color:</strong> ${car.color}</p>` : ''}
                ${car.mileage ? `<p><strong>Mileage:</strong> ${parseInt(car.mileage).toLocaleString()} miles</p>` : ''}
                ${car.vin ? `<p><strong>VIN:</strong> ${car.vin}</p>` : ''}
            </div>
        </div>
    `).join('');
}

function checkAuth() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

function formatCurrency(amount) {
    return 'AED ' + parseFloat(amount).toFixed(2);
}