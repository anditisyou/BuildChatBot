# quick-test.ps1
Write-Host "Quick Test" -ForegroundColor Cyan

$testDsl = @"
bot QuickBot
domain education
welcome "Hello"
intent test
keywords: test
response "OK"
fallback "Sorry"
"@

$body = @{dsl = $testDsl} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/compile" -Method Post -ContentType "application/json" -Body $body
    if ($response.success) {
        Write-Host "✅ Server is working!" -ForegroundColor Green
        Write-Host "Bot ID: $($response.bot_id)"
    } else {
        Write-Host "❌ Error: $($response.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Cannot connect to server. Is it running?" -ForegroundColor Red
}