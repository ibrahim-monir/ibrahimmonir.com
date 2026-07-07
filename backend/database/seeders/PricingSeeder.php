<?php

namespace Database\Seeders;

use App\Models\Pricing;
use Illuminate\Database\Seeder;

class PricingSeeder extends Seeder
{
    /**
     * Seed the pricing plans — only once. After the first run the admin
     * fully owns this data (edits and deletes are preserved on later deploys).
     *
     * USD prices are an estimated conversion from the BDT starting price
     * (~110 BDT/USD) plus a 20% international-payment premium — adjust in
     * the admin panel if the real rate differs.
     */
    public function run(): void
    {
        if (Pricing::query()->exists()) {
            return;
        }

        $plans = [
            [
                'title'         => 'Landing Page Design',
                'description'   => 'Single landing page, campaign or lead-generation site.',
                'price'         => 87,
                'bdt_price'     => 8000,
                'billing_cycle' => 'once',
                'features'      => [
                    'Modern UI/UX',
                    'Elementor Pro',
                    'Fully Responsive',
                    'Contact/Lead Form',
                    'Basic Animation',
                    'Speed Optimized',
                    'CTA Focused Design',
                ],
            ],
            [
                'title'         => 'Business Website',
                'description'   => 'Company, agency, portfolio or service website.',
                'price'         => 218,
                'bdt_price'     => 20000,
                'billing_cycle' => 'once',
                'features'      => [
                    'Up to 8 Pages',
                    'Premium Design',
                    'Mobile Responsive',
                    'Contact Forms',
                    'Blog Setup',
                    'Basic SEO',
                    'Speed Optimization',
                    'Security Setup',
                ],
            ],
            [
                'title'         => 'E-commerce Website',
                'description'   => 'WooCommerce online store.',
                'price'         => 436,
                'bdt_price'     => 40000,
                'billing_cycle' => 'once',
                'features'      => [
                    'WooCommerce Setup',
                    'Product Categories',
                    'Product Upload',
                    'Payment Gateway',
                    'Shipping Configuration',
                    'Cart & Checkout Setup',
                    'Mobile Friendly',
                    'Speed Optimization',
                    'Security Configuration',
                    'Training & Documentation',
                ],
            ],
            [
                'title'         => 'Website Redesign & Optimization',
                'description'   => 'Existing website redesign, speed and UI/UX improvements.',
                'price'         => 164,
                'bdt_price'     => 15000,
                'billing_cycle' => 'once',
                'features'      => [
                    'Complete UI Redesign',
                    'UX Improvements',
                    'Mobile Optimization',
                    'Performance Optimization',
                    'Core Web Vitals Improvements',
                    'Elementor Cleanup',
                    'Bug Fixes',
                    'Modern Design Refresh',
                ],
            ],
            [
                'title'         => 'WordPress Support & Maintenance',
                'description'   => 'Bug fixes, updates, security and ongoing maintenance.',
                'price'         => 55,
                'bdt_price'     => 5000,
                'billing_cycle' => 'monthly',
                'features'      => [
                    'WordPress Updates',
                    'Plugin Updates',
                    'Theme Updates',
                    'Regular Backups',
                    'Security Monitoring',
                    'Bug Fixes',
                    'Performance Checks',
                    'Priority Support',
                ],
            ],
            [
                'title'         => 'Custom Development',
                'description'   => 'Unique features, API integrations, automation and advanced solutions.',
                'price'         => 0,
                'bdt_price'     => null,
                'billing_cycle' => 'once',
                'features'      => [
                    'School Management Systems',
                    'Inventory Management Systems',
                    'POS (Point of Sale) Systems',
                    'Custom WordPress & WooCommerce Development',
                    'Membership Systems',
                    'API, CRM & ERP Integrations',
                    'Payment Gateway & Checkout Integration',
                    'Automation Solutions',
                    'Custom Dashboards & Reporting',
                    'Booking Systems',
                    'Any Unique Business Requirement',
                ],
            ],
        ];

        foreach ($plans as $i => $p) {
            Pricing::create([
                'title'         => $p['title'],
                'description'   => $p['description'],
                'price'         => $p['price'],
                'bdt_price'     => $p['bdt_price'],
                'billing_cycle' => $p['billing_cycle'],
                'features'      => $p['features'],
                'is_popular'    => $p['title'] === 'Business Website',
                'is_active'     => true,
                'order'         => $i,
            ]);
        }
    }
}
