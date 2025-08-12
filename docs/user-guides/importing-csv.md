# Importing CSV

You can import income and expense rows from a CSV file.

## CSV Columns
- `date`: YYYY-MM-DD
- `amount`: signed decimal; expenses negative
- `type`: `income` | `expense` (transfers not yet supported)
- `account`: account name
- `category`: free text (expense only)
- `label`: free text
- `ledger`: `ACTUAL` | `PROJECTED`

Use the template at `docs/csv/csv-import-template.csv`.

## Notes
- Transfers: currently not supported in the importer. You will receive a validation error if present. Either omit transfers or represent them as paired rows temporarily.
- After import, check the summary returned by the importer for counts of inserted rows.
