document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Credenciales válidas (simuladas)
        const validCredentials = {
            'administrador@upaep.edu.mx': 'admin123',
            'invitado@upaep.edu.mx': 'invitado123'
        };

        if (validCredentials[email] && validCredentials[email] === password) {
            // Guardar datos en localStorage
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', email === 'invitado@upaep.edu.mx' ? 'Jane Doe' : 'John Doe');
            
            // Redirigir al dashboard
            window.location.href = '../pages/dashboard.html';
        } else {
            errorMessage.textContent = 'Credenciales incorrectas';
            errorMessage.style.display = 'block';
        }
    });
});