<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class FolderController extends Controller
{
    protected $baseDirectory = '';

    public function createFolder(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'folder_name' => 'required|string|max:255'
        ]);
    
        if ($validation->fails()) {
            return response()->json([
                'status' => 422,
                'message' => 'Validation failed!',
                'errors' => $validation->errors()
            ], 422);
        }
    
        $folderName = $request->input('folder_name');
    
        if (Storage::disk('public')->exists($folderName)) {
            return response()->json(['error' => 'Folder already exists'], 400);
        }
    
        Storage::disk('public')->makeDirectory($folderName, 0755, true);
    
        return response()->json([
            'message' => 'Folder created successfully',
            'folder' => $folderName
        ], 201);
    }
    
    public function uploadFiles(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'files.*' => 'required|image|max:51200',
            'folder_name' => 'required|string|max:255'
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => 422,
                'message' => 'Validation failed!',
                'errors' => $validation->errors()
            ], 422);
        }

        $folderName = $request->input('folder_name');
        $uploadedFileUrls = []; 

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $fileName = $file->getClientOriginalName();
                $finalName = date("His") . '_' . $fileName; 
                Storage::disk('public')->putFileAs($folderName, $file, $finalName);

                $imgUrl = Storage::url($folderName . '/' . $finalName);
                $uploadedFileUrls[] = $imgUrl; 
            }
            return response()->json($uploadedFileUrls, 201);
        }
        
        return response()->json(['error' => 'No files uploaded'], 400);
    }

    public function listFolders(Request $request)
    {
        $folders = Storage::disk('public')->directories();
        $folderNames = array_map(function ($folder) {
            return basename($folder);
        }, $folders);

        return response()->json(['folders' => $folderNames]);
    }

    public function retrieveFiles(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'folder_name' => 'required|string|max:255'
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => 422,
                'message' => 'Validation failed!',
                'errors' => $validation->errors()
            ], 422);
        }

        $folderName = $request->input('folder_name');
        $files = Storage::disk('public')->files($folderName);

        if (empty($files)) {
            return response()->json(['message' => 'No files found in this folder'], 404);
        }

        $fileUrls = array_map(function ($file) {
            return Storage::url($file);
        }, $files);

        return response()->json(['files' => $fileUrls]);
    }

    public function deleteFolder(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'folder_name' => 'required|string|max:255'
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => 422,
                'message' => 'Validation failed!',
                'errors' => $validation->errors()
            ], 422);
        }

        $folderName = $request->input('folder_name');

        if (!Storage::disk('public')->exists($folderName)) {
            return response()->json(['error' => 'Folder not found'], 404);
        }

        Storage::disk('public')->deleteDirectory($folderName);

        return response()->json(['message' => 'Folder deleted successfully'], 200);
    }

    public function deleteFiles(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'folder_name' => 'required|string|max:255',
            'files' => 'required|array',
            'files.*' => 'string'
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => 422,
                'message' => 'Validation failed!',
                'errors' => $validation->errors()
            ], 422);
        }

        $folderName = $request->input('folder_name');
        $files = $request->input('files');
        $missingFiles = []; 
        $currentFiles = Storage::disk('public')->files($folderName);

        foreach ($files as $file) {
            $filePath = $folderName . '/' . $file;

            if (Storage::disk('public')->exists($filePath)) {
                Storage::disk('public')->delete($filePath);
            } else {
                $missingFiles[] = $file;
            }
        }

        if (count($missingFiles) > 0) {
            return response()->json([
                'status' => 200,
                'message' => 'Some files were not found, but the rest were deleted.',
                'missing_files' => $missingFiles,
                'current_files' => array_map('basename', $currentFiles) // Only return file names
            ], 200);
        }

        return response()->json(['message' => 'All files deleted successfully'], 200);
    }
}
