<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Laravel Queue Demo</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])

</head>

<body>
    <main>
        <div>
            <h1>Laravel Queue Demo</h1>
            <p>Press the button to dispatch a job in server</p>
            <button>DISPATCH</button>
            <div id="debug"></div>
        </div>
    </main>
</body>

</html>
