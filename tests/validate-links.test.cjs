const fs = require('fs');
const path = require('path');

describe('CLAUDE.md Link Validation', () => {
  let docContent;
  const rootDir = path.join(__dirname, '..');

  beforeAll(() => {
    docContent = fs.readFileSync(path.join(rootDir, 'CLAUDE.md'), 'utf-8');
  });

  describe('File Paths', () => {
    test('should reference valid source directories', () => {
      ['client/src/components', 'client/src/slides', 'client/src/data'].forEach(dir => {
        if (docContent.includes(dir)) {
          expect(fs.existsSync(path.join(rootDir, dir))).toBe(true);
        }
      });
    });

    test('should reference valid schema files', () => {
      if (docContent.includes('schemas.ts')) {
        expect(fs.existsSync(path.join(rootDir, 'client/src/data/schemas.ts'))).toBe(true);
      }
    });
  });

  describe('Package Scripts', () => {
    let packageJson;
    beforeAll(() => {
      packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
    });

    test('should reference valid scripts', () => {
      ['dev', 'build', 'lint'].forEach(script => {
        if (docContent.includes(`npm run ${script}`)) {
          expect(packageJson.scripts).toHaveProperty(script);
        }
      });
    });
  });
});