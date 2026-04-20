import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_PATHS = [
  '/dashboard',
  '/projects/create',
  '/messages',
  '/notifications',
]

function isProtectedPath(pathname: string): boolean {
  if (PROTECTED_PATHS.some(p => pathname.startsWith(p))) return true
  if (/^\/projects\/[^/]+\/(manage|bids)/.test(pathname)) return true
  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip auth check entirely for public marketing/static routes
  if (!isProtectedPath(pathname)) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isDashboard = pathname.startsWith('/dashboard')
  const isCreateProject = pathname.startsWith('/projects/create')

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Role based access — only fetch profile when needed
  if (isDashboard || isCreateProject) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const role = profile?.role

    if (isDashboard) {
      if (role === 'business_owner' && pathname === '/dashboard') {
        return NextResponse.redirect(new URL('/dashboard/client', request.url))
      }
      if (role === 'business_owner' && pathname.startsWith('/dashboard/business')) {
        return NextResponse.redirect(new URL('/dashboard/client', request.url))
      }
      if (role === 'freelancer' && pathname.startsWith('/dashboard/client')) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    if (isCreateProject && role !== 'business_owner') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    // Only run middleware on routes that could be protected (not static assets)
    '/(dashboard|messages|notifications|projects)(.*)',
  ],
}
