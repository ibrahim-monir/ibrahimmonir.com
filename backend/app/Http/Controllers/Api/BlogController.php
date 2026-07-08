<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $posts = BlogPost::with('category')
            ->published()
            ->when($request->category, fn($q, $c) => $q->whereHas('category', fn($q) => $q->where('slug', $c)))
            ->latest('published_at')
            ->paginate(min((int) $request->input('per_page', 9), 50));

        return response()->json($posts);
    }

    public function show(string $slug)
    {
        $post = BlogPost::with('category')
            ->where('slug', $slug)
            ->published()
            ->firstOrFail();

        $post->increment('views');

        return response()->json(['post' => $post]);
    }
}
