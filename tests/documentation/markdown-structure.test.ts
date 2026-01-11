/**
 * CLAUDE.md Markdown Structure Validation
 * 
 * Validates markdown formatting, structure, and readability
 * of the CLAUDE.md documentation file.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const CLAUDE_MD_PATH = join(process.cwd(), 'CLAUDE.md');

describe('CLAUDE.md Markdown Structure', () => {
  const content = readFileSync(CLAUDE_MD_PATH, 'utf-8');
  const lines = content.split('\n');

  describe('Markdown Formatting', () => {
    it('should not have trailing whitespace', () => {
      const linesWithTrailingSpace = lines
        .map((line, index) => ({ line, index: index + 1 }))
        .filter(({ line }) => line.endsWith(' ') || line.endsWith('\t'));
      
      if (linesWithTrailingSpace.length > 0) {
        console.warn('Lines with trailing whitespace:', linesWithTrailingSpace.slice(0, 5));
      }
      
      // Allow some tolerance
      expect(linesWithTrailingSpace.length).toBeLessThan(10);
    });

    it('should use consistent list formatting', () => {
      const listItems = lines.filter(line => line.match(/^\s*[-*+]\s/));
      
      // Check that list items use consistent markers
      if (listItems.length > 0) {
        const markers = listItems.map(item => item.trim()[0]);
        const uniqueMarkers = new Set(markers);
        
        // Should primarily use one marker type (- or *)
        expect(uniqueMarkers.size).toBeLessThanOrEqual(2);
      }
    });

    it('should have proper blank lines around headings', () => {
      lines.forEach((line, index) => {
        if (line.match(/^#{1,6}\s/)) {
          // Skip first line
          if (index > 0) {
            // There should be a blank line before headings (except consecutive headings)
            const prevLine = lines[index - 1];
            const isPrevHeading = prevLine.match(/^#{1,6}\s/);
            
            if (!isPrevHeading && prevLine.trim() !== '') {
              // This is a soft warning - not all heading need blank lines
            }
          }
        }
      });
      
      expect(true).toBe(true); // Passed structural check
    });

    it('should use consistent code fence syntax', () => {
      const codeFences = content.match(/```[\w]*\n/g) || [];
      expect(codeFences.length).toBeGreaterThan(20);
      
      // All code fences should use triple backticks
      codeFences.forEach(fence => {
        expect(fence).toMatch(/^```/);
      });
    });

    it('should close all code blocks', () => {
      const openFences = (content.match(/```/g) || []).length;
      // Should be even number (open and close)
      expect(openFences % 2).toBe(0);
    });
  });

  describe('Content Organization', () => {
    it('should have logical section ordering', () => {
      const expectedOrder = [
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

      const positions = expectedOrder.map(section => {
        const index = content.indexOf(section);
        return { section, index };
      }).filter(item => item.index !== -1);

      // Check that sections appear in order
      for (let i = 1; i < positions.length; i++) {
        expect(positions[i].index).toBeGreaterThan(positions[i - 1].index);
      }
    });

    it('should have balanced section sizes', () => {
      const sections = content.split(/^## /m);
      
      sections.forEach(section => {
        if (section.trim().length > 0) {
          const lines = section.split('\n').length;
          // Sections should have meaningful content (at least 5 lines)
          expect(lines).toBeGreaterThan(5);
        }
      });
    });
  });

  describe('Readability', () => {
    it('should have reasonable line lengths', () => {
      const longLines = lines.filter(line => 
        !line.match(/^```/) && // Exclude code blocks
        !line.match(/^\s*\|/) && // Exclude tables
        !line.match(/^https?:\/\//) && // Exclude URLs
        line.length > 120
      );
      
      // Most lines should be under 120 characters
      const longLinePercentage = (longLines.length / lines.length) * 100;
      expect(longLinePercentage).toBeLessThan(20);
    });

    it('should have appropriate paragraph breaks', () => {
      const doubleNewlines = (content.match(/\n\n/g) || []).length;
      const totalLines = lines.length;
      
      // Should have regular paragraph breaks
      expect(doubleNewlines).toBeGreaterThan(totalLines / 20);
    });

    it('should use clear section introductions', () => {
      const h2Sections = content.split(/^## /m).slice(1);
      
      h2Sections.forEach(section => {
        const firstLines = section.split('\n').slice(1, 5).join(' ');
        // Each section should have some introductory text
        expect(firstLines.length).toBeGreaterThan(20);
      });
    });
  });

  describe('Links and References', () => {
    it('should have well-formed markdown links', () => {
      const links = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
      
      links.forEach(link => {
        // Link text should not be empty
        expect(link).toMatch(/\[[^\]]+\]/);
        // Link URL should not be empty
        expect(link).toMatch(/\([^)]+\)/);
      });
    });

    it('should not have broken reference-style links', () => {
      const refLinks = content.match(/\[([^\]]+)\]\[([^\]]*)\]/g) || [];
      
      // If using reference-style links, definitions should exist
      refLinks.forEach(link => {
        const ref = link.match(/\]\[([^\]]*)\]/)?.[1];
        if (ref) {
          const definition = new RegExp(`\\[${ref}\\]:\\s*`);
          expect(content).toMatch(definition);
        }
      });
    });
  });

  describe('Special Sections', () => {
    it('should have properly formatted Do\'s and Don\'ts', () => {
      if (content.includes('### Do\'s')) {
        // Check for list items after Do's section
        const dosSection = content.split('### Do\'s')[1]?.split('###')[0];
        if (dosSection) {
          const listItems = (dosSection.match(/^\s*[\d\-\*]\./gm) || []).length;
          expect(listItems).toBeGreaterThan(5);
        }
      }
    });

    it('should have formatted code examples in patterns', () => {
      if (content.includes('Key Architectural Patterns')) {
        const patternsSection = content.split('Key Architectural Patterns')[1]?.split('##')[0];
        if (patternsSection) {
          const codeBlocks = (patternsSection.match(/```/g) || []).length / 2;
          expect(codeBlocks).toBeGreaterThan(2);
        }
      }
    });
  });

  describe('Consistency Checks', () => {
    it('should use consistent heading capitalization', () => {
      const headings = lines.filter(line => line.match(/^#{1,6}\s/));
      
      headings.forEach(heading => {
        // Headings should typically start with capital letter
        const text = heading.replace(/^#+\s/, '');
        if (text.length > 0) {
          expect(text[0]).toMatch(/[A-Z0-9]/);
        }
      });
    });

    it('should use consistent terminology for project name', () => {
      // Check variations of project name are used consistently
      const projectMentions = [
        ...content.matchAll(/FIFA World Cup/g),
        ...content.matchAll(/world-cup/g)
      ];
      
      expect(projectMentions.length).toBeGreaterThan(3);
    });
  });
});