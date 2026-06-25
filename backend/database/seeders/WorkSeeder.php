<?php

namespace Database\Seeders;

use App\Models\Work;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class WorkSeeder extends Seeder
{
    /**
     * Seed a set of demo projects — only once. After the first run the admin
     * fully owns this data (edits and deletes are preserved on later deploys).
     */
    public function run(): void
    {
        if (Work::query()->exists()) {
            return;
        }

        $projects = [
            [
                'title'        => 'Multi-vendor E-commerce Platform',
                'category'     => 'E-Commerce',
                'technologies' => ['Laravel', 'React', 'MySQL', 'Redis'],
                'description'  => 'A full-featured marketplace with vendor onboarding, Stripe payments, real-time inventory and an analytics dashboard.',
                'is_featured'  => true,
            ],
            [
                'title'        => 'SaaS Project Management Tool',
                'category'     => 'SaaS',
                'technologies' => ['Laravel', 'Next.js', 'PostgreSQL', 'Tailwind CSS'],
                'description'  => 'Team collaboration platform with kanban boards, time tracking, automated client invoicing and role-based access.',
                'is_featured'  => true,
            ],
            [
                'title'        => 'Healthcare Appointment System',
                'category'     => 'Laravel',
                'technologies' => ['Laravel', 'Vue.js', 'MySQL'],
                'description'  => 'Patient scheduling, doctor availability management and automated SMS / email reminders for clinics.',
                'is_featured'  => true,
            ],
            [
                'title'        => 'Real Estate Listing Portal',
                'category'     => 'Next.js',
                'technologies' => ['Next.js', 'Laravel API', 'MySQL', 'TypeScript'],
                'description'  => 'Property listings with advanced filtering, map search, virtual tours and an agent management back office.',
                'is_featured'  => false,
            ],
            [
                'title'        => 'Restaurant POS & Ordering',
                'category'     => 'Web App',
                'technologies' => ['Laravel', 'React', 'MySQL'],
                'description'  => 'Complete point-of-sale with table management, kitchen display screens and live inventory tracking.',
                'is_featured'  => false,
            ],
            [
                'title'        => 'Learning Management System',
                'category'     => 'SaaS',
                'technologies' => ['Laravel', 'Next.js', 'PostgreSQL'],
                'description'  => 'Course authoring platform with video hosting, quizzes, progress tracking and certificate generation.',
                'is_featured'  => false,
            ],
            [
                'title'        => 'Corporate WordPress Website',
                'category'     => 'WordPress',
                'technologies' => ['WordPress', 'PHP', 'Tailwind CSS'],
                'description'  => 'A fast, SEO-optimised corporate site with a custom theme, ACF-driven content and a multilingual setup.',
                'is_featured'  => false,
            ],
            [
                'title'        => 'Delivery Tracking API',
                'category'     => 'API',
                'technologies' => ['Laravel', 'MySQL', 'Redis'],
                'description'  => 'A robust REST API powering live courier tracking, webhooks and rate-limited partner integrations.',
                'is_featured'  => false,
            ],
        ];

        foreach ($projects as $i => $p) {
            $slug = Str::slug($p['title']);

            Work::create([
                'title'        => $p['title'],
                'slug'         => $slug,
                'category'     => $p['category'],
                'description'  => $p['description'],
                'technologies' => $p['technologies'],
                'thumbnail'    => "https://picsum.photos/seed/{$slug}/900/560",
                'images'       => null,
                'url'          => null,
                'is_featured'  => $p['is_featured'],
                'is_active'    => true,
                'order'        => $i,
            ]);
        }
    }
}
