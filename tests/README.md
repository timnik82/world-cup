# Test Suite Documentation

## Overview

This directory contains the test suite for the FIFA World Cup History project, with a focus on validating the CLAUDE.md documentation file.

## Test Structure

### Documentation Tests (`tests/documentation/`)

Comprehensive validation of the CLAUDE.md AI assistant guide:

1. **claude-md.test.ts** - Main documentation validation
   - File structure and organization
   - Heading hierarchy
   - Table of contents accuracy
   - File path references
   - Directory structure accuracy
   - NPM scripts documentation
   - Technology stack accuracy
   - Code block syntax
   - Best practices documentation
   - Internal consistency

2. **code-accuracy.test.ts** - Cross-reference validation
   - Component count accuracy
   - Store files accuracy
   - API provider patterns
   - Data files structure
   - Dependency versions
   - Build configuration
   - TypeScript and Vite configuration

3. **markdown-structure.test.ts** - Markdown quality validation
   - Formatting consistency
   - Content organization
   - Readability metrics
   - Links and references
   - Special sections formatting

## Running Tests

```bash
# Run all tests
npm test

# Run tests once (CI mode)
npm run test:run

# Run with coverage
npm run test:coverage

# Run only documentation tests
npm run test:docs

# Run in watch mode (development)
npm test -- --watch

# Run specific test file
npm test -- tests/documentation/claude-md.test.ts
```

## Test Framework

- **Framework**: Vitest
- **Environment**: Node.js
- **Timeout**: 30 seconds per test

## Writing New Tests

When adding new tests:

1. Place test files in appropriate subdirectories
2. Use descriptive `describe` and `it` blocks
3. Follow existing naming conventions
4. Include helpful error messages
5. Ensure tests are deterministic

### Example Test Structure

```typescript
import { describe, it, expect } from 'vitest';

describe('Feature Name', () => {
  describe('Specific Aspect', () => {
    it('should behave in expected way', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = someFunction(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

## Test Coverage

Current focus:
- ✅ Documentation validation (CLAUDE.md)
- ⏳ Unit tests for components (planned)
- ⏳ Integration tests (planned)
- ⏳ E2E tests (planned)

## CI Integration

Tests are designed to run in CI/CD pipelines:

```yaml
# Add to .github/workflows/ci-lint-typecheck.yml
- name: Run Tests
  run: npm run test:run
```

## Troubleshooting

### Tests Failing

1. **File Path Issues**: Ensure tests run from repository root
2. **Missing Dependencies**: Run `npm install` to install vitest
3. **Timeout Errors**: Increase timeout in vitest.config.ts
4. **Import Errors**: Check path aliases in vitest.config.ts

### Common Issues

- **CLAUDE.md not found**: Tests expect file in repository root
- **Package.json missing**: Tests validate against actual package.json
- **TypeScript errors**: Ensure TypeScript is installed

## Best Practices

1. **Keep tests focused**: One concept per test
2. **Use descriptive names**: Test names should explain what they validate
3. **Avoid test interdependence**: Tests should run independently
4. **Mock external dependencies**: Don't rely on network or filesystem when possible
5. **Keep tests fast**: Aim for sub-second execution per test
6. **Document complex assertions**: Add comments for non-obvious checks

## Maintenance

- Review and update tests when CLAUDE.md changes
- Add new tests for new documentation sections
- Keep test expectations aligned with actual codebase
- Run tests before committing changes

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Writing Good Tests](https://github.com/goldbergyoni/javascript-testing-best-practices)