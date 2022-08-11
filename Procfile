web: composer run-script warmup && vendor/bin/heroku-php-apache2 public/
queue_worker: php artisan queue:work database --sleep=3 --tries=3 --daemon
