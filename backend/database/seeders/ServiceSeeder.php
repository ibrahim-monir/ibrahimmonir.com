<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Seed the services list, matched by slug. An existing row (e.g. one
     * already created by hand in the admin) is never overwritten — only its
     * blank fields are filled in. Missing rows are created fresh. This way
     * re-running the seeder (every deploy) is always safe.
     */
    public function run(): void
    {
        $services = [
            [
                'title' => 'WordPress Development',
                'slug' => 'wordpress-development',
                'short_desc' => 'End-to-end WordPress solutions — from custom themes and plugins to full business websites.',
                'description' => "<p>I build WordPress sites that are fast, secure, and genuinely easy for you to manage after launch — not just a theme with your logo dropped in. That covers custom theme builds from scratch, hand-coded or page-builder-driven (Elementor, Bricks, Divi), and any plugin work your project needs, from small tweaks to fully custom functionality.</p><p>Every build gets the same attention to performance and on-page SEO groundwork, so the site is ready to rank and load quickly from day one. If your project involves selling online, WooCommerce setup and customisation is handled as part of the same engagement.</p>",
                'color' => '#21759B',
                'price' => 400,
                'is_popular' => true,
                'features' => [
                    'Custom theme development from scratch',
                    'Plugin development & modification',
                    'Page builder setup (Elementor, Bricks, Divi…)',
                    'Performance & SEO optimisation',
                    'WooCommerce store setup & customisation',
                ],
            ],
            [
                'title' => 'E-Commerce Solutions',
                'slug' => 'ecommerce-solutions',
                'short_desc' => 'Powerful online stores with WooCommerce or custom-built cart systems that convert visitors into buyers.',
                'description' => "<p>I set up and customise online stores that are built to sell, not just to look good. Most projects run on WooCommerce — configured, themed, and extended around how you actually take orders — but for stores with unusual requirements I also build fully custom cart and checkout flows from the ground up.</p><p>That includes wiring up Stripe, PayPal, or local payment gateways, setting up inventory and subscription management, and tuning the store to stay fast under real traffic and order volume, so checkout abandonment stays low.</p>",
                'color' => '#7F54B3',
                'price' => 600,
                'is_popular' => false,
                'features' => [
                    'WooCommerce setup & advanced customisation',
                    'Custom cart, checkout & order flows',
                    'Stripe, PayPal & local payment gateways',
                    'Inventory & subscription management',
                    'Performance tuning for high traffic',
                ],
            ],
            [
                'title' => 'Laravel Development',
                'slug' => 'laravel-development',
                'short_desc' => "Robust server-side applications, admin panels, and APIs built with Laravel's powerful ecosystem.",
                'description' => "<p>For projects that outgrow WordPress, I build custom backend applications on Laravel — admin dashboards, internal tools, and full web apps built around your actual workflow instead of a generic template. Filament powers most of the admin panels I ship, giving you a clean, fast interface without a custom frontend build for every screen.</p><p>Depending on the project this covers multi-tenancy and role-based access control, background queue jobs and event-driven notifications, and authentication via Laravel Sanctum or Passport for anything that needs an API or mobile client attached.</p>",
                'color' => '#FF2D20',
                'price' => 500,
                'is_popular' => false,
                'features' => [
                    'Custom web applications & dashboards',
                    'Filament admin panel development',
                    'Multi-tenancy & role-based access',
                    'Queue jobs, events & notifications',
                    'Laravel Sanctum / Passport auth',
                ],
            ],
            [
                'title' => 'Next.js / React Apps',
                'slug' => 'nextjs-react-apps',
                'short_desc' => 'Modern, high-performance frontend applications with server-side rendering and excellent SEO.',
                'description' => "<p>When a project needs a fully custom frontend — not a page builder — I build it with Next.js and the App Router: server components, server actions, and the SSR/SSG/ISR strategy that fits the page, so content stays fast and indexable.</p><p>The stack is TypeScript and Tailwind CSS throughout, with API routes or a full-stack setup wired in where the app needs its own backend. Core Web Vitals and SEO are treated as part of the build, not an afterthought bolted on at the end.</p>",
                'color' => '#111827',
                'price' => 500,
                'is_popular' => false,
                'features' => [
                    'App Router with RSC & server actions',
                    'SSR, SSG & ISR strategies',
                    'TypeScript & Tailwind CSS',
                    'API routes & full-stack setups',
                    'Core Web Vitals & SEO optimisation',
                ],
            ],
            [
                'title' => 'SaaS Platforms',
                'slug' => 'saas-platforms',
                'short_desc' => 'Scalable multi-tenant SaaS products with billing, subscriptions, and beautiful user dashboards.',
                'description' => "<p>I build multi-tenant SaaS products from the ground up — team/organisation isolation, subscription billing through Stripe, and role and permission management baked into the architecture rather than added on later.</p><p>Beyond the core product, this includes the analytics dashboards and reporting your users expect, plus onboarding flows and transactional email automation so new signups reach an activated account without manual handling on your end.</p>",
                'color' => '#f97316',
                'price' => 2000,
                'is_popular' => false,
                'features' => [
                    'Multi-tenant architecture (team / org isolation)',
                    'Stripe subscription billing & plans',
                    'Role & permission management',
                    'Analytics dashboards & reporting',
                    'Onboarding flows & email automation',
                ],
            ],
            [
                'title' => 'API Development',
                'slug' => 'api-development',
                'short_desc' => 'Clean, well-documented RESTful APIs and third-party integrations that connect your systems.',
                'description' => "<p>I design and build RESTful APIs that other developers actually enjoy integrating with — consistent resource naming, sensible status codes, and documentation that stays in sync with the code, usually via Postman collections or OpenAPI/Swagger.</p><p>This also covers third-party API integrations for systems you already rely on, webhook systems and event broadcasting for real-time updates, and the operational side — rate limiting, caching, and authentication — so the API holds up under real usage.</p>",
                'color' => '#06B6D4',
                'price' => 300,
                'is_popular' => false,
                'features' => [
                    'RESTful API design & development',
                    'Third-party API integrations',
                    'Webhook systems & event broadcasting',
                    'API documentation (Postman / Swagger)',
                    'Rate limiting, caching & security',
                ],
            ],
            [
                'title' => 'Plugins & Themes',
                'slug' => 'plugins-themes',
                'short_desc' => 'Bespoke WordPress plugins and themes built to your exact specifications — clean, scalable code.',
                'description' => "<p>When an off-the-shelf plugin or theme doesn't quite fit, I build a custom one — a WordPress plugin written to your exact spec, or a premium, FSE-ready theme built around your design rather than adapted from someone else's.</p><p>For existing sites, this often means Elementor or Gutenberg widget add-ons, WooCommerce extensions for a specific store need, or a licensing and auto-update system if you plan to distribute the plugin yourself.</p>",
                'color' => '#10b981',
                'price' => 200,
                'is_popular' => false,
                'features' => [
                    'Custom WordPress plugin development',
                    'Premium theme development (FSE ready)',
                    'Elementor / Gutenberg widget addons',
                    'Plugin licensing & auto-update system',
                    'WooCommerce extension development',
                ],
            ],
            [
                'title' => 'Business Systems',
                'slug' => 'business-systems',
                'short_desc' => 'Custom ERP, CRM, and management systems that automate your workflows and boost productivity.',
                'description' => "<p>For businesses that have outgrown spreadsheets, I build ERP, CRM, and internal management systems around how your business actually operates — usually as a Filament-powered admin panel on top of a Laravel backend.</p><p>Typical scope includes inventory and order management, invoicing and financial reporting, staff accounts with role-based access control, and automating whatever manual workflow is currently costing your team the most time.</p>",
                'color' => '#f59e0b',
                'price' => 1500,
                'is_popular' => false,
                'features' => [
                    'ERP & CRM systems (Filament-powered)',
                    'Inventory & order management',
                    'Invoicing & financial reporting',
                    'Staff & role-based access control',
                    'Custom workflows & automation',
                ],
            ],
        ];

        foreach ($services as $i => $s) {
            $existing = Service::where('slug', $s['slug'])->first();

            if (! $existing) {
                Service::create([
                    'title' => $s['title'],
                    'slug' => $s['slug'],
                    'short_desc' => $s['short_desc'],
                    'description' => $s['description'],
                    'color' => $s['color'],
                    'price' => $s['price'],
                    'features' => $s['features'],
                    'is_popular' => $s['is_popular'],
                    'is_active' => true,
                    'order' => $i,
                ]);
                continue;
            }

            // Only backfill fields the admin left blank — never touch a
            // value that was already set by hand. The RichEditor leaves an
            // empty "<p></p>" behind instead of null, so treat that as blank too.
            $fill = [];
            foreach (['short_desc', 'color', 'features', 'is_popular'] as $field) {
                if (blank($existing->$field)) {
                    $fill[$field] = $s[$field];
                }
            }
            if (blank($existing->description) || trim(strip_tags($existing->description)) === '') {
                $fill['description'] = $s['description'];
            }
            if (blank($existing->price)) {
                $fill['price'] = $s['price'];
            }
            if ($fill) {
                $existing->update($fill);
            }
        }
    }
}
