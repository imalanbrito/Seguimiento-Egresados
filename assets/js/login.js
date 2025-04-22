document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    // Manejar envío del formulario
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        authenticateUser();
    });

    // Manejar tecla Enter
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            authenticateUser();
        }
    });

    function authenticateUser() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Credenciales válidas (modo dummy)
        const validCredentials = {
            'administrador@upaep.edu.mx': { password: 'admin123', redirect: 'dashboard.html' },
            'invitado@upaep.edu.mx': { password: 'invitado123', redirect: 'dashboard.html' }
        };

        if (validCredentials[email] && validCredentials[email].password === password) {
            // Simular sesión
            sessionStorage.setItem('userEmail', email);
            sessionStorage.setItem('userType', email === 'administrador@upaep.mx' ? 'admin' : 'invitado');
            
            // Redirigir
            window.location.href = validCredentials[email].redirect;
        } else {
            errorMessage.textContent = 'Credenciales incorrectas. Usa: administrador@upaep.mx/admin123 o invitado@upaep.mx/invitado123';
            errorMessage.style.display = 'block';
        }
    }
});