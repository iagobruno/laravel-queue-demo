import EchoCore from 'laravel-echo';
import Pusher from 'pusher-js';

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


const buttonGroup = document.querySelector('fieldset');
const buttons = buttonGroup.querySelectorAll('button');
const debug = document.querySelector('#debug');
const csrfToken = document.querySelector('meta[name=csrf-token]').content;

buttons.forEach((button) => {
    button.addEventListener('click', dispatchJob);
});

function dispatchJob(evt) {
    buttonGroup.disabled = true;
    display('requesting');

    // Dispatch the job on server
    fetch(window.location.origin + '/dispatch', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify({
            dispatchBadJob: evt.currentTarget.classList.contains('secondary'),
        })
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.message === 'Job queued') {
                display('waiting');
                subscribeToJobEvents(res.jobId);
            }
            else {
                return Promise.reject();
            }
        })
        .catch(() => display('error'));

    // Listen to job events
    let channel;
    function subscribeToJobEvents (jobId) {
        channel = Echo.channel('jobs.' + jobId)
            .listenToAll(console.log.bind(null, 'Web socket event =>'))
            .listen('JobStarted', (data) => {
                display('processing');
            })
            .listen('JobCompleted', (data) => {
                display('success');
                unsubscribe();
            })
            .listen('JobFailed', (data) => {
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
        buttonGroup.disabled = true;
    }

    if (type === 'error' || type === 'failed' || type === 'success') {
        buttonGroup.disabled = false;
    }
}
