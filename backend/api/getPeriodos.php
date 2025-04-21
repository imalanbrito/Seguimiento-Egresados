<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $periodos = [];
    $anioActual = date("Y");
    
    // Generar periodos desde 1977 hasta el año actual
    for ($año = $anioActual; $año >= 1977; $año--) {
        $periodos[] = "Primavera $año";
        $periodos[] = "Otoño $año";
    }
    
    // Validar que se generaron periodos
    if (empty($periodos)) {
        throw new Exception("No se pudieron generar los periodos");
    }
    
    http_response_code(200);
    echo json_encode($periodos, JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'periodos' => []
    ]);
}
?>