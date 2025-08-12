#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const HASURA_URL = process.env.HASURA_URL || 'http://localhost:8080'
const ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET

if (!ADMIN_SECRET) {
  console.error('HASURA_GRAPHQL_ADMIN_SECRET env var is required')
  process.exit(1)
}

const metadataPath = path.resolve(process.cwd(), 'hasura/metadata/metadata.json')
if (!fs.existsSync(metadataPath)) {
  console.error('Metadata file not found:', metadataPath)
  process.exit(1)
}

const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))

async function main() {
  const res = await fetch(`${HASURA_URL}/v1/metadata`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': ADMIN_SECRET,
    },
    body: JSON.stringify({ type: 'replace_metadata', args: metadata }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to apply metadata: ${res.status} ${text}`)
  }
  const json = await res.json()
  console.log('Applied metadata:', json)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


