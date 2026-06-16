<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $client = $request->user()->client;

        if (! $client) {
            return response()->json(['projects' => []]);
        }

        $projects = Project::with(['service', 'files'])
            ->where('client_id', $client->id)
            ->latest()
            ->get();

        return response()->json(['projects' => $projects]);
    }

    public function show(Request $request, string $id)
    {
        $client = $request->user()->client;

        $project = Project::with(['service', 'files', 'messages.user', 'invoices'])
            ->where('client_id', $client?->id)
            ->findOrFail($id);

        return response()->json(['project' => $project]);
    }
}
