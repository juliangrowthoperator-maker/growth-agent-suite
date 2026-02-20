import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // If you need custom logic on top of the default checks
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/login",
        },
    }
);

// Protect specific routes (e.g. /dashboard and settings)
export const config = {
    matcher: ["/dashboard/:path*", "/clients/:path*"],
};
