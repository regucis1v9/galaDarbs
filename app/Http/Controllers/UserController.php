<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function createUser(Request $request)
    {
        // Validate the request
        $messages = [
            'name.required' => 'Lietotāja vārds ir obligāts.',
            'name.unique' => 'Lietotāja vārds jau ir aizņemts.',
            'email.required' => 'E-pasta adrese ir obligāta.',
            'email.email' => 'E-pasta adresei jābūt derīgai.',
            'email.unique' => 'E-pasta adrese jau ir aizņemta.',
            'password.required' => 'Parole ir obligāta.',
            'password.min' => 'Parolei jābūt vismaz :min rakstzīmēm garai.',
            'role.required' => 'Pieejas līmenis ir obligāta.',
        ];

        // Validate the request with custom error messages
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|min:3|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|min:1'
        ], $messages);

        // If validation fails, return an error response
        if ($validation->fails()) {
            return response()->json([
                'status' => 422,
                'message' => 'Validācijas neizpildījās',
                'errors' => $validation->errors()
            ],422);
        }
        // // Create the user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' =>  $request->role,
        ]);

        // Return the created user data
        return response()->json([
            'status' => 201,
            'message' => 'Lietotājs veiksmīgi izveidots',
            'user' => $user,
        ], 201);
    }
    
    public function login(Request $request)
    {
        $messages = [
            'name.required' => 'Lietotājvārds ir obligāts.',
            'name.exists' => 'Lietotājvārds neeksistē.', 
            'password.required' => 'Parole ir obligāta.',
            'password.min' => 'Parolei jābūt vismaz :min rakstzīmēm garai.',
        ];
    
        // Validate the request
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:255|exists:users,name', 
            'password' => 'required|string|min:8',
        ], $messages);
    
        if ($validation->fails()) {
            return response()->json([
                'status' => 422,
                'message' => 'Validācijas neizpildījās',
                'errors' => $validation->errors()
            ], 422);
        }
    
        $user = User::where('name', $request->name)->first();
    
        if ($user && Hash::check($request->password, $user->password)) {
            $token = $user->createToken('auth_token')->plainTextToken;
    
            $cookie = cookie('sanctum_token', $token, 60 * 24, null, null, false, true); 
    
            return response()->json([
                'status' => 200,
                'message' => 'Pieslēgšanās veiksmīga',
                'token' => $token,
            ])->cookie($cookie);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Nepareiza parole',
                'errors' => [
                    'password' => 'Nepareiza parole'
                ]
            ], 401);
        }
    }
    
    public function getAllUsers(Request $request)
    {
        $allUsers = User::all();

        if(count($allUsers) < 1){
            return response()->json([
                'status' => 200,
                'message' => 'Datu bāzē nav lietotāju',
            ], 200);
        }
        
        return response()->json([
            'status' => 200,
            'message' => 'Veiksmīgi atrasti lietotāji',
            'users' => $allUsers
        ], 200);
    }
    public function deleteUser(Request $request)
    {
        $messages = [
            'id.exists' => 'ID Nepastāv.',
        ];

        $validation = Validator::make($request->all(), [
            'id' => 'required|integer|exists:users,id',
        ], $messages);

        if ($validation->fails()) {
            return response()->json([
                'status' => 422,
                'message' => 'Kļūda pārbaudot sniegtos datus',
                'errors' => $validation->errors()
            ], 422);
        }

        $id = $request->id;
        $user = User::find($id);

        if ($user) {
            $user->delete();
            $allUsers = User::all();

            return response()->json([
                'status' => 200,
                'message' => 'Veiksmīgi izdēsts lietotājs',
                'users' => $allUsers
            ], 200);
        }

        return response()->json([
            'status' => 404,
            'message' => 'Lietotājs nav atrasts',
        ], 404);
    }
    public function logout(Request $request)
    {
        // Optionally, delete the token from the database
        $request->user()->tokens()->delete();
    
        // Clear the token cookie
        return response()->json([
            'status' => 200,
            'message' => 'Atslēgšanās veiksmīga',
        ])->cookie('token', '', -1); // Setting the cookie with a negative value deletes it
    }
    public function editUser(Request $request)
    {
        $messages = [
            'id.required' => 'ID ir obligāts.',
            'id.exists' => 'ID nepastāv.',
            'name.required' => 'Lietotāja vārds ir obligāts.',
            'name.unique' => 'Lietotāja vārds jau ir aizņemts.',
            'email.required' => 'E-pasta adrese ir obligāta.',
            'email.email' => 'E-pasta adresei jābūt derīgai.',
            'email.unique' => 'E-pasta adrese jau ir aizņemta.',
            'password.min' => 'Parolei jābūt vismaz :min rakstzīmēm garai.',
            'password.required' => 'Parole ir obligāta',
            'role.required' => 'Pieejas līmenis ir obligāta.',
        ];
    
        // Validate the request
        $validation = Validator::make($request->all(), [
            'id' => 'required|integer|exists:users,id',
            'name' => [
                'required',
                'string',
                'min:3',
                'max:255',
                Rule::unique('users')->ignore($request->id),
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($request->id),
            ],
            'password' => 'sometimes|string|min:8', // Password is optional for update
            'role' => 'required|string|min:1',
        ], $messages);
    
        // If validation fails, return an error response
        if ($validation->fails()) {
            return response()->json([
                'status' => 422,
                'message' => 'Validācijas neizpildījās',
                'errors' => $validation->errors()
            ], 422);
        }
    
        // Find the user by ID
        $user = User::find($request->id);
    
        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'Lietotājs nav atrasts',
            ], 404);
        }
    
        // Update user details
        $user->name = $request->name;
        $user->email = $request->email;
    
        // Only update the password if it's provided
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
    
        $user->role = $request->role;
        $user->save(); // Save the changes
    
        // Retrieve all users after the update
        $allUsers = User::all();
    
        // Return the updated user data along with the list of all users
        return response()->json([
            'status' => 200,
            'message' => 'Lietotājs veiksmīgi atjaunināts',
            'user' => $user,
            'users' => $allUsers,  // Return all users
        ], 200);
    }
    
}
