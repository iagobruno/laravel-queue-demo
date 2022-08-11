<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Events\JobStarted;
use App\Events\JobFailed;

class BadJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 1;

     /**
     * The maximum number of unhandled exceptions to allow before failing.
     */
    public $maxExceptions = 3;

    /**
     * The number of seconds to wait before retrying the job.
     * @see https://laravel.com/docs/9.x/queues#dealing-with-failed-jobs
     */
    public int $backoff = 1;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        private string $clientID
    ) {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        event(new JobStarted($this->clientID));

        return $this->release(2); // Release the job back onto the queue for immediate processing
        // return $this->fail(); // Manually mark a job as failed
        // throw new \Exception("Unknow Error!");

        event(new JobCompleted($this->clientID));
    }

    /**
     * Handle a job failure.
     *
     * @param  \Throwable  $exception
     * @return void
     */
    public function failed($exception)
    {
        event(new JobFailed($this->clientID));
    }
}
