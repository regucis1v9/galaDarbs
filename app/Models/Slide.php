<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Slide extends Model
{
    use HasFactory;

    protected $fillable = [
        'imageLink',
        'description',
        'textColor',
        'bgColor',
        'textPosition',
        'startDate',
        'endDate',
        'selectedScreens',
    ];

    // Cast the selectedScreens field as an array (stored as JSON in the DB)
    protected $casts = [
        'selectedScreens' => 'array',
        'startDate' => 'datetime',
        'endDate' => 'datetime',
    ];
}

