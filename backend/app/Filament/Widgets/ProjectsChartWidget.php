<?php

namespace App\Filament\Widgets;

use App\Models\Project;
use Filament\Widgets\ChartWidget;

class ProjectsChartWidget extends ChartWidget
{
    protected ?string $heading = 'Projects Overview';
    protected static ?int $sort = 3;
    protected int|string|array $columnSpan = 1;

    protected function getData(): array
    {
        $statuses = ['pending', 'in_progress', 'review', 'completed', 'cancelled'];
        $labels   = ['Pending', 'In Progress', 'Review', 'Completed', 'Cancelled'];
        $colors   = [
            'rgba(251, 191, 36, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(239, 68, 68, 0.8)',
        ];

        $counts = array_map(
            fn ($s) => Project::where('status', $s)->count(),
            $statuses
        );

        return [
            'datasets' => [
                [
                    'label'           => 'Projects',
                    'data'            => $counts,
                    'backgroundColor' => $colors,
                    'borderColor'     => $colors,
                    'borderWidth'     => 1,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
