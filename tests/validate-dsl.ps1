# validate-dsl.ps1 - Completely fixed version
param([string]$DslFile = "fixed-bot.dsl")

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "DSL Validator" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Check if file exists
if (-not (Test-Path $DslFile)) {
    Write-Host "ERROR: File not found: $DslFile" -ForegroundColor Red
    Write-Host ""
    Write-Host "Creating a sample file for you..." -ForegroundColor Yellow
    
    # Create a sample file
    $sampleContent = @"
bot SampleBot
domain education
welcome "Hello"
intent test
keywords: test
response "Working"
fallback "Sorry"
"@
    $sampleContent | Out-File -FilePath $DslFile -Encoding UTF8
    Write-Host "✅ Created sample $DslFile" -ForegroundColor Green
}

# Read the file
Write-Host "Validating: $DslFile" -ForegroundColor Yellow
Write-Host ""

$content = Get-Content -Path $DslFile -Raw
$lines = $content -split "`r`n|`n"
$lineNumber = 0
$validationErrors = @()

# Check each line
foreach ($line in $lines) {
    $lineNumber++
    $trimmed = $line.Trim()
    
    # Skip empty lines
    if ($trimmed -eq "") { continue }
    
    # Rule 1: Check for trailing colon in keywords (most common error)
    if ($trimmed -match "^keywords:" -and $trimmed -match ":$") {
        $validationErrors += "Line $lineNumber`: Keywords has trailing colon - remove the ':' at the end"
        Write-Host "  ✗ Line $lineNumber`: $trimmed" -ForegroundColor Red
        Write-Host "    Should be: $($trimmed -replace ':$', '')" -ForegroundColor Green
    }
    
    # Rule 2: Check for colon after bot/domain/tone
    if ($trimmed -match "^(bot|domain|tone):") {
        $parts = $trimmed -split ":"
        $validationErrors += "Line $lineNumber`: Remove colon after '$($parts[0])'"
        Write-Host "  ✗ Line $lineNumber`: $trimmed" -ForegroundColor Red
        Write-Host "    Should be: $($parts[0]) $($parts[1].Trim())" -ForegroundColor Green
    }
    
    # Rule 3: Check responses have quotes
    if ($trimmed -match "^response\s+" -and $trimmed -notmatch '^response\s+".*"$') {
        $validationErrors += "Line $lineNumber`: Response must be in double quotes"
        Write-Host "  ✗ Line $lineNumber`: $trimmed" -ForegroundColor Red
        Write-Host "    Should be: response ""your message here""" -ForegroundColor Green
    }
    
    # Rule 4: Check welcome has quotes
    if ($trimmed -match "^welcome\s+" -and $trimmed -notmatch '^welcome\s+".*"$') {
        $validationErrors += "Line $lineNumber`: Welcome message must be in double quotes"
        Write-Host "  ✗ Line $lineNumber`: $trimmed" -ForegroundColor Red
        Write-Host "    Should be: welcome ""your message here""" -ForegroundColor Green
    }
    
    # Rule 5: Check fallback has quotes
    if ($trimmed -match "^fallback\s+" -and $trimmed -notmatch '^fallback\s+".*"$') {
        $validationErrors += "Line $lineNumber`: Fallback message must be in double quotes"
        Write-Host "  ✗ Line $lineNumber`: $trimmed" -ForegroundColor Red
        Write-Host "    Should be: fallback ""your message here""" -ForegroundColor Green
    }
}

# Summary
Write-Host ""
if ($validationErrors.Count -eq 0) {
    Write-Host "✅ VALIDATION PASSED! No syntax errors found." -ForegroundColor Green
    
    # Count intents
    $intentCount = 0
    foreach ($line in $lines) {
        if ($line -match "^intent\s+") {
            $intentCount++
        }
    }
    Write-Host "📊 Found $intentCount intent(s)" -ForegroundColor Yellow
    
    # Check required sections
    $hasBot = $false
    $hasDomain = $false
    $hasWelcome = $false
    $hasFallback = $false
    
    foreach ($line in $lines) {
        if ($line -match "^bot\s+") { $hasBot = $true }
        if ($line -match "^domain\s+") { $hasDomain = $true }
        if ($line -match "^welcome\s+") { $hasWelcome = $true }
        if ($line -match "^fallback\s+") { $hasFallback = $true }
    }
    
    if (-not $hasBot) { Write-Host "⚠️  Missing: bot name" -ForegroundColor Yellow }
    if (-not $hasDomain) { Write-Host "⚠️  Missing: domain" -ForegroundColor Yellow }
    if (-not $hasWelcome) { Write-Host "⚠️  Missing: welcome message" -ForegroundColor Yellow }
    if (-not $hasFallback) { Write-Host "⚠️  Missing: fallback message" -ForegroundColor Yellow }
    if ($intentCount -eq 0) { Write-Host "⚠️  Missing: at least one intent" -ForegroundColor Yellow }
    
} else {
    Write-Host "❌ VALIDATION FAILED! Found $($validationErrors.Count) error(s):" -ForegroundColor Red
    foreach ($err in $validationErrors) {
        Write-Host "  • $err" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Cyan