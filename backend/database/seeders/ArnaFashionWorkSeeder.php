<?php

namespace Database\Seeders;

use App\Models\Work;
use Illuminate\Database\Seeder;

class ArnaFashionWorkSeeder extends Seeder
{
    /**
     * Upsert by slug so re-running on later deploys doesn't duplicate the entry
     * or clobber admin edits to fields not listed here.
     */
    public function run(): void
    {
        Work::updateOrCreate(
            ['slug' => 'arna-fashion'],
            [
                'title'        => 'Arna Fashion',
                'category'     => 'WordPress',
                'description'  => 'Corporate website for a garment manufacturer and 100% exporter — company profile, product catalog, production capacity, machinery & equipment, and compliance details.',
                'technologies' => ['WordPress', 'PHP', 'MySQL'],
                'url'          => 'https://turismoapparels.com/arna-fashion/',
                'is_featured'  => true,
                'is_active'    => true,
                'order'        => 0,
            ]
        );
    }
}
