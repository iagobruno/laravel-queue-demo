<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Queue;
use Illuminate\Queue\Events\JobProcessed;
use Illuminate\Queue\Events\JobProcessing;
use Illuminate\Queue\Events\JobFailed;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Queue::before(function (JobProcessing $event) {
            $payload = $event->job->payload();
            $jobClass = unserialize($payload['data']['command']);
            $jobClassName = get_class($jobClass);

            $isFirstAttempt = $event->job->attempts() === 1;
            if ($isFirstAttempt) {
                $id = $jobClass->clientID;
                event(new \App\Events\JobStarted($id));
            }
        });

        Queue::after(function (JobProcessed $event) {
            $payload = $event->job->payload();
            $jobClass = unserialize($payload['data']['command']);
            $jobClassName = get_class($jobClass);

            $isCompleted = !$event->job->isReleased() && !$event->job->hasFailed();
            if ($isCompleted) {
                $id = $jobClass->clientID;
                event(new \App\Events\JobCompleted($id));
            }
        });

        Queue::failing(function (JobFailed $event) {
            $payload = $event->job->payload();
            $jobClass = unserialize($payload['data']['command']);
            $jobClassName = get_class($jobClass);

            if ($event->job->hasFailed()) {
                $id = $jobClass->clientID;
                event(new \App\Events\JobFailed($id));
            }
        });
    }
}
