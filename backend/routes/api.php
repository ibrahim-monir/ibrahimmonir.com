<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PresenceController;
use App\Http\Controllers\Api\VisitorChatController;
use App\Http\Controllers\Api\DirectMessageController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\FileController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\PricingController;
use App\Http\Controllers\Api\WorkController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/register',        [AuthController::class, 'register']);
Route::post('/auth/login',           [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password',  [AuthController::class, 'resetPassword']);

Route::get('/services',         [ServiceController::class, 'index']);
Route::get('/services/{slug}',  [ServiceController::class, 'show']);

Route::get('/products',         [ProductController::class, 'index']);
Route::get('/products/{slug}',  [ProductController::class, 'show']);

Route::get('/works',            [WorkController::class, 'index']);
Route::get('/pricing',          [PricingController::class, 'index']);

Route::get('/blog',             [BlogController::class, 'index']);
Route::get('/blog/{slug}',      [BlogController::class, 'show']);

Route::post('/contact',         [ContactController::class, 'store']);

Route::get('/settings',         [SettingsController::class, 'index']);
Route::get('/experiences',      [ExperienceController::class, 'index']);
Route::get('/testimonials',     [TestimonialController::class, 'index']);

// Public visitor chat (token-based, no auth)
Route::post('/visitor/init',     [VisitorChatController::class, 'init']);
Route::get('/visitor/messages',  [VisitorChatController::class, 'messages']);
Route::post('/visitor/messages', [VisitorChatController::class, 'send']);
Route::get('/visitor/unread',    [VisitorChatController::class, 'unread']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);
    Route::post('/presence',    [PresenceController::class, 'ping']);
    Route::post('/visitor/reply/{sessionId}', [VisitorChatController::class, 'adminReply']);

    Route::get('/dm',                         [DirectMessageController::class, 'index']);
    Route::post('/dm',                        [DirectMessageController::class, 'store']);
    Route::get('/dm/unread',                  [DirectMessageController::class, 'unread']);
    Route::get('/dm/{clientId}',              [DirectMessageController::class, 'index']);
    Route::post('/dm/{clientId}',             [DirectMessageController::class, 'store']);

    Route::get('/profile',              [ProfileController::class, 'show']);
    Route::put('/profile',              [ProfileController::class, 'updateInfo']);
    Route::post('/profile/avatar',      [ProfileController::class, 'updateAvatar']);
    Route::put('/profile/password',     [ProfileController::class, 'updatePassword']);

    Route::get('/projects',          [ProjectController::class, 'index']);
    Route::get('/projects/{id}',     [ProjectController::class, 'show']);

    Route::get('/projects/{projectId}/messages',  [MessageController::class, 'index']);
    Route::post('/projects/{projectId}/messages', [MessageController::class, 'store']);

    Route::get('/projects/{projectId}/files',     [FileController::class, 'index']);
    Route::get('/files/{fileId}/download',        [FileController::class, 'download']);

    Route::get('/invoices',      [InvoiceController::class, 'index']);
    Route::get('/invoices/{id}', [InvoiceController::class, 'show']);
});
