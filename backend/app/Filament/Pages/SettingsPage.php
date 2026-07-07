<?php

namespace App\Filament\Pages;

use App\Models\SiteSetting;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Concerns\InteractsWithSchemas;
use Filament\Schemas\Contracts\HasSchemas;
use Filament\Schemas\Schema;

class SettingsPage extends Page implements HasSchemas
{
    use InteractsWithSchemas;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-cog-6-tooth';
    protected static ?string $navigationLabel = 'Website Settings';
    protected static ?string $title = 'Website Settings';
    protected static string|\UnitEnum|null $navigationGroup = 'Settings';
    protected static ?int $navigationSort = 1;

    protected string $view = 'filament.pages.settings-page';

    public array $data = [];

    // Keys whose values are stored as JSON arrays
    protected array $jsonArrayKeys = ['hero_typewriter_roles'];

    public function mount(): void
    {
        $data = SiteSetting::getAll();
        foreach ($this->jsonArrayKeys as $key) {
            if (isset($data[$key]) && is_string($data[$key])) {
                $decoded = json_decode($data[$key], true);
                if (is_array($decoded)) {
                    $data[$key] = $decoded;
                }
            }
        }
        $this->form->fill($data);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->statePath('data')
            ->components([
                Tabs::make()->tabs([

                    Tab::make('General')->icon('heroicon-o-globe-alt')->schema([
                        Section::make('Site Identity')->schema([
                            TextInput::make('site_name')
                                ->label('Site Name')
                                ->default('Ibrahim Monir')
                                ->required(),
                            TextInput::make('site_tagline')
                                ->label('Tagline')
                                ->placeholder('Full-Stack Web Developer'),
                            TextInput::make('site_email')
                                ->label('Site Email')
                                ->email()
                                ->placeholder('hello@ibrahimmonir.com'),
                            FileUpload::make('site_logo')
                                ->label('Logo')
                                ->image()
                                ->disk('public')
                                ->directory('settings')
                                ->imageEditor(),
                            FileUpload::make('site_favicon')
                                ->label('Favicon')
                                ->image()
                                ->disk('public')
                                ->directory('settings'),
                        ])->columns(2),
                    ]),

                    Tab::make('Hero Section')->icon('heroicon-o-home')->schema([
                        Section::make('Hero Content')->schema([
                            TextInput::make('hero_badge')
                                ->label('Badge Text')
                                ->placeholder('Available for Freelance'),
                            TagsInput::make('hero_typewriter_roles')
                                ->label('Typewriter Roles')
                                ->helperText('These texts cycle in the hero animation. Press Enter after each one.')
                                ->placeholder('Add a role and press Enter...')
                                ->columnSpanFull(),
                            TextInput::make('hero_headline')
                                ->label('Main Headline')
                                ->placeholder("Hi, I'm Ibrahim Monir")
                                ->columnSpanFull(),
                            TextInput::make('hero_subheadline')
                                ->label('Sub-Headline')
                                ->placeholder('Full-Stack Web Developer')
                                ->columnSpanFull(),
                            Textarea::make('hero_bio')
                                ->label('Short Bio')
                                ->rows(3)
                                ->placeholder('I build fast, scalable web applications...')
                                ->columnSpanFull(),
                            TextInput::make('hero_cta_primary')
                                ->label('Primary CTA Label')
                                ->placeholder('View My Work'),
                            TextInput::make('hero_cta_primary_url')
                                ->label('Primary CTA URL')
                                ->placeholder('/works'),
                            TextInput::make('hero_cta_secondary')
                                ->label('Secondary CTA Label')
                                ->placeholder('Download CV'),
                            TextInput::make('hero_cta_secondary_url')
                                ->label('Secondary CTA URL')
                                ->placeholder('/cv.pdf'),
                        ])->columns(2),

                        Section::make('Profile Photo')->schema([
                            FileUpload::make('hero_photo')
                                ->label('Profile Photo')
                                ->image()
                                ->disk('public')
                                ->directory('settings')
                                ->imageEditor()
                                ->columnSpanFull(),
                        ]),

                        Section::make('CV / Resume')->schema([
                            FileUpload::make('hero_resume')
                                ->label('Upload CV / Resume')
                                ->disk('public')
                                ->directory('settings/resumes')
                                ->acceptedFileTypes(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
                                ->helperText('PDF or Word document. Visitors will download this file via the "Download CV" button.')
                                ->columnSpanFull(),
                        ]),
                    ]),

                    Tab::make('Contact Info')->icon('heroicon-o-phone')->schema([
                        Section::make('Contact Details')->schema([
                            TextInput::make('contact_phone')
                                ->label('Phone Number')
                                ->placeholder('+880 1700-000000')
                                ->tel(),
                            TextInput::make('contact_whatsapp')
                                ->label('WhatsApp Number')
                                ->placeholder('+8801700000000'),
                            TextInput::make('contact_email')
                                ->label('Contact Email')
                                ->email()
                                ->placeholder('ibrahimkhalilmp@gmail.com'),
                            TextInput::make('contact_address')
                                ->label('Address')
                                ->placeholder('Dhaka, Bangladesh'),
                            Textarea::make('contact_map_embed')
                                ->label('Google Maps Embed URL')
                                ->rows(2)
                                ->placeholder('https://maps.google.com/...')
                                ->columnSpanFull(),
                        ])->columns(2),
                    ]),

                    Tab::make('About & Stats')->icon('heroicon-o-user')->schema([
                        Section::make('About Text')->schema([
                            Textarea::make('about_bio')
                                ->label('About Bio')
                                ->rows(4)
                                ->placeholder('I am a passionate full-stack developer...')
                                ->columnSpanFull(),
                            Textarea::make('about_bio_extended')
                                ->label('Extended Bio (second paragraph)')
                                ->rows(3)
                                ->columnSpanFull(),
                        ]),

                        Section::make('Counter Stats')->schema([
                            TextInput::make('stat_years_experience')
                                ->label('Years of Experience')
                                ->numeric()
                                ->placeholder('5'),
                            TextInput::make('stat_projects_completed')
                                ->label('Projects Completed')
                                ->numeric()
                                ->placeholder('80'),
                            TextInput::make('stat_clients_served')
                                ->label('Clients Served')
                                ->numeric()
                                ->placeholder('40'),
                            TextInput::make('stat_satisfaction')
                                ->label('Client Satisfaction %')
                                ->numeric()
                                ->placeholder('100')
                                ->suffix('%'),
                        ])->columns(2),
                    ]),

                    Tab::make('Analytics')->icon('heroicon-o-chart-bar')->schema([
                        Section::make('Google Analytics / Tag Manager')->schema([
                            TextInput::make('ga4_measurement_id')
                                ->label('GA4 Measurement ID')
                                ->placeholder('G-XXXXXXXXXX')
                                ->helperText('From Google Analytics 4 → Admin → Data Streams. Leave blank to disable.'),
                            TextInput::make('gtm_container_id')
                                ->label('GTM Container ID')
                                ->placeholder('GTM-XXXXXXX')
                                ->helperText('From Google Tag Manager → your container ID. Leave blank to disable.'),
                        ])->columns(2),
                    ]),

                    Tab::make('SEO')->icon('heroicon-o-magnifying-glass')->schema([
                        Section::make('Search Engine Optimization')->schema([
                            TextInput::make('seo_title_suffix')
                                ->label('Page Title Suffix')
                                ->placeholder(' | Ibrahim Monir')
                                ->helperText('Appended to all page titles')
                                ->columnSpanFull(),
                            Textarea::make('seo_meta_description')
                                ->label('Default Meta Description')
                                ->rows(3)
                                ->maxLength(160)
                                ->placeholder('Full-Stack Web Developer specializing in WordPress, Laravel & Next.js...')
                                ->columnSpanFull(),
                            TextInput::make('seo_keywords')
                                ->label('Meta Keywords')
                                ->placeholder('web developer, laravel, nextjs, wordpress, bangladesh')
                                ->columnSpanFull(),
                            FileUpload::make('seo_og_image')
                                ->label('Default OG Image (Social Share)')
                                ->image()
                                ->disk('public')
                                ->directory('settings')
                                ->columnSpanFull(),
                        ]),
                    ]),

                ])->persistTabInQueryString(),
            ]);
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('save')
                ->label('Save Settings')
                ->icon('heroicon-o-check')
                ->color('primary')
                ->action('save'),
        ];
    }

    public function save(): void
    {
        $state = $this->form->getState();
        SiteSetting::setMany($state);

        Notification::make()
            ->success()
            ->title('Settings saved successfully.')
            ->send();
    }
}
