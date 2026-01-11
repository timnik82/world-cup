const fs = require('fs');
const path = require('path');

describe('CLAUDE.md Documentation Validation', () => {
  let docContent;
  let lines;

  beforeAll(() => {
    const docPath = path.join(__dirname, '..', 'CLAUDE.md');
    docContent = fs.readFileSync(docPath, 'utf-8');
    lines = docContent.split('\n');
  });

  describe('Document Structure', () => {
    test('should have a valid title', () => {
      expect(lines[0]).toMatch(/^# CLAUDE\.md/);
    });

    test('should contain Table of Contents', () => {
      expect(docContent).toContain('## Table of Contents');
    });

    test('should have all major sections', () => {
      const sections = ['Project Overview', 'Codebase Structure', 'Technology Stack', 'Development Workflows', 'Testing Strategy'];
      sections.forEach(section => expect(docContent).toContain(`## ${section}`));
    });
  });

  describe('Code Blocks', () => {
    test('should have properly closed code blocks', () => {
      const codeBlocks = (docContent.match(/```/g) || []).length;
      expect(codeBlocks % 2).toBe(0);
    });
  });

  describe('File References', () => {
    test('should reference existing directories', () => {
      ['client', 'server', 'shared', 'script'].forEach(dir => {
        if (docContent.includes(`${dir}/`)) {
          expect(fs.existsSync(path.join(__dirname, '..', dir))).toBe(true);
        }
      });
    });

    test('should reference existing config files', () => {
      ['package.json', 'tsconfig.json', 'vite.config.ts'].forEach(file => {
        if (docContent.includes(file)) {
          expect(fs.existsSync(path.join(__dirname, '..', file))).toBe(true);
        }
      });
    });
  });

  describe('NPM Scripts', () => {
    let packageJson;
    beforeAll(() => {
      packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8'));
    });

    test('should reference valid npm scripts', () => {
      const scripts = (docContent.match(/npm run (\w+)/g) || []).map(s => s.replace('npm run ', ''));
      scripts.forEach(script => expect(packageJson.scripts).toHaveProperty(script));
    });
  });

  describe('Dependencies', () => {
    let packageJson;
    beforeAll(() => {
      packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8'));
    });

    test('should reference actual dependencies', () => {
      [
        { name: 'React', pkg: 'react' },
        { name: 'Vite', pkg: 'vite' },
        { name: 'Zod', pkg: 'zod' }
      ].forEach(({ name, pkg }) => {
        if (docContent.includes(name)) {
          const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
          expect(allDeps).toHaveProperty(pkg);
        }
      });
    });
  });

  describe('Metadata', () => {
    test('should have last updated date', () => {
      expect(docContent).toMatch(/Last Updated.*\d{4}-\d{2}-\d{2}/);
    });

    test('should reference repository', () => {
      expect(docContent).toContain('timnik82/world-cup');
    });
  });
});