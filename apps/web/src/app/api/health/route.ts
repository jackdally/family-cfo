import { NextResponse } from 'next/server'
import { gql } from '../../../lib/hasura'

export async function GET() {
  try {
    // Simple query to validate Hasura connectivity and auth
    await gql<{ __typename: string }>('query { __typename }')
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}


