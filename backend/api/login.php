<?php
session_start();
header('Content-Type: application/json');

$validCredentials = [
    "administrador@upaep.edu.mx" => ["password" => "admin123", "name" => "ALAN YAIR PEREZ FLORES"],
    "invitado@upaep.edu.mx" => ["password" => "invitado123", "name" => "Invitado UPAEP"]
];

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (isset($validCredentials[$email])) {
    if ($validCredentials[$email]['password'] === $password) {
        $_SESSION['userEmail'] = $email;
        $_SESSION['userName'] = $validCredentials[$email]['name'];
        $_SESSION['userType'] = ($email === 'invitado@upaep.edu.mx') ? "Invitado" : "Administrativo";
        
        $redirect = ($email === 'invitado@upaep.edu.mx') ? '../pages/exhibicion.html' : '../pages/dashboard.html';
        
        echo json_encode([
            "success" => true, 
            "userName" => $_SESSION['userName'],
            "userType" => $_SESSION['userType'],
            "redirect" => $redirect
        ]);
        exit();
    }
}

echo json_encode(["success" => false]);
exit();
?>