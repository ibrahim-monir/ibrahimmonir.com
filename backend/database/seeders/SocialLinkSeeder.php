<?php

namespace Database\Seeders;

use App\Models\SocialLink;
use Illuminate\Database\Seeder;

class SocialLinkSeeder extends Seeder
{
    /**
     * Seed the social links — only once. After the first run the admin
     * fully owns this data (edits and deletes are preserved on later deploys).
     */
    public function run(): void
    {
        if (SocialLink::query()->exists()) {
            return;
        }

        $links = [
            ['platform' => 'github', 'url' => 'https://github.com/ibrahim-monir'],
            ['platform' => 'linkedin', 'url' => 'https://linkedin.com/in/ibrahimkhalilmp'],
            ['platform' => 'facebook', 'url' => 'https://facebook.com/ibrahimmonir'],
            ['platform' => 'twitter', 'url' => 'https://twitter.com/ibrahimmonir'],
        ];

        foreach ($links as $i => $l) {
            SocialLink::create([
                'platform'  => $l['platform'],
                'url'       => $l['url'],
                'is_active' => true,
                'order'     => $i,
            ]);
        }
    }
}
