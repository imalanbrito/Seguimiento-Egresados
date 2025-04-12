<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-6">
    <title>Seguimiento de Egresados</title>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

    <style>
        body {
            font-family: 'Fira Sans', sans-serif;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
        }

        header {
            background-color: {{ $userEmail === 'invitado@upaep.edu.mx' ? '#757575' : '#b90114' }};
            color: #ffffff;
            height: 55px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 0 20px;
        }
        .user-info {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .user-name {
            font-size: 15px;
            font-weight: 900;
        }

        .user-img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-image: url('https://www.w3schools.com/howto/img_avatar.png');
            background-size: cover;
            background-position: center;
        }

        .date-time {
            display: flex;
            flex-direction: column;
            font-size: 14px;
            color: #ffffff;
            text-align: center;
        }

        .icon-box {
            width: 30px;
            height: 30px;
            background-color: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }

        .logout-icon {
            width: 20px;
            height: 20px;
            background-image: url('ruta/a/logout-icon.svg'); 
            background-size: cover;
            background-position: center;
        }

        main {
            max-width: 1200px;
            margin: 40px auto;
        }

        h1, h2 {
            font-weight: 700;
        }

        .data-container {
            background-color: #ffffff;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
            border-radius: 10px;
            padding: 20px;
            width: 100%;
            height: 500px;
            margin-top: 50px; 
            display: flex;
            justify-content: center;
            align-items: center;
        }

        #map {
            width: 100%;
            height: 100%;
            border-radius: 10px;
        }

        .statistics-container {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            gap: 10px;
            width: 100%;
        }

        .stat-box {
            background-color: #ffffff;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
            border-radius: 10px;
            padding: 20px;
            flex: 1.5;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: auto;
        }

        .stat-number {
            font-size: 64px;
            font-weight: 900;
            color: #b90114;
        }

        .stat-text {
            font-size: 20px;
            font-weight: 700;
            color: #333;
        }

        .extra-container {
            background-color: #ffffff;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
            border-radius: 10px;
            padding: 20px;
            margin-top: 25px; 
            width: 100%;
            height: 1052px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: flex-end;
        }

        .button-container {
            display: flex;
            justify-content: flex-end;
            gap: 20px;
            width: 100%;
            margin-top: 20px;
        }

        .button {
            background-color: #b90114;
            color: #ffffff;
            font-size: 16px;
            padding: 10px 20px;
            border: none;
            border-radius: 50px;
            cursor: pointer;
        }

        .button.left {
            background-color: #b90114;
        }

    </style>
</head>
<body>
    <header>
        <div class="user-info">
            <span class="user-name">{{ $userName }}</span>
            <div class="user-img"></div>
            <div class="date-time">
                <span>{{ date('d/m/Y') }}</span>
                <span>{{ date('H:i') }}</span>
            </div>
            <div class="icon-box"></div>
            <div class="icon-box" onclick="window.location.href='{{ route('login') }}'">
                <div class="logout-icon"></div>
            </div>
        </div>
    </header>

    <main>
        <h1>Egresados Ingenierías</h1>
        <h2>Tipo de Persona: <strong>{{ $userEmail === 'invitado@upaep.edu.mx' ? 'Invitado' : 'Administrativo' }}</strong></h2>

        <div class="data-container">
            <div id="map"></div>
        </div>

        <div class="statistics-container">
            <div class="stat-box">
                <span class="stat-number">451</span>
                <span class="stat-text">Egresados Totales de Todas las Ingenierías</span>
            </div>
            <div class="stat-box">
                <span class="stat-number">42</span>
                <span class="stat-text">Egresados del Periodo Anterior</span>
            </div>
        </div>

        <div class="extra-container">
            <div class="button-container">
                <button class="button left" onclick="window.location.href='{{ route('dashboard') }}'">Regresar</button>
                <button class="button">Descargar</button>
            </div>
        </div>
    </main>

    <script>
        var map = L.map('map').setView([19.0433, -98.1981], 5); // Puebla, México

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    </script>
</body>
</html>