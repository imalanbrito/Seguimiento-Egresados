<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::get('/', function () {
    return redirect('/login');
});

Route::get('/login', function () {
    return view('login');
})->name('login');

Route::post('/login', function (Request $request) {
    $email = $request->input('email');
    $password = $request->input('password');

    $validCredentials = [
        'administrador@upaep.edu.mx' => 'admin123',
        'invitado@upaep.edu.mx' => 'invitado123'
    ];

    if (isset($validCredentials[$email]) && $validCredentials[$email] === $password) {
        session([
            'userEmail' => $email,
            'userName' => $email === 'invitado@upaep.edu.mx' ? 'Jane Doe' : 'John Doe'
        ]);
        return redirect('/dashboard');
    }

    return redirect()->back()->withErrors(['email' => 'Credenciales incorrectas']);
});

Route::get('/dashboard', function () {
    if (!session()->has('userEmail')) {
        return redirect('/login');
    }

    $userEmail = session('userEmail');
    $userName = session('userName');

    $periodos = [];
    foreach (range(2024, 1973) as $año) {
        $periodos[] = "Otoño $año";
        $periodos[] = "Primavera $año";
    }

    $programas = [
        "Ingeniería Aeroespacial", "Ingeniería Agrónoma", "Ingeniería Ambiental y Desarrollo Sustentable",
        "Ingeniería Biónica", "Ingeniería Biotecnología", "Ingeniería Civil",
        "Ingeniería en Ciencia de Datos", "Ingeniería en Computación y Sistemas",
        "Ingeniería en Diseño Automotriz", "Ingeniería en Proyectos Industriales",
        "Ingeniería en Software", "Ingeniería Industrial", "Ingeniería Mecatrónica", "Ingeniería Química Industrial"
    ];
    sort($programas);

    return view('dashboard', compact('userEmail', 'userName', 'periodos', 'programas'));
})->name('dashboard');

Route::get('/exhibicion', function () {
    if (!session()->has('userEmail')) {
        return redirect('/login');
    }

    $userEmail = session('userEmail');
    $userName = session('userName');

    return view('exhibicion', compact('userEmail', 'userName'));
})->name('exhibicion');

Route::post('/continuar', function (Request $request) {
    // Verifica si se seleccionó algún filtro
    $filtros = [
        'periodo' => $request->input('periodo'),
        'programa' => $request->input('programa'),
        'empresa' => $request->input('empresa'),
        'sector' => $request->input('sector'),
        'alcance' => $request->input('alcance'),
        'estatus' => $request->input('estatus'),
        'buscar' => trim($request->input('buscar'))
    ];

    // Si no hay filtros, redirige a exhibición
    if (!array_filter($filtros)) {
        return redirect('/exhibicion');
    }

    return redirect('/dashboard'); // Aquí podrías agregar lógica para mostrar resultados filtrados
})->name('continuar');

Route::get('/logout', function () {
    session()->flush();
    return redirect('/login');
})->name('logout');