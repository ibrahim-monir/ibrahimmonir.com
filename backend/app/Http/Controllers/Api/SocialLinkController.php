<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SocialLink;
use Illuminate\Http\JsonResponse;

class SocialLinkController extends Controller
{
    public function index(): JsonResponse
    {
        $links = SocialLink::where('is_active', true)
            ->orderBy('order')
            ->get(['platform', 'url']);

        return response()->json($links);
    }
}
