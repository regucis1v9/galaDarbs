<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileUploadController extends Controller
{
    public function uploadFile(Request $request)
    {
        // Validate the request to ensure a file and folder name are provided
        $request->validate([
            'folder_name' => 'required|string|max:255',
            'file' => 'required|file|max:2048' // max file size is 2MB, adjust as needed
        ]);

        // Get the folder name and file from the request
        $folderName = $request->input('new_folder');
        $file = $request->file('file');

        // Define the path where the file will be uploaded
        $filePath = $folderName . '/' . $file->getClientOriginalName();

        // Log the path for debugging
        \Log::info('Uploading file to path:', ['path' => $filePath]);

        // Store the file
        $file->storeAs($folderName, $file->getClientOriginalName(), 'public');

        return response()->json(['message' => 'File uploaded successfully'], 201);
    }
}
