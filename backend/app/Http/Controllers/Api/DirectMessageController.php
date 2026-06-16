<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DirectMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DirectMessageController extends Controller
{
    private function clientId(Request $request): int
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            $clientId = $request->route('clientId') ?? $request->input('client_id');
            return (int) $clientId;
        }

        return $user->client->id;
    }

    public function index(Request $request)
    {
        $clientId = $this->clientId($request);

        $messages = DirectMessage::with('user')
            ->where('client_id', $clientId)
            ->oldest()
            ->get()
            ->map(fn ($m) => $this->format($m));

        DirectMessage::where('client_id', $clientId)
            ->where('user_id', '!=', $request->user()->id)
            ->update(['is_read' => true]);

        return response()->json(['messages' => $messages]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'body'       => 'nullable|string|max:2000',
            'attachment' => 'nullable|file|max:10240',
        ]);

        if (! $request->filled('body') && ! $request->hasFile('attachment')) {
            return response()->json(['message' => 'Message or attachment required.'], 422);
        }

        $clientId = $this->clientId($request);

        $attachmentPath = $attachmentName = $attachmentMime = null;
        if ($request->hasFile('attachment')) {
            $file           = $request->file('attachment');
            $attachmentPath = $file->store('chat-attachments', 'public');
            $attachmentName = $file->getClientOriginalName();
            $attachmentMime = $file->getMimeType();
        }

        $msg = DirectMessage::create([
            'user_id'         => $request->user()->id,
            'client_id'       => $clientId,
            'body'            => $request->input('body'),
            'attachment_path' => $attachmentPath,
            'attachment_name' => $attachmentName,
            'attachment_mime' => $attachmentMime,
            'is_read'         => false,
        ]);

        return response()->json(['message' => $this->format($msg->load('user'))], 201);
    }

    public function unread(Request $request)
    {
        $clientId = $request->user()->role === 'admin'
            ? null
            : $request->user()->client?->id;

        $query = DirectMessage::where('is_read', false)
            ->where('user_id', '!=', $request->user()->id);

        if ($clientId) {
            $query->where('client_id', $clientId);
        }

        return response()->json(['count' => $query->count()]);
    }

    private function format(DirectMessage $m): array
    {
        return [
            'id'              => $m->id,
            'body'            => $m->body,
            'attachment_url'  => $m->attachment_path ? Storage::disk('public')->url($m->attachment_path) : null,
            'attachment_name' => $m->attachment_name,
            'attachment_mime' => $m->attachment_mime,
            'is_read'         => $m->is_read,
            'created_at'      => $m->created_at,
            'user'            => ['id' => $m->user->id, 'name' => $m->user->name, 'role' => $m->user->role],
        ];
    }
}
