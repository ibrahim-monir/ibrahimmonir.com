<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PresenceController extends Controller
{
    public function ping(Request $request)
    {
        $user = $request->user();
        $tabActive = filter_var($request->input('tab_active', true), FILTER_VALIDATE_BOOLEAN);

        $user->last_seen_at = now();
        if ($tabActive) {
            $user->last_active_at = now();
        }
        $user->timestamps = false;
        $user->saveQuietly();

        return response()->json(['ok' => true]);
    }
}
