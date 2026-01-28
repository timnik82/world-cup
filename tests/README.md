# CLAUDE.md Documentation Tests

This directory contains comprehensive validation tests for the CLAUDE.md documentation file.

## Overview

These tests ensure that the CLAUDE.md documentation remains accurate, up-to-date, and provides valid guidance for AI assistants working with the codebase.

## Test Suites

### 1. `validate-claude-docs.test.cjs`
**Main validation suite covering:**
- Document structure and formatting
- Code block syntax and validity
- File system references accuracy
- NPM script documentation
- Dependency version accuracy
- Path alias correctness
- Code example quality
- Internal link validation
- Content completeness
- Best practices documentation
- Command validity

### 2. `validate-links.test.cjs`
**Link and reference validation:**
- File path references
- Directory structure accuracy
- Import statement validity
- Package.json references
- GitHub repository references
- Workflow file references

### 3. `validate-schema-accuracy.test.cjs`
**Schema and type reference validation:**
- Zod schema references
- TypeScript configuration accuracy
- State management documentation
- API and data layer structure
- Component architecture
- Build tool references

## Running Tests

### Prerequisites

These tests are designed to run with plain Node.js using the custom runner in `run-tests.cjs`, so **Jest is not required**.

Ensure you have:
- Node.js (v18 or later recommended)
- npm (or another Node.js package manager)

If you prefer to integrate these tests into an existing Jest-based workflow, you can optionally install Jest:
```bash
npm install --save-dev jest
```

### Run All Tests
```bash
npm test
```

Or directly:
```bash
node tests/run-tests.cjs
```

### Run Individual Test Suite

The test files use a custom test runner and cannot be run individually. Use the methods above to run all tests together via `npm test` or `node tests/run-tests.cjs`.

Test files:
- `validate-claude-docs.test.cjs`
- `validate-links.test.cjs`
- `validate-schema-accuracy.test.cjs`

### With Jest (if configured)
```bash
npm test -- tests/
```

## Test Categories

### Structural Tests
- Header hierarchy
- Code block closure
- List formatting
- Section completeness

### Reference Tests
- File paths exist
- Dependencies are installed
- Commands are valid
- Configuration matches

### Content Tests
- Technical accuracy
- Version correctness
- Pattern validity
- Example quality

### Link Tests
- Internal anchors work
- File references valid
- Import paths correct
- Cross-references accurate

## Maintaining Tests

When updating CLAUDE.md:

1. **Add new sections**: Update structure tests to check for new sections
2. **Add new file references**: Add paths to reference validation tests
3. **Update versions**: Version tests will catch mismatches automatically
4. **Add new patterns**: Add pattern validation to code example tests

## Test Philosophy

These tests are designed to:
- **Catch drift**: Alert when documentation becomes stale
- **Validate accuracy**: Ensure referenced files/configs exist
- **Check consistency**: Maintain uniform formatting and style
- **Verify completeness**: Ensure all important topics are covered
- **Test examples**: Validate code snippets follow best practices

## CI Integration

To integrate with CI/CD:

```yaml
# .github/workflows/test-docs.yml
name: Documentation Tests
on: [push, pull_request]
jobs:
  test-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install jest
      - run: npm test -- tests/
```

## Coverage Goals

Current test coverage includes:
- ✅ 100% of major sections validated
- ✅ All file references checked
- ✅ All commands verified
- ✅ All code examples validated
- ✅ All internal links tested
- ✅ Dependency versions checked
- ✅ Configuration accuracy confirmed

## Troubleshooting

**Test fails on file reference:**
- Check if file was moved/renamed
- Update test or documentation accordingly

**Test fails on version mismatch:**
- Update version in CLAUDE.md
- Or update package.json if doc is correct

**Test fails on code example:**
- Fix syntax in documentation
- Or update test if pattern changed

## Future Enhancements

Potential additions:
- [ ] Markdown linting integration
- [ ] Link checker for external URLs
- [ ] Screenshot validation for UI examples
- [ ] Automated changelog generation
- [ ] Documentation coverage metrics