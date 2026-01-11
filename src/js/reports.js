let cars = JSON.parse(localStorage.getItem('cars')) || [];
let services = JSON.parse(localStorage.getItem('services')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateReportStats();
});

function updateReportStats() {
    document.getElementById('summary-vehicles').textContent = cars.length;
    
    document.getElementById('summary-services').textContent = services.length;
    
    const totalSpent = services.reduce((sum, service) => sum + parseFloat(service.cost || 0), 0);
    document.getElementById('total-spent').textContent = formatCurrency(totalSpent);
    
    const avgCost = services.length > 0 ? totalSpent / services.length : 0;
    document.getElementById('avg-cost').textContent = formatCurrency(avgCost);
    
    const avgServices = cars.length > 0 ? services.length / cars.length : 0;
    document.getElementById('avg-services').textContent = avgServices.toFixed(1);
    
    if (cars.length > 0 && services.length > 0) {
        const serviceCount = {};
        services.forEach(service => {
            serviceCount[service.carId] = (serviceCount[service.carId] || 0) + 1;
        });
        
        let maxServices = 0;
        let mostServicedCarId = null;
        
        for (const carId in serviceCount) {
            if (serviceCount[carId] > maxServices) {
                maxServices = serviceCount[carId];
                mostServicedCarId = carId;
            }
        }
        
        if (mostServicedCarId) {
            const car = cars.find(c => c.id === mostServicedCarId);
            if (car) {
                document.getElementById('most-serviced').textContent = `${car.make} ${car.model} (${maxServices} services)`;
            }
        }
    }
    
    if (services.length > 0) {
        const sortedServices = [...services].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        if (sortedServices.length >= 2) {
            const mileageDifferences = [];
            for (let i = 1; i < sortedServices.length; i++) {
                const diff = parseInt(sortedServices[i].mileage) - parseInt(sortedServices[i-1].mileage);
                if (diff > 0) {
                    mileageDifferences.push(diff);
                }
            }
            
            if (mileageDifferences.length > 0) {
                const avgInterval = mileageDifferences.reduce((sum, diff) => sum + diff, 0) / mileageDifferences.length;
                const lastService = sortedServices[sortedServices.length - 1];
                const nextRecommendedMileage = parseInt(lastService.mileage) + Math.round(avgInterval);
                document.getElementById('next-service').textContent = `At ${nextRecommendedMileage.toLocaleString()} miles`;
            }
        }
    }
}

function checkAuth() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

function formatCurrency(amount) {
    return 'AED ' + parseFloat(amount).toFixed(2);
}