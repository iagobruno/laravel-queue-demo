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

Start the queue worker to process new jobs.

```
sail artisan queue:work
```

### Front-end assets

Open another terminal tab and run the command below to compile front-end assets:

```
sail yarn install
sail yarn run dev
```

Now you can access the project at http://localhost in the browser.
