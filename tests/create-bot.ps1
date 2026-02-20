param([string]$DslFile = "fashion-bot.dsl")

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "DSL Compiler" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

if (-not (Test-Path $DslFile)) {
    Write-Host "ERROR: File not found: $DslFile" -ForegroundColor Red
    exit 1
}

Write-Host "Compiling: $DslFile" -ForegroundColor Yellow
$dslContent = Get-Content -Path $DslFile -Raw

# Properly escape the DSL content for JSON
$escapedDsl = $dslContent `
    -replace '\\', '\\' `
    -replace '"', '\"' `
    -replace "`r", '\r' `
    -replace "`n", '\n' `
    -replace "`t", '\t'

# Create JSON string directly without ConvertTo-Json object serialization
$jsonBody = "{""dsl"":""$escapedDsl""}"

Write-Host "Sending request..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/compile" `
        -Method Post `
        -ContentType "application/json" `
        -Body $jsonBody `
        -ErrorAction Stop

    if ($response.success) {
        Write-Host "`n✅ SUCCESS!" -ForegroundColor Green
        Write-Host "Bot ID: $($response.bot_id)" -ForegroundColor Cyan
        Write-Host "Intents: $($response.stats.intents)" -ForegroundColor Cyan
        Write-Host "Keywords: $($response.stats.keywords)" -ForegroundColor Cyan
    } else {
        Write-Host "`n❌ FAILED!" -ForegroundColor Red
        Write-Host "Error: $($response.error)" -ForegroundColor Red
    }
}
catch {
    Write-Host "`n❌ ERROR:" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody"
    } else {
        Write-Host $_.Exception.Message
    }
}