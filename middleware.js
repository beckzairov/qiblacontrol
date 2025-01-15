import { NextResponse } from 'next/server';
console.log(123);

export function middleware(request) {
  // Get the token from cookies
  const token = request.cookies.get('token')?.value;

  // If the user is trying to access protected routes without a token, redirect to /auth/login
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Allow requests to public routes like /auth/login and /auth/register
  return NextResponse.next();
}

// Define which routes the middleware should apply to
export const config = {
  matcher: [
    "/profile/:path*",
    "/dashboard/:path*",
    "/",
    "/for/:path*"
  ]
};

// function to decode token validity
// function decodeToken(token: string): boolean {
//   try {
//     const decodedToken = jwt.decode(token) as jwt.JwtPayload;

//     if (!decodedToken || !decodedToken.exp) {
//       return false;
//     }

//     const currentTime = Math.floor(Date.now() / 1000);
//     return decodedToken.exp > currentTime;
//   } catch (err) {
//     console.error("Token decoding error:", err);
//     return false;
//   }
// }
