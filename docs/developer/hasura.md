# Developer: Hasura

- Console: http://localhost:8080 (admin secret: `devadminsecret`)
- Apply metadata: `HASURA_GRAPHQL_ADMIN_SECRET=devadminsecret npm run hasura:apply`
- Role headers for user:
  - `x-hasura-role: user`
  - `x-hasura-user-id: owner-dev`
- Permissions: see `overview/permissions`.
