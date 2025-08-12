import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'
import { ensureAccountByName, getOrCreateDefaultScenario, insertExpense, insertIncome, insertTransfer } from '../../../lib/hasura'

type ImportRow = {
  date: string
  amount: string
  type: 'income' | 'expense' | 'transfer'
  account: string
  fromAccount?: string
  toAccount?: string
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
  const ownerId = 'owner-dev'
  const scenario = await getOrCreateDefaultScenario(ownerId)

  // Collect transfers separately (supports either from/to columns or single account+label convention)
  const transferRows = records.filter(r => r.type === 'transfer')

  // Group by account name
  const byAccount = new Map<string, ImportRow[]>()
  for (const r of records) {
    const key = r.account || 'Checking'
    if (!byAccount.has(key)) byAccount.set(key, [])
    byAccount.get(key)!.push(r)
  }

  let totalIncome = 0
  let totalExpense = 0
  let totalTransfer = 0

  for (const [accountName, rows] of byAccount) {
    const account = await ensureAccountByName(ownerId, scenario.id, accountName, 'checking')
    const incomeRows = rows
      .filter(r => r.type === 'income')
      .map(r => ({ date: r.date, amount: Number(r.amount), label: r.label || 'income', ledger: r.ledger }))
    const expenseRows = rows
      .filter(r => r.type === 'expense')
      .map(r => ({ date: r.date, amount: Math.abs(Number(r.amount)), category: r.category || 'uncategorized', ledger: r.ledger }))

    if (incomeRows.length) {
      const res = await insertIncome(ownerId, account.id, incomeRows)
      totalIncome += res.insert_IncomeEvent.affected_rows
    }
    if (expenseRows.length) {
      const res = await insertExpense(ownerId, account.id, expenseRows)
      totalExpense += res.insert_ExpenseEvent.affected_rows
    }
  }

  // Process transfers: group by (from,to)
  const transferMap = new Map<string, { fromAccountId: string; toAccountId: string; rows: Array<{ date: string; amount: number; ledger: 'ACTUAL' | 'PROJECTED' }> }>()
  for (const r of transferRows) {
    const fromName = (r.fromAccount || r.account || '').trim()
    const toName = (r.toAccount || '').trim()
    if (!fromName || !toName) continue
    const from = await ensureAccountByName(ownerId, scenario.id, fromName, 'checking')
    const to = await ensureAccountByName(ownerId, scenario.id, toName, 'checking')
    const key = `${from.id}::${to.id}`
    if (!transferMap.has(key)) transferMap.set(key, { fromAccountId: from.id, toAccountId: to.id, rows: [] })
    transferMap.get(key)!.rows.push({ date: r.date, amount: Math.abs(Number(r.amount)), ledger: r.ledger })
  }
  for (const [, grp] of transferMap) {
    const res = await insertTransfer(ownerId, grp.fromAccountId, grp.toAccountId, grp.rows)
    totalTransfer += res.insert_AccountTransfer.affected_rows
  }

  const summary = { total: records.length, income: totalIncome, expense: totalExpense, transfer: totalTransfer }
  return NextResponse.json({ ok: true, scenarioId: scenario.id, summary })
}


