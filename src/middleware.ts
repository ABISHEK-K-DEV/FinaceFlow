
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware function is correctly structured but currently performs no specific actions
// and simply passes the request to the next handler.
// As noted in previous comments, authentication redirection is handled elsewhere in the application
// (e.g., in src/app/page.tsx and src/app/(app)/layout.tsx).
export function middleware(request: NextRequest) {
  // You can add logic here to run before a request is completed.
  // For example, redirecting, rewriting URLs, setting headers, etc.

  // Pass the request to the next handler in the chain.
  return NextResponse.next();
}

// To apply this middleware to specific paths, you can uncomment and configure the 'matcher'.
// If 'config' or 'matcher' is omitted, the middleware applies to all paths in your application.
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     '/((?!api|_next/static|_next/image|favicon.ico).*)'
//   ],
// };
