<?php
header('Content-Type: application/json');

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

sort($programas); // Ordenar alfabéticamente

echo json_encode($programas);
?>