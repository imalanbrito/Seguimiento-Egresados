document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos del usuario
    loadUserData();
    checkGuestUser();
    updateDateTime();
    
    // Cargar datos de periodos y programas
    loadPeriodos();
    loadProgramas();
    
    // Manejar el formulario
    const filterForm = document.getElementById('filter-form');
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            applyFilters();
        });
    }
    
    // Manejar tecla Enter
    document.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.querySelector(".continue-button").click();
        }
    });
});

function loadPeriodos() {
    // Datos simulados - en un caso real estos vendrían de una API
    const periodos = [];
    for (let año = 2024; año >= 1973; año--) {
        periodos.push(`Otoño ${año}`);
        periodos.push(`Primavera ${año}`);
    }
    
    const selectPeriodo = document.getElementById('periodo');
    if (selectPeriodo) {
        periodos.forEach(periodo => {
            const option = document.createElement('option');
            option.value = periodo;
            option.textContent = periodo;
            selectPeriodo.appendChild(option);
        });
    }
}

function loadProgramas() {
    // Datos simulados
    const programas = [
        "Ingeniería Aeroespacial", 
        "Ingeniería Agrónoma", 
        "Ingeniería Ambiental y Desarrollo Sustentable",
        "Ingeniería Biónica", 
        "Ingeniería Biotecnología", 
        "Ingeniería Civil",
        "Ingeniería en Ciencia de Datos", 
        "Ingeniería en Computación y Sistemas",
        "Ingeniería en Diseño Automotriz", 
        "Ingeniería en Proyectos Industriales",
        "Ingeniería en Software", 
        "Ingeniería Industrial", 
        "Ingeniería Mecatrónica", 
        "Ingeniería Química Industrial"
    ].sort();
    
    const selectPrograma = document.getElementById('programa');
    if (selectPrograma) {
        programas.forEach(programa => {
            const option = document.createElement('option');
            option.value = programa;
            option.textContent = programa;
            selectPrograma.appendChild(option);
        });
    }
}

function applyFilters() {
    // Obtener valores del formulario
    const periodo = document.getElementById('periodo').value;
    const programa = document.getElementById('programa').value;
    const buscar = document.getElementById('buscar').value;
    const empresa = document.getElementById('empresa').value;
    const sector = document.getElementById('sector').value;
    const alcance = document.getElementById('alcance').value;
    const estatus = document.getElementById('estatus').value;
    
    // Aquí iría la lógica para aplicar los filtros
    // Por ahora solo redirigimos a exhibición
    window.location.href = 'exhibicion.html';
}