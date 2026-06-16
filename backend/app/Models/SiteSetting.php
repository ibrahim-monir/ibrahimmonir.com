<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = ['key', 'value'];

    public static function get(string $key, mixed $default = null): mixed
    {
        return static::where('key', $key)->value('value') ?? $default;
    }

    public static function set(string $key, mixed $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
    }

    public static function getAll(): array
    {
        return static::all()->pluck('value', 'key')->toArray();
    }

    public static function setMany(array $data): void
    {
        foreach ($data as $key => $value) {
            if ($key !== '') {
                $stored = is_array($value) ? json_encode($value, JSON_UNESCAPED_UNICODE) : $value;
                static::updateOrCreate(['key' => $key], ['value' => $stored]);
            }
        }
    }
}
