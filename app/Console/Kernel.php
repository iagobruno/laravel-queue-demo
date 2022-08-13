<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Console\Commands\AboutGithubUser;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('inspire')->hourly();
        // $schedule->command(AboutGithubUser::class, ['iagobruno'])->everyMinute();
        // $schedule->command('model:prune')->dailyAt('00:00')->withoutOverlapping();
        // $schedule->job(new \App\Jobs\SlowJob)->daily()->onOneServer();
        // $schedule->call(fn () => DB::table('recent_users')->delete())->daily();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
