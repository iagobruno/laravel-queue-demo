# laravel-queue-demo

[![Online Demo](https://img.shields.io/badge/Online-Demo-brightgreen.svg)](https://laravel-queue-demo.herokuapp.com/)

## Getting Started

Clone this repo and run commands in the order below:

```
composer install
cp .env.example .env # And edit the values
php artisan key:generate
```

Then start Docker containers using Sail:

```
sail up -d
```

Start the queue worker to process the jobs:

```
sail artisan queue:listen
```

### Front-end assets

Open another terminal tab and run the command below to compile front-end assets:

```
sail yarn install
sail yarn run dev
```

Now you can access the project at http://localhost in your browser.

## How it works

- O cliente faz uma requisição HTTP comum ao servidor.
- O servidor adiciona um job na fila de processos.
- Um worker secundário no servidor processa a fila e notifica quando cada job for concluído via web socket.
- O cliente recebe a resposta do job via web socket.
