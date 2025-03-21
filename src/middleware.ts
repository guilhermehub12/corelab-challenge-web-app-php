import { NextRequest, NextResponse } from "next/server";

// Caminhos que não precisam de autenticação
const publicPaths = ["/login", "/register"];

export function middleware(request: NextRequest) {
  // Verificar se o usuário está autenticado
  const token = request.cookies.get('token')?.value;
  const url = request.nextUrl.clone();
  const isPublicPath = publicPaths.some((path) =>
    url.pathname.startsWith(path)
  );

  // Redirecionar para login se o usuário não estiver autenticado e tentar acessar uma rota protegida
  if (!token && !isPublicPath) {
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Redirecionar para dashboard se o usuário estiver autenticado e tentar acessar uma rota pública
  if (token && isPublicPath) {
    url.pathname = "/tasks";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Caminhos que o middleware deve verificar
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)",
    '/tasks/:path'
  ],
};
