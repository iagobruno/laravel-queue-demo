<?php

use App\Jobs\BadJob;
use App\Jobs\SlowJob;
use Illuminate\Support\Facades\Queue;
use function Pest\Laravel\{postJson};

test('Deve adicionar um job a fila', function () {
    Queue::fake();

    postJson('/dispatch', []);

    Queue::assertPushed(SlowJob::class);
});

test('Deve adicionar o BadJob a fila se solicitado', function () {
    Queue::fake();

    postJson('/dispatch', [
        'dispatchBadJob' => true,
    ]);

    Queue::assertPushed(BadJob::class);
});
