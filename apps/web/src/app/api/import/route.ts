import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'

type ImportRow = {
  date: string
  amount: string
  type: 'income' | 'expense' | 'transfer'
  account: string
  category?: string
  label?: string
  ledger: 'ACTUAL' | 'PROJECTED'
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') || ''
  if (!contentType.includes('text/csv') && !contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Upload CSV (text/csv)' }, { status: 400 })
  }

  let csvText = ''
  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'file missing' }, { status: 400 })
    csvText = await file.text()
  } else {
    csvText = await req.text()
  }

  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  }) as ImportRow[]

  // TODO: Map accounts, insert rows via GraphQL mutation
  const summary = {
    total: records.length,
    income: records.filter(r => r.type === 'income').length,
    expense: records.filter(r => r.type === 'expense').length,
    transfer: records.filter(r => r.type === 'transfer').length,
  }

  return NextResponse.json({ ok: true, summary })
}


