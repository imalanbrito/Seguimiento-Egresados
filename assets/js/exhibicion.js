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
    updateUserInfo();
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
    
    document.getElementById('logout-btn').addEventListener('click', function() {
        sessionStorage.clear();
        window.location.href = '../login.html';
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
    map = L.map('map').setView([19.0433, -98.1981], 5); // Puebla, México
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
}

async function loadEgresadosData() {
    try {
        const response = await fetch('../assets/data/egresados.json');
        const data = await response.json();
        
        // Extraer solo los datos del array all_data y mapear a la estructura requerida
        egresadosData = data.all_data.map(item => ({
            id: item.id || '',
            CURP: item.CURP || '',
            "Nombre Completo": item["Nombre Completo"] || '',
            "Programa Academico": item["Programa Academico"] || '',
            generacion: item.generacion || '',
            Ciudad: item.Ciudad || '',
            lat: item.lat || null,
            lng: item.lng || null,
            empleado: item.empleado || false,
            empresa: item.empresa || '',
            "Correo de Empresa o Negocio": item["Correo de Empresa o Negocio"] || '',
            sector: item.sector || '',
            ingenieria: item.ingenieria || ''
        }));
        
        filteredData = [...egresadosData];
        updateStatistics();
        renderTable(filteredData);
        addMarkersFromData();
    } catch (error) {
        console.error('Error cargando datos:', error);
        loadSampleData();
    }
}

function renderTable(data) {
    const tableBody = document.querySelector('#egresados-table tbody');
    tableBody.innerHTML = '';
    
    if (data.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="12" style="text-align: center; padding: 20px;">
                No se encontraron egresados con los filtros aplicados
            </td>`;
        tableBody.appendChild(row);
        return;
    }
    
    data.forEach(egresado => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${egresado.id}</td>
            <td>${egresado.CURP}</td>
            <td>${egresado["Nombre Completo"]}</td>
            <td>${egresado["Programa Academico"]}</td>
            <td>${egresado.generacion}</td>
            <td>${egresado.Ciudad}</td>
            <td>${egresado.empleado ? 'Sí' : 'No'}</td>
            <td>${egresado.empresa}</td>
            <td>${egresado["Correo de Empresa o Negocio"]}</td>
            <td>${egresado.sector}</td>
            <td>${egresado.ingenieria}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Modifica también la función addMarkersFromData para usar la nueva estructura
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
            
            let popupContent = `<b>${e["Nombre Completo"] || 'Egresado'}</b><br>`;
            popupContent += `<small>${e.generacion || ''}</small><br>`;
            popupContent += `<b>Programa:</b> ${e["Programa Academico"] || ''}<br>`;
            
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
    
    // ... (mantén la misma lógica de resumen de filtros que tenías originalmente)
    
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