<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $programas = [
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
    ];
    
    // Validar que hay programas definidos
    if (empty($programas)) {
        throw new Exception("No hay programas académicos definidos");
    }
    
    // Ordenar alfabéticamente
    sort($programas);
    
    http_response_code(200);
    echo json_encode($programas, JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'programas' => []
    ]);
}
?>