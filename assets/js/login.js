document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('../backend/api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                sessionStorage.setItem('userEmail', email);
                sessionStorage.setItem('userName', data.userName);
                window.location.href = '../pages/dashboard.html';
            } else {
                errorMessage.textContent = 'Credenciales incorrectas';
                errorMessage.style.display = 'block';
            }
        })
        .catch(error => console.error('Error:', error));
    });
});