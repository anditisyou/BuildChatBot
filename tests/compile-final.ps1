# compile-final.ps1 - Simplified working version
param(
    [string]$DslFile = "fashion-bot.dsl",
    [string]$ServerUrl = "http://localhost:5000"
)

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "DSL Compiler" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Check if file exists
if (-not (Test-Path $DslFile)) {
    Write-Host "ERROR: File not found: $DslFile" -ForegroundColor Red
    exit 1
}

# Read the file
Write-Host "Reading: $DslFile" -ForegroundColor Yellow
$dslContent = Get-Content -Path $DslFile -Raw

# Show the DSL content
Write-Host "`nDSL Content:" -ForegroundColor Yellow
Write-Host "-------------------"
Write-Host $dslContent
Write-Host "-------------------`n"

# Check for trailing colons in keywords (common error)
if ($dslContent -match "keywords:.*:`n") {
    Write-Host "⚠️  WARNING: Found trailing colon in keywords!" -ForegroundColor Red
    Write-Host "   Please remove the colon at the end of keywords lines" -ForegroundColor Red
    Write-Host "   Example: keywords: hello hi (correct)" -ForegroundColor Green
    Write-Host "   Not: keywords: hello hi : (wrong)" -ForegroundColor Red
}

# Create JSON payload - simple and reliable
$body = @{
    dsl = $dslContent
}

$jsonBody = $body | ConvertTo-Json

Write-Host "Sending to server..." -ForegroundColor Yellow

try {
    # Send request
    $response = Invoke-RestMethod -Uri "$ServerUrl/api/compile" `
        -Method Post `
        -ContentType "application/json" `
        -Body $jsonBody

    # Show response
    if ($response.success) {
        Write-Host "`n✅ SUCCESS!" -ForegroundColor Green
        Write-Host "Bot ID: $($response.bot_id)" -ForegroundColor Cyan
        Write-Host "Intents: $($response.stats.intents)" -ForegroundColor Cyan
        Write-Host "Keywords: $($response.stats.keywords)" -ForegroundColor Cyan
        Write-Host "`nEmbed Script:" -ForegroundColor Yellow
        Write-Host $response.embed_script
        
        # Save bot ID
        $response.bot_id | Out-File -FilePath "last_bot_id.txt"
        Write-Host "`nBot ID saved to last_bot_id.txt" -ForegroundColor Green
    } else {
        Write-Host "`n❌ COMPILATION FAILED!" -ForegroundColor Red
        Write-Host "Error: $($response.error)" -ForegroundColor Red
    }
}
catch {
    Write-Host "`n❌ ERROR:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Cyan