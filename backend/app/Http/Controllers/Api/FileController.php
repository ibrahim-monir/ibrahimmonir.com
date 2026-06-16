<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function index(Request $request, string $projectId)
    {
        $client = $request->user()->client;

        $project = Project::where('client_id', $client?->id)->findOrFail($projectId);

        return response()->json(['files' => $project->files]);
    }

    public function download(Request $request, string $fileId)
    {
        $file = ProjectFile::findOrFail($fileId);
        $client = $request->user()->client;

        $project = Project::where('client_id', $client?->id)->findOrFail($file->project_id);

        if (! Storage::exists($file->path)) {
            return response()->json(['message' => 'File not found.'], 404);
        }

        return Storage::download($file->path, $file->name);
    }
}
