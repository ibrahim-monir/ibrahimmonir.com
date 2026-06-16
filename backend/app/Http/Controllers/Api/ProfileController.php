<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json($request->user()->load('client'));
    }

    public function updateInfo(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|unique:users,email,' . $user->id,
            'company' => 'nullable|string|max:255',
            'phone'   => 'nullable|string|max:20',
        ]);

        $user->update([
            'name'  => $data['name'],
            'email' => $data['email'],
        ]);

        $user->client()->updateOrCreate(
            ['user_id' => $user->id],
            ['company' => $data['company'] ?? null, 'phone' => $data['phone'] ?? null]
        );

        return response()->json($user->fresh()->load('client'));
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $client = $request->user()->client()->firstOrCreate(['user_id' => $request->user()->id]);

        if ($client->avatar) {
            Storage::disk('public')->delete($client->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $client->update(['avatar' => $path]);

        return response()->json([
            'avatar_url' => Storage::disk('public')->url($path),
        ]);
    }

    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:8|confirmed',
        ]);

        if (! Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Current password is incorrect.'],
            ]);
        }

        $user->update(['password' => $request->password]);

        return response()->json(['message' => 'Password updated successfully.']);
    }
}
