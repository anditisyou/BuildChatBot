# test-working.ps1 - Ultra simple test
Write-Host "Simple Test" -ForegroundColor Cyan

# Simple DSL without any special characters
$simpleDsl = @"
bot TestBot
domain education
welcome "Hello"
intent test
keywords: test
response "Working"
fallback "Sorry"
"@

# Create JSON manually
$json = "{`"dsl`":`"$($simpleDsl -replace '"', '\"' -replace "`r`n", '\n' -replace "`n", '\n')`"}"

Write-Host "Sending: $json" -ForegroundColor Yellow

try {
    $response = curl.exe -s -X POST http://localhost:5000/api/compile `
        -H "Content-Type: application/json" `
        -d $json
    
    Write-Host "Response: $response" -ForegroundColor Green
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}