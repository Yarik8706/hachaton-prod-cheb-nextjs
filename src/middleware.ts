import {NextRequest, NextResponse} from 'next/server'

export async function middleware(request: NextRequest) {
	const token = request.cookies.get('token')?.value

	const protectedPaths = ["/v1"];

	if (protectedPaths.some((p) => request.nextUrl.pathname.startsWith(
		p.replace(":path", "")))) {
		if (!token) {
			const url = new URL("/", request.url);
			url.searchParams.set("message", "Unauthorized");
			return NextResponse.redirect(url);
		}
	}
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
