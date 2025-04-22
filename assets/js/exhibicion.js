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

    // Inicializar funciones básicas
    updateDateTime();
    updateUserInfo();
    initMap();
    setInterval(updateDateTime, 1000);
    
    // Configurar eventos
    setupEventListeners();
    
    // Cargar y procesar datos
    await loadAndProcessData();
    
    // Mostrar contenido
    document.getElementById('content').style.display = 'block';
    document.getElementById('loading-screen').style.display = 'none';
    localStorage.removeItem('egresados-ready');
});

// FUNCIONES BÁSICAS
function updateDateTime() {
    const now = new Date();
    document.getElementById('current-date').textContent = now.toLocaleDateString('es-MX');
    document.getElementById('current-time').textContent = now.toLocaleTimeString('es-MX', {hour12: false});
}

function updateUserInfo() {
    const userEmail = sessionStorage.getItem('userEmail');
    const userNameElement = document.getElementById('header-user-name');
    const userTypeElement = document.getElementById('user-type');
    
    if (userEmail === 'administrador@upaep.edu.mx') {
        userNameElement.textContent = 'Administrativo UPAEP';
        userTypeElement.textContent = 'Administrativo';
    } else if (userEmail === 'invitado@upaep.edu.mx') {
        userNameElement.textContent = 'Invitado UPAEP';
        userTypeElement.textContent = 'Invitado';
    } else {
        userNameElement.textContent = 'Usuario UPAEP';
        userTypeElement.textContent = 'Usuario';
    }
}

function initMap() {
    const centerOfMexico = [23.6345, -102.5528];
    const defaultZoom = 5;
    map = L.map('map').setView(centerOfMexico, defaultZoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

// CONFIGURACIÓN DE EVENTOS
function setupEventListeners() {
    document.getElementById('back-btn').addEventListener('click', () => window.location.href = 'dashboard.html');
    document.getElementById('logout-btn').addEventListener('click', () => {
        sessionStorage.clear();
        window.location.href = '../login.html';
    });
    document.getElementById('download-btn').addEventListener('click', generateCSV);
    document.getElementById('export-excel').addEventListener('click', exportToExcel);
    document.getElementById('search-input').addEventListener('input', filterTable);
}

// MANEJO DE DATOS
async function loadAndProcessData() {
    try {
        const response = await fetch('../assets/data/egresados.json');
        const data = await response.json();
        
        // Procesar datos del JSON o usar datos de ejemplo
        egresadosData = data.all_data || generateSampleData();
        
        filteredData = [...egresadosData];
        updateStatistics();
        renderTable(filteredData);
        updateMapWithData();
    } catch (error) {
        console.error('Error cargando datos:', error);
        egresadosData = generateSampleData();
        filteredData = [...egresadosData];
        updateStatistics();
        renderTable(filteredData);
        updateMapWithData();
    }
}

function generateSampleData() {
    return [
        {
            "id": 3464538,
                 "CURP": "PERJ920101HDFLRN01",
                 "Nombre Completo": "Juan Pérez López",
                 "generacion": "2018",
                 "Programa Academico": "Ingeniería Civil",
                 "Ciudad": "Puebla",
                 "lat": 19.0433,
                 "lng": -98.1981,
                 "empleado": true,
                 "empresa": "Constructora XYZ",
                 "Correo de Empresa o Negocio": "contacto@constructora.com",
                 "sector": "Construcción"
                 
             },
             {
                 "id": 3464539,
                 "CURP": "GOMS930215MDFLRN02",
                 "Nombre Completo": "María González Sánchez",
                 "generacion": "2019",
                 "Programa Academico": "Ingeniería en Software",
                 "Ciudad": "Puebla",
                 "lat": 19.0415,
                 "lng": -98.2063,
                 "empleado": true,
                 "empresa": "Tech Solutions",
                 "Correo de Empresa o Negocio": "maria.gonzalez@techsolutions.com",
                 "sector": "Tecnología"
                 
             },
             {
                 "id": 3464540,
                 "CURP": "ROML940322HDFLRN03",
                 "Nombre Completo": "Luis Rodríguez Martínez",
                 "generacion": "2020",
                 "Programa Academico": "Ingeniería en Software",
                 "Ciudad": "Puebla",
                 "lat": 19.0456,
                 "lng": -98.2019,
                 "empleado": true,
                 "empresa": "Data Analytics MX",
                 "Correo de Empresa o Negocio": "lrodriguez@dataanalytics.com",
                 "sector": "Ciencia de Datos"
                 
             },
             {
                 "id": 3464541,
                 "CURP": "HERN950428MDFLRN04",
                 "Nombre Completo": "Ana Hernández Navarro",
                 "generacion": "2017",
                 "Programa Academico": "Ingeniería Ambiental y Desarrollo Sustentable",
                 "Ciudad": "Puebla",
                 "lat": 19.0421,
                 "lng": -98.2037,
                 "empleado": true,
                 "empresa": "EcoPlanet",
                 "Correo de Empresa o Negocio": "ana.hernandez@ecoplanet.com",
                 "sector": "Ambiental",
                 
             },
             {
                 "id": 3464542,
                 "CURP": "GARJ960530HDFLRN05",
                 "Nombre Completo": "Jorge García Ruiz",
                 "generacion": "2021",
                 "Programa Academico": "Ingeniería Agrónoma",
                 "Ciudad": "Puebla",
                 "lat": 19.0442,
                 "lng": -98.2055,
                 "empleado": true,
                 "empresa": "AgroSolutions",
                 "Correo de Empresa o Negocio": "jgarcia@agrosolutions.com",
                 "sector": "Agrícola",
                 
             },
             {
                 "id": 3464543,
                 "CURP": "LOPM970612MDFLRN06",
                 "Nombre Completo": "Mónica López Pérez",
                 "generacion": "2018",
                 "Programa Academico": "Ingeniería en Biotecnología",
                 "Ciudad": "Puebla",
                 "lat": 19.0438,
                 "lng": -98.2024,
                 "empleado": true,
                 "empresa": "BioGen Tech",
                 "Correo de Empresa o Negocio": "mlopez@biogentech.com",
                 "sector": "Biotecnología",
                 
             },
             {
                 "id": 3464544,
                 "CURP": "DIAJ980724HDFLRN07",
                 "Nombre Completo": "José Díaz Alonso",
                 "generacion": "2019",
                 "Programa Academico": "Ingeniería Aeroespacial",
                 "Ciudad": "Puebla",
                 "lat": 19.0419,
                 "lng": -98.2046,
                 "empleado": true,
                 "empresa": "AeroMex",
                 "Correo de Empresa o Negocio": "jdiaz@aeromex.com",
                 "sector": "Aeroespacial"
                 
             },
             {
                 "id": 3464545,
                 "CURP": "MART990830MDFLRN08",
                 "Nombre Completo": "Teresa Martínez Ríos",
                 "generacion": "2020",
                 "Programa Academico": "Ingeniería Biónica",
                 "Ciudad": "Puebla",
                 "lat": 19.0428,
                 "lng": -98.2031,
                 "empleado": true,
                 "empresa": "BioTech Solutions",
                 "Correo de Empresa o Negocio": "tmartinez@biotechsolutions.com",
                 "sector": "Biomédica"
                 
             },
             {
                 "id": 3464546,
                 "CURP": "SANC001012HDFLRN09",
                 "Nombre Completo": "Carlos Sánchez Mendoza",
                 "generacion": "2021",
                 "Programa Academico": "Ingeniería Civil",
                 "Ciudad": "Puebla",
                 "lat": 19.0435,
                 "lng": -98.2058,
                 "empleado": true,
                 "empresa": "Construcciones Modernas",
                 "Correo de Empresa o Negocio": "csanchez@construccionesmodernas.com",
                 "sector": "Construcción"
                 
             },
             {
                 "id": 3464547,
                 "CURP": "RODR011114MDFLRN10",
                 "Nombre Completo": "Rosa Rodríguez Díaz",
                 "generacion": "2017",
                 "Programa Academico": "Ingeniería Industrial",
                 "Ciudad": "Puebla",
                 "lat": 19.0423,
                 "lng": -98.2042,
                 "empleado": true,
                 "empresa": "Industrial Solutions",
                 "Correo de Empresa o Negocio": "rrodriguez@industrialsolutions.com",
                 "sector": "Industrial"
             },
             {
                 "id": 3464548,
                 "CURP": "GOME021216HDFLRN11",
                 "Nombre Completo": "Eduardo Gómez Vargas",
                 "generacion": "2018",
                 "Programa Academico": "Ingeniería en Diseño Automotriz",
                 "Ciudad": "Ciudad de México",
                 "lat": 19.4326,
                 "lng": -99.1332,
                 "empleado": true,
                 "empresa": "AutoDesign",
                 "Correo de Empresa o Negocio": "egomez@autodesign.com",
                 "sector": "Automotriz"
                 
             },
             {
                 "id": 3464549,
                 "CURP": "VARG031318MDFLRN12",
                 "Nombre Completo": "Gabriela Vargas Castro",
                 "generacion": "2019",
                 "Programa Academico": "Ingeniería Mecatrónica",
                 "Ciudad": "Monterrey",
                 "lat": 25.6866,
                 "lng": -100.3161,
                 "empleado": true,
                 "empresa": "MechTech",
                 "Correo de Empresa o Negocio": "gvargas@mechtech.com",
                 "sector": "Mecatrónica"
                 
             },
             {
                 "id": 3464550,
                 "CURP": "CRUZ041420HDFLRN13",
                 "Nombre Completo": "Javier Cruz Ortega",
                 "generacion": "2020",
                 "Programa Academico": "Ingeniería Química Industrial",
                 "Ciudad": "Guadalajara",
                 "lat": 20.6597,
                 "lng": -103.3496,
                 "empleado": true,
                 "empresa": "Quimica Industrial",
                 "Correo de Empresa o Negocio": "jcruz@quimicaindustrial.com",
                 "sector": "Químico"
                 
             },
             {
                 "id": 3464551,
                 "CURP": "FLOR051522MDFLRN14",
                 "Nombre Completo": "Flor Morales Reyes",
                 "generacion": "2021",
                 "Programa Academico": "Ingeniería en Proyectos Industriales",
                 "Ciudad": "Querétaro",
                 "lat": 20.5888,
                 "lng": -100.3899,
                 "empleado": true,
                 "empresa": "Proyectos Industriales SA",
                 "Correo de Empresa o Negocio": "fmorales@proyectosindustriales.com",
                 "sector": "Industrial"
                 
             },
             {
                 "id": 3464552,
                 "CURP": "FERN930817MDFLTR02",
                 "Nombre Completo": "Laura Fernández Torres",
                 "generacion": "2015",
                 "Programa Academico": "Ingeniería en Biotecnología",
                 "Ciudad":"Puebla",
                 "lat": 20.5888, "lng": -100.3899,
                 "empleado": false,
                 "empresa": "",
                 "Correo de Empresa o Negocio": "",
                 "sector": ""
                 
             },
             {
                 "id": 3464553, "CURP": "RODR850926HDFMRL07", 
                 "Nombre Completo": "Carlos Rodríguez Molina",
                 "generacion": "2014",
                 "Programa Academico": "Ingeniería Biónica",
                 "Ciudad": "Mérida",
                 "lat": 20.9671,
                 "lng": -89.6235,
                 "empleado": true,
                 "empresa": "BioTec Industries",
                 "Correo de Empresa o Negocio": "crodriguez@biotecind.com",
                 "sector": "Biotecnología"
                 
             },
             {
                 "id": 3464554,
                 "CURP": "SANC911211MDFPTR03",
                 "Nombre Completo": "Andrea Sánchez Pérez",
                 "generacion": "2017",
                 "Programa Academico": "Ingeniería en Computación y Sistemas",
                 "Ciudad": "Puebla",
                 "lat": 32.5149,
                 "lng": -117.0382,
                 "empleado": false,
                 "empresa": "",
                 "Correo de Empresa o Negocio": "",
                 "sector": ""
                 
             },
             {
                 "id": 3464555,
                 "CURP": "HERN820319HDFVRS01",
                 "Nombre Completo": "Fernando Hernández Vargas",
                 "generacion": "2013",
                 "Programa Academico": "Ingeniería Ambiental y Desarrollo Sustentable",
                 "Ciudad": "Puebla",
                 "lat": 21.1619,
                 "lng": -86.8515,
                 "empleado": true,
                 "empresa": "GreenTech Solutions",
                 "Correo de Empresa o Negocio":
                 "fhernandez@greentech.com",
                 "sector": "Medio Ambiente"
                 
             },
             {
                 "id": 3464556,
                 "CURP": "VELA900505HDFLTR04",
                 "Nombre Completo": "Daniel Velázquez Torres",
                 "generacion": "2016",
                 "Programa Academico": "Ingeniería Agrónoma",
                 "Ciudad": "Ciudad de México",
                 "lat": 19.4326,
                 "lng": -99.1332,
                 "empleado": false,
                 "empresa": "",
                 "Correo de Empresa o Negocio": "",
                 "sector": ""
                 
             },
             {
                 "id": 3464557,
                 "CURP": "CRUZ951228MDFGNL06",
                 "Nombre Completo": "Gabriela Cruz González",
                 "generacion": "2018",
                 "Programa Academico": "Ingeniería en Diseño Automotriz",
                 "Ciudad": "Puebla",
                 "lat": 21.1220,
                 "lng": -101.6822,
                 "empleado": true,
                 "empresa": "AutoDesign",
                 "Correo de Empresa o Negocio": "gcruz@autodesign.com",
                 "sector": "Automotriz"
                 
             },
             {
                 "id": 3464558,
                 "CURP": "AGUI780407HDFMRZ09",
                 "Nombre Completo": "Luis Aguilar Martínez",
                 "generacion": "2012",
                 "Programa Academico": "Ingeniería Industrial",
                 "Ciudad": "Toluca",
                 "lat": 19.2826,
                 "lng": -99.6557,
                 "empleado": true,
                 "empresa": "Industrias Toluca",
                 "Correo de Empresa o Negocio":
                 "laguilar@indtoluca.com", "sector":
                 "Industrial"
                 
             },
             {
                 "id": 3464587,
                 "CURP": "LOPA491230MDFLRN50",
                 "Nombre Completo": "Ana López Pérez",
                 "generacion": "2020",
                 "Programa Academico": "Ingeniería en Computación y Sistemas",
                 "Ciudad": "Puebla",
                 "lat": 19.0412,
                 "lng": -98.2067,
                 "empleado": true,
                 "empresa": "Data Systems",
                 "Correo de Empresa o Negocio": "alopez@datasystems.com",
                 "sector": "Tecnología"
                 
         }
    ];
}

// RENDERIZADO DE DATOS
function renderTable(data) {
    const tableBody = document.querySelector('#egresados-table tbody');
    tableBody.innerHTML = '';
    
    if (data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 20px;">
                    No se encontraron egresados con los filtros aplicados
                </td>
            </tr>`;
        return;
    }
    
    const rows = data.map(egresado => `
        <tr>
            <td>${egresado.id || '-'}</td>
            <td>${egresado.CURP || '-'}</td>
            <td>${egresado["Nombre Completo"] || '-'}</td>
            <td>${egresado["Programa Academico"] || '-'}</td>
            <td>${egresado.periodo || egresado.generacion || '-'}</td>
            <td>${egresado.empresa || '-'}</td>
            <td>${egresado.sector || '-'}</td>
            <td>${egresado.Ciudad || egresado.ubicacion || '-'}</td>
            <td>${egresado.empleado ? 'Empleado' : 'No empleado'}</td>
        </tr>`
    ).join('');
    
    tableBody.innerHTML = rows;
}

function updateMapWithData() {
    // Limpiar marcadores existentes
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    // Agregar nuevos marcadores
    const markers = filteredData
        .filter(e => e.lat && e.lng)
        .map(e => {
            const popupContent = `
                <b>${e["Nombre Completo"] || 'Egresado'}</b><br>
                <small>${e.generacion || ''}</small><br>
                ${e.empresa ? `<b>Empresa:</b> ${e.empresa}<br>` : ''}
                <b>Empleado:</b> ${e.empleado ? 'Sí' : 'No'}
            `;
            
            return L.marker([e.lat, e.lng])
                .addTo(map)
                .bindPopup(popupContent);
        });

    // Ajustar vista
    if (markers.length > 0) {
        map.fitBounds(L.featureGroup(markers).getBounds().pad(0.2));
    } else {
        map.setView([23.6345, -102.5528], 5);
    }
}

// FILTRADO DE DATOS
function applyStoredFilters() {
    const filtrosGuardados = localStorage.getItem('egresados-filtros');
    const summaryContainer = document.getElementById('filter-summary-container');
    
    summaryContainer.innerHTML = '';
    filteredData = [...egresadosData];
    
    if (!filtrosGuardados) {
        updateUI();
        return;
    }
    
    try {
        const filtros = JSON.parse(filtrosGuardados);
        activeFilters = {};
        
        // Aplicar filtros solo si no son valores por defecto
        if (filtros.periodo && !['todas', 'Todos los periodos'].includes(filtros.periodo)) {
            filteredData = filteredData.filter(e => e.periodo === filtros.periodo);
            activeFilters.periodo = filtros.periodo;
        }
        
        if (filtros.programa && !['todas', 'Todas las carreras'].includes(filtros.programa)) {
            filteredData = filteredData.filter(e => e["Programa Academico"] === filtros.programa);
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
        
        showFilterSummary();
        updateUI();
    } catch (error) {
        console.error('Error aplicando filtros:', error);
        updateUI();
    }
}

function filterTable() {
    const termino = document.getElementById('search-input').value.toLowerCase().trim();
    
    if (!termino) {
        applyStoredFilters();
        return;
    }
    
    const resultados = filteredData.filter(e => 
        (e["Nombre Completo"] || '').toLowerCase().includes(termino) ||
        (e.CURP || '').toLowerCase().includes(termino) ||
        (e.empresa || '').toLowerCase().includes(termino) ||
        (e.id && e.id.toString().includes(termino))
    );
    
    renderTable(resultados);
    updateMapWithMarkers(resultados);
}

function updateUI() {
    renderTable(filteredData);
    updateMapWithData();
    updateStatistics();
}

function showFilterSummary() {
    const summaryContainer = document.getElementById('filter-summary-container');
    
    if (Object.keys(activeFilters).length === 0) {
        summaryContainer.innerHTML = '<h3>Mostrando todos los egresados</h3>';
        return;
    }
    
    let summaryHTML = '<h3>Filtros aplicados:</h3>';
    Object.entries(activeFilters).forEach(([key, value]) => {
        summaryHTML += `<p><strong>${formatFilterName(key)}:</strong> ${value}</p>`;
    });
    
    summaryContainer.innerHTML = summaryHTML;
}

function formatFilterName(key) {
    const names = {
        'periodo': 'Periodo',
        'programa': 'Programa Academico',
        'empresa': 'Empresa',
        'sector': 'Sector',
        'estatus': 'Estatus Laboral',
        'buscar': 'Búsqueda'
    };
    return names[key] || key;
}

// EXPORTACIÓN DE DATOS
function generateCSV() {
    if (filteredData.length === 0) {
        alert('No hay datos para exportar');
        return;
    }
    
    const headers = [
        'ID', 'CURP', 'Nombre', 'Programa Académico UPAEP', 
        'Periodo de Egreso', 'Empresa', 'Giro o Sector', 
        'Ubicación de la Empresa', 'Estatus Laboral'
    ];
    
    const rows = filteredData.map(e => [
        e.id || '',
        `"${(e.CURP || '').replace(/"/g, '""')}"`,
        `"${(e["Nombre Completo"] || '').replace(/"/g, '""')}"`,
        `"${(e["Programa Academico"] || '').replace(/"/g, '""')}"`,
        `"${(e.periodo || e.generacion || '').replace(/"/g, '""')}"`,
        e.empresa ? `"${e.empresa.replace(/"/g, '""')}"` : '-',
        e.sector ? `"${e.sector.replace(/"/g, '""')}"` : '-',
        `"${(e.Ciudad || e.ubicacion || '').replace(/"/g, '""')}"`,
        e.empleado ? 'Empleado' : 'No empleado'
    ]);
    
    downloadFile(headers.join(',') + '\n' + rows.map(row => row.join(',')).join('\n'), 'egresados.csv', 'text/csv');
}

function exportToExcel() {
    if (filteredData.length === 0) {
        alert('No hay datos para exportar');
        return;
    }
    
    if (typeof XLSX === 'undefined') {
        loadScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js', exportToExcel);
        return;
    }
    
    try {
        const excelData = filteredData.map(e => ({
            'ID': e.id || '',
            'CURP': e.CURP || '-',
            'Nombre': e["Nombre Completo"] || '-',
            'Programa Académico UPAEP': e["Programa Academico"] || '-',
            'Periodo de Egreso': e.periodo || e.generacion || '-',
            'Empresa': e.empresa || '-',
            'Giro o Sector': e.sector || '-',
            'Ubicación de la Empresa': e.Ciudad || e.ubicacion || '-',
            'Estatus Laboral': e.empleado ? 'Empleado' : 'No empleado'
        }));
        
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Egresados");
        XLSX.writeFile(wb, `egresados_${new Date().toISOString().slice(0,10)}.xlsx`);
    } catch (error) {
        console.error('Error al exportar a Excel:', error);
        alert('Error al exportar a Excel');
    }
}

// FUNCIONES UTILITARIAS
function updateStatistics() {
    const [totalElement, filteredElement] = document.querySelectorAll('.stat-number');
    if (totalElement) totalElement.textContent = egresadosData.length;
    if (filteredElement) filteredElement.textContent = filteredData.length;
}

function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
}