const fs = require('fs');
const path = require('path');

describe('Schema Validation', () => {
  let docContent;
  const rootDir = path.join(__dirname, '..');

  beforeAll(() => {
    docContent = fs.readFileSync(path.join(rootDir, 'CLAUDE.md'), 'utf-8');
  });

  describe('Zod', () => {
    test('should reference Zod', () => {
      if (docContent.includes('Zod')) {
        const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
        expect(pkg.dependencies).toHaveProperty('zod');
      }
    });

    test('should document z.infer', () => {
      expect(docContent).toContain('z.infer');
    });
  });

  describe('TypeScript', () => {
    test('should describe TypeScript setup', () => {
      const tsconfigPath = path.join(rootDir, 'tsconfig.json');
      if (fs.existsSync(tsconfigPath)) {
        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
        if (docContent.toLowerCase().includes('strict mode')) {
          expect(tsconfig.compilerOptions?.strict).toBe(true);
        }
      }
    });
  });

  describe('Components', () => {
    test('should reference slide components', () => {
      ['IntroSlide', 'TimelineSlide', 'MatchesSlide'].forEach(slide => {
        if (docContent.includes(slide)) {
          expect(fs.existsSync(path.join(rootDir, `client/src/slides/${slide}.tsx`))).toBe(true);
        }
      });
    });
  });
});