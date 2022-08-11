<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Laravel Queue Demo</title>

    <style>
        body {
            font-family: 'Nunito', sans-serif;
            font-size: 24px;
            color: #111;
            margin: 0;
        }

        main {
            height: 100vh;
            width: 100vw;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        h1 {
            font-size: 2em;
            margin: 0;
        }

        p {
            color: rgb(0 0 0 / 76%);
            margin: 0.6em 0 1.2em;
        }

        button {
            background-color: green;
            border: 1px solid rgb(0 0 0 / 60%);
            border-radius: 4px;
            padding: 10px;
            width: 100%;
            text-align: center;
            font-size: 0.86em;
            color: white;
            cursor: pointer;
        }

        button:active {
            transform: translateY(2px);
        }

        button:disabled {
            background-color: gray;
            opacity: 0.8;
            pointer-events: none;
        }

        #debug {
            margin-top: 1em;
            height: 1.2em;
        }
    </style>
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

    <script>
        const button = document.querySelector('button');
        const debug = document.querySelector('#debug');
        const csrfToken = document.querySelector('meta[name=csrf-token]').content;

        button.addEventListener('click', dispatch);

        function dispatch() {
            button.disabled = true;
            log('requesting');

            fetch('{{ config('app.url') }}/dispatch', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify({})
                })
                .then(res => res.json())
                .then((res) => {
                    if (res.message !== 'Job added to queue') {
                        log('error');
                    }

                    log('waiting');
                })
                .catch(() => log('error'));
        }

        function log(type) {
            const messages = {
                'requesting': 'Requesting to server...',
                'waiting': 'Waiting response...',
                'error': `<span style="color:red">An error occurred while requesting your order.</span>`,
                'success': `<span style="color:green">Your request has been processed!</span>`,
            };
            debug.innerHTML = messages[type];
            console.log(debug.innerText);
        }
    </script>
</body>

</html>
