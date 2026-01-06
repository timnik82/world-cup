#!/bin/bash
set -euo pipefail

# Fetch up-to-date documentation using Context7 API
#
# Usage:
#   ./scripts/search-docs-online.sh "next.js" "ssr"
#   ./scripts/search-docs-online.sh "@sentry/nextjs" "withSentryConfig"
#   ./scripts/search-docs-online.sh "react" "useState"

# Check for required dependencies
if ! command -v curl &> /dev/null; then
  echo "❌ Error: curl is not installed"
  echo "Please install curl to use this script:"
  echo "  - Ubuntu/Debian: sudo apt-get install curl"
  echo "  - macOS: brew install curl"
  echo "  - Fedora: sudo dnf install curl"
  exit 1
fi

if ! command -v jq &> /dev/null; then
  echo "❌ Error: jq is not installed"
  echo "Please install jq to use this script:"
  echo "  - Ubuntu/Debian: sudo apt-get install jq"
  echo "  - macOS: brew install jq"
  echo "  - Fedora: sudo dnf install jq"
  exit 1
fi

if [ $# -lt 1 ]; then
  echo "Usage: $0 <package> [topic]"
  echo ""
  echo "Examples:"
  echo "  $0 'next.js' 'ssr'"
  echo "  $0 '@sentry/nextjs' 'withSentryConfig'"
  echo "  $0 'react' 'useState'"
  echo ""
  echo "Required: Set CONTEXT7_API_KEY environment variable"
  exit 1
fi

PACKAGE="$1"
TOPIC="${2:-}"
PAGE="${3:-1}"
LIMIT="${4:-10}"

# Check for API key
if [ -z "${CONTEXT7_API_KEY:-}" ]; then
  echo "❌ Error: CONTEXT7_API_KEY environment variable is not set"
  echo ""
  echo "To use this script, you need a Context7 API key."
  echo "Set it with: export CONTEXT7_API_KEY='your_api_key_here'"
  echo ""
  echo "Get your API key from: https://context7.com"
  exit 1
fi

echo "🔍 Searching Context7 for: $PACKAGE"
echo ""

# Step 1: Search for the library (with URL encoding)
SEARCH_RESPONSE=$(curl -s --fail --max-time 30 -G "https://context7.com/api/v2/search" \
  --data-urlencode "query=${PACKAGE}" \
  -H "Authorization: Bearer ${CONTEXT7_API_KEY}" 2>&1) || {
  echo "❌ Search request failed (network error or timeout)"
  echo "Please check your internet connection and try again."
  exit 1
}

# Validate JSON response
if ! echo "$SEARCH_RESPONSE" | jq -e . >/dev/null 2>&1; then
  echo "❌ Search failed: Invalid JSON response from server"
  echo "Response: $SEARCH_RESPONSE"
  exit 1
fi

# Check if search returned an error
if echo "$SEARCH_RESPONSE" | jq -e '.error' >/dev/null 2>&1; then
  echo "❌ Search failed:"
  echo "$SEARCH_RESPONSE" | jq -r '.error'
  exit 1
fi

# Get the number of results
RESULT_COUNT=$(echo "$SEARCH_RESPONSE" | jq -r '.results | length')

if [ "$RESULT_COUNT" -eq 0 ]; then
  echo "❌ No results found for '$PACKAGE'"
  exit 1
fi

echo "📚 Found $RESULT_COUNT libraries:"
echo ""

# Display search results
echo "$SEARCH_RESPONSE" | jq -r '.results[] |
  "  ID: \(.id)",
  "  Title: \(.title)",
  "  Description: \(.description)",
  "  Stars: \(.stars)",
  "  Trust Score: \(.trustScore)",
  "  Last Updated: \(.lastUpdateDate)",
  "  Snippets: \(.totalSnippets)",
  "  ---"
'

# Get the best match (first result with highest trust score)
LIBRARY_ID=$(echo "$SEARCH_RESPONSE" | jq -r '[.results[] | select(.trustScore > 0)] | sort_by(-.trustScore) | .[0].id // .results[0].id')

if [ -z "$LIBRARY_ID" ] || [ "$LIBRARY_ID" = "null" ]; then
  echo "❌ Could not determine library ID"
  exit 1
fi

# Remove leading slash if present
LIBRARY_ID="${LIBRARY_ID#/}"

echo ""
echo "📖 Fetching documentation for: $LIBRARY_ID"
if [ -n "$TOPIC" ]; then
  echo "   Topic: $TOPIC"
fi
echo ""

# Step 2: Fetch documentation (with URL encoding for topic)
# Use curl with proper URL encoding (avoiding eval for security)
if [ -n "$TOPIC" ]; then
  DOCS_RESPONSE=$(curl -s --fail --max-time 30 -G "https://context7.com/api/v2/docs/info/${LIBRARY_ID}" \
    --data-urlencode "type=json" \
    --data-urlencode "page=${PAGE}" \
    --data-urlencode "limit=${LIMIT}" \
    --data-urlencode "topic=${TOPIC}" \
    -H "Authorization: Bearer ${CONTEXT7_API_KEY}" 2>&1) || {
    echo "❌ Documentation fetch failed (network error or timeout)"
    echo "Please check your internet connection and try again."
    exit 1
  }
else
  DOCS_RESPONSE=$(curl -s --fail --max-time 30 -G "https://context7.com/api/v2/docs/info/${LIBRARY_ID}" \
    --data-urlencode "type=json" \
    --data-urlencode "page=${PAGE}" \
    --data-urlencode "limit=${LIMIT}" \
    -H "Authorization: Bearer ${CONTEXT7_API_KEY}" 2>&1) || {
    echo "❌ Documentation fetch failed (network error or timeout)"
    echo "Please check your internet connection and try again."
    exit 1
  }
fi

# Validate JSON response
if ! echo "$DOCS_RESPONSE" | jq -e . >/dev/null 2>&1; then
  echo "❌ Documentation fetch failed: Invalid JSON response from server"
  echo "Response: $DOCS_RESPONSE"
  exit 1
fi

# Check if docs fetch returned an error
if echo "$DOCS_RESPONSE" | jq -e '.error' >/dev/null 2>&1; then
  echo "❌ Documentation fetch failed:"
  echo "$DOCS_RESPONSE" | jq -r '.error'
  exit 1
fi

# Display documentation snippets
SNIPPET_COUNT=$(echo "$DOCS_RESPONSE" | jq -r '.snippets | length')

if [ "$SNIPPET_COUNT" -eq 0 ]; then
  echo "❌ No documentation snippets found"
  if [ -n "$TOPIC" ]; then
    echo "   Try without topic filter or use a different topic"
  fi
  exit 1
fi

echo "📄 Documentation Snippets:"
echo ""

echo "$DOCS_RESPONSE" | jq -r '.snippets[] |
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "📍 \(.breadcrumb)",
  "🔗 \(.pageId)",
  "",
  "\(.content)",
  ""
'

# Display pagination info
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Summary:"
echo "$DOCS_RESPONSE" | jq -r '
  "  Total Tokens: \(.totalTokens)",
  "  Page: \(.pagination.page) of \(.pagination.totalPages)",
  "  Limit: \(.pagination.limit)",
  "  Has Next: \(.pagination.hasNext)",
  "  Has Previous: \(.pagination.hasPrev)"
'

# Show next page hint
HAS_NEXT=$(echo "$DOCS_RESPONSE" | jq -r '.pagination.hasNext')
if [ "$HAS_NEXT" = "true" ]; then
  NEXT_PAGE=$((PAGE + 1))
  echo ""
  echo "💡 To see more results, run:"
  if [ -n "$TOPIC" ]; then
    echo "   $0 '$PACKAGE' '$TOPIC' $NEXT_PAGE"
  else
    echo "   $0 '$PACKAGE' '' $NEXT_PAGE"
  fi
fi

echo ""
