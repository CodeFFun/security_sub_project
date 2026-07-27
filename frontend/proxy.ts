import { NextRequest, NextResponse } from "next/server";
import { getUserData, getAuthToken } from "./lib/cookie";

const publicPaths = ["/login", "/register", "/forgot-password"];
const adminPaths = ["/admin"]
const userPaths = ["/user"]
const shopPaths = ["/shop"]

export async function proxy(req: NextRequest){
    const { pathname } = req.nextUrl;
    
    const token = await getAuthToken();
    const user = token ? await getUserData() : null;

    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
    
    const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));

    const isUserPath = userPaths.some((path) => pathname.startsWith(path));

    const isShopPath = shopPaths.some((path) => pathname.startsWith(path));

    if(!token && !isPublicPath){
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if(token && user){
        if(isAdminPath && user.role !== "admin"){
            return NextResponse.redirect(new URL("/admin/home", req.url));
        }
        if(isUserPath && user.role !== "customer" ){
            return NextResponse.redirect(new URL("/user/home", req.url));
        }
        if(isShopPath && user.role !== "shop"){
            return NextResponse.redirect(new URL("/shop/home", req.url));
        }
        if(isPublicPath){
            return NextResponse.redirect(new URL(`/${user.role}/home`, req.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/user/:path*",
        "/login",
        "/register",
        "/shop/:path*",
    ],
}