<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonalAccessToken extends Model
{
    // Specify the table name if it's not the plural of the model name
    protected $table = 'personal_access_tokens';

    // Add any fillable fields or guarded fields as per your needs
    protected $fillable = [
        // List the columns that you want to be mass-assignable
        'tokenable_type', 'tokenable_id', 'name', 'token', 'abilities', 'last_used_at', 'expires_at'
    ];

    // Specify the primary key if it's different from the default 'id'
    protected $primaryKey = 'id';

    // If the table does not use Laravel's default timestamps, you can disable it
    public $timestamps = true;

    // Optionally, add relationships, casts, and other model properties/methods
}
