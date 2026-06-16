<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\JsonResponse;

class ExperienceController extends Controller
{
    public function index(): JsonResponse
    {
        $experiences = Experience::active()->get()->map(fn ($e) => [
            'id'          => $e->id,
            'role'        => $e->role,
            'company'     => $e->company,
            'year_label'  => $e->year_label,
            'year_start'  => $e->year_start,
            'year_end'    => $e->year_end,
            'description' => $e->description,
        ]);

        return response()->json($experiences);
    }
}
