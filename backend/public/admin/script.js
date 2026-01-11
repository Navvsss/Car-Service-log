document.addEventListener('DOMContentLoaded', async () => {
    if (document.getElementById('userTableBody')) {
        await loadUsers();
    }

    if (document.getElementById('vehicleTableBody')) {
        await loadVehicles();
    }

    if (document.getElementById('serviceTableBody')) {
        await loadServices();
    }

    if (document.getElementById('addUserForm')) {
        document.getElementById('addUserForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            await fetch('/api/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            window.location.href = 'index.html';
        });
    }

    if (document.getElementById('addVehicleForm')) {
        document.getElementById('addVehicleForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const make = document.getElementById('make').value;
            const model = document.getElementById('model').value;
            const year = document.getElementById('year').value;
            const vin = document.getElementById('vin').value;
            const color = document.getElementById('color').value;
            const mileage = document.getElementById('mileage').value;
            const userId = document.getElementById('userId').value;

            await fetch('/api/vehicles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ make, model, year, vin, color, mileage, userId })
            });

            window.location.href = 'index.html';
        });
    }

    if (document.getElementById('addServiceForm')) {
        document.getElementById('addServiceForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const vehicleId = document.getElementById('vehicleId').value;
            const date = document.getElementById('date').value;
            const type = document.getElementById('type').value;
            const mileage = document.getElementById('mileage').value;
            const cost = document.getElementById('cost').value;
            const notes = document.getElementById('notes').value;
            const userId = document.getElementById('userId').value;

            await fetch('/api/services', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ vehicleId, date, type, mileage, cost, notes, userId })
            });

            window.location.href = 'index.html';
        });
    }

    if (document.getElementById('editUserForm')) {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('id');
        
        if (userId) {
            const user = await fetch(`/api/users/${userId}`).then(res => res.json());

            document.getElementById('userId').value = user._id;
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;

            document.getElementById('editUserForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const id = document.getElementById('userId').value;
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                const updateData = { name, email };
                if (password) {
                    updateData.password = password;
                }

                await fetch(`/api/users/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateData)
                });

                window.location.href = 'index.html';
            });
        }
    }
});

async function loadUsers() {
    try {
        const users = await fetch('/api/users').then(res => res.json());
        const userTableBody = document.getElementById('userTableBody');
        userTableBody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.isAdmin ? 'Admin' : 'User'}</td>
                <td>
                    <a href="edit-user.html?id=${user._id}">Edit</a>
                    <button onclick="deleteUser('${user._id}')">Delete</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function loadVehicles() {
    try {
        const vehicles = await fetch('/api/vehicles/admin').then(res => res.json());
        const vehicleTableBody = document.getElementById('vehicleTableBody');
        vehicleTableBody.innerHTML = '';
        vehicles.forEach(vehicle => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${vehicle.make}</td>
                <td>${vehicle.model}</td>
                <td>${vehicle.year}</td>
                <td>${vehicle.userId}</td>
                <td>
                    <button onclick="deleteVehicle('${vehicle._id}')">Delete</button>
                </td>
            `;
            vehicleTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading vehicles:', error);
    }
}

async function loadServices() {
    try {
        const services = await fetch('/api/services/admin').then(res => res.json());
        const serviceTableBody = document.getElementById('serviceTableBody');
        serviceTableBody.innerHTML = '';
        services.forEach(service => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${service.vehicleId}</td>
                <td>${service.type}</td>
                <td>${new Date(service.date).toLocaleDateString()}</td>
                <td>$${service.cost}</td>
                <td>
                    <button onclick="deleteService('${service._id}')">Delete</button>
                </td>
            `;
            serviceTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

async function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        await fetch(`/api/users/${id}`, {
            method: 'DELETE'
        });
        window.location.reload();
    }
}

async function deleteVehicle(id) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
        await fetch(`/api/vehicles/${id}`, {
            method: 'DELETE'
        });
        window.location.reload();
    }
}

async function deleteService(id) {
    if (confirm('Are you sure you want to delete this service?')) {
        await fetch(`/api/services/${id}`, {
            method: 'DELETE'
        });
        window.location.reload();
    }
}