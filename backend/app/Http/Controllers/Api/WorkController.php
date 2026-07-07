<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Work;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class WorkController extends Controller
{
    public function index(): JsonResponse
    {
        $works = Work::where('is_active', true)
            ->orderByDesc('is_featured')
            ->orderBy('order')
            ->latest()
            ->get()
            ->map(fn (Work $w) => [
                'id'           => $w->id,
                'title'        => $w->title,
                'slug'         => $w->slug,
                'category'     => $w->category,
                'description'  => $w->description,
                'technologies' => $w->technologies ?? [],
                'url'          => $w->url,
                'is_featured'  => (bool) $w->is_featured,
                'thumbnail'    => $this->fileUrl($w->thumbnail),
                'images'       => collect($w->images ?? [])->map(fn (string $path) => $this->fileUrl($path))->values()->all(),
            ]);

        return response()->json($works);
    }

    private function fileUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        // Already an absolute URL (e.g. external image) — return as-is.
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }
}
