<?php

namespace App\Filament\Widgets;

use App\Models\BlogPost;
use App\Models\Client;
use App\Models\Contact;
use App\Models\Invoice;
use App\Models\Project;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsWidget extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        $totalRevenue = Invoice::where('status', 'paid')->sum('amount');
        $pendingInvoices = Invoice::where('status', 'pending')->count();
        $activeProjects = Project::where('status', 'in_progress')->count();

        return [
            Stat::make('Total Clients', Client::count())
                ->description('All registered clients')
                ->descriptionIcon(Heroicon::OutlinedArrowTrendingUp)
                ->descriptionColor('success')
                ->icon(Heroicon::OutlinedUsers)
                ->color('primary')
                ->chart([3, 5, 4, 7, 6, 8, Client::count()]),

            Stat::make('Active Projects', $activeProjects)
                ->description(Project::count() . ' total projects')
                ->descriptionIcon(Heroicon::OutlinedBriefcase)
                ->icon(Heroicon::OutlinedRectangleStack)
                ->color('warning')
                ->chart([1, 3, 2, 5, 4, 6, $activeProjects]),

            Stat::make('Publications', BlogPost::count())
                ->description(BlogPost::where('status', 'published')->count() . ' published')
                ->descriptionIcon(Heroicon::OutlinedDocumentText)
                ->descriptionColor('success')
                ->icon(Heroicon::OutlinedDocumentText)
                ->color('info')
                ->chart([0, 1, 1, 2, 3, 4, BlogPost::count()]),

            Stat::make('New Contacts', Contact::whereMonth('created_at', now()->month)->count())
                ->description('This month')
                ->descriptionIcon(Heroicon::OutlinedEnvelope)
                ->icon(Heroicon::OutlinedInbox)
                ->color('success')
                ->chart([1, 2, 1, 3, 2, 4, Contact::whereMonth('created_at', now()->month)->count()]),

            Stat::make('Revenue', '$' . number_format($totalRevenue, 0))
                ->description('From paid invoices')
                ->descriptionIcon(Heroicon::OutlinedCurrencyDollar)
                ->descriptionColor('success')
                ->icon(Heroicon::OutlinedBanknotes)
                ->color('success')
                ->chart([500, 800, 600, 1200, 900, 1500, (int)$totalRevenue]),

            Stat::make('Pending Invoices', $pendingInvoices)
                ->description('Awaiting payment')
                ->descriptionIcon(Heroicon::OutlinedClock)
                ->descriptionColor('warning')
                ->icon(Heroicon::OutlinedDocumentDuplicate)
                ->color('warning')
                ->chart([2, 1, 3, 2, 4, 3, $pendingInvoices]),
        ];
    }
}
