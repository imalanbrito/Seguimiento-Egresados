document.addEventListener("DOMContentLoaded", function() {
    // Inicialización
    updateUserInfo();
    setupLogoutButton();
    initSelects();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Configurar botones
    document.getElementById('apply-btn').addEventListener('click', aplicarFiltros);
    document.getElementById('reset-btn').addEventListener('click', limpiarFiltros);
    
    // Cargar datos iniciales
    loadInitialData();
});

// Funciones principales
function updateDateTime() {
    const now = new Date();
    document.getElementById('current-date').textContent = now.toLocaleDateString('es-MX');
    document.getElementById('current-time').textContent = now.toLocaleTimeString('es-MX', {hour: '2-digit', minute:'2-digit'});
}

function updateUserInfo() {
    const userEmail = sessionStorage.getItem('userEmail');
    const userNameElement = document.getElementById('header-user-name');
    const userTypeElement = document.getElementById('user-type');
    
    if (userEmail === 'administrador@upaep.mx') {
        userNameElement.textContent = 'Administrativo UPAEP';
        userTypeElement.textContent = 'Administrativo';
    } else {
        userNameElement.textContent = 'Invitado UPAEP';
        userTypeElement.textContent = 'Invitado';
    }
}

function setupLogoutButton() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.clear();
            window.location.href = 'login.html';
        });
    }
}

function initSelects() {
    // Forzar visibilidad de textos en selects
    document.querySelectorAll('.dropdown-group select').forEach(select => {
        select.style.color = '#333';
        if (select.id === 'sector') {
            select.selectedIndex = 0; // Seleccionar "Todos los sectores"
        }
    });
}

function loadInitialData() {
    // Valores por defecto
    const defaults = {
        periodo: 'todas',
        programa: 'todas',
        sector: 'todos',
        empresa: 'todas',
        alcance: 'todas',
        estatus: 'todas',
        buscar: '' // Añadido para limpiar también el campo de búsqueda
    };
    
    Object.entries(defaults).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.value = value;
    });
}

// FUNCIÓN CLAVE QUE SIEMPRE HA FUNCIONADO:
function aplicarFiltros() {
    // 1. Prevenir cualquier comportamiento por defecto
    event.preventDefault();
    
    // 2. Recoger todos los filtros actuales
    const filtros = {
        periodo: document.getElementById('periodo').value,
        buscar: document.getElementById('buscar').value,
        programa: document.getElementById('programa').value,
        empresa: document.getElementById('empresa').value,
        sector: document.getElementById('sector').value,
        alcance: document.getElementById('alcance').value,
        estatus: document.getElementById('estatus').value
    };
    
    // 3. Guardar en localStorage (exactamente como en tu versión funcional)
    localStorage.setItem('egresados-filtros', JSON.stringify(filtros));
    localStorage.setItem('egresados-ready', 'true'); // Flag importante
    
    // 4. Redirección garantizada (método que siempre te ha funcionado)
    window.location.href = 'exhibicion.html';
    
    // 5. Forzar redirección si hay algún problema (backup)
    setTimeout(() => {
        if (window.location.pathname.indexOf('exhibicion.html') === -1) {
            window.location.assign('exhibicion.html');
        }
    }, 200);
}

function limpiarFiltros() {
    document.getElementById('filter-form').reset();
    loadInitialData();
    initSelects();
    localStorage.removeItem('egresados-filtros');
    localStorage.removeItem('egresados-ready');
}