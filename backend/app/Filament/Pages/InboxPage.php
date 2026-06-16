<?php

namespace App\Filament\Pages;

use App\Models\Client;
use App\Models\DirectMessage;
use Filament\Pages\Page;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Livewire\Attributes\On;

class InboxPage extends Page
{
    protected static string|\BackedEnum|null  $navigationIcon  = 'heroicon-o-chat-bubble-left-right';
    protected static ?string                  $navigationLabel = 'Inbox';
    protected static ?string                  $title           = 'Client Inbox';
    protected static string|\UnitEnum|null    $navigationGroup = null;
    protected static ?int                     $navigationSort  = 2;
    protected string                          $view            = 'filament.pages.inbox';

    public ?int    $activeClientId  = null;
    public string  $replyBody       = '';
    public array   $conversations   = [];
    public array   $messages        = [];
    public array   $clientProjects  = [];

    public function mount(): void
    {
        $this->loadConversations();
    }

    public function loadConversations(): void
    {
        $this->conversations = Client::with(['user', 'directMessages' => function ($q) {
            $q->latest()->limit(1);
        }])
        ->whereHas('directMessages')
        ->get()
        ->map(function (Client $c) {
            $last   = $c->directMessages->first();
            $unread = DirectMessage::where('client_id', $c->id)
                ->where('user_id', '!=', Auth::id())
                ->where('is_read', false)
                ->count();
            return [
                'id'         => $c->id,
                'name'       => $c->user->name ?? 'Unknown',
                'email'      => $c->user->email ?? '',
                'avatar_url' => $c->avatar ? Storage::disk('public')->url($c->avatar) : null,
                'last_msg'   => $last?->body ?? '(attachment)',
                'last_time'  => $last?->created_at?->diffForHumans() ?? '',
                'unread'     => $unread,
            ];
        })
        ->sortByDesc('unread')
        ->values()
        ->toArray();
    }

    public function selectClient(int $clientId): void
    {
        $this->activeClientId = $clientId;
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
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($p) => [
                'id'       => $p->id,
                'title'    => $p->title,
                'status'   => $p->status,
                'progress' => $p->progress ?? 0,
                'url'      => '/admin/projects/' . $p->id . '/edit',
            ])
            ->toArray();
    }

    public function loadMessages(): void
    {
        if (! $this->activeClientId) return;

        $this->messages = DirectMessage::with('user')
            ->where('client_id', $this->activeClientId)
            ->oldest()
            ->get()
            ->map(fn ($m) => [
                'id'              => $m->id,
                'body'            => $m->body,
                'attachment_url'  => $m->attachment_path ? Storage::disk('public')->url($m->attachment_path) : null,
                'attachment_name' => $m->attachment_name,
                'attachment_mime' => $m->attachment_mime,
                'is_own'          => $m->user_id === Auth::id(),
                'sender'          => $m->user->name ?? 'Unknown',
                'time'            => $m->created_at->format('d M, H:i'),
            ])
            ->toArray();
    }

    public function sendReply(): void
    {
        if (! $this->activeClientId || ! trim($this->replyBody)) return;

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

    public function refreshMessages(): void
    {
        $this->loadMessages();
        $this->loadConversations();
        $this->loadClientProjects();
    }

    public static function getNavigationBadge(): ?string
    {
        $count = DirectMessage::where('is_read', false)
            ->where('user_id', '!=', Auth::id())
            ->count();
        return $count > 0 ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'danger';
    }
}
