# GitHub API Integration Guide

This guide provides instructions and examples for interacting with the GitHub REST API within this project.

## Authentication

All API requests require a GitHub Personal Access Token (PAT).

1.  **Generate a Token**: Go to GitHub Settings -> Developer settings -> Personal access tokens.
2.  **Required Scopes**: `repo` (for private repositories) or `public_repo` (for public repositories).
3.  **Configure Secret**: Add the token to Replit Secrets as `GITHUB_TOKEN`.

## Environment Variables

The following environment variables are used by the scripts:

- `GITHUB_TOKEN`: Your GitHub Personal Access Token.
- `GITHUB_REPO`: The repository in "owner/repo" format (e.g., `timnik82/world-cup`).
- `GITHUB_API_BASE`: The API base URL (defaults to `https://api.github.com`).

## Helper Scripts

### 1. Fetching PR Feedback

The `fetch-pr-feedback.sh` script retrieves all types of feedback for a Pull Request:
- PR metadata and description
- General comments
- Line-specific review comments

```bash
# Fetch feedback for a specific PR
./fetch-pr-feedback.sh <PR_NUMBER>

# Fetch feedback for the PR of the current branch
./fetch-pr-feedback.sh current
```

### 2. Searching Pull Requests

```bash
# List 20 most recent PRs
./fetch-pr-feedback.sh list

# Search PRs by branch name (local search)
./fetch-pr-feedback.sh search <term>

# Search PRs using GitHub Search API (comprehensive)
./fetch-pr-feedback.sh api-search <term>
```

## Manual API Usage Examples

### Get PR Details

```bash
curl -s -L \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "$GITHUB_API_BASE/repos/$GITHUB_REPO/pulls/$PR_NUMBER"
```

### Get Review Comments

```bash
curl -s -L \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "$GITHUB_API_BASE/repos/$GITHUB_REPO/pulls/$PR_NUMBER/comments"
```

## API Rate Limits

GitHub API has rate limits:
- **Authenticated requests**: 5,000 requests per hour
- **Unauthenticated requests**: 60 requests per hour

Check your current status:
```bash
curl -s -L -H "Authorization: Bearer $GITHUB_TOKEN" "$GITHUB_API_BASE/rate_limit"
```

## Best Practices

1.  **Always use a token**: Never make unauthenticated requests.
2.  **Handle rate limits**: Check the `X-RateLimit-Remaining` header.
3.  **Use the scripts**: For finding PRs, use the provided `fetch-pr-feedback.sh` search commands.

## References

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [Pull Request Comments API](https://docs.github.com/en/rest/pulls/comments)
- [Search API](https://docs.github.com/en/rest/search)
- [Authentication Guide](https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api)

## Quick Reference for AI Assistants

When asked to fetch PR feedback:
1.  **Use the script**: `./fetch-pr-feedback.sh <PR_NUMBER>`
2.  **Analyze**: Look for review comments and general feedback.
3.  **Implement**: Apply fixes based on the feedback provided.
