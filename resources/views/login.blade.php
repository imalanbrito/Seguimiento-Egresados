<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Inicio de Sesión - Seguimiento de Egresados</title>
    
    <!-- Google Fonts: Fira Sans -->
    <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;700;900&display=swap" rel="stylesheet">
    
    <style>
        body {
            font-family: 'Fira Sans', sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        .login-container {
            background-color: #ffffff;
            padding: 3vw;
            border-radius: 20px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            width: 80%;
            max-width: 500px;
        }

        h1 {
            font-size: 3vw;
            color: #b90114;
            text-align: center;
            margin-bottom: 2vw;
        }

        form {
            display: flex;
            flex-direction: column;
        }

        label {
            font-size: 1.2vw;
            margin-bottom: 0.5vw;
            font-weight: bold;
            color: #333;
        }

        input[type="email"],
        input[type="password"] {
            padding: 1vw;
            font-size: 1.2vw;
            border-radius: 10px;
            border: 2px solid #ccc;
            margin-bottom: 2vw;
            font-family: 'Fira Sans', sans-serif;
        }

        .error-message {
            color: red;
            font-size: 1vw;
            margin-bottom: 1vw;
        }

        button {
            background-color: #b90114;
            color: #ffffff;
            padding: 1vw;
            font-size: 1.5vw;
            font-weight: bold;
            border: none;
            border-radius: 50px;
            cursor: pointer;
        }

        button:hover {
            background-color: #9a0010;
        }

        @media (max-width: 768px) {
            h1 {
                font-size: 5vw;
            }

            label, input, button {
                font-size: 4vw;
            }

            .error-message {
                font-size: 3.5vw;
            }
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h1>Inicio de Sesión</h1>

        @if($errors->any())
            <div class="error-message">{{ $errors->first() }}</div>
        @endif

        <form action="/login" method="POST">
            @csrf
            <label for="email">Correo institucional</label>
            <input type="email" id="email" name="email" placeholder="ejemplo@upaep.edu.mx" required>

            <label for="password">Contraseña</label>
            <input type="password" id="password" name="password" placeholder="••••••••••" required>

            <button type="submit">Ingresar</button>
        </form>
    </div>
</body>
</html>
