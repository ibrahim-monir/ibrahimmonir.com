<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;

class TestimonialController extends Controller
{
    public function index(): JsonResponse
    {
        $testimonials = Testimonial::active()->get()->map(fn ($t) => [
            'id'           => $t->id,
            'name'         => $t->name,
            'job_title'    => $t->job_title,
            'company'      => $t->company,
            'country'      => $t->country,
            'rating'       => $t->rating,
            'review_text'  => $t->review_text,
            'avatar_color' => $t->avatar_color,
            'initials'     => $t->initials,
            'is_linkedin'  => $t->is_linkedin,
            'linkedin_url' => $t->linkedin_url,
        ]);

        return response()->json($testimonials);
    }
}
