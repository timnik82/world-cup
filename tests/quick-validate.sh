#!/bin/bash

# Quick validation script for CLAUDE.md
# Runs basic checks without requiring npm dependencies

echo "🔍 Quick Validation of CLAUDE.md"
echo "================================"
echo ""

CLAUDE_FILE="../CLAUDE.md"
ERRORS=0

# Check 1: File exists
echo -n "✓ Checking file exists... "
if [ ! -f "$CLAUDE_FILE" ]; then
    echo "❌ FAILED: CLAUDE.md not found"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ PASSED"
fi

# Check 2: Code blocks are properly closed
echo -n "✓ Checking code block closure... "
CODE_BLOCKS=$(grep -c '```' "$CLAUDE_FILE")
if [ $((CODE_BLOCKS % 2)) -ne 0 ]; then
    echo "❌ FAILED: Unmatched code blocks (found $CODE_BLOCKS backticks)"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ PASSED ($((CODE_BLOCKS / 2)) code blocks)"
fi

# Check 3: TOC exists
echo -n "✓ Checking Table of Contents... "
if ! grep -q "## Table of Contents" "$CLAUDE_FILE"; then
    echo "❌ FAILED: No Table of Contents found"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ PASSED"
fi

# Check 4: Major sections exist
echo "✓ Checking major sections..."
SECTIONS=("Project Overview" "Codebase Structure" "Technology Stack" "Development Workflows" "Testing Strategy")
for section in "${SECTIONS[@]}"; do
    echo -n "  - $section... "
    if ! grep -q "## $section" "$CLAUDE_FILE"; then
        echo "❌ MISSING"
        ERRORS=$((ERRORS + 1))
    else
        echo "✅"
    fi
done

# Check 5: File references
echo "✓ Checking file references..."
FILES=("package.json" "tsconfig.json" "vite.config.ts" "tailwind.config.ts")
for file in "${FILES[@]}"; do
    if grep -q "$file" "$CLAUDE_FILE"; then
        echo -n "  - $file... "
        if [ -f "../$file" ]; then
            echo "✅ EXISTS"
        else
            echo "❌ REFERENCED BUT MISSING"
            ERRORS=$((ERRORS + 1))
        fi
    fi
done

# Check 6: Directory references
echo "✓ Checking directory references..."
DIRS=("client/src" "server" "shared" "script")
for dir in "${DIRS[@]}"; do
    if grep -q "$dir" "$CLAUDE_FILE"; then
        echo -n "  - $dir... "
        if [ -d "../$dir" ]; then
            echo "✅ EXISTS"
        else
            echo "❌ REFERENCED BUT MISSING"
            ERRORS=$((ERRORS + 1))
        fi
    fi
done

# Check 7: npm scripts mentioned
echo "✓ Checking npm scripts..."
SCRIPTS=("dev" "build" "start" "check" "lint")
for script in "${SCRIPTS[@]}"; do
    echo -n "  - npm run $script... "
    if ! grep -q "npm run $script" "$CLAUDE_FILE"; then
        echo "⚠️ NOT DOCUMENTED"
    elif ! grep -q "\"$script\":" ../package.json; then
        echo "❌ DOCUMENTED BUT NOT IN package.json"
        ERRORS=$((ERRORS + 1))
    else
        echo "✅"
    fi
done

# Check 8: Headers have consistent formatting
echo -n "✓ Checking header formatting... "
BAD_HEADERS=$(grep -E '^#{1,6}[^ ]' "$CLAUDE_FILE" | wc -l)
if [ "$BAD_HEADERS" -gt 0 ]; then
    echo "⚠️ WARNING: $BAD_HEADERS headers missing space after #"
else
    echo "✅ PASSED"
fi

# Check 9: Last updated date
echo -n "✓ Checking last updated date... "
if ! grep -qE "Last Updated.*[0-9]{4}-[0-9]{2}-[0-9]{2}" "$CLAUDE_FILE"; then
    echo "⚠️ WARNING: No last updated date found"
else
    echo "✅ PASSED"
fi

# Summary
echo ""
echo "================================"
if [ $ERRORS -eq 0 ]; then
    echo "✨ All checks passed! ($ERRORS errors)"
    exit 0
else
    echo "❌ Validation failed with $ERRORS error(s)"
    exit 1
fi