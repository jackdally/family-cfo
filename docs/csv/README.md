## CSV Import Template (MVP)

Columns:
- date: YYYY-MM-DD
- amount: signed decimal; expenses negative
- type: income | expense | transfer
- account: account name (for income/expense)
- fromAccount: transfer source account (for transfer)
- toAccount: transfer destination account (for transfer)
- category: free text (expense only)
- label: free text
- ledger: ACTUAL | PROJECTED

Notes:
- Transfers: provide `fromAccount` and `toAccount` columns. Amount should be positive; importer will create a single AccountTransfer row.
- Future iterations will include a column mapper and Monarch-compatible import.

