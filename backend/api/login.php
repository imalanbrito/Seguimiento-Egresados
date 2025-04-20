<?php
session_start();
header('Content-Type: application/json');

$validCredentials = [
    "administrador@upaep.edu.mx" => "admin123",
    "invitado@upaep.edu.mx" => "invitado123"
];

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (isset($validCredentials[$email]) && $validCredentials[$email] === $password) {
    $_SESSION['userEmail'] = $email;
    $_SESSION['userName'] = ($email === 'invitado@upaep.edu.mx') ? "Jane Doe" : "John Doe";
    echo json_encode(["success" => true, "userName" => $_SESSION['userName'], "userType" => ($email === "invitado@upaep.edu.mx" ? "Invitado" : "Administrativo")]);
    exit();
}

echo json_encode(["success" => false]);
exit();