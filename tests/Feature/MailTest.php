<?php

use App\Mail\DumpMail;
use Illuminate\Support\Facades\Mail;
use function Pest\Laravel\{get};

test('Deve conseguir enviar um email', function () {
    Mail::fake();

    get('/mail');

    Mail::assertQueued(DumpMail::class);
    // Mail::assertQueued(DumpMail::class, function ($mail) use ($user) {
    //     return $mail->hasTo($user->email) &&
    //            $mail->hasSubject('My first email');
    // });
});
