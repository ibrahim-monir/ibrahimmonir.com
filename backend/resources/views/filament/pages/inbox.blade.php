<x-filament-panels::page>
<style>
.inbox-wrap   { display:flex; gap:0; height:calc(100vh - 12rem); border-radius:12px; overflow:hidden; border:1px solid rgba(255,255,255,0.08); }
.conv-list    { width:290px; flex-shrink:0; display:flex; flex-direction:column; border-right:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.02); }
.conv-header  { padding:14px 16px; border-bottom:1px solid rgba(255,255,255,0.08); }
.conv-header p{ font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#6b7280; margin:0; }
.conv-scroll  { flex:1; overflow-y:auto; }
.conv-item    { width:100%; text-align:left; padding:10px 14px; border-bottom:1px solid rgba(255,255,255,0.04); cursor:pointer; transition:background .15s; background:transparent; border-left:3px solid transparent; display:flex; align-items:center; gap:10px; }
.conv-item:hover { background:rgba(255,255,255,0.04); }
.conv-item.active { background:rgba(245,158,11,0.08); border-left-color:#f59e0b; }
.conv-avatar  { width:38px; height:38px; border-radius:50%; flex-shrink:0; object-fit:cover; }
.conv-initials{ width:38px; height:38px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; color:#000; background:#f59e0b; }
.conv-body    { flex:1; min-width:0; }
.conv-top     { display:flex; align-items:center; justify-content:space-between; gap:6px; margin-bottom:2px; }
.conv-name    { font-size:13px; font-weight:600; color:#e5e7eb; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.conv-preview { font-size:12px; color:#6b7280; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.conv-time    { font-size:11px; color:#4b5563; white-space:nowrap; flex-shrink:0; }
.badge        { background:#ef4444; color:#fff; font-size:10px; font-weight:700; border-radius:999px; padding:1px 6px; flex-shrink:0; }
.chat-panel   { flex:1; display:flex; flex-direction:column; background:rgba(0,0,0,0.15); }
.chat-header  { padding:14px 20px; border-bottom:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.02); flex-shrink:0; display:flex; align-items:center; gap:14px; justify-content:space-between; }
.header-avatar{ width:44px; height:44px; border-radius:50%; flex-shrink:0; object-fit:cover; }
.header-initials{ width:44px; height:44px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:700; color:#000; background:#f59e0b; }
.chat-name    { font-size:14px; font-weight:600; color:#e5e7eb; margin-bottom:2px; }
.chat-email   { font-size:12px; color:#6b7280; }
.refresh-btn  { font-size:12px; color:#9ca3af; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:6px 12px; cursor:pointer; display:flex; align-items:center; gap:6px; transition:background .15s; }
.refresh-btn:hover { background:rgba(255,255,255,0.1); }
.header-right { display:flex; align-items:center; gap:8px; flex-shrink:0; }
.view-client-btn { font-size:12px; font-weight:600; color:#f59e0b; background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.25); border-radius:8px; padding:6px 12px; text-decoration:none; display:flex; align-items:center; gap:6px; transition:background .15s; }
.view-client-btn:hover { background:rgba(245,158,11,0.18); }
.proj-pills   { display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-top:4px; }
.proj-pill    { font-size:11px; font-weight:500; color:#d1d5db; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08); border-radius:6px; padding:3px 10px; text-decoration:none; display:inline-flex; align-items:center; gap:5px; white-space:nowrap; transition:background .15s; }
.proj-pill:hover { background:rgba(255,255,255,0.12); }
.proj-dot     { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.dot-active   { background:#22c55e; }
.dot-completed{ background:#3b82f6; }
.dot-paused   { background:#f59e0b; }
.dot-other    { background:#6b7280; }
.msg-area     { flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; gap:12px; }
.msg-row      { display:flex; align-items:flex-end; gap:8px; }
.msg-row.own  { justify-content:flex-end; }
.msg-row.other{ justify-content:flex-start; }
.msg-avatar   { width:28px; height:28px; border-radius:50%; object-fit:cover; flex-shrink:0; }
.msg-initials { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:#000; background:#f59e0b; flex-shrink:0; }
.msg-bubble-wrap { max-width:65%; display:flex; flex-direction:column; gap:3px; }
.msg-row.own  .msg-bubble-wrap { align-items:flex-end; }
.msg-row.other .msg-bubble-wrap { align-items:flex-start; }
.msg-sender   { font-size:11px; font-weight:600; color:#f59e0b; padding:0 4px; }
.msg-bubble   { padding:10px 14px; border-radius:16px; font-size:13px; line-height:1.5; word-break:break-word; }
.msg-bubble.own   { background:#f59e0b; color:#000; border-bottom-right-radius:4px; }
.msg-bubble.other { background:rgba(255,255,255,0.08); color:#e5e7eb; border-bottom-left-radius:4px; }
.msg-img      { max-width:200px; border-radius:12px; cursor:pointer; object-fit:cover; }
.msg-file     { display:flex; align-items:center; gap:8px; padding:10px 14px; border-radius:12px; font-size:12px; text-decoration:none; }
.msg-file.own   { background:#f59e0b; color:#000; }
.msg-file.other { background:rgba(255,255,255,0.08); color:#e5e7eb; }
.msg-time     { font-size:11px; color:#4b5563; padding:0 4px; }
.reply-area   { flex-shrink:0; padding:16px; border-top:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.02); }
.reply-row    { display:flex; gap:10px; align-items:flex-end; }
.reply-input  { flex:1; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:12px; color:#e5e7eb; font-size:13px; padding:10px 14px; resize:none; outline:none; transition:border-color .15s; font-family:inherit; }
.reply-input:focus { border-color:rgba(245,158,11,0.5); }
.reply-input::placeholder { color:#4b5563; }
.send-btn     { background:#f59e0b; color:#000; font-size:13px; font-weight:700; border-radius:12px; padding:10px 20px; border:none; cursor:pointer; display:flex; align-items:center; gap:6px; transition:opacity .15s; flex-shrink:0; }
.send-btn:hover { opacity:.9; }
.send-btn:disabled { opacity:.5; cursor:not-allowed; }
.empty-state  { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; color:#4b5563; }
.empty-state svg { width:48px; height:48px; opacity:.3; }
.empty-state p { font-size:13px; }
.empty-conv   { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 16px; color:#4b5563; gap:8px; }
.empty-conv svg { width:32px; height:32px; opacity:.3; }
.empty-conv p { font-size:12px; text-align:center; }
</style>

{{-- Reusable avatar macro --}}
@php
function convAvatar($conv, $size = 'conv') {
    $initial = strtoupper(substr($conv['name'] ?? '?', 0, 1));
    if (!empty($conv['avatar_url'])) {
        return '<img src="' . e($conv['avatar_url']) . '" class="' . $size . '-avatar" alt="' . e($conv['name']) . '" />';
    }
    return '<div class="' . $size . '-initials">' . $initial . '</div>';
}
@endphp

<div class="inbox-wrap">

    {{-- ── Conversation list ── --}}
    <div class="conv-list">
        <div class="conv-header">
            <p>Conversations ({{ count($conversations) }})</p>
        </div>
        <div class="conv-scroll">
            @forelse($conversations as $conv)
                @php $initial = strtoupper(substr($conv['name'], 0, 1)); @endphp
                <button
                    wire:click="selectClient({{ $conv['id'] }})"
                    class="conv-item {{ $activeClientId === $conv['id'] ? 'active' : '' }}">

                    {{-- Avatar --}}
                    @if(!empty($conv['avatar_url']))
                        <img src="{{ $conv['avatar_url'] }}" class="conv-avatar" alt="{{ $conv['name'] }}" />
                    @else
                        <div class="conv-initials">{{ $initial }}</div>
                    @endif

                    <div class="conv-body">
                        <div class="conv-top">
                            <span class="conv-name">{{ $conv['name'] }}</span>
                            <div style="display:flex;align-items:center;gap:4px;">
                                @if($conv['unread'] > 0)
                                    <span class="badge">{{ $conv['unread'] }}</span>
                                @endif
                                <span class="conv-time">{{ $conv['last_time'] }}</span>
                            </div>
                        </div>
                        <div class="conv-preview">{{ $conv['last_msg'] }}</div>
                    </div>
                </button>
            @empty
                <div class="empty-conv">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                    </svg>
                    <p>No client messages yet</p>
                </div>
            @endforelse
        </div>
    </div>

    {{-- ── Chat panel ── --}}
    <div class="chat-panel">
        @if($activeClientId)
            @php $active = collect($conversations)->firstWhere('id', $activeClientId); @endphp
            @php $activeInitial = strtoupper(substr($active['name'] ?? '?', 0, 1)); @endphp

            {{-- Header --}}
            <div class="chat-header">
                {{-- Avatar --}}
                @if(!empty($active['avatar_url']))
                    <img src="{{ $active['avatar_url'] }}" class="header-avatar" alt="{{ $active['name'] }}" />
                @else
                    <div class="header-initials">{{ $activeInitial }}</div>
                @endif

                <div style="flex:1;min-width:0;">
                    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                        <div class="chat-name">{{ $active['name'] ?? 'Client' }}</div>
                        <span style="font-size:12px;color:#4b5563;">·</span>
                        <div class="chat-email">{{ $active['email'] ?? '' }}</div>
                    </div>

                    @if(count($clientProjects) > 0)
                        <div class="proj-pills" style="margin-top:6px;">
                            <span style="font-size:11px;color:#4b5563;margin-right:2px;">Projects:</span>
                            @foreach($clientProjects as $proj)
                                @php
                                    $dotClass = match($proj['status']) {
                                        'active'    => 'dot-active',
                                        'completed' => 'dot-completed',
                                        'paused'    => 'dot-paused',
                                        default     => 'dot-other',
                                    };
                                @endphp
                                <a href="{{ $proj['url'] }}" target="_blank" class="proj-pill" title="{{ $proj['status'] }} · {{ $proj['progress'] }}%">
                                    <span class="proj-dot {{ $dotClass }}"></span>
                                    {{ Str::limit($proj['title'], 22) }}
                                    <span style="color:#6b7280;">{{ $proj['progress'] }}%</span>
                                </a>
                            @endforeach
                        </div>
                    @else
                        <div style="margin-top:4px;font-size:11px;color:#4b5563;">No projects yet</div>
                    @endif
                </div>

                <div class="header-right">
                    <a href="/admin/clients/{{ $activeClientId }}/edit" target="_blank" class="view-client-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        View Client
                    </a>
                    <button wire:click="refreshMessages" class="refresh-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" wire:loading.class="animate-spin">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            {{-- Messages --}}
            <div class="msg-area" id="msg-area">
                @forelse($messages as $msg)
                    <div class="msg-row {{ $msg['is_own'] ? 'own' : 'other' }}">

                        {{-- Client avatar beside their messages --}}
                        @if(! $msg['is_own'])
                            @if(!empty($active['avatar_url']))
                                <img src="{{ $active['avatar_url'] }}" class="msg-avatar" alt="{{ $active['name'] }}" />
                            @else
                                <div class="msg-initials">{{ $activeInitial }}</div>
                            @endif
                        @endif

                        <div class="msg-bubble-wrap">
                            @if(! $msg['is_own'])
                                <span class="msg-sender">{{ $msg['sender'] }}</span>
                            @endif

                            @if($msg['attachment_url'])
                                @if(str_starts_with($msg['attachment_mime'] ?? '', 'image/'))
                                    <a href="{{ $msg['attachment_url'] }}" target="_blank">
                                        <img src="{{ $msg['attachment_url'] }}" class="msg-img" alt="image" />
                                    </a>
                                @else
                                    <a href="{{ $msg['attachment_url'] }}" target="_blank"
                                        class="msg-file {{ $msg['is_own'] ? 'own' : 'other' }}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                                        </svg>
                                        {{ $msg['attachment_name'] }}
                                    </a>
                                @endif
                            @endif

                            @if($msg['body'])
                                <div class="msg-bubble {{ $msg['is_own'] ? 'own' : 'other' }}">
                                    {{ $msg['body'] }}
                                </div>
                            @endif

                            <span class="msg-time">{{ $msg['time'] }}</span>
                        </div>
                    </div>
                @empty
                    <div style="flex:1;display:flex;align-items:center;justify-content:center;color:#4b5563;font-size:13px;">
                        No messages yet — send the first reply!
                    </div>
                @endforelse
            </div>

            {{-- Reply --}}
            <div class="reply-area">
                <div class="reply-row">
                    <textarea
                        wire:model="replyBody"
                        wire:keydown.enter.prevent="sendReply"
                        placeholder="Type a reply… (Enter to send, Shift+Enter for new line)"
                        rows="2"
                        class="reply-input"
                        onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();}"
                    ></textarea>
                    <button wire:click="sendReply" class="send-btn" wire:loading.attr="disabled">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                        Send
                    </button>
                </div>
            </div>

        @else
            <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
                <p>Select a conversation from the left</p>
            </div>
        @endif
    </div>
</div>

<script>
    function scrollToBottom() {
        const el = document.getElementById('msg-area');
        if (el) el.scrollTop = el.scrollHeight;
    }
    document.addEventListener('livewire:updated', scrollToBottom);
    document.addEventListener('DOMContentLoaded', scrollToBottom);
</script>
</x-filament-panels::page>
