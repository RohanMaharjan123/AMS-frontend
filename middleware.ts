import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface DecodedToken {
    role?: string; 
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const access = request.cookies.get("Access")?.value; // Check for 'access' cookie

    const publicOnlyPaths = ["/login", "/signup"]; // Use /signup if that's your route name
    if (access && publicOnlyPaths.includes(pathname)) {
        console.log(`Redirecting logged-in user from ${pathname} to /dashboard`);
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // --- Protect dashboard routes ---
    if (pathname.startsWith("/dashboard")) {
        // Redirect to /login if no access token
        if (!access) {
            console.log(`Redirecting unauthenticated user from ${pathname} to /login`);
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirectedFrom", pathname); 
            return NextResponse.redirect(loginUrl);
        }
        // If access token exists, validate it and check role
        try {
            // Decode the token
            const decodedToken = jwtDecode<JwtPayload & DecodedToken>(access); 
            const expirationTime = decodedToken.exp; // Standard JWT expiration claim
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

            // Check if token is expired
            if (expirationTime && expirationTime < currentTime) {
                console.log("Access token expired. Redirecting to login.");
                const loginUrl = new URL("/login", request.url);
                const response = NextResponse.redirect(loginUrl);
                response.cookies.delete('access'); 
                return response;
            }

            // Check role
            const currentUserRole = decodedToken.role || ""; // Get role, default to empty string if undefined
            const allowedRoles = ["super_admin", "artist_manager", "artist"];

            if (!allowedRoles.includes(currentUserRole)) {
                console.log(`User role "${currentUserRole}" not permitted for ${pathname}. Redirecting.`);
                return NextResponse.redirect(new URL("/permission-denied", request.url));
            }

            const requestHeaders = new Headers(request.headers);
            requestHeaders.set("Authorization", `Bearer ${access}`);

            console.log(`User role "${currentUserRole}" authorized. Proceeding to ${pathname} with Authorization header set.`);
            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });

        } catch (error) {
            // Handle invalid token format
            console.error("Invalid token encountered:", error);
            const loginUrl = new URL("/login", request.url);
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete('access'); // Attempt to clear the invalid cookie
            return response;
        }
    }

    return NextResponse.next();
}

// --- Configure the matcher ---
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
    ],
};
