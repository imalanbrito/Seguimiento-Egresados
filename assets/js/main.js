// Función para actualizar fecha y hora
function updateDateTime() {
    const now = new Date();
    const dateElement = document.getElementById('current-date');
    const timeElement = document.getElementById('current-time');
    
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('es-MX');
    }
    
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString('es-MX', {hour: '2-digit', minute:'2-digit'});
    }
}

// Actualizar cada minuto
setInterval(updateDateTime, 60000);
updateDateTime();

// Verificar si es usuario invitado
function checkGuestUser() {
    const userEmail = localStorage.getItem('userEmail');
    const header = document.getElementById('main-header');
    const userTypeElement = document.getElementById('user-type');
    
    if (userEmail === 'invitado@upaep.edu.mx' && header) {
        header.style.backgroundColor = '#757575';
    }
    
    if (userTypeElement) {
        userTypeElement.textContent = userEmail === 'invitado@upaep.edu.mx' ? 'Invitado' : 'Administrativo';
    }
}

// Cargar datos del usuario
function loadUserData() {
    const userNameElement = document.getElementById('user-name');
    const userName = localStorage.getItem('userName');
    
    if (userNameElement && userName) {
        userNameElement.textContent = userName;
    }
}

// Inicialización común
document.addEventListener("DOMContentLoaded", function () {
    updateDateTime();
});

function updateDateTime() {
    const now = new Date();
    document.getElementById("current-date").textContent = now.toLocaleDateString("es-MX");
    document.getElementById("current-time").textContent = now.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit"
    });
}