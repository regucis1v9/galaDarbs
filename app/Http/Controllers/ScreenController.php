<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Screen;

class ScreenController extends Controller
{
    // Function to add a new screen (already implemented)
    public function addScreen(Request $request)
    {
        // Retrieve all existing screen names
        $existingScreens = Screen::all()->pluck('table_name')->toArray();
        
        // Extract the numbers from existing screen names
        $numbers = [];
        foreach ($existingScreens as $screen) {
            if (preg_match('/Ekrāns(\d+)/', $screen, $matches)) {
                $numbers[] = (int)$matches[1];
            }
        }
        
        // Find the next available screen number
        $nextScreenNumber = 1;
        while (in_array($nextScreenNumber, $numbers)) {
            $nextScreenNumber++;
        }
        
        // Create the new screen name
        $newScreenName = 'Ekrāns' . $nextScreenNumber;
        $newScreen = Screen::create(['table_name' => $newScreenName]);
    
        return response()->json([
            'message' => 'Screen created successfully',
            'screen' => $newScreen,
        ]);
    }
    
    public function getAllScreens()
    {
        // Retrieve all screen entries
        $screens = Screen::all();

        // Return them in a JSON response
        return response()->json($screens);
    }
    // Function to delete a screen by ID
    public function deleteScreen(Request $request)
    {
        // Get the ID from the request body
        $id = $request->input('id');

        // Find the screen entry by ID
        $screen = Screen::find($id);

        // Check if the screen exists
        if ($screen) {
            // Delete the screen
            $screen->delete();

            return response()->json([
                'message' => 'Screen deleted successfully',
            ]);
        } else {
            // If screen not found, return a 404 response
            return response()->json([
                'message' => 'Screen not found',
            ], 404);
        }
    }
}