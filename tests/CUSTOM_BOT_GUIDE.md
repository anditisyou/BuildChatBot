# DSL Chatbot Platform - Custom Bot Creation Guide

## Overview
The DSL (Domain Specific Language) system allows you to create chatbots by writing simple text files following a specific format. Each bot responds to user queries based on **intents** (what the user wants) and **keywords** (words that trigger those intents).

---

## Core Bot Structure

Every bot DSL file must have this structure:

```
bot YourBotName
domain DOMAIN
tone TONE

welcome "Your welcome message"

intent intent_name
keywords: keyword1 keyword2 keyword3
response "Response message"

[more intents...]

fallback "Default message when no intent matches"
```

---

## 1. Bot Definition
**Syntax**: `bot BotName`
- Defines your bot's name
- Name must be a single word or CamelCase (e.g., `SupportBot`, `ShoppingAssistant`)
- Must be the first line in your DSL file

**Example**:
```
bot CustomerSupportBot
```

---

## 2. Domain (Required - Pick ONE)
**Syntax**: `domain DOMAIN_NAME`

Only these three domains are supported:
- **education** - University, school, course-related bots
- **ecommerce** - Shopping, fashion, retail bots
- **saas** - Software as a service, technical support, API help bots

**Examples**:
```
domain education      # For school admissions bot
domain ecommerce      # For online shop bot
domain saas          # For tech support bot
```

---

## 3. Tone (Optional)
**Syntax**: `tone TONE`

Common tone values: `professional`, `friendly`, `helpful`, `casual`, `formal`

**Examples**:
```
tone friendly        # Conversational, casual
tone professional    # Formal, business-like
tone helpful         # Clear and supportive
```

---

## 4. Welcome Message (Required)
**Syntax**: `welcome "Your message here"`

The first message shown to users when they start chatting.

**Examples**:
```
welcome "Hi! Welcome to our store. How can I help you shop today?"
welcome "Hello! I'm here to answer questions about our university."
welcome "Welcome to TechFlow Support. What do you need help with?"
```

---

## 5. Intents (The Core - At least 1 required)

An **intent** is something the user wants to do. Each intent has:
- A name (what is this intent for?)
- Keywords (words that trigger this intent)
- A response (what the bot says when the intent is triggered)

**Syntax**:
```
intent intent_name
keywords: keyword1 keyword2 keyword3
response "Response message"
```

### 5.1 Intent Name
- Single word or simple identifier: `reset_password`, `check_order`, `return_policy`
- Describes the user's goal

### 5.2 Keywords
- **Purpose**: User messages containing these words trigger this intent
- **Format**: List words after `keywords:` (no trailing colon)
- **Example**: `keywords: password reset change forgot`
  - Will match: "I forgot my password", "How do I reset?", "change password"
- **Tip**: Use 3-6 related keywords per intent

### 5.3 Response
- **Purpose**: What the bot says when this intent is triggered
- **Format**: A quoted string with the bot's answer
- **Can span multiple lines**: Yes!
- **Can use formatting**: Line breaks, simple text formatting

---

## 6. Fallback Message (Required)
**Syntax**: `fallback "Message when no intent matches"`

When a user's message doesn't match any keywords, the fallback response is shown.

**Example**:
```
fallback "I'm not sure about that. Please visit our help page at help.example.com"
```

---

## Complete Example: University Bot 

```
bot UniversityAdmissionsBot
domain education
tone professional

welcome "Welcome to State University Admissions! How can I help?"

intent requirements
keywords: requirements admission eligibility criteria
response "To apply, you need:
- High school diploma/GED
- GPA 3.0 or higher
- SAT score 1200+ or ACT 25+
- Letter of recommendation"

intent deadlines
keywords: deadline due date apply when
response "Important dates:
- Early Action: Nov 1
- Regular: Jan 15
- Financial Aid: Mar 1"

intent tuition
keywords: cost tuition fees price
response "2024-2025 Tuition:
- In-state: $12,500/year
- Out-of-state: $28,000/year
- Room & board: $10,000/year"

intent campus_tour
keywords: tour visit campus schedule
response "Schedule a tour at university.edu/visit
Available: Mon-Fri 10am & 2pm, Sat 11am"

fallback "For more info, email admissions@university.edu or call 555-123-4567"
```

---

## Complete Example: E-commerce Bot

```
bot OnlineShopBot
domain ecommerce
tone friendly

welcome "Welcome to our store! What would you like to shop for today?"

intent product_search
keywords: shirts pants shoes dresses jacket
response "Great! I can help you find the perfect item. What size and color are you looking for?"

intent check_order
keywords: order status tracking delivery where
response "To check your order:
1. Go to Account > Orders
2. Enter your order number
3. See real-time tracking"

intent returns
keywords: return refund exchange policy
response "30-day free returns if items are unworn with tags. Start at store.com/returns"

intent payment
keywords: payment credit card PayPal Apple Pay
response "We accept all major credit cards, PayPal, Apple Pay, and Google Pay"

intent shipping
keywords: shipping delivery free how much cost
response "Free shipping on orders over $50! Standard delivery 3-5 days. Express 1-2 days available."

fallback "I'm not sure. Check our FAQ at store.com/help or email support@store.com"
```

---

## Complete Example: SaaS Support Bot

```
bot TechFlowSupportBot
domain saas
tone helpful

welcome "Welcome to TechFlow Support. How can I help?"

intent reset_password
keywords: password reset forgot login change
response "To reset your password: Go to login page, click Forgot Password, check email for reset link"

intent api_error
keywords: error api failed broken not working
response "Check status.techflow.com for outages. Verify your API key is active. Review error logs in dashboard"

intent billing
keywords: billing invoice payment subscription bill
response "View invoices at Account > Billing. Update payment method in Account > Payment Settings"

intent setup
keywords: setup install integrate connect webhook
response "Go to Dashboard > Integrations. Select platform, authorize, configure webhooks, test connection"

intent pricing
keywords: pricing plan cost upgrade features
response "Starter $9/mo (10k API calls). Pro $49/mo (100k calls). Enterprise custom pricing with unlimited calls."

fallback "Visit documentation at docs.techflow.com or email support@techflow.com for more help"
```

---

## How to Compile Your Bot

### Option 1: PowerShell Script (Windows)
```powershell
cd D:\Projects\CD\tests
.\create-bot.ps1 -DslFile "your-bot.dsl"
```

### Option 2: Direct API Call
```powershell
$dsl = Get-Content -Raw "your-bot.dsl"
$json = "{""dsl"":""$($dsl -replace '\', '\\' -replace '"', '\"' -replace "`r", '\r' -replace "`n", '\n'  )""}"
Invoke-RestMethod -Uri "http://localhost:5000/api/compile" -Method Post -ContentType "application/json" -Body $json
```

---

## Important Rules

✅ **DO**:
- Use one intent per bot goal
- List 3-6 keywords per intent
- Keep responses clear and helpful
- Use simple, ASCII-friendly text
- Start with lowercase for intent names

❌ **DON'T**:
- Use emoji or special unicode characters (causes parse errors)
- Add trailing colons after keywords: `keywords: word1 word2 :` ❌
- Use domains other than education, ecommerce, saas
- Leave out welcome or fallback messages
- Make responses too long (keep under 500 chars per response)

---

## Testing Your Bot

After compilation, you get:
- **Bot ID**: Unique identifier for your bot
- **Intents**: Count of intents defined
- **Keywords**: Total keywords across all intents

**Example output**:
```
✅ SUCCESS!
Bot ID: bot_9b713855_mlpicej5
Intents: 5
Keywords: 25
```

---

## Quick Start: Create Your First Bot

1. **Choose a Domain**: What is your bot for?
   - University Q&A → `domain education`
   - Product recommendations → `domain ecommerce`
   - Tech support → `domain saas`

2. **Define 3-5 Intents**: What questions will users ask?
   - For education: requirements, deadlines, tuition, admissions
   - For e-commerce: product search, orders, returns, shipping
   - For SaaS: password reset, billing, errors, setup, pricing

3. **Add Keywords**: What words signal each intent?
   - Intent: "billing" → Keywords: "invoice bill payment cost"
   - Intent: "shipping" → Keywords: "delivery when arrive how long"

4. **Write Responses**: What should the bot say?
   - Keep it helpful and concise
   - Can include multiple lines
   - Avoid emoji and special characters

5. **Save as .dsl**: `my-bot.dsl`

6. **Compile**: `.\create-bot.ps1 -DslFile "my-bot.dsl"`

7. **Deploy**: Use the returned Bot ID to embed in your website

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| `Invalid domain` | Domain not education/ecommerce/saas | Change to one of the three |
| Empty response error | Emoji in text | Remove all emoji, use plain text |
| Syntax error | Extra colon after keywords | Change `keyword1 keyword2 :` to `keyword1 keyword2` |
| No intents compiled | Missing required intent/keywords | Ensure each intent has keywords and response |

---

## Next Steps

- Modify `custom-bot-template.dsl` in `/tests` directory
- Create multiple bots for different purposes
- Test user messages against your keywords
- Add more intents based on common questions
- Deploy bot using the Bot ID

Happy bot building! 🤖
