<?php

namespace App\Filament\Pages;

use App\Models\Client;
use App\Models\DirectMessage;
use App\Models\VisitorMessage;
use App\Models\VisitorSession;
use Carbon\Carbon;
use Filament\Pages\Page;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
class InboxPage extends Page
{
    protected static string|\BackedEnum|null $navigationIcon  = 'heroicon-o-chat-bubble-left-right';
    protected static ?string                 $navigationLabel = 'Inbox';
    protected static ?string                 $title           = 'Client Inbox';
    protected static string|\UnitEnum|null   $navigationGroup = null;
    protected static ?int                    $navigationSort  = 2;
    protected static ?string                 $slug            = 'inbox';
    protected string                         $view            = 'filament.pages.inbox';

    public string  $activeTab       = 'clients';   // clients | visitors
    public ?int    $activeClientId  = null;
    public ?int    $activeVisitorId = null;
    public string  $replyBody       = '';
    public array   $conversations   = [];
    public array   $visitors        = [];
    public array   $messages        = [];
    public array   $clientProjects  = [];

    public function mount(): void
    {
        $this->loadConversations();
        $this->loadVisitors();
    }

    // ── Clients ──────────────────────────────────────────────
    public function loadConversations(): void
    {
        $this->conversations = Client::with(['user', 'directMessages' => fn ($q) => $q->latest()->limit(1)])
            ->whereHas('directMessages')
            ->get()
            ->map(function (Client $c) {
                $last       = $c->directMessages->first();
                $unread     = DirectMessage::where('client_id', $c->id)
                    ->where('user_id', '!=', Auth::id())
                    ->where('is_read', false)->count();
                $lastActive = $c->user?->last_active_at;
                $lastSeen   = $c->user?->last_seen_at;

                $status = 'offline';
                if ($lastActive && Carbon::parse($lastActive)->gt(now()->subSeconds(20))) $status = 'online';
                elseif ($lastSeen && Carbon::parse($lastSeen)->gt(now()->subMinutes(5)))  $status = 'away';

                return [
                    'id'         => $c->id,
                    'name'       => $c->user->name ?? 'Unknown',
                    'email'      => $c->user->email ?? '',
                    'avatar_url' => $c->avatar ? Storage::disk('public')->url($c->avatar) : null,
                    'status'     => $status,
                    'last_seen'  => $lastSeen ? Carbon::parse($lastSeen)->diffForHumans() : 'Never',
                    'last_msg'   => $last?->body ?? '(attachment)',
                    'last_time'  => $last?->created_at?->diffForHumans() ?? '',
                    'unread'     => $unread,
                ];
            })
            ->sortByDesc('unread')->values()->toArray();
    }

    public function selectClient(int $clientId): void
    {
        $this->activeTab       = 'clients';
        $this->activeClientId  = $clientId;
        $this->activeVisitorId = null;
        $this->loadMessages();
        $this->loadClientProjects();

        DirectMessage::where('client_id', $clientId)
            ->where('user_id', '!=', Auth::id())
            ->update(['is_read' => true]);

        $this->loadConversations();
    }

    public function loadClientProjects(): void
    {
        if (! $this->activeClientId) { $this->clientProjects = []; return; }
        $this->clientProjects = \App\Models\Project::where('client_id', $this->activeClientId)
            ->orderByDesc('created_at')->get()
            ->map(fn ($p) => [
                'id'       => $p->id, 'title' => $p->title,
                'status'   => $p->status, 'progress' => $p->progress ?? 0,
                'url'      => '/admin/projects/' . $p->id . '/edit',
            ])->toArray();
    }

    public function loadMessages(): void
    {
        if (! $this->activeClientId) return;
        $this->messages = DirectMessage::with('user')
            ->where('client_id', $this->activeClientId)->oldest()->get()
            ->map(fn ($m) => [
                'id'              => $m->id,
                'body'            => $m->body,
                'attachment_url'  => $m->attachment_path ? Storage::disk('public')->url($m->attachment_path) : null,
                'attachment_name' => $m->attachment_name,
                'attachment_mime' => $m->attachment_mime,
                'is_own'          => $m->user_id === Auth::id(),
                'sender'          => $m->user->name ?? 'Unknown',
                'time'            => $m->created_at->format('d M, H:i'),
            ])->toArray();
    }

    public function sendReply(): void
    {
        if (! trim($this->replyBody)) return;

        if ($this->activeTab === 'visitors' && $this->activeVisitorId) {
            VisitorMessage::create([
                'session_id' => $this->activeVisitorId,
                'body'       => trim($this->replyBody),
                'sender'     => 'admin',
                'is_read'    => false,
            ]);
            $this->replyBody = '';
            $this->loadVisitorMessages();
            $this->loadVisitors();
            return;
        }

        if ($this->activeClientId) {
            DirectMessage::create([
                'user_id'   => Auth::id(),
                'client_id' => $this->activeClientId,
                'body'      => trim($this->replyBody),
                'is_read'   => false,
            ]);
            $this->replyBody = '';
            $this->loadMessages();
            $this->loadConversations();
        }
    }

    public function refreshMessages(): void
    {
        $this->loadConversations();
        $this->loadVisitors();
        if ($this->activeTab === 'clients') {
            $this->loadMessages();
            $this->loadClientProjects();
        } else {
            $this->loadVisitorMessages();
        }
    }

    public function autoRefresh(): void
    {
        $this->loadConversations();
        $this->loadVisitors();
        if ($this->activeClientId) $this->loadMessages();
        if ($this->activeVisitorId) $this->loadVisitorMessages();
    }

    // ── Visitors ─────────────────────────────────────────────
    public function loadVisitors(): void
    {
        $this->visitors = VisitorSession::with(['messages' => fn ($q) => $q->latest()->limit(1)])
            ->whereHas('messages')
            ->orderByDesc('last_seen_at')
            ->get()
            ->map(function (VisitorSession $v) {
                $last   = $v->messages->first();
                $unread = $v->messages()->where('sender', 'visitor')->where('is_read', false)->count();
                $isOnline = $v->last_seen_at && Carbon::parse($v->last_seen_at)->gt(now()->subMinutes(5));

                return [
                    'id'        => $v->id,
                    'name'      => $v->name,
                    'ip'        => $v->ip,
                    'last_msg'  => $last?->body ?? '(attachment)',
                    'last_time' => $last?->created_at?->diffForHumans() ?? '',
                    'unread'    => $unread,
                    'status'    => $isOnline ? 'online' : 'offline',
                ];
            })->toArray();
    }

    public function selectVisitor(int $visitorId): void
    {
        $this->activeTab       = 'visitors';
        $this->activeVisitorId = $visitorId;
        $this->activeClientId  = null;
        $this->clientProjects  = [];
        $this->loadVisitorMessages();

        VisitorMessage::where('session_id', $visitorId)
            ->where('sender', 'visitor')->update(['is_read' => true]);

        $this->loadVisitors();
    }

    public function loadVisitorMessages(): void
    {
        if (! $this->activeVisitorId) return;
        $this->messages = VisitorMessage::where('session_id', $this->activeVisitorId)
            ->oldest()->get()
            ->map(fn ($m) => [
                'id'              => $m->id,
                'body'            => $m->body,
                'attachment_url'  => $m->attachment_path ? Storage::disk('public')->url($m->attachment_path) : null,
                'attachment_name' => $m->attachment_name,
                'attachment_mime' => $m->attachment_mime,
                'is_own'          => $m->sender === 'admin',
                'sender'          => $m->sender === 'admin' ? 'You' : ($this->activeVisitor()['name'] ?? 'Visitor'),
                'time'            => $m->created_at->format('d M, H:i'),
            ])->toArray();
    }

    private function activeVisitor(): ?array
    {
        return collect($this->visitors)->firstWhere('id', $this->activeVisitorId);
    }

    // ── Badge ─────────────────────────────────────────────────
    public static function getNavigationBadge(): ?string
    {
        $clients  = DirectMessage::where('is_read', false)->where('user_id', '!=', Auth::id())->count();
        $visitors = VisitorMessage::where('sender', 'visitor')->where('is_read', false)->count();
        $total    = $clients + $visitors;
        return $total > 0 ? (string) $total : null;
    }

    public static function getNavigationBadgeColor(): ?string { return 'danger'; }
}
