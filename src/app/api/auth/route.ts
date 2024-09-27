import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const CORRECT_PASSWORD = process.env.PASSWORD // Replace with your actual password

export async function POST(request: Request) {
  const body = await request.json()
  const { password } = body

  if (password === CORRECT_PASSWORD) {
    // Set a secure HTTP-only cookie
    cookies().set('auth', 'true', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 // 1 hour
    })

    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 })
  }
}