# Branch Protection — Recommended Configuration

Apply these settings via GitHub Settings > Branches > Branch protection rules.

## `main` branch

| Setting | Value |
|---------|-------|
| Require pull request before merging | Yes |
| Required approving reviews | 1 (minimum) |
| Dismiss stale reviews on new pushes | Yes |
| Require review from CODEOWNERS | Yes |
| Require status checks to pass | Yes |
| Required checks | `CI Gate`, `Code Quality`, `Dependency Audit`, `Secret Detection`, `Build Verification`, `Container Build & Scan` |
| Require branches to be up to date | Yes |
| Require signed commits | Recommended |
| Restrict force pushes | Yes |
| Restrict deletions | Yes |

## `develop` branch

| Setting | Value |
|---------|-------|
| Require pull request before merging | Yes |
| Required approving reviews | 1 |
| Require status checks to pass | Yes |
| Required checks | `CI Gate`, `Code Quality`, `Build Verification` |
| Restrict force pushes | Yes |

## Environment Protection Rules

### `staging`
- No manual approval required (auto-deploys from `develop`)
- Deployment reviewers: optional

### `production`
- **Required reviewers**: At least 1 designated reviewer must approve
- **Wait timer**: 5 minutes (allows cancellation window)
- **Restrict to specific branches**: `main` only
