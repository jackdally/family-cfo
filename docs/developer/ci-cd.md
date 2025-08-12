# Developer: CI/CD

- CI workflow: `.github/workflows/ci.yml`
  - Build web, type-check, lint
  - Build docs smoke
- Docs deploy: `.github/workflows/docs.yml` publishes to `gh-pages`
- Default branch: `develop`; PRs flow into develop, then to `main` for releases.
