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

function aplicarFiltros() {
    event.preventDefault();
    
    // Obtener valores de los filtros
    const periodo = document.getElementById('periodo').value;
    const buscar = document.getElementById('buscar').value.trim();
    const programa = document.getElementById('programa').value;
    const empresa = document.getElementById('empresa').value;
    const sector = document.getElementById('sector').value;
    const alcance = document.getElementById('alcance').value;
    const estatus = document.getElementById('estatus').value;

    // Crear objeto de filtros solo con valores no por defecto
    const filtros = {};
    
    if (periodo && periodo !== 'todas' && periodo !== 'Todos los periodos') {
        filtros.periodo = periodo;
    }
    
    if (buscar && buscar !== '') {
        filtros.buscar = buscar;
    }
    
    if (programa && programa !== 'todas' && programa !== 'Todas las carreras') {
        filtros.programa = programa;
    }
    
    if (empresa && empresa !== 'todas' && empresa !== 'Todas las empresas') {
        filtros.empresa = empresa;
    }
    
    if (sector && sector !== 'todos' && sector !== 'Todos los sectores') {
        filtros.sector = sector;
    }
    
    if (alcance && alcance !== 'todas' && alcance !== 'Todos los alcances') {
        filtros.alcance = alcance;
    }
    
    if (estatus && estatus !== 'todas' && estatus !== 'Todos los estatus') {
        filtros.estatus = estatus;
    }

    // Solo guardar filtros si hay alguno aplicado
    if (Object.keys(filtros).length > 0) {
        localStorage.setItem('egresados-filtros', JSON.stringify(filtros));
    } else {
        localStorage.removeItem('egresados-filtros'); // Eliminar filtros si no hay ninguno válido
    }
    
    localStorage.setItem('egresados-ready', 'true');
    window.location.href = 'exhibicion.html';
}

function limpiarFiltros() {
    document.getElementById('filter-form').reset();
    loadInitialData();
    initSelects();
    localStorage.removeItem('egresados-filtros');
    localStorage.removeItem('egresados-ready');
}