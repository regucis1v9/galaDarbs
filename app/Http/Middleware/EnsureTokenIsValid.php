<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\PersonalAccessToken; // Model for the personal_access_tokens table
use Carbon\Carbon;

class EnsureTokenIsValid
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Extract the token from the Authorization header
        $authorizationHeader = $request->header('Authorization');

        $token = PersonalAccessToken::where('token', $authorizationHeader)->first();

        if (!$token) {
            return response()->json(['error' => 'Unauthorized', 'token' => $authorizationHeader], 403);
        }

        return $next($request);
    }
}
