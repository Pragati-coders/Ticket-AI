import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/api(.*)",
  "/dashboard(.*)",
  "/tickets(.*)",
  "/knowledge-base(.*)",
  "/analytics(.*)",
  "/notifications(.*)",
  "/admin(.*)",
  "/agent(.*)",
  "/customer(.*)"
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAgentRoute = createRouteMatcher(["/agent(.*)"]);
const isStaffRoute = createRouteMatcher(["/knowledge-base(.*)", "/analytics(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }

  const session = await auth();
  const claims = session.sessionClaims as
    | {
        metadata?: { role?: string };
        publicMetadata?: { role?: string };
      }
    | null
    | undefined;
  const role = claims?.metadata?.role ?? claims?.publicMetadata?.role;

  if (isAdminRoute(request) && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAgentRoute(request) && role !== "admin" && role !== "agent") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isStaffRoute(request) && role !== "admin" && role !== "agent") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|webp|ico|woff2?|ttf|map)).*)", "/(api|trpc)(.*)"]
};
