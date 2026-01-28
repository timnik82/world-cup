#!/usr/bin/env node

/**
 * Standalone test runner for CLAUDE.md validation
 * Runs without requiring Jest installation
 */

const fs = require('fs');
const path = require('path');

// Simple test framework
class TestRunner {
  constructor() {
    this.tests = [];
    this.suites = [];
    this.currentSuite = null;
    this.results = {
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  describe(name, fn) {
    const suite = { name, tests: [], befores: [] };
    this.suites.push(suite);
    this.currentSuite = suite;
    fn();
    this.currentSuite = null;
  }

  beforeAll(fn) {
    if (this.currentSuite) {
      this.currentSuite.befores.push(fn);
    }
  }

  test(name, fn) {
    if (this.currentSuite) {
      this.currentSuite.tests.push({ name, fn });
    }
  }

  expect(value) {
    return {
      toBe: (expected) => {
        if (value !== expected) {
          throw new Error(`Expected ${expected}, got ${value}`);
        }
      },
      toContain: (expected) => {
        if (!value.includes(expected)) {
          throw new Error(`Expected to contain "${expected}"`);
        }
      },
      toMatch: (pattern) => {
        if (!pattern.test(value)) {
          throw new Error(`Expected to match ${pattern}`);
        }
      },
      not: {
        toContain: (expected) => {
          if (value.includes(expected)) {
            throw new Error(`Expected not to contain "${expected}"`);
          }
        },
        toMatch: (pattern) => {
          if (pattern.test(value)) {
            throw new Error(`Expected not to match ${pattern}`);
          }
        }
      },
      toBeGreaterThan: (expected) => {
        if (value <= expected) {
          throw new Error(`Expected ${value} to be greater than ${expected}`);
        }
      },
      toBeLessThan: (expected) => {
        if (value >= expected) {
          throw new Error(`Expected ${value} to be less than ${expected}`);
        }
      },
      toBeLessThanOrEqual: (expected) => {
        if (value > expected) {
          throw new Error(`Expected ${value} to be less than or equal to ${expected}`);
        }
      },
      toHaveProperty: (prop) => {
        if (!(prop in value)) {
          throw new Error(`Expected to have property "${prop}"`);
        }
      },
      toBeTruthy: () => {
        if (!value) {
          throw new Error(`Expected truthy value, got ${value}`);
        }
      }
    };
  }

  async run() {
    console.log('\n🧪 Running CLAUDE.md Validation Tests\n');
    
    for (const suite of this.suites) {
      console.log(`\n📋 ${suite.name}`);
      
      // Run beforeAll hooks
      for (const before of suite.befores) {
        try {
          await before();
        } catch (error) {
          console.error(`❌ BeforeAll failed: ${error.message}`);
          continue;
        }
      }
      
      // Run tests
      for (const test of suite.tests) {
        try {
          await test.fn();
          this.results.passed++;
          console.log(`  ✅ ${test.name}`);
        } catch (error) {
          this.results.failed++;
          this.results.errors.push({
            suite: suite.name,
            test: test.name,
            error: error.message
          });
          console.log(`  ❌ ${test.name}`);
          console.log(`     ${error.message}`);
        }
      }
    }
    
    this.printSummary();
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 Test Summary\n');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Total: ${this.results.passed + this.results.failed}`);
    
    if (this.results.failed > 0) {
      console.log('\n❌ Failed Tests:\n');
      this.results.errors.forEach(({ suite, test, error }) => {
        console.log(`  ${suite} > ${test}`);
        console.log(`    ${error}\n`);
      });
      process.exit(1);
    } else {
      console.log('\n✨ All tests passed!\n');
      process.exit(0);
    }
  }
}

// Create global test functions
const runner = new TestRunner();
global.describe = runner.describe.bind(runner);
global.test = runner.test.bind(runner);
global.beforeAll = runner.beforeAll.bind(runner);
global.expect = runner.expect.bind(runner);

// Load and run test files
const testFiles = [
  './validate-claude-docs.test.cjs',
  './validate-links.test.cjs',
  './validate-schema-accuracy.test.cjs'
];

console.log('Loading test files...');
testFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    require(fullPath);
    console.log(`✓ Loaded ${file}`);
  } else {
    console.warn(`⚠ Test file not found: ${file}`);
  }
});

// Run all tests
runner.run().catch(error => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});