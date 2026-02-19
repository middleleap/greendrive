## Summary

<!-- Brief description of the changes -->

## Change Management

- **Change Ticket**: <!-- e.g. CHG-1234, JIRA-567, or N/A for non-production changes -->
- **Risk Level**: <!-- Low / Medium / High / Critical -->
- **Rollback Plan**: <!-- How to revert if something goes wrong -->

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Security fix
- [ ] Configuration / CI/CD change
- [ ] Documentation update
- [ ] Dependency update

## Security Checklist

- [ ] No secrets, tokens, or credentials are committed
- [ ] No new `eval()`, `Function()`, or dynamic code execution introduced
- [ ] User inputs are validated/sanitized
- [ ] CORS configuration remains restricted
- [ ] OAuth tokens remain server-side only
- [ ] No new dependencies with known vulnerabilities (`npm audit` passes)
- [ ] No new dependencies with restricted licenses (GPL, AGPL, SSPL)
- [ ] API endpoints do not expose sensitive data in responses

## Testing

- [ ] Application starts without errors
- [ ] All four dashboard tabs render correctly
- [ ] Mock mode works (no Tesla credentials)
- [ ] Live mode works (if testable)
- [ ] Build completes: `npm run build`
- [ ] Lint passes: `npm run lint`

## Compliance Attestation

- [ ] I confirm this change has been reviewed for security implications
- [ ] I confirm this change does not introduce any data privacy concerns
- [ ] I confirm this change follows the project's coding standards
- [ ] I confirm the change ticket (if applicable) has been approved

## Deployment Notes

<!-- Any special considerations for deploying this change -->
<!-- For production changes: include the change management ticket ID -->
