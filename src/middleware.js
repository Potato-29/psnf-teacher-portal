import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token"); // Assuming the token is stored in cookies

  if (req.nextUrl.pathname === "/" && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Check if the user is trying to access the root path and has a token
  if (req.nextUrl.pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Allow the request to continue if no redirection is needed
  return NextResponse.next();
}

// Specify the paths where the middleware should run
export const config = {
  matcher: ["/"], // Apply middleware only to the root path
};
