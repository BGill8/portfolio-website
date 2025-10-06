// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

// Get the secret from environment variables
const secret = process.env.SANITY_REVALIDATE_SECRET

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{ _type: string }>(req, secret)
    if (!isValidSignature) {
      return new Response('Invalid signature', { status: 401 })
    }

    if (!body?._type) {
      return new Response('Bad request', { status: 400 })
    }

    // Revalidate the 'sanity' tag. This will clear the cache for all 
    // fetch requests that have this tag.
    revalidateTag('sanity')

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    console.error(err)
    // Check if the caught object is an instance of Error
    if (err instanceof Error) {
      return new Response(err.message, { status: 500 })
    }
    // If it's not an Error instance, return a generic message
    return new Response('An unknown error occurred', { status: 500 })
  }
}