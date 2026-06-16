<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Navigation\NavigationGroup;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\View\PanelsRenderHook;
use App\Filament\Widgets\ContactsChartWidget;
use App\Filament\Widgets\ProjectsChartWidget;
use App\Filament\Widgets\StatsWidget;
use Illuminate\Support\HtmlString;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->brandName('Ibrahim Monir')
            ->colors([
                'primary' => Color::Amber,
            ])
            ->navigationGroups([
                NavigationGroup::make('Client Management')
                    ->icon('heroicon-o-users'),
                NavigationGroup::make('Portfolio')
                    ->icon('heroicon-o-squares-2x2'),
                NavigationGroup::make('Publications')
                    ->icon('heroicon-o-document-text')
                    ->collapsed(),
                NavigationGroup::make('Settings')
                    ->icon('heroicon-o-cog-6-tooth')
                    ->collapsed(),
            ])
            ->sidebarCollapsibleOnDesktop()
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->widgets([
                StatsWidget::class,
                ContactsChartWidget::class,
                ProjectsChartWidget::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                PreventRequestForgery::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ])
            ->renderHook(
                PanelsRenderHook::SIDEBAR_FOOTER,
                fn (): HtmlString => new HtmlString('
                    <div style="padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 8px;">

                        <!-- Inbox / Chat shortcut -->
                        <a href="/admin/inbox"
                           style="
                               display: flex; align-items: center; gap: 8px;
                               padding: 9px 14px; border-radius: 8px; width: 100%;
                               font-size: 0.8rem; font-weight: 600; text-decoration: none;
                               color: #94a3b8;
                               background: rgba(255,255,255,0.04);
                               border: 1px solid rgba(255,255,255,0.08);
                               transition: all 0.2s;
                               box-sizing: border-box;
                           "
                           onmouseover="this.style.background=\'rgba(255,255,255,0.08)\';this.style.color=\'#f1f5f9\'"
                           onmouseout="this.style.background=\'rgba(255,255,255,0.04)\';this.style.color=\'#94a3b8\'">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                            Client Inbox
                        </a>

                        <!-- Visit Website -->
                        <a href="' . config('app.frontend_url', 'http://localhost:3000') . '"
                           target="_blank"
                           style="
                               display: flex; align-items: center; gap: 8px;
                               padding: 9px 14px; border-radius: 8px; width: 100%;
                               font-size: 0.8rem; font-weight: 600; text-decoration: none;
                               color: #f59e0b;
                               background: rgba(245,158,11,0.1);
                               border: 1px solid rgba(245,158,11,0.25);
                               transition: background 0.2s;
                               box-sizing: border-box;
                           "
                           onmouseover="this.style.background=\'rgba(245,158,11,0.2)\'"
                           onmouseout="this.style.background=\'rgba(245,158,11,0.1)\'">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15 3 21 3 21 9"/>
                                <line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                            Visit Website
                        </a>
                    </div>
                '),
            );
    }
}
