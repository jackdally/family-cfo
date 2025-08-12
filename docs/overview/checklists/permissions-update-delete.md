# Checklist: Hasura Permissions (Update/Delete)

- [ ] Add update permissions for core tables scoped to `ownerId = X-Hasura-User-Id`
- [ ] Add delete permissions for core tables scoped to `ownerId = X-Hasura-User-Id`
- [ ] Verify with GraphQL queries/mutations (docs examples) for each table
- [ ] Ensure web app mutations pass role/user headers (prep for JWT)
- [ ] Document rollback/backup for metadata changes

Definition of done: Update/Delete work for `Scenario`, `Account`, `IncomeEvent`, `ExpenseEvent`, `AccountBalance`, `AccountTransfer`, `RecurringRule` under owner scope.
