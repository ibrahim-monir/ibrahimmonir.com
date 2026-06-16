<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Project;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    private function resolveProject(Request $request, string $projectId): Project
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return Project::findOrFail($projectId);
        }

        return Project::where('client_id', $user->client?->id)->findOrFail($projectId);
    }

    public function index(Request $request, string $projectId)
    {
        $project = $this->resolveProject($request, $projectId);

        $messages = Message::with('user')
            ->where('project_id', $project->id)
            ->oldest()
            ->get();

        Message::where('project_id', $project->id)
            ->where('user_id', '!=', $request->user()->id)
            ->update(['is_read' => true]);

        return response()->json(['messages' => $messages]);
    }

    public function store(Request $request, string $projectId)
    {
        $project = $this->resolveProject($request, $projectId);

        $data = $request->validate(['body' => 'required|string|max:2000']);

        $message = Message::create([
            'project_id' => $project->id,
            'user_id'    => $request->user()->id,
            'body'       => $data['body'],
        ]);

        return response()->json(['message' => $message->load('user')], 201);
    }
}
