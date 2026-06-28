<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactMail;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email',
            'phone'   => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|min:10',
        ]);

        Contact::create($data);

        $adminEmail = config('mail.admin_email');

        if ($adminEmail) {
            Mail::to($adminEmail)->send(new ContactMail(
                senderName:  $data['name'],
                senderEmail: $data['email'],
                phone:       $data['phone'] ?? '',
                subject:     $data['subject'],
                body:        $data['message'],
            ));
        }

        return response()->json(['message' => 'Message sent successfully!'], 201);
    }
}
