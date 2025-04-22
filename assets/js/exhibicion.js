document.addEventListener('DOMContentLoaded', async function() {
    // Verificar si se viene del dashboard
    if (localStorage.getItem('egresados-ready') !== 'true') {
        window.location.href = 'dashboard.html';
        return;
    }
    
    
    
    // Variables globales
    let egresadosData = [];
    let filteredData = [];
    let map;
    let activeFilters = {};

    // Inicializar funciones
    updateDateTime();
    updateUserType();
    initMap();
    
    // Actualizar reloj cada segundo
    setInterval(updateDateTime, 1000);
    
    // Cargar datos de egresados
    await loadEgresadosData();
    applyStoredFilters();
    
    // Configurar botones
    document.getElementById('back-btn').addEventListener('click', function() {
        window.location.href = 'dashboard.html';
    });
    
    document.getElementById('download-btn').addEventListener('click', generateCSV);
    document.getElementById('export-excel').addEventListener('click', exportToExcel);
    document.getElementById('search-input').addEventListener('input', filterTable);
    
    // Mostrar contenido y ocultar pantalla de carga
    document.getElementById('content').style.display = 'block';
    document.getElementById('loading-screen').style.display = 'none';
    
    // Limpiar flag
    localStorage.removeItem('egresados-ready');
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

function initMap() {
    map = L.map('map').setView([19.0433, -98.1981], 5); // Puebla, México
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

async function loadEgresadosData() {
    try {
        const response = await fetch('../assets/data/egresados.json');
        egresadosData = await response.json();
        
        // Normalizar datos para compatibilidad
        egresadosData = egresadosData.map(egresado => {
            // Asegurar campos básicos
            if (!egresado.periodo) {
                egresado.periodo = `Otoño ${egresado.generacion || '2023'}`;
            }
            if (!egresado.estatus) {
                egresado.estatus = egresado.empleado ? "Activo" : "Inactivo";
            }
            if (!egresado.alcance) {
                egresado.alcance = "Nacional";
            }
            return egresado;
        });
        
        filteredData = [...egresadosData];
        updateStatistics();
    } catch (error) {
        console.error('Error cargando datos:', error);
        loadSampleData();
    }
}

function loadSampleData() {
    egresadosData = [
        {
            "id": 1,
            "CURP": "PERJ920101HDFLRN01",
            "Nombre Completo": "Juan Pérez López",
            "generacion": "2018",
            "Ciudad": "Puebla",
            "lat": 19.0433,
            "lng": -98.1981,
            "empleado": true,
            "empresa": "Constructora XYZ",
            "Correo de Empresa o Negocio": "contacto@constructora.com",
            "sector": "Construcción",
            "ingenieria": "Ingeniería Civil"
        },
        {
            "id": 2,
            "CURP": "GARM900512MDFLRN02",
            "Nombre Completo": "María García Ruiz",
            "generacion": "2020",
            "Ciudad": "Ciudad de México",
            "lat": 19.5,
            "lng": -99.1,
            "empleado": true,
            "empresa": "Tech Solutions",
            "Correo de Empresa o Negocio": "info@techsolutions.com",
            "sector": "Tecnología",
            "ingenieria": "Ingeniería en Computación y Sistemas"
        },
        {
            "id": 3,
            "CURP": "RAMG930203HDFLRN03",
            "Nombre Completo": "Ramón González Méndez",
            "generacion": "2019",
            "Ciudad": "Monterrey",
            "lat": 25.6866,
            "lng": -100.3161,
            "empleado": true,
            "empresa": "Data Analytica",
            "Correo de Empresa o Negocio": "info@dataanalytica.com",
            "sector": "Ciencia de Datos",
            "ingenieria": "Ingeniería en Ciencia de Datos"
        },
        {
            "id": 4,
            "CURP": "SALV881210MDFLRN04",
            "Nombre Completo": "Salvador Vargas Cruz",
            "generacion": "2017",
            "Ciudad": "Guadalajara",
            "lat": 20.6597,
            "lng": -103.3496,
            "empleado": true,
            "empresa": "EcoPlanet",
            "Correo de Empresa o Negocio": "contacto@ecoplanet.com",
            "sector": "Ambiental",
            "ingenieria": "Ingeniería Ambiental y Desarrollo Sustentable"
        },
        {
            "id": 5,
            "CURP": "FLOM950612HDFLRN05",
            "Nombre Completo": "Florencia Martínez Díaz",
            "generacion": "2021",
            "Ciudad": "Mérida",
            "lat": 20.9671,
            "lng": -89.6237,
            "empleado": true,
            "empresa": "AgroSolutions",
            "Correo de Empresa o Negocio": "info@agrosolutions.com",
            "sector": "Agrícola",
            "ingenieria": "Ingeniería Agrónoma"
        },
        {
            "id": 6,
            "CURP": "BENJ890417HDFLRN06",
            "Nombre Completo": "Benjamín Herrera Núñez",
            "generacion": "2016",
            "Ciudad": "Tijuana",
            "lat": 32.5149,
            "lng": -117.0382,
            "empleado": true,
            "empresa": "BioGen Tech",
            "Correo de Empresa o Negocio": "contacto@biogen.com",
            "sector": "Biotecnología",
            "ingenieria": "Ingeniería en Biotecnología"
        },
        {
            "id": 7,
            "CURP": "RODG910715HDFLRN07",
            "Nombre Completo": "Rodrigo Gómez Castillo",
            "generacion": "2019",
            "Ciudad": "Querétaro",
            "lat": 20.5888,
            "lng": -100.3899,
            "empleado": true,
            "empresa": "Orbital Aerospace",
            "Correo de Empresa o Negocio": "info@orbitalaerospace.com",
            "sector": "Aeroespacial",
            "ingenieria": "Ingeniería Aeroespacial"
        },
        {
            "id": 8,
            "CURP": "LUIS850923MDFLRN08",
            "Nombre Completo": "Luis Herrera Velázquez",
            "generacion": "2015",
            "Ciudad": "Toluca",
            "lat": 19.2826,
            "lng": -99.6557,
            "empleado": true,
            "empresa": "BioTech Solutions",
            "Correo de Empresa o Negocio": "contacto@biotechsolutions.com",
            "sector": "Biónica",
            "ingenieria": "Ingeniería Biónica"
        },
        {
            "id": 9,
            "CURP": "CAMI930503HDFLRN09",
            "Nombre Completo": "Camila Morales Sánchez",
            "generacion": "2020",
            "Ciudad": "Puebla",
            "lat": 19.0433,
            "lng": -98.1981,
            "empleado": true,
            "empresa": "Industrial Dynamics",
            "Correo de Empresa o Negocio": "contacto@industrialdynamics.com",
            "sector": "Industrial",
            "ingenieria": "Ingeniería Industrial"
        },
        {
            "id": 10,
            "CURP": "FERN890630HDFLRN10",
            "Nombre Completo": "Fernanda López Arriaga",
            "generacion": "2018",
            "Ciudad": "Guadalajara",
            "lat": 20.6597,
            "lng": -103.3496,
            "empleado": true,
            "empresa": "Automotive Creators",
            "Correo de Empresa o Negocio": "info@automotivecreators.com",
            "sector": "Automotriz",
            "ingenieria": "Ingeniería en Diseño Automotriz"
        },
        {
            "id": 11,
            "CURP": "JAVI950211HDFLRN11",
            "Nombre Completo": "Javier Torres Mendoza",
            "generacion": "2021",
            "Ciudad": "Cancún",
            "lat": 21.1619,
            "lng": -86.8515,
            "empleado": true,
            "empresa": "SmartTech",
            "Correo de Empresa o Negocio": "contacto@smarttech.com",
            "sector": "Tecnología",
            "ingenieria": "Ingeniería en Software"
        },
        {
            "id": 12,
            "CURP": "PAUL871225MDFLRN12",
            "Nombre Completo": "Paula Ramírez García",
            "generacion": "2016",
            "Ciudad": "Monterrey",
            "lat": 25.6866,
            "lng": -100.3161,
            "empleado": true,
            "empresa": "MecaTech",
            "Correo de Empresa o Negocio": "info@mecatech.com",
            "sector": "Mecatrónica",
            "ingenieria": "Ingeniería Mecatrónica"
        },
        {
            "id": 13,
            "CURP": "DANI920305HDFLRN13",
            "Nombre Completo": "Daniela Vázquez Fernández",
            "generacion": "2019",
            "Ciudad": "Ciudad de México",
            "lat": 19.5,
            "lng": -99.1,
            "empleado": true,
            "empresa": "EcoIndustries",
            "Correo de Empresa o Negocio": "info@ecoindustries.com",
            "sector": "Químico Industrial",
            "ingenieria": "Ingeniería Química Industrial"
        },
        {
            "id": 14,
            "CURP": "MARI890813HDFLRN14",
            "Nombre Completo": "Mario Fernández Rodríguez",
            "generacion": "2017",
            "Ciudad": "Puebla",
            "lat": 19.0433,
            "lng": -98.1981,
            "empleado": true,
            "empresa": "Proyectos México",
            "Correo de Empresa o Negocio": "contacto@proyectosmexico.com",
            "sector": "Industrial",
            "ingenieria": "Ingeniería en Proyectos Industriales"
        },
        {
            "id": 15,
            "CURP": "ALEJ920112HDFLRN15",
            "Nombre Completo": "Alejandro Ramírez Salazar",
            "generacion": "2020",
            "Ciudad": "Guadalajara",
            "lat": 20.6597,
            "lng": -103.3496,
            "empleado": true,
            "empresa": "EnviroTech",
            "Correo de Empresa o Negocio": "info@envirotech.com",
            "sector": "Ambiental",
            "ingenieria": "Ingeniería Ambiental y Desarrollo Sustentable"
        },
        {
            "id": 16,
            "CURP": "JORG880814HDFLRN16",
            "Nombre Completo": "Jorge Castillo Rodríguez",
            "generacion": "2016",
            "Ciudad": "Toluca",
            "lat": 19.2826,
            "lng": -99.6557,
            "empleado": true,
            "empresa": "AgroDevelopers",
            "Correo de Empresa o Negocio": "info@agrodevelopers.com",
            "sector": "Agrícola",
            "ingenieria": "Ingeniería Agrónoma"
        },
        {
            "id": 17,
            "CURP": "RAUL930725HDFLRN17",
            "Nombre Completo": "Raúl Hernández Gutiérrez",
            "generacion": "2019",
            "Ciudad": "Monterrey",
            "lat": 25.6866,
            "lng": -100.3161,
            "empleado": true,
            "empresa": "Quantum Science",
            "Correo de Empresa o Negocio": "info@quantumscience.com",
            "sector": "Ciencia de Datos",
            "ingenieria": "Ingeniería en Ciencia de Datos"
        }
    ];

    
    filteredData = [...egresadosData];
    updateStatistics();
    renderTable(filteredData);
    addMarkersFromData();
}

function applyStoredFilters() {
    const filtrosGuardados = localStorage.getItem('egresados-filtros');
    const summaryContainer = document.getElementById('filter-summary-container');
    
    if (!filtrosGuardados) {
        filteredData = [...egresadosData];
        summaryContainer.innerHTML = '<h3>Mostrando todos los egresados</h3>';
        renderTable(filteredData);
        addMarkersFromData();
        return;
    }
    
    try {
        const filtros = JSON.parse(filtrosGuardados);
        filteredData = [...egresadosData];
        activeFilters = {};
        
        // Aplicar filtros
        if (filtros.periodo && filtros.periodo !== 'todas') {
            filteredData = filteredData.filter(e => e.periodo === filtros.periodo);
            activeFilters.periodo = filtros.periodo;
        }
        
        if (filtros.programa && filtros.programa !== 'todas') {
            filteredData = filteredData.filter(e => (e.carrera || e['Programas Académicos UPAEP']) === filtros.programa);
            activeFilters.programa = filtros.programa;
        }
        
        if (filtros.empresa && filtros.empresa !== 'todas') {
            filteredData = filteredData.filter(e => e.empresa === filtros.empresa);
            activeFilters.empresa = filtros.empresa;
        }
        
        if (filtros.sector && filtros.sector !== 'todas') {
            filteredData = filteredData.filter(e => e.sector === filtros.sector);
            activeFilters.sector = filtros.sector;
        }
        
        if (filtros.estatus && filtros.estatus !== 'todas') {
            const buscaActivo = filtros.estatus === 'Activo';
            filteredData = filteredData.filter(e => e.empleado === buscaActivo);
            activeFilters.estatus = filtros.estatus;
        }
        
        if (filtros.buscar && filtros.buscar !== '') {
            const termino = filtros.buscar.toLowerCase();
            filteredData = filteredData.filter(e => 
                (e.nombre || e['Nombre Completo'] || '').toLowerCase().includes(termino) || 
                (e.id && e.id.toString().includes(termino)) ||
                (e.CURP && e.CURP.toLowerCase().includes(termino))
            );
            activeFilters.buscar = filtros.buscar;
        }
        
        // Mostrar resumen de filtros
        showFilterSummary();
        
        renderTable(filteredData);
        addMarkersFromData();
        updateStatistics();
    } catch (error) {
        console.error('Error aplicando filtros:', error);
        filteredData = [...egresadosData];
        summaryContainer.innerHTML = '<h3>Mostrando todos los egresados</h3>';
        renderTable(filteredData);
        addMarkersFromData();
    }
}

function showFilterSummary() {
    const summaryContainer = document.getElementById('filter-summary-container');
    
    if (Object.keys(activeFilters).length === 0) {
        summaryContainer.innerHTML = '<h3>Mostrando todos los egresados</h3>';
        return;
    }
    
    let summaryHTML = '<h3>Filtros aplicados:</h3>';
    
    if (activeFilters.periodo) {
        summaryHTML += `<p><strong>Periodo:</strong> ${activeFilters.periodo}</p>`;
    }
    
    if (activeFilters.programa) {
        summaryHTML += `<p><strong>Carrera:</strong> ${activeFilters.programa}</p>`;
    }
    
    if (activeFilters.empresa) {
        summaryHTML += `<p><strong>Empresa:</strong> ${activeFilters.empresa}</p>`;
    }
    
    if (activeFilters.buscar) {
        summaryHTML += `<p><strong>Búsqueda:</strong> "${activeFilters.buscar}"</p>`;
    }
    
    summaryContainer.innerHTML = summaryHTML;
}

function renderTable(data) {
    const tableBody = document.querySelector('#egresados-table tbody');
    tableBody.innerHTML = '';
    
    if (data.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="9" style="text-align: center; padding: 20px;">
                No se encontraron egresados con los filtros aplicados
            </td>`;
        tableBody.appendChild(row);
        return;
    }
    
    data.forEach(egresado => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${egresado.id || egresado['ID Unisoft'] || '-'}</td>
            <td>${egresado.CURP || '-'}</td>
            <td>${egresado.nombre || egresado['Nombre Completo'] || '-'}</td>
            <td>${egresado.generacion || '-'}</td>
            <td>${egresado.ubicacion || egresado.Ciudad || '-'}</td>
            <td>${egresado.empleado ? 'Sí' : 'No'}</td>
            <td>${egresado.empresa || '-'}</td>
            <td>${egresado['Correo de Empresa o Negocio'] || '-'}</td>
            <td>${egresado.sector || '-'}</td>
        `;
        tableBody.appendChild(row);
    });
}

function addMarkersFromData() {
    // Limpiar marcadores existentes
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    
    // Agregar nuevos marcadores
    const markers = filteredData
        .filter(e => e.lat && e.lng)
        .map(e => {
            const marker = L.marker([e.lat, e.lng]).addTo(map);
            
            let popupContent = `<b>${e.nombre || e['Nombre Completo'] || 'Egresado'}</b><br>`;
            popupContent += `<small>${e.generacion || ''}</small><br>`;
            
            if (e.empresa) {
                popupContent += `<b>Empresa:</b> ${e.empresa}<br>`;
            }
            
            popupContent += `<b>Empleado:</b> ${e.empleado ? 'Sí' : 'No'}`;
            
            marker.bindPopup(popupContent);
            return marker;
        });
    
    // Ajustar vista del mapa
    if (markers.length > 0) {
        const group = new L.FeatureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.2));
    } else {
        map.setView([19.0433, -98.1981], 5);
    }
}

function filterTable() {
    const termino = document.getElementById('search-input').value.toLowerCase();
    
    if (termino === '') {
        // Si no hay término de búsqueda, volver a los datos filtrados originales
        applyStoredFilters();
        return;
    }
    
    const resultados = filteredData.filter(e => 
        (e.nombre || e['Nombre Completo'] || '').toLowerCase().includes(termino) ||
        (e.CURP || '').toLowerCase().includes(termino) ||
        (e.empresa || '').toLowerCase().includes(termino) ||
        (e.id && e.id.toString().includes(termino))
    );
    
    renderTable(resultados);
    
    // Actualizar marcadores del mapa con los resultados de búsqueda
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    
    resultados.filter(e => e.lat && e.lng).forEach(e => {
        L.marker([e.lat, e.lng]).addTo(map)
            .bindPopup(`<b>${e.nombre || e['Nombre Completo'] || 'Egresado'}</b><br>${e.empresa || ''}`);
    });
}

function updateStatistics() {
    const totalElement = document.querySelectorAll('.stat-number')[0];
    const filteredElement = document.querySelectorAll('.stat-number')[1];
    
    if (totalElement) totalElement.textContent = egresadosData.length;
    if (filteredElement) filteredElement.textContent = filteredData.length;
}

function generateCSV() {
    if (filteredData.length === 0) {
        alert('No hay datos para exportar');
        return;
    }
    
    // Encabezados CSV
    const headers = [
        'ID', 'CURP', 'Nombre', 'Generación', 'Ubicación', 
        'Empleado', 'Empresa', 'Correo Empresa', 'Sector'
    ];
    
    // Preparar datos
    const rows = filteredData.map(e => [
        e.id || e['ID Unisoft'] || '',
        `"${(e.CURP || '').replace(/"/g, '""')}"`,
        `"${(e.nombre || e['Nombre Completo'] || '').replace(/"/g, '""')}"`,
        e.generacion || '',
        `"${(e.ubicacion || e.Ciudad || '').replace(/"/g, '""')}"`,
        e.empleado ? 'Sí' : 'No',
        e.empresa ? `"${e.empresa.replace(/"/g, '""')}"` : '-',
        e['Correo de Empresa o Negocio'] ? `"${e['Correo de Empresa o Negocio'].replace(/"/g, '""')}"` : '-',
        e.sector ? `"${e.sector.replace(/"/g, '""')}"` : '-'
    ]);
    
    // Crear contenido CSV
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.join(',') + '\n';
    });
    
    // Crear y descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `egresados_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportToExcel() {
    if (filteredData.length === 0) {
        alert('No hay datos para exportar');
        return;
    }
    
    // Verificar si SheetJS está cargado
    if (typeof XLSX === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
        script.onload = exportToExcel;
        document.head.appendChild(script);
        return;
    }
    
    try {
        // Preparar datos para Excel
        const excelData = filteredData.map(e => ({
            ID: e.id || e['ID Unisoft'] || '',
            CURP: e.CURP || '-',
            Nombre: e.nombre || e['Nombre Completo'] || '-',
            Generación: e.generacion || '-',
            Ubicación: e.ubicacion || e.Ciudad || '-',
            Empleado: e.empleado ? 'Sí' : 'No',
            Empresa: e.empresa || '-',
            'Correo Empresa': e['Correo de Empresa o Negocio'] || '-',
            Sector: e.sector || '-'
        }));
        
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Egresados");
        
        // Exportar archivo
        XLSX.writeFile(wb, `egresados_${new Date().toISOString().slice(0,10)}.xlsx`);
    } catch (error) {
        console.error('Error al exportar a Excel:', error);
        alert('Error al exportar a Excel');
    }
}