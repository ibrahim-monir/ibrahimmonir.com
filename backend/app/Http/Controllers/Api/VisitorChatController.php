<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VisitorMessage;
use App\Models\VisitorSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class VisitorChatController extends Controller
{
    private function session(string $token): VisitorSession
    {
        $session = VisitorSession::firstOrCreate(
            ['token' => $token],
            [
                'name'         => 'Visitor #' . strtoupper(Str::random(5)),
                'ip'           => request()->ip(),
                'last_seen_at' => now(),
            ]
        );

        $session->last_seen_at = now();
        $session->saveQuietly();

        return $session;
    }

    public function init(Request $request)
    {
        $request->validate(['token' => 'required|string|max:64']);
        $session = $this->session($request->input('token'));

        return response()->json([
            'name'  => $session->name,
            'token' => $session->token,
        ]);
    }

    public function messages(Request $request)
    {
        $request->validate(['token' => 'required|string|max:64']);
        $session = $this->session($request->input('token'));

        // Mark admin messages as read
        $session->messages()->where('sender', 'admin')->where('is_read', false)->update(['is_read' => true]);

        $msgs = $session->messages()->oldest()->get()->map(fn ($m) => $this->format($m));

        return response()->json(['messages' => $msgs]);
    }

    public function send(Request $request)
    {
        $request->validate([
            'token'      => 'required|string|max:64',
            'body'       => 'nullable|string|max:2000',
            'attachment' => 'nullable|file|max:10240',
        ]);

        if (! $request->filled('body') && ! $request->hasFile('attachment')) {
            return response()->json(['message' => 'Message or attachment required.'], 422);
        }

        $session = $this->session($request->input('token'));

        $attachmentPath = $attachmentName = $attachmentMime = null;
        if ($request->hasFile('attachment')) {
            $file           = $request->file('attachment');
            $attachmentPath = $file->store('visitor-attachments', 'public');
            $attachmentName = $file->getClientOriginalName();
            $attachmentMime = $file->getMimeType();
        }

        $msg = VisitorMessage::create([
            'session_id'      => $session->id,
            'body'            => $request->input('body'),
            'sender'          => 'visitor',
            'is_read'         => false,
            'attachment_path' => $attachmentPath,
            'attachment_name' => $attachmentName,
            'attachment_mime' => $attachmentMime,
        ]);

        return response()->json(['message' => $this->format($msg)], 201);
    }

    public function unread(Request $request)
    {
        $request->validate(['token' => 'required|string|max:64']);
        $session = VisitorSession::where('token', $request->input('token'))->first();
        if (! $session) return response()->json(['count' => 0]);

        $count = $session->messages()->where('sender', 'admin')->where('is_read', false)->count();
        return response()->json(['count' => $count]);
    }

    public function adminReply(Request $request, int $sessionId)
    {
        $request->validate(['body' => 'required|string|max:2000']);
        $session = VisitorSession::findOrFail($sessionId);

        $msg = VisitorMessage::create([
            'session_id' => $session->id,
            'body'       => trim($request->input('body')),
            'sender'     => 'admin',
            'is_read'    => false,
        ]);

        return response()->json(['message' => $this->format($msg)], 201);
    }

    private function format(VisitorMessage $m): array
    {
        return [
            'id'              => $m->id,
            'body'            => $m->body,
            'sender'          => $m->sender,
            'is_read'         => $m->is_read,
            'attachment_url'  => $m->attachment_path ? Storage::disk('public')->url($m->attachment_path) : null,
            'attachment_name' => $m->attachment_name,
            'attachment_mime' => $m->attachment_mime,
            'created_at'      => $m->created_at,
        ];
    }
}
