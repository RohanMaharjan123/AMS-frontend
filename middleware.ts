import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface DecodedToken {
    role?: string;
}

const ACCESS_TOKEN_COOKIE_NAME = "Access";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const access = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value; 

    const publicOnlyPaths = ["/login", "/signup"];
    if (access && publicOnlyPaths.includes(pathname)) {
        console.log(`Redirecting logged-in user from ${pathname} to /dashboard`);
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (pathname.startsWith("/dashboard")) {
        if (!access) {
            console.log(`Redirecting unauthenticated user from ${pathname} to /login`);
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirectedFrom", pathname);
            return NextResponse.redirect(loginUrl);
        }
        try {
            const decodedToken = jwtDecode<JwtPayload & DecodedToken>(access);
            const expirationTime = decodedToken.exp;
            const currentTime = Math.floor(Date.now() / 1000);

            if (expirationTime && expirationTime < currentTime) {
                console.log("Access token expired. Redirecting to login.");
                const loginUrl = new URL("/login", request.url);
                const response = NextResponse.redirect(loginUrl);
                response.cookies.delete(ACCESS_TOKEN_COOKIE_NAME);
                return response;
            }
            const currentUserRole = decodedToken.role || "";
            const allowedRoles = ["super_admin", "artist_manager", "artist"];

            if (!allowedRoles.includes(currentUserRole)) {
                console.log(`User role "${currentUserRole}" not permitted for ${pathname}. Redirecting.`);
                return NextResponse.redirect(new URL("/permission-denied", request.url)); 
            }

            const requestHeaders = new Headers(request.headers);
            requestHeaders.set("Authorization", `Bearer ${access}`);
            
            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });

        } catch (error) {
            console.error("Invalid token encountered:", error);
            const loginUrl = new URL("/login", request.url);
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete(ACCESS_TOKEN_COOKIE_NAME);
            return response;
        }
    }

    return NextResponse.next();
}
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)',
    ],
};
