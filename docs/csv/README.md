## CSV Import Template (MVP)

Columns:
- date: YYYY-MM-DD
- amount: signed decimal; expenses negative
- type: income | expense | transfer
- account: account name
- category: free text (expense only)
- label: free text
- ledger: ACTUAL | PROJECTED

Notes:
- For transfers, include two rows if desired (debit and credit) or leave blank and use a dedicated transfer tool later.
- Future iterations will include a column mapper and Monarch-compatible import.

