#!/bin/bash

echo "Testing compilation with correct DSL..."

# Run compilation and capture the response
COMPILE_RESPONSE=$(curl -s -X POST http://localhost:5000/api/compile \
  -H "Content-Type: application/json" \
  -d '{
    "dsl": "bot AdmissionsBot\ndomain education\ntone formal\n\nwelcome \"Welcome!\"\n\nintent fees\nkeywords: fee tuition\nresponse \"$10k\"\n\nfallback \"Sorry\""
  }')

# Pretty print the compilation response
echo "$COMPILE_RESPONSE" | python -m json.tool 2>/dev/null || echo "$COMPILE_RESPONSE"

# Extract bot_id using grep and sed (works on Windows/Git Bash)
BOT_ID=$(echo "$COMPILE_RESPONSE" | grep -o '"bot_id":"[^"]*"' | sed 's/"bot_id":"//;s/"//')

if [ -z "$BOT_ID" ]; then
    echo "Failed to extract bot_id from response"
    exit 1
fi

echo -e "\n✅ Bot compiled successfully with ID: $BOT_ID"
echo -e "\n📁 Checking storage/bots.json..."
cat storage/bots.json | python -m json.tool 2>/dev/null || cat storage/bots.json

echo -e "\n\n🤖 Testing chat with bot ID: $BOT_ID"

# Test chat with the actual bot ID
CHAT_RESPONSE=$(curl -s -X POST http://localhost:5000/api/chat/$BOT_ID \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the fee?"}')

echo -e "\n📨 Chat Response:"
echo "$CHAT_RESPONSE" | python -m json.tool 2>/dev/null || echo "$CHAT_RESPONSE"

# Test another message
echo -e "\n\n📨 Testing another message..."
CHAT_RESPONSE2=$(curl -s -X POST http://localhost:5000/api/chat/$BOT_ID \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about tuition"}')

echo "$CHAT_RESPONSE2" | python -m json.tool 2>/dev/null || echo "$CHAT_RESPONSE2"

# Test fallback
echo -e "\n\n📨 Testing fallback message..."
CHAT_RESPONSE3=$(curl -s -X POST http://localhost:5000/api/chat/$BOT_ID \
  -H "Content-Type: application/json" \
  -d '{"message": "random message"}')

echo "$CHAT_RESPONSE3" | python -m json.tool 2>/dev/null || echo "$CHAT_RESPONSE3"