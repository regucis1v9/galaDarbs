<?php

namespace App\Http\Controllers;

use App\Models\Slide;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon; // Use Carbon for date handling

class SlideController extends Controller
{
    /**
     * Store a new slide.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function saveSlides(Request $request)
    {
        // Check if request contains an array of slides
        $slides = $request->all();
    
        foreach ($slides as $slide) {
            // Validate each slide
            $validated = Validator::make($slide, [
                'imageLink' => 'required|string',
                'description' => 'required|string',
                'textColor' => 'required|string',
                'bgColor' => 'required|string',
                'textPosition' => 'required|string',
                'startDate' => 'required|date',
                'endDate' => 'required|date',
                'selectedScreens' => 'required|array',
            ]);
    
            if ($validated->fails()) {
                return response()->json(['error' => $validated->errors()], 422);
            }
    
            // Create slide in the database
            Slide::create($validated->validated());
        }
    
        return response()->json(['message' => 'Slides created successfully']);
    }

    /**
     * Get all slides.
     *
     * @return \Illuminate\Http\Response
     */
    public function getAllSlides()
    {
        // Get all slides from the database
        $slides = Slide::all();

        // Return the slides as a JSON response
        return response()->json($slides);
    }

    /**
     * Get today's slides.
     *
     * @return \Illuminate\Http\Response
     */
    public function getTodaysSlides()
    {
        // Get the current date using Carbon
        $today = Carbon::today();

        // Fetch slides where today's date is between startDate and endDate
        $slides = Slide::where('startDate', '<=', $today)
                        ->where('endDate', '>=', $today)
                        ->get();

        // Return today's slides as a JSON response
        return response()->json($slides);
    }
}
