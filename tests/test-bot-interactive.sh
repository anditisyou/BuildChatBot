#!/bin/bash

echo "🤖 DSL Chatbot Tester"
echo "====================="

# Compile bot
echo "Enter your DSL code (press Ctrl+D when done):"
DSL=$(cat)

echo "Compiling bot..."
COMPILE_RESPONSE=$(curl -s -X POST http://localhost:5000/api/compile \
  -H "Content-Type: application/json" \
  -d "{\"dsl\": \"$DSL\"}")

BOT_ID=$(echo "$COMPILE_RESPONSE" | grep -o '"bot_id":"[^"]*"' | sed 's/"bot_id":"//;s/"//')

if [ -z "$BOT_ID" ]; then
    echo "Compilation failed:"
    echo "$COMPILE_RESPONSE"
    exit 1
fi

echo "✅ Bot compiled! ID: $BOT_ID"
echo "📝 Start chatting (type 'quit' to exit)"

# Interactive chat loop
while true; do
    echo -n "You: "
    read MESSAGE
    
    if [ "$MESSAGE" = "quit" ]; then
        break
    fi
    
    RESPONSE=$(curl -s -X POST http://localhost:5000/api/chat/$BOT_ID \
      -H "Content-Type: application/json" \
      -d "{\"message\": \"$MESSAGE\"}")
    
    BOT_RESPONSE=$(echo "$RESPONSE" | grep -o '"response":"[^"]*"' | sed 's/"response":"//;s/"//')
    
    if [ -n "$BOT_RESPONSE" ]; then
        echo "Bot: $BOT_RESPONSE"
    else
        echo "Bot: Error - $(echo "$RESPONSE" | grep -o '"error":"[^"]*"')"
    fi
done