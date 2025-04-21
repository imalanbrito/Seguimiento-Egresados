document.addEventListener("DOMContentLoaded", function() {
    // Inicializar funciones
    updateDateTime();
    updateUserType();
    
    // Actualizar reloj cada segundo
    setInterval(updateDateTime, 1000);
    
    // Configurar botones
    document.getElementById('apply-btn').addEventListener('click', aplicarFiltros);
    document.getElementById('reset-btn').addEventListener('click', limpiarFiltros);
    
    // Cargar datos iniciales
    loadInitialData();
});

function updateDateTime() {
    const now = new Date();
    document.getElementById('current-date').textContent = now.toLocaleDateString('es-MX');
    document.getElementById('current-time').textContent = now.toLocaleTimeString('es-MX', {hour12: false});
}

function updateUserType() {
    const userTypeElement = document.getElementById("user-type");
    if (userTypeElement) {
        userTypeElement.textContent = document.body.classList.contains('invitado') ? "Invitado" : "Administrativo";
    }
}

function loadInitialData() {
    // Establecer valores por defecto
    document.getElementById('periodo').value = 'todas';
    document.getElementById('programa').value = 'todas';
    document.getElementById('empresa').value = 'todas';
    document.getElementById('sector').value = 'todas';
    document.getElementById('alcance').value = 'todas';
    document.getElementById('estatus').value = 'todas';
}

function aplicarFiltros() {
    const filtros = {
        periodo: document.getElementById('periodo').value,
        buscar: document.getElementById('buscar').value,
        programa: document.getElementById('programa').value,
        empresa: document.getElementById('empresa').value,
        sector: document.getElementById('sector').value,
        alcance: document.getElementById('alcance').value,
        estatus: document.getElementById('estatus').value
    };
    
    // Guardar filtros en localStorage (aunque no haya filtros seleccionados)
    localStorage.setItem('egresados-filtros', JSON.stringify(filtros));
    
    // Establecer flag para indicar que viene del dashboard
    localStorage.setItem('egresados-ready', 'true');
    
    // Redirigir a la página de exhibición
    window.location.href = 'exhibicion.html';
}

function limpiarFiltros() {
    // Resetear todos los selectores
    document.getElementById('filter-form').reset();
    
    // Establecer valores por defecto
    document.getElementById('periodo').value = 'todas';
    document.getElementById('programa').value = 'todas';
    document.getElementById('empresa').value = 'todas';
    document.getElementById('sector').value = 'todas';
    document.getElementById('alcance').value = 'todas';
    document.getElementById('estatus').value = 'todas';
    
    // Limpiar el campo de búsqueda
    document.getElementById('buscar').value = '';
    
    // Eliminar filtros guardados
    localStorage.removeItem('egresados-filtros');
}