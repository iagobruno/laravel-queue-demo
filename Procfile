web: vendor/bin/heroku-php-apache2 public/
worker: php artisan queue:work database --tries=3 --sleep=3 --daemon
scheduler: php artisan schedule:work