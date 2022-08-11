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
            return display('error');
        }

        display('waiting');
    })
    .catch(() => display('error'));
}

function display(type) {
    const messages = {
        'requesting': 'Requesting to server...',
        'waiting': 'Your job was added to the queue. Waiting...',
        'processing': 'Your job is currently being processed...',
        'error': `<span style="color:red">An error occurred while requesting your job.</span>`,
        'failed': `<span style="color:red">An error occurred while processing the job.</span>`,
        'success': `<span style="color:green">Your requested job has been completed!</span>`,
    };
    debug.innerHTML = messages[type];
    console.log(debug.innerText);

    if (type === 'error' || type === 'success') {
        button.disabled = false;
    }
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

const channel = Echo.channel('jobs.' + clientID);

channel.listenToAll((event, data) => {
    console.log('Web socket event:', event, data);
});

channel.listen('JobStarted', function (data) {
    display('processing');
});

channel.listen('JobCompleted', function (data) {
    display('success');
    button.disabled = false;
});

channel.listen('JobFailed', function (data) {
    display('failed');
    button.disabled = false;
});
