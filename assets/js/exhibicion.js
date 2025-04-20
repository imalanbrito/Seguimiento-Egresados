document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos del usuario
    loadUserData();
    checkGuestUser();
    updateDateTime();
    
    // Inicializar mapa
    initMap();
    
    // Configurar botones
    document.getElementById('back-btn').addEventListener('click', function() {
        window.location.href = 'dashboard.html';
    });
    
    document.getElementById('download-btn').addEventListener('click', function() {
        generateCSV();
    });
});

function initMap() {
    var map = L.map('map').setView([19.0433, -98.1981], 5); // Puebla, México

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

function generateCSV() {
    alert('Función de descarga en desarrollo');
}