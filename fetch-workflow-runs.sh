#!/bin/bash

# GitHub Actions Workflow Run Fetcher
# This script fetches GitHub Actions workflow runs and job details using the GitHub REST API
#
# Required Environment Variables:
#   GITHUB_TOKEN - GitHub Personal Access Token
#   GITHUB_REPO - Repository in format "owner/repo" (e.g., "owner/repo-name")
#   GITHUB_API_BASE - GitHub API base URL (default: https://api.github.com)
#
# Usage:
#   ./fetch-workflow-runs.sh current             # Fetch workflow runs for current commit
#   ./fetch-workflow-runs.sh pr <PR_NUMBER>      # Fetch workflow runs for PR
#   ./fetch-workflow-runs.sh sha <COMMIT_SHA>    # Fetch workflow runs for specific commit
#   ./fetch-workflow-runs.sh list                # List recent workflow runs
#   ./fetch-workflow-runs.sh jobs <RUN_ID>       # Get detailed job status for a workflow run
#   ./fetch-workflow-runs.sh logs <RUN_ID> <JOB_ID>  # Get logs for a specific job

set -e -o pipefail

# Validate environment variables
if [ -z "$GITHUB_TOKEN" ]; then
    echo "Error: GITHUB_TOKEN environment variable is required"
    exit 1
fi

if [ -z "$GITHUB_REPO" ]; then
    echo "Error: GITHUB_REPO environment variable is required"
    exit 1
fi

if [ -z "$GITHUB_API_BASE" ]; then
    GITHUB_API_BASE="https://api.github.com"
fi

# Common headers for GitHub API v3
HEADERS=(
    -H "Accept: application/vnd.github+json"
    -H "Authorization: Bearer $GITHUB_TOKEN"
    -H "X-GitHub-Api-Version: 2022-11-28"
)

# Function to get current commit SHA
get_current_sha() {
    local sha
    sha=$(git rev-parse HEAD 2>/dev/null)
    if [ -z "$sha" ]; then
        echo "Error: Not in a git repository" >&2
        exit 1
    fi
    echo "$sha"
}

# Function to get PR number for current branch
get_current_pr() {
    local branch
    branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
    if [ -z "$branch" ]; then
        echo "Error: Not in a git repository" >&2
        exit 1
    fi

    echo "Finding PR for branch: $branch" >&2

    # Use GitHub Search API with head:<branch> qualifier
    local query="repo:$GITHUB_REPO is:pr head:$branch"
    local encoded_query
    encoded_query=$(python3 -c "import urllib.parse, sys; print(urllib.parse.quote(sys.argv[1]))" "$query")

    # Search for the PR and get the most recently updated one
    local pr_data
    pr_data=$(curl -s -L "${HEADERS[@]}" \
        "$GITHUB_API_BASE/search/issues?q=$encoded_query&sort=updated&order=desc&per_page=1")

    # Safely parse the PR number from the JSON response
    local pr_number
    pr_number=$(python3 -c "
import json, sys
try:
    result = json.load(sys.stdin)
    if result.get('items'):
        print(result['items'][0]['number'])
except (json.JSONDecodeError, IndexError, KeyError):
    pass
" <<< "$pr_data")

    if [ -z "$pr_number" ]; then
        echo "Error: No PR found for branch '$branch'" >&2
        exit 1
    fi

    echo "$pr_number"
}

# Function to fetch workflow runs for a specific commit SHA
fetch_runs_by_sha() {
    local sha="$1"
    echo "=== Workflow Runs for commit: $sha ==="
    echo ""

    curl -s -L "${HEADERS[@]}" \
        "$GITHUB_API_BASE/repos/$GITHUB_REPO/actions/runs?head_sha=$sha" \
        | python3 -c "
import json, sys, datetime

try:
    data = json.load(sys.stdin)
    runs = data.get('workflow_runs', [])

    if not runs:
        print('No workflow runs found for this commit')
    else:
        for run in runs:
            name = run['name']
            status = run['status']
            conclusion = run.get('conclusion', 'N/A')
            run_id = run['id']
            url = run['html_url']
            created = run['created_at']
            updated = run.get('updated_at', 'N/A')

            # Status emoji
            if conclusion == 'success':
                emoji = '✅'
            elif conclusion == 'failure':
                emoji = '❌'
            elif conclusion == 'cancelled':
                emoji = '🚫'
            elif status == 'in_progress':
                emoji = '🔄'
            elif status == 'queued':
                emoji = '⏳'
            else:
                emoji = '⏭️'

            print(f'{emoji} Workflow: {name}')
            print(f'   Status: {status}')
            print(f'   Conclusion: {conclusion}')
            print(f'   Run ID: {run_id}')
            print(f'   Created: {created}')
            print(f'   Updated: {updated}')
            print(f'   URL: {url}')
            print('   ---')
except Exception as e:
    print(f'Error: {e}', file=sys.stderr)
    sys.exit(1)
"
}

# Function to fetch workflow runs for a PR
fetch_runs_by_pr() {
    local pr_number="$1"
    echo "=== Fetching workflow runs for PR #$pr_number ==="
    echo ""

    # First get the PR details to find the head SHA
    local pr_data
    pr_data=$(curl -s -L "${HEADERS[@]}" \
        "$GITHUB_API_BASE/repos/$GITHUB_REPO/pulls/$pr_number")

    local head_sha
    head_sha=$(python3 -c "
import json, sys
try:
    pr = json.load(sys.stdin)
    print(pr['head']['sha'])
except Exception as e:
    print(f'Error: {e}', file=sys.stderr)
    sys.exit(1)
" <<< "$pr_data")

    if [ -z "$head_sha" ]; then
        echo "Error: Could not fetch PR details" >&2
        exit 1
    fi

    echo "Head commit: $head_sha"
    echo ""

    fetch_runs_by_sha "$head_sha"
}

# Function to list recent workflow runs
list_recent_runs() {
    echo "=== Recent Workflow Runs (20 most recent) ==="
    echo ""

    curl -s -L "${HEADERS[@]}" \
        "$GITHUB_API_BASE/repos/$GITHUB_REPO/actions/runs?per_page=20" \
        | python3 -c "
import json, sys

try:
    data = json.load(sys.stdin)
    runs = data.get('workflow_runs', [])

    if not runs:
        print('No workflow runs found')
    else:
        for run in runs:
            name = run['name']
            status = run['status']
            conclusion = run.get('conclusion', 'N/A')
            run_id = run['id']
            branch = run['head_branch']
            sha = run['head_sha'][:7]
            created = run['created_at']

            # Status emoji
            if conclusion == 'success':
                emoji = '✅'
            elif conclusion == 'failure':
                emoji = '❌'
            elif conclusion == 'cancelled':
                emoji = '🚫'
            elif status == 'in_progress':
                emoji = '🔄'
            elif status == 'queued':
                emoji = '⏳'
            else:
                emoji = '⏭️'

            print(f'{emoji} [{name}] (ID: {run_id})')
            print(f'   Branch: {branch} ({sha})')
            print(f'   Status: {status} / {conclusion}')
            print(f'   Created: {created}')
            print()
except Exception as e:
    print(f'Error: {e}', file=sys.stderr)
    sys.exit(1)
"
}

# Function to get detailed job status for a workflow run
fetch_job_details() {
    local run_id="$1"
    echo "=== Job Details for Workflow Run #$run_id ==="
    echo ""

    curl -s -L "${HEADERS[@]}" \
        "$GITHUB_API_BASE/repos/$GITHUB_REPO/actions/runs/$run_id/jobs" \
        | python3 -c "
import json, sys

try:
    data = json.load(sys.stdin)
    jobs = data.get('jobs', [])

    if not jobs:
        print('No jobs found for this workflow run')
    else:
        for job in jobs:
            name = job['name']
            status = job['status']
            conclusion = job.get('conclusion', 'Running...')
            job_id = job['id']
            started = job.get('started_at', 'Not started')
            completed = job.get('completed_at', 'In progress')
            url = job['html_url']

            # Status emoji
            if conclusion == 'success':
                emoji = '✅'
            elif conclusion == 'failure':
                emoji = '❌'
            elif conclusion == 'cancelled':
                emoji = '🚫'
            elif conclusion == 'skipped':
                emoji = '⏭️'
            elif status == 'in_progress':
                emoji = '🔄'
            elif status == 'queued':
                emoji = '⏳'
            else:
                emoji = '❓'

            print(f'{emoji} Job: {name}')
            print(f'   Status: {status}')
            print(f'   Conclusion: {conclusion}')
            print(f'   Job ID: {job_id}')
            print(f'   Started: {started}')
            print(f'   Completed: {completed}')
            print(f'   URL: {url}')

            # Show step details
            steps = job.get('steps', [])
            if steps:
                print(f'   Steps:')
                for step in steps:
                    step_name = step['name']
                    step_status = step['status']
                    step_conclusion = step.get('conclusion', 'running')

                    if step_conclusion == 'success':
                        step_emoji = '  ✓'
                    elif step_conclusion == 'failure':
                        step_emoji = '  ✗'
                    elif step_status == 'in_progress':
                        step_emoji = '  ⋯'
                    else:
                        step_emoji = '  -'

                    print(f'     {step_emoji} {step_name} ({step_status})')

            print('   ---')
except Exception as e:
    print(f'Error: {e}', file=sys.stderr)
    sys.exit(1)
"
}

# Function to fetch logs for a specific job
fetch_job_logs() {
    local run_id="$1"
    local job_id="$2"

    echo "=== Fetching logs for Job #$job_id in Run #$run_id ==="
    echo ""

    # Download logs (they come as a zip file, so we need to handle that)
    curl -s -L "${HEADERS[@]}" \
        "$GITHUB_API_BASE/repos/$GITHUB_REPO/actions/jobs/$job_id/logs"
}

# Function to show help
show_help() {
    echo "Usage: $0 <command> [args]"
    echo ""
    echo "Commands:"
    echo "  current                    - Fetch workflow runs for current commit"
    echo "  pr <PR_NUMBER>            - Fetch workflow runs for a specific PR"
    echo "  sha <COMMIT_SHA>          - Fetch workflow runs for a specific commit"
    echo "  list                      - List 20 most recent workflow runs"
    echo "  jobs <RUN_ID>             - Get detailed job status for a workflow run"
    echo "  logs <RUN_ID> <JOB_ID>    - Get logs for a specific job"
    echo ""
    echo "Examples:"
    echo "  $0 current"
    echo "  $0 pr 76"
    echo "  $0 sha abc123def456"
    echo "  $0 list"
    echo "  $0 jobs 19194761348"
    echo "  $0 logs 19194761348 29876543210"
    echo ""
    echo "Environment variables required:"
    echo "  GITHUB_TOKEN     - GitHub Personal Access Token"
    echo "  GITHUB_REPO      - Repository in format 'owner/repo'"
    echo "  GITHUB_API_BASE  - GitHub API base URL (optional, defaults to https://api.github.com)"
}

# Main script logic
case "${1:-}" in
    current)
        SHA=$(get_current_sha)
        echo "Current commit: $SHA"
        echo ""
        fetch_runs_by_sha "$SHA"
        ;;
    pr)
        if [ -z "$2" ]; then
            echo "Error: PR number required"
            echo "Usage: $0 pr <PR_NUMBER>"
            exit 1
        fi
        fetch_runs_by_pr "$2"
        ;;
    sha)
        if [ -z "$2" ]; then
            echo "Error: commit SHA required"
            echo "Usage: $0 sha <COMMIT_SHA>"
            exit 1
        fi
        fetch_runs_by_sha "$2"
        ;;
    list)
        list_recent_runs
        ;;
    jobs)
        if [ -z "$2" ]; then
            echo "Error: run ID required"
            echo "Usage: $0 jobs <RUN_ID>"
            exit 1
        fi
        fetch_job_details "$2"
        ;;
    logs)
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo "Error: run ID and job ID required"
            echo "Usage: $0 logs <RUN_ID> <JOB_ID>"
            exit 1
        fi
        fetch_job_logs "$2" "$3"
        ;;
    help|--help|-h)
        show_help
        ;;
    "")
        show_help
        exit 1
        ;;
    *)
        echo "Error: Invalid command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
