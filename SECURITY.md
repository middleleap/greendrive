# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in Bank GreenDrive, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

### How to Report

1. Email security concerns to the repository maintainers
2. Include a detailed description of the vulnerability
3. Provide steps to reproduce if possible
4. Allow reasonable time for a fix before public disclosure

### What to Expect

- Acknowledgment within 48 hours
- Status update within 5 business days
- Fix timeline communicated once the issue is assessed

## Security Measures

This project implements the following security controls:

### CI/CD Pipeline
- **SAST scanning** via CodeQL on every push and PR
- **Secret detection** via TruffleHog to prevent credential leaks
- **Dependency auditing** via `npm audit` — blocks on high/critical vulnerabilities
- **Container scanning** via Trivy — blocks on high/critical CVEs
- **SBOM generation** via CycloneDX for audit compliance
- **Automated dependency updates** via Dependabot (weekly)

### Application Security
- OAuth tokens stored in-memory only — never persisted to disk
- Tokens never exposed to frontend — server-side proxy pattern
- CORS restricted to configured frontend origin only
- CSRF protection via random state parameter in OAuth flow
- Read-only Tesla API scopes — no vehicle command access
- Input validation on all API endpoints

### Infrastructure
- TLS 1.2+ only (PCI DSS compliant)
- Strong cipher suites with forward secrecy
- HSTS with preload directive
- Content Security Policy (CSP)
- Rate limiting on all endpoints (stricter on auth routes)
- Non-root container execution
- Read-only container filesystem
- Security capability dropping (no-new-privileges)
- Hidden files blocked at reverse proxy level

### Branch Protection (Recommended Configuration)
- Require pull request reviews before merging
- Require status checks to pass (CI Gate)
- Require signed commits
- Restrict force pushes to protected branches
- Require CODEOWNERS review for security-sensitive paths
