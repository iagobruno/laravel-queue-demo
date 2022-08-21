<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request as Request;
use Illuminate\Support\Facades\Mail;
use App\Jobs\SlowJob;
use App\Jobs\BadJob;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::view('/', 'welcome');

Route::post('/dispatch', function (Request $request) {
    $id = str()->random();

    if ($request->boolean('dispatchBadJob', false)) {
        BadJob::dispatch($id);
    } else {
        SlowJob::dispatch($id);
    }

    return [
        'message' => 'Job queued',
        'jobId' => $id,
    ];
});

Route::get('/mail', function () {
    $user = \App\Models\User::factory(50)->create();
    Mail::to($user)->send(new \App\Mail\DumpMail());
    return 'SENT';
});
