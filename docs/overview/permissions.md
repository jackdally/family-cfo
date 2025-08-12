# Hasura Permissions (Owner-Based Access)

Family CFO uses owner-based row filters enforced by Hasura. Every core table includes an `ownerId` column, and permissions are scoped to the session variable `X-Hasura-User-Id` for role `user`.

## Session headers
- `X-Hasura-Role: user`
- `X-Hasura-User-Id: <owner-id>` (MVP local value is `owner-dev`)

## Tables covered
- `Scenario`, `Account`, `AccountBalance`, `IncomeEvent`, `ExpenseEvent`, `AccountTransfer`, `RecurringRule`
  - Select: `ownerId = X-Hasura-User-Id`
  - Insert: `ownerId` is auto-set via `set: { ownerId: X-Hasura-User-Id }`

These rules are encoded in `hasura/metadata/metadata.json` and applied with:

```bash
HASURA_GRAPHQL_ADMIN_SECRET=devadminsecret npm run hasura:apply
```

## Quick local verification
```bash
# List scenarios for owner-dev
curl -sS \
  -H 'Content-Type: application/json' \
  -H 'x-hasura-admin-secret: devadminsecret' \
  -H 'x-hasura-role: user' \
  -H 'x-hasura-user-id: owner-dev' \
  -X POST http://localhost:8080/v1/graphql \
  --data-binary '{"query":"query { Scenario(limit: 1) { id name ownerId } }"}' | jq .

# Insert a scenario (ownerId will be set by Hasura)
curl -sS \
  -H 'Content-Type: application/json' \
  -H 'x-hasura-admin-secret: devadminsecret' \
  -H 'x-hasura-role: user' \
  -H 'x-hasura-user-id: owner-dev' \
  -X POST http://localhost:8080/v1/graphql \
  --data-binary '{"query":"mutation($name:String!){ insert_Scenario_one(object:{name:$name}){ id name ownerId }}","variables":{"name":"Docs Test"}}' | jq .
```

## Unauthorized role
`HASURA_GRAPHQL_UNAUTHORIZED_ROLE=public` is enabled, but `public` has no access by default. We may add selective read permissions later; not required for MVP.
