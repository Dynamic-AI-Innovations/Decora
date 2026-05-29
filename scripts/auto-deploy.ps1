#requires -Version 5.1
<#
.SYNOPSIS
    Auto-deploys staged + unstaged changes to the Decora GitHub repo.

.DESCRIPTION
    Fired by Claude Code's Stop hook after every assistant turn.
    Only acts if there are real changes — silent and idempotent otherwise.

    Hook contract:
      - Runs from $env:CLAUDE_PROJECT_DIR (the project root).
      - Must exit 0 even if nothing was committed.
      - Must NOT prompt or block on credentials.
#>

$ErrorActionPreference = 'Continue'

if ($env:CLAUDE_PROJECT_DIR) {
    Set-Location $env:CLAUDE_PROJECT_DIR
}

if (-not (Test-Path '.git')) {
    exit 0
}

# Stage everything (.gitignore filters secrets, node_modules, etc.)
git add -A 2>&1 | Out-Null

# Check if anything is actually staged. `git diff --cached --quiet` exits:
#   0 = no diff (nothing to commit)
#   1 = diff present
git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
    exit 0
}

$timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm'
$msg = @"
auto: claude session updates ($timestamp)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
"@

git commit -m $msg 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[auto-deploy] commit failed (exit $LASTEXITCODE) — leaving changes staged."
    exit 0
}

git push 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[auto-deploy] push failed (exit $LASTEXITCODE) — commit landed locally; run 'git push' when ready."
    exit 0
}

Write-Host "[auto-deploy] pushed $(git rev-parse --short HEAD) to origin."
exit 0
