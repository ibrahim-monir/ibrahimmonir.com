<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;

class SettingsController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = SiteSetting::getAll();

        // Resolve storage URLs for file fields
        $fileKeys = ['site_logo', 'site_favicon', 'hero_photo', 'seo_og_image', 'hero_resume'];
        foreach ($fileKeys as $key) {
            if (!empty($settings[$key])) {
                $settings[$key . '_url'] = asset('storage/' . $settings[$key]);
            }
        }

        // Decode JSON array fields
        $jsonArrayKeys = ['hero_typewriter_roles'];
        foreach ($jsonArrayKeys as $key) {
            if (!empty($settings[$key]) && is_string($settings[$key])) {
                $decoded = json_decode($settings[$key], true);
                if (is_array($decoded)) {
                    $settings[$key] = $decoded;
                }
            }
        }

        return response()->json($settings);
    }
}
