<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Seguimiento de Egresados</title>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;700;900&display=swap" rel="stylesheet">

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
            background-image: url('ruta/a/logout-icon.svg'); /* Reemplaza con la ruta correcta */
            background-size: cover;
            background-position: center;
        }

        main {
            padding: 40px;
        }

        h1, h2 {
            font-weight: 700;
        }

        .filter-container {
            background-color: #ffffff;
            box-shadow: 
                0px 4px 4px rgba(0, 0, 0, 0.25),
                inset 6px 9px 11.6px rgba(0, 0, 0, 0.05);
            border-radius: 10px;
            padding: 40px;
            margin-top: 40px;
        }

        .search-row {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 20px;
        }

        .search-row select,
        .search-row input {
            height: 36px;
            font-size: 16px;
            padding: 8px;
            border-radius: 10px;
            border: 2px solid #757575;
            width: 100%;
            max-width: 400px;
        }

        .search-row input::placeholder {
            color: #757575;
        }

        @media (min-width: 1024px) {
            .search-row input {
                height: 40px;
            }
        }

        .dropdown-group {
            margin-bottom: 25px;
        }

        .dropdown-group label {
            display: block;
            font-weight: 700;
        }

        .dropdown-group select {
            width: 100%;
            height: 40px;
            font-size: 16px;
            border: 2px solid #757575;
            border-radius: 10px;
            padding: 8px;
        }

        .continue-button {
            margin-top: 20px;
            background-color: #b90114;
            color: #ffffff;
            font-size: 16px;
            padding: 10px 20px;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            display: block;
            margin-left: auto;
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

        <div class="filter-container">
            <form action="{{ route('continuar') }}" method="POST">
                @csrf

                <div class="search-row">
                    <label for="periodo">Seleccione Periodo:</label>
                    <select name="periodo" id="periodo">
                        <option disabled selected>Seleccione opción</option>
                        @foreach ($periodos as $periodo)
                            <option>{{ $periodo }}</option>
                        @endforeach
                    </select>

                    <label for="buscar">Buscar:</label>
                    <input type="text" name="buscar" id="buscar" placeholder="ID / Nombre del Egresado">
                </div>

                <h2>Filtrar por:</h2>

                <div class="dropdown-group">
                    <label for="programa">Programa Académico UPAEP</label>
                    <select name="programa" id="programa">
                        <option disabled selected>Seleccione opción</option>
                        @foreach ($programas as $programa)
                            <option>{{ $programa }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="dropdown-group">
                    <label for="empresa">Empresa o Negocio</label>
                    <select name="empresa" id="empresa">
                        <option disabled selected>Seleccione opción</option>
                    </select>
                </div>

                <div class="dropdown-group">
                    <label for="sector">Giro o Sector</label>
                    <select name="sector" id="sector">
                        <option disabled selected>Seleccione opción</option>
                    </select>
                </div>

                <div class="dropdown-group">
                    <label for="alcance">Alcance Geográfico de la Empresa</label>
                    <select name="alcance" id="alcance">
                        <option disabled selected>Seleccione opción</option>
                        <option>Nacional</option>
                        <option>Internacional</option>
                    </select>
                </div>

                <div class="dropdown-group">
                    <label for="estatus">Estatus Laboral</label>
                    <select name="estatus" id="estatus">
                        <option disabled selected>Seleccione opción</option>
                        <option>Activo</option>
                        <option>Inactivo</option>
                    </select>
                </div>

                <button type="submit" class="continue-button">Continuar</button>
            </form>
        </div>
    </main>
    <script>
        document.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                event.preventDefault(); // Evita comportamientos no deseados
                document.querySelector(".continue-button").click(); // Simula el clic en "Continuar"
            }
        });
    </script>
</body>
</html>