/**
 * CLAUDE.md Code Accuracy Validation
 * 
 * Validates that code examples and patterns documented in CLAUDE.md
 * match the actual codebase implementation.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const CLAUDE_MD_PATH = join(process.cwd(), 'CLAUDE.md');
const REPO_ROOT = process.cwd();

describe('CLAUDE.md Code Accuracy', () => {
  const claudeContent = readFileSync(CLAUDE_MD_PATH, 'utf-8');

  describe('Component Count Accuracy', () => {
    it('should accurately report number of UI components', () => {
      const uiComponentsPath = join(REPO_ROOT, 'client/src/components/ui');
      
      if (existsSync(uiComponentsPath)) {
        const uiComponents = readdirSync(uiComponentsPath)
          .filter(f => f.endsWith('.tsx') || f.endsWith('.ts'))
          .length;
        
        // Document mentions "47 UI components" - verify this is approximately correct
        const mentionedCount = claudeContent.match(/(\d+)\s+UI\s+components/i);
        if (mentionedCount) {
          const documentedCount = parseInt(mentionedCount[1]);
          // Allow some variance as components may be added/removed
          expect(Math.abs(uiComponents - documentedCount)).toBeLessThan(10);
        }
      }
    });

    it('should accurately report number of slides', () => {
      const slidesPath = join(REPO_ROOT, 'client/src/slides');
      
      if (existsSync(slidesPath)) {
        const slides = readdirSync(slidesPath)
          .filter(f => f.endsWith('.tsx'))
          .length;
        
        // Document should mention slides
        const mentionedSlides = claudeContent.match(/(\d+)\s+slides/i);
        if (mentionedSlides) {
          const documentedSlides = parseInt(mentionedSlides[1]);
          expect(slides).toBeCloseTo(documentedSlides, 2);
        }
      }
    });
  });

  describe('Store Files Accuracy', () => {
    it('should list all actual store files', () => {
      const storePath = join(REPO_ROOT, 'client/src/store');
      
      if (existsSync(storePath)) {
        const stores = readdirSync(storePath)
          .filter(f => f.endsWith('.ts') || f.endsWith('.tsx'))
          .map(f => f.replace(/\.(ts|tsx)$/, ''));
        
        stores.forEach(store => {
          expect(claudeContent).toContain(store);
        });
      }
    });
  });

  describe('API Provider Pattern', () => {
    it('should document actual API provider implementation', () => {
      const apiPath = join(REPO_ROOT, 'client/src/lib/api');
      
      if (existsSync(apiPath)) {
        expect(claudeContent).toContain('API Provider Pattern');
        expect(claudeContent).toContain('VITE_API_PROVIDER');
      }
    });
  });

  describe('Data Files Documentation', () => {
    it('should reference actual data directory structure', () => {
      const dataPath = join(REPO_ROOT, 'client/src/data');
      
      if (existsSync(dataPath)) {
        const dataFiles = readdirSync(dataPath);
        
        // Check for schemas.ts
        if (dataFiles.includes('schemas.ts')) {
          expect(claudeContent).toContain('schemas.ts');
        }
        
        // Check for JSON files
        const jsonFiles = dataFiles.filter(f => f.endsWith('.json'));
        expect(jsonFiles.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Dependency Versions', () => {
    it('should document dependencies from package.json', () => {
      const packageJson = JSON.parse(
        readFileSync(join(REPO_ROOT, 'package.json'), 'utf-8')
      );

      const keyDependencies = [
        'react',
        'typescript',
        'vite',
        'express',
        'zustand'
      ];

      keyDependencies.forEach(dep => {
        const version = packageJson.dependencies[dep] || packageJson.devDependencies[dep];
        if (version) {
          // Check that the dependency is mentioned
          expect(claudeContent.toLowerCase()).toContain(dep.toLowerCase());
        }
      });
    });
  });

  describe('Build Configuration Accuracy', () => {
    it('should document actual build output paths', () => {
      const packageJson = JSON.parse(
        readFileSync(join(REPO_ROOT, 'package.json'), 'utf-8')
      );

      if (packageJson.scripts?.build) {
        expect(claudeContent).toContain('dist/');
      }
    });
  });

  describe('Port Configuration', () => {
    it('should document correct default port', () => {
      // Document mentions port 5000
      expect(claudeContent).toContain('5000');
      expect(claudeContent).toContain('PORT');
    });
  });

  describe('File Structure Completeness', () => {
    it('should document all top-level directories', () => {
      const topLevelDirs = readdirSync(REPO_ROOT, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .filter(dirent => !dirent.name.startsWith('.'))
        .filter(dirent => dirent.name !== 'node_modules')
        .map(dirent => dirent.name);

      const criticalDirs = topLevelDirs.filter(dir => 
        ['client', 'server', 'shared', 'script'].includes(dir)
      );

      criticalDirs.forEach(dir => {
        expect(claudeContent).toContain(dir);
      });
    });
  });

  describe('TypeScript Configuration', () => {
    it('should reference actual tsconfig settings', () => {
      const tsconfig = JSON.parse(
        readFileSync(join(REPO_ROOT, 'tsconfig.json'), 'utf-8')
      );

      expect(claudeContent).toContain('tsconfig.json');
      expect(claudeContent).toContain('TypeScript');
      
      if (tsconfig.compilerOptions?.paths) {
        expect(claudeContent).toContain('Path Aliases');
      }
    });
  });

  describe('Vite Configuration', () => {
    it('should document Vite as build tool', () => {
      if (existsSync(join(REPO_ROOT, 'vite.config.ts'))) {
        expect(claudeContent).toContain('Vite');
        expect(claudeContent).toContain('vite.config.ts');
      }
    });
  });

  describe('Database Configuration', () => {
    it('should document Drizzle ORM if present', () => {
      if (existsSync(join(REPO_ROOT, 'drizzle.config.ts'))) {
        expect(claudeContent).toContain('Drizzle');
        expect(claudeContent).toContain('DATABASE_URL');
      }
    });
  });
});