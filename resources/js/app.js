import EchoCore from 'laravel-echo';
import Pusher from 'pusher-js';
import uuid from 'cuid';

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


const button = document.querySelector('button');
const debug = document.querySelector('#debug');
const csrfToken = document.querySelector('meta[name=csrf-token]').content;

button.addEventListener('click', dispatchJob);

function dispatchJob() {
    const ID = uuid();

    button.disabled = true;
    display('requesting');

    // Dispatch the job on server
    fetch(window.location.origin + '/dispatch', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify({
            clientID: ID,
        })
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.message === 'Job added to queue') {
            display('waiting');
            subscribeToJobEvents();
        }
        else {
            return Promise.reject();
        }
    })
    .catch(() => display('error'));

    // Listen to job events
    let channel;
    function subscribeToJobEvents () {
        channel = Echo.channel('jobs.' + ID)
            .listenToAll((event, data) => {
                console.log('Web socket event:', event, data);
            })
            .listen('JobStarted', function (data) {
                display('processing');
            })
            .listen('JobCompleted', function (data) {
                display('success');
                unsubscribe();
            })
            .listen('JobFailed', function (data) {
                display('failed');
                unsubscribe();
            });
    }

    function unsubscribe () {
        channel.stopListeningToAll().unsubscribe();
    }
}

function display(type) {
    const messages = {
        'requesting': '📞 Requesting to server...',
        'error': `<span style="color:red">❌ An error occurred while requesting your job.</span>`,
        'waiting': '⏳ The job was added to the queue. Waiting...',
        'processing': '🛠️ Your job is currently being processed...',
        'failed': `<span style="color:red">⚠️ An error occurred while processing the job.</span>`,
        'success': `<span style="color:green">✅ Your requested job has been completed!</span>`,
    };
    debug.innerHTML = messages[type];
    console.log(debug.innerText);

    if (type === 'requesting') {
        button.disabled = true;
    }

    if (type === 'error' || type === 'failed' || type === 'success') {
        button.disabled = false;
    }
}
