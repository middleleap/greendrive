## Summary

<!-- Brief description of the changes -->

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Security fix
- [ ] Configuration / CI/CD change
- [ ] Documentation update

## Security Checklist

- [ ] No secrets, tokens, or credentials are committed
- [ ] No new `eval()`, `Function()`, or dynamic code execution introduced
- [ ] User inputs are validated/sanitized
- [ ] CORS configuration remains restricted
- [ ] OAuth tokens remain server-side only
- [ ] No new dependencies with known vulnerabilities (`npm audit` passes)

## Testing

- [ ] Application starts without errors
- [ ] All four dashboard tabs render correctly
- [ ] Mock mode works (no Tesla credentials)
- [ ] Live mode works (if testable)
- [ ] Build completes: `npm run build`
- [ ] Lint passes: `npm run lint`

## Deployment Notes

<!-- Any special considerations for deploying this change -->
