import EchoCore from 'laravel-echo';
import Pusher from 'pusher-js';
import cuid from 'cuid';

const clientID = cuid();
const button = document.querySelector('button');
const debug = document.querySelector('#debug');
const csrfToken = document.querySelector('meta[name=csrf-token]').content;

button.addEventListener('click', dispatch);

function dispatch() {
    button.disabled = true;
    display('requesting');

    fetch(window.location.origin + '/dispatch', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify({
            clientID,
        })
    })
    .then(res => res.json())
    .then((res) => {
        if (res.message !== 'Job added to queue') {
            display('error');
        }

        display('waiting');
    })
    .catch(() => display('error'));
}

function display(type) {
    const messages = {
        'requesting': 'Requesting to server...',
        'waiting': 'Waiting response...',
        'error': `<span style="color:red">An error occurred while requesting your order.</span>`,
        'success': `<span style="color:green">Your request has been processed!</span>`,
    };
    debug.innerHTML = messages[type];
    console.log(debug.innerText);
}


window.Pusher = Pusher;
window.Echo = new EchoCore({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    // wsHost: import.meta.env.VITE_PUSHER_HOST ?? `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
    // wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
    // wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});

Echo.channel('responses.' + clientID).listen('JobCompleted', function (data) {
    console.log('Web socket event', data);
    display('success');
    button.disabled = false;
});
