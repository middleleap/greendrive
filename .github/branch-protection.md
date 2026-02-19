# Branch Protection — Required Configuration

Apply these settings via GitHub Settings > Branches > Branch protection rules.
These settings are **mandatory** for bank compliance (SOX, dual-control, non-repudiation).

## `main` branch

| Setting | Value | Rationale |
|---------|-------|-----------|
| Require pull request before merging | **Yes** | Change control |
| Required approving reviews | **2 (minimum)** | Dual-control / segregation of duties |
| Dismiss stale reviews on new pushes | **Yes** | Prevents stale approvals on changed code |
| Require review from CODEOWNERS | **Yes** | Designated ownership |
| Require status checks to pass | **Yes** | Automated quality gate |
| Required checks | `CI Gate`, `Code Quality`, `Dependency Audit`, `License Compliance`, `Secret Detection`, `SAST Scan`, `Build Verification`, `Container Build & Scan` | All security gates mandatory |
| Require branches to be up to date | **Yes** | Prevents merge conflicts |
| Require signed commits | **Yes (Required)** | Non-repudiation / audit trail |
| Require linear history | **Yes** | Clean audit trail |
| Restrict force pushes | **Yes** | Prevent history tampering |
| Restrict deletions | **Yes** | Prevent branch destruction |
| Lock branch | No | Allow merges via PR |
| Allow bypass for admins | No | No exceptions to policy |

## `develop` branch

| Setting | Value | Rationale |
|---------|-------|-----------|
| Require pull request before merging | **Yes** | Change control |
| Required approving reviews | **1 (minimum)** | Development velocity |
| Require status checks to pass | **Yes** | Automated quality gate |
| Required checks | `CI Gate`, `Code Quality`, `Build Verification` | Core checks required |
| Require signed commits | **Yes (Required)** | Non-repudiation |
| Restrict force pushes | **Yes** | Prevent history tampering |

## `release/**` branches

| Setting | Value | Rationale |
|---------|-------|-----------|
| Require pull request before merging | **Yes** | Release control |
| Required approving reviews | **2** | Dual-control for releases |
| Require status checks to pass | **Yes** | All gates must pass |
| Required checks | `CI Gate` | Full gate required |
| Restrict force pushes | **Yes** | Prevent tampering |

## Environment Protection Rules

### `staging`
- No manual approval required (auto-deploys from `develop`)
- Deployment reviewers: optional
- Branch restriction: `develop` only

### `production`
- **Required reviewers**: At least 2 designated reviewers must approve
- **Wait timer**: 5 minutes (allows cancellation window)
- **Restrict to specific branches**: `main` only
- **Prevent self-review**: Deployer cannot be sole approver

## GitHub Repository Settings

These additional settings should be enabled at the repository level:

| Setting | Value | Rationale |
|---------|-------|-----------|
| Secret scanning | **Enabled** | Detect leaked credentials |
| Secret scanning push protection | **Enabled** | Block pushes containing secrets |
| Dependabot alerts | **Enabled** | Vulnerable dependency detection |
| Dependabot security updates | **Enabled** | Auto-patch vulnerabilities |
| Private vulnerability reporting | **Enabled** | Responsible disclosure |
| Code scanning (CodeQL) | **Enabled** | SAST on every PR |
