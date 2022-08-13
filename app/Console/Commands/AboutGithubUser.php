<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class AboutGithubUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'github:user {username?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get and show infos about an Github user.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $username = $this->argument('username') ?? $this->ask('Github username:');
        $response = Http::acceptJson()->get("https://api.github.com/users/{$username}");

        if ($response->status() === 404) {
            return $this->error('User not found');
        }
        else if (!$response->ok()) {
            $this->error('Something goes wrong');
        }

        dump($response->json());
        return 0;
    }
}
