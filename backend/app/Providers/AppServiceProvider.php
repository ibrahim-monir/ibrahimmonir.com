<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
        }

        ResetPassword::createUrlUsing(function ($notifiable, $token) {
            return config('app.frontend_url') . '/reset-password?token=' . $token . '&email=' . urlencode($notifiable->email);
        });
    }
}
