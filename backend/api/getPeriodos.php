<?php
header('Content-Type: application/json');

$periodos = [];
$anioActual = date("Y");

for ($año = $anioActual; $año >= 1977; $año--) {
    $periodos[] = "Primavera $año";
    $periodos[] = "Otoño $año";
}

echo json_encode($periodos);
?>