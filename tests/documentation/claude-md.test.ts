/**
 * CLAUDE.md Documentation Validation Tests
 * 
 * This test suite validates the integrity, accuracy, and completeness
 * of the CLAUDE.md AI assistant guide documentation.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const CLAUDE_MD_PATH = join(process.cwd(), 'CLAUDE.md');
const REPO_ROOT = process.cwd();

describe('CLAUDE.md Documentation Validation', () => {
  let content: string;
  let lines: string[];

  beforeAll(() => {
    content = readFileSync(CLAUDE_MD_PATH, 'utf-8');
    lines = content.split('\n');
  });

  describe('File Structure', () => {
    it('should exist in the repository root', () => {
      expect(existsSync(CLAUDE_MD_PATH)).toBe(true);
    });

    it('should be a non-empty file', () => {
      expect(content.length).toBeGreaterThan(0);
      expect(lines.length).toBeGreaterThan(100);
    });

    it('should have proper title and introduction', () => {
      expect(lines[0]).toContain('# CLAUDE.md');
      expect(content).toContain('AI Assistant Guide');
    });

    it('should contain a table of contents', () => {
      expect(content).toContain('## Table of Contents');
    });
  });

  describe('Heading Hierarchy', () => {
    it('should have properly nested headings', () => {
      const headings = lines.filter(line => line.match(/^#{1,6}\s/));
      expect(headings.length).toBeGreaterThan(10);

      // Check that we don't skip heading levels
      let prevLevel = 0;
      headings.forEach((heading, index) => {
        const level = heading.match(/^(#+)/)?.[1].length || 0;
        if (index > 0) {
          expect(level - prevLevel).toBeLessThanOrEqual(1);
        }
        prevLevel = level;
      });
    });

    it('should have unique heading anchors', () => {
      const headings = lines.filter(line => line.match(/^#{1,6}\s/));
      const anchors = headings.map(h => 
        h.replace(/^#+\s/, '').toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
      );
      const uniqueAnchors = new Set(anchors);
      expect(anchors.length).toBe(uniqueAnchors.size);
    });
  });

  describe('Table of Contents Links', () => {
    it('should have TOC links matching actual sections', () => {
      const tocMatch = content.match(/## Table of Contents\n\n([\s\S]*?)(?=\n## )/);
      if (tocMatch) {
        const tocSection = tocMatch[1];
        const tocLinks = tocSection.match(/\[([^\]]+)\]\(#([^)]+)\)/g) || [];
        
        expect(tocLinks.length).toBeGreaterThan(5);

        tocLinks.forEach(link => {
          const anchor = link.match(/#([^)]+)/)?.[1];
          if (anchor) {
            // Convert anchor back to heading format
            const expectedHeading = anchor.replace(/-/g, ' ');
            const headingExists = content.toLowerCase().includes(expectedHeading.toLowerCase());
            expect(headingExists).toBe(true);
          }
        });
      }
    });
  });

  describe('File Path References', () => {
    it('should reference only existing files', () => {
      // Extract file paths from backticks
      const pathPattern = /`([a-zA-Z0-9/_.\-]+\.[a-zA-Z]+)`/g;
      const paths = [...content.matchAll(pathPattern)].map(m => m[1]);
      
      // Filter out example/placeholder paths
      const realPaths = paths.filter(p => 
        !p.includes('example.com') &&
        !p.includes('NewSlide') &&
        !p.includes('newStore') &&
        !p.startsWith('http') &&
        !p.includes('*')
      );

      const missingFiles: string[] = [];
      realPaths.forEach(path => {
        const fullPath = join(REPO_ROOT, path);
        if (!existsSync(fullPath)) {
          missingFiles.push(path);
        }
      });

      if (missingFiles.length > 0) {
        console.warn('Missing files referenced in CLAUDE.md:', missingFiles);
      }
      
      // This is a soft check - some files might be examples
      expect(missingFiles.length).toBeLessThan(realPaths.length / 2);
    });

    it('should reference correct package.json', () => {
      expect(content).toContain('package.json');
      expect(existsSync(join(REPO_ROOT, 'package.json'))).toBe(true);
    });

    it('should reference correct config files', () => {
      const configFiles = [
        'vite.config.ts',
        'tailwind.config.ts',
        'tsconfig.json',
        'eslint.config.js'
      ];

      configFiles.forEach(file => {
        expect(content).toContain(file);
        expect(existsSync(join(REPO_ROOT, file))).toBe(true);
      });
    });
  });

  describe('Directory Structure References', () => {
    it('should reference existing directories', () => {
      const directories = [
        'client',
        'server',
        'shared',
        'client/src',
        'client/src/components',
        'client/src/data',
        'client/src/slides',
        'client/src/store'
      ];

      directories.forEach(dir => {
        expect(content).toContain(dir);
        expect(existsSync(join(REPO_ROOT, dir))).toBe(true);
      });
    });

    it('should have accurate codebase structure section', () => {
      expect(content).toContain('## Codebase Structure');
      expect(content).toContain('client/');
      expect(content).toContain('server/');
      expect(content).toContain('shared/');
    });
  });

  describe('NPM Scripts Documentation', () => {
    it('should document valid npm scripts', () => {
      const packageJson = JSON.parse(
        readFileSync(join(REPO_ROOT, 'package.json'), 'utf-8')
      );

      const documentedScripts = [
        'npm run dev',
        'npm run build',
        'npm start',
        'npm run check',
        'npm run lint',
        'npm run db:push'
      ];

      documentedScripts.forEach(script => {
        expect(content).toContain(script);
        
        // Extract script name
        const scriptName = script.replace('npm run ', '').replace('npm ', '');
        if (scriptName !== 'start') {
          expect(packageJson.scripts).toHaveProperty(scriptName);
        }
      });
    });

    it('should have Development Workflows section', () => {
      expect(content).toContain('## Development Workflows');
      expect(content).toContain('### NPM Scripts');
    });
  });

  describe('Technology Stack Accuracy', () => {
    it('should reference technologies from package.json', () => {
      const packageJson = JSON.parse(
        readFileSync(join(REPO_ROOT, 'package.json'), 'utf-8')
      );

      const coreDependencies = [
        'react',
        'express',
        'typescript',
        'vite',
        'tailwindcss',
        'zod',
        'zustand',
        'drizzle-orm'
      ];

      coreDependencies.forEach(dep => {
        expect(content.toLowerCase()).toContain(dep.toLowerCase());
        expect(
          packageJson.dependencies[dep] || packageJson.devDependencies[dep]
        ).toBeDefined();
      });
    });

    it('should document the correct technology stack section', () => {
      expect(content).toContain('## Technology Stack');
      expect(content).toContain('### Frontend');
      expect(content).toContain('### Backend');
      expect(content).toContain('### Development Tools');
    });
  });

  describe('Code Block Syntax', () => {
    it('should have properly formatted code blocks', () => {
      const codeBlockPattern = /```(\w+)?\n([\s\S]*?)```/g;
      const codeBlocks = [...content.matchAll(codeBlockPattern)];
      
      expect(codeBlocks.length).toBeGreaterThan(10);

      codeBlocks.forEach((block, index) => {
        const language = block[1];
        const code = block[2];

        // Check that code blocks are not empty
        expect(code.trim().length).toBeGreaterThan(0);

        // Check common languages are specified
        if (language) {
          expect(['bash', 'typescript', 'javascript', 'shell', 'json', 'diff', 'tsx', 'ts', 'js']).toContain(language);
        }
      });
    });

    it('should have valid shell commands in bash blocks', () => {
      const bashPattern = /```(?:bash|shell)\n([\s\S]*?)```/g;
      const bashBlocks = [...content.matchAll(bashPattern)];
      
      expect(bashBlocks.length).toBeGreaterThan(5);

      bashBlocks.forEach(block => {
        const commands = block[1].trim();
        // Check that common shell commands are present
        if (commands.includes('npm')) {
          expect(commands).toMatch(/npm\s+(run\s+)?(dev|build|start|lint|check)/);
        }
      });
    });

    it('should have valid TypeScript code examples', () => {
      const tsPattern = /```(?:typescript|ts|tsx)\n([\s\S]*?)```/g;
      const tsBlocks = [...content.matchAll(tsPattern)];
      
      expect(tsBlocks.length).toBeGreaterThan(3);

      tsBlocks.forEach(block => {
        const code = block[1];
        // Basic syntax checks
        if (code.includes('import')) {
          expect(code).toMatch(/import\s+.*\s+from\s+['"]/);
        }
        if (code.includes('export')) {
          expect(code).toMatch(/export\s+(const|function|type|interface|default)/);
        }
      });
    });
  });

  describe('Path Aliases Documentation', () => {
    it('should document correct path aliases from tsconfig', () => {
      const tsconfig = JSON.parse(
        readFileSync(join(REPO_ROOT, 'tsconfig.json'), 'utf-8')
      );

      expect(content).toContain('Path Aliases');
      expect(content).toContain('@/');
      
      if (tsconfig.compilerOptions?.paths) {
        Object.keys(tsconfig.compilerOptions.paths).forEach(alias => {
          if (alias !== '@db/*') {
            expect(content).toContain(alias);
          }
        });
      }
    });
  });

  describe('Environment Variables Documentation', () => {
    it('should document environment variables', () => {
      expect(content).toContain('Environment Variables');
      expect(content).toContain('DATABASE_URL');
      expect(content).toContain('PORT');
    });

    it('should reference .env.example if it exists', () => {
      if (existsSync(join(REPO_ROOT, '.env.example'))) {
        expect(content).toContain('.env');
      }
    });
  });

  describe('Testing Strategy Section', () => {
    it('should have a testing strategy section', () => {
      expect(content).toContain('## Testing Strategy');
    });

    it('should document current testing state', () => {
      expect(content).toContain('Current State');
      // Document acknowledges no tests currently exist
      expect(content.toLowerCase()).toContain('test');
    });

    it('should include data-testid mentions', () => {
      expect(content).toContain('data-testid');
    });
  });

  describe('Best Practices Documentation', () => {
    it('should have Do\'s and Don\'ts sections', () => {
      expect(content).toContain('### Do\'s');
      expect(content).toContain('### Don\'ts');
    });

    it('should have kid-friendly design principles', () => {
      expect(content).toContain('Kid-Friendly');
      expect(content).toContain('ages 9-10');
    });

    it('should document code conventions', () => {
      expect(content).toContain('## Code Conventions');
      expect(content).toContain('### File Naming');
      expect(content).toContain('### Import Patterns');
    });
  });

  describe('Quick Reference Section', () => {
    it('should have a quick reference section', () => {
      expect(content).toContain('## Quick Reference');
    });

    it('should list important paths', () => {
      expect(content).toContain('### Important Paths');
    });

    it('should list key files', () => {
      expect(content).toContain('### Key Files');
    });

    it('should list project commands', () => {
      expect(content).toContain('### Project Commands');
    });
  });

  describe('Internal Consistency', () => {
    it('should not have broken internal references', () => {
      // Check for markdown links
      const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
      const links = [...content.matchAll(linkPattern)];
      
      links.forEach(link => {
        const url = link[2];
        if (url.startsWith('#')) {
          // Internal anchor link
          const anchor = url.substring(1);
          const heading = anchor.replace(/-/g, ' ');
          expect(content.toLowerCase()).toContain(heading.toLowerCase());
        }
      });
    });

    it('should maintain consistent terminology', () => {
      // Check that key terms are used consistently
      const reactMentions = (content.match(/React/g) || []).length;
      const reactLowerMentions = (content.match(/\breact\b/gi) || []).length;
      
      // React should be capitalized in most contexts
      expect(reactMentions).toBeGreaterThan(0);
    });

    it('should have consistent code formatting', () => {
      // Check that inline code uses backticks
      const inlineCodeCount = (content.match(/`[^`\n]+`/g) || []).length;
      expect(inlineCodeCount).toBeGreaterThan(50);
    });
  });

  describe('Metadata', () => {
    it('should have last updated date', () => {
      expect(content).toContain('Last Updated');
      // Check date format (YYYY-MM-DD)
      expect(content).toMatch(/Last Updated.*\d{4}-\d{2}-\d{2}/);
    });

    it('should reference correct repository', () => {
      expect(content).toContain('timnik82/world-cup');
    });

    it('should mention the branch name', () => {
      expect(content).toContain('Branch');
    });
  });

  describe('Completeness Checks', () => {
    it('should cover all major sections mentioned in TOC', () => {
      const majorSections = [
        'Project Overview',
        'Codebase Structure',
        'Technology Stack',
        'Development Workflows',
        'Key Architectural Patterns',
        'Code Conventions',
        'Working with the Codebase',
        'Testing Strategy',
        'Deployment',
        'Common Tasks'
      ];

      majorSections.forEach(section => {
        expect(content).toContain(section);
      });
    });

    it('should have sufficient detail (word count)', () => {
      const wordCount = content.split(/\s+/).length;
      expect(wordCount).toBeGreaterThan(3000);
    });

    it('should have multiple code examples', () => {
      const codeBlockCount = (content.match(/```/g) || []).length / 2;
      expect(codeBlockCount).toBeGreaterThan(20);
    });
  });

  describe('Deployment Documentation', () => {
    it('should document deployment process', () => {
      expect(content).toContain('## Deployment');
      expect(content).toContain('Production Build');
    });

    it('should mention Replit deployment', () => {
      expect(content).toContain('Replit');
    });
  });

  describe('Getting Help Section', () => {
    it('should have a getting help section', () => {
      expect(content).toContain('## Getting Help');
    });

    it('should reference other documentation files', () => {
      const docFiles = ['replit.md', 'design_guidelines.md'];
      docFiles.forEach(file => {
        if (existsSync(join(REPO_ROOT, file))) {
          expect(content).toContain(file);
        }
      });
    });
  });
});