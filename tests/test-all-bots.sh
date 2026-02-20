#!/bin/bash
# test-all-bots.sh

for bot in templates/*.dsl; do
    echo "Testing $bot..."
    DSL=$(cat "$bot")
    
    RESPONSE=$(curl -s -X POST http://localhost:5000/api/compile \
      -H "Content-Type: application/json" \
      -d "{\"dsl\": \"$DSL\"}")
    
    if echo "$RESPONSE" | grep -q "success\":true"; then
        echo "✅ $bot compiled successfully"
    else
        echo "❌ $bot failed:"
        echo "$RESPONSE"
    fi
done