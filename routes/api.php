<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\ScreenController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/createFolder', [FolderController::class, 'createFolder']);
Route::post('/uploadFiles', [FolderController::class, 'uploadFiles']);
Route::get('/listFolders', [FolderController::class, 'listFolders']);
Route::post('/retrieveFiles', [FolderController::class, 'retrieveFiles']);
Route::get('/addScreen', [ScreenController::class, 'addScreen']);
Route::post('/deleteScreen', [ScreenController::class, 'deleteScreen']);
Route::get('/getAllScreens', [ScreenController::class, 'getAllScreens']);
Route::post('/deleteFolder', [FolderController::class, 'deleteFolder']);
Route::post('/deleteFiles', [FolderController::class, 'deleteFiles']);