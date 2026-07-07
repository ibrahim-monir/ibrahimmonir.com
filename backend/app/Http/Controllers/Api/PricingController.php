<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Package;

class PackageController extends Controller
{
    public function index()
    {
        $packages = Package::where('is_active', true)
            ->orderBy('order')
            ->get(['id', 'title', 'description', 'price', 'bdt_price', 'billing_cycle', 'features', 'is_popular']);

        return response()->json($packages);
    }
}
