<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pricing;

class PricingController extends Controller
{
    public function index()
    {
        $plans = Pricing::where('is_active', true)
            ->orderBy('order')
            ->get(['id', 'title', 'description', 'price', 'bdt_price', 'billing_cycle', 'features', 'is_popular']);

        return response()->json($plans);
    }
}
