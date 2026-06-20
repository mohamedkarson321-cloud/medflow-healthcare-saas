import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/about", "/services", "/doctors", "/departments", "/pricing", "/faq", "/blog", "/contact", "/careers", "/testimonials", "/book-appointment"];
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];

export default auth((req: NextRequest & { auth: { user?: { role?: string } } | null }) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const isLoggedIn = !!session?.user;

  if (authRoutes.some((r) => pathname.startsWith(r))) {
    if (isLoggedIn) {
      const role = session?.user?.role;
      const dest = role === "PATIENT" ? "/patient/dashboard" : role === "DOCTOR" ? "/doctor/dashboard" : role === "RECEPTIONIST" ? "/reception/dashboard" : "/admin/dashboard";
      return NextResponse.redirect(new URL(dest, req.url));
    }
    return NextResponse.next();
  }

  if (publicRoutes.some((r) => pathname === r || pathname.startsWith(r + "/"))) return NextResponse.next();

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = session?.user?.role;
  if (pathname.startsWith("/patient") && role !== "PATIENT") return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  if (pathname.startsWith("/doctor") && role !== "DOCTOR" && role !== "SUPER_ADMIN") return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  if (pathname.startsWith("/reception") && !["RECEPTIONIST","NURSE","CLINIC_ADMIN","SUPER_ADMIN"].includes(role ?? "")) return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  if (pathname.startsWith("/admin") && !["CLINIC_ADMIN","SUPER_ADMIN"].includes(role ?? "")) return NextResponse.redirect(new URL("/patient/dashboard", req.url));

  return NextResponse.next();
});

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"] };
