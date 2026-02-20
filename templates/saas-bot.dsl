bot CloudServicesBot
domain saas
tone technical

welcome "Welcome to CloudTech Support! I'm your virtual assistant. How can I help you with our services today?"

intent pricing_plans
keywords: pricing plans cost subscription monthly :
response "Our pricing plans:
🚀 Starter: $29/month - 5 users, 10GB storage
💼 Professional: $99/month - 20 users, 100GB storage, API access
🏢 Enterprise: Custom pricing - Unlimited users, dedicated support, SLA
All plans include a 14-day free trial!"

intent technical_support
keywords: support help issue problem troubleshooting :
response "I can help with technical issues! Please specify:
1️⃣ What feature are you having trouble with?
2️⃣ When did the issue start?
3️⃣ Any error messages you're seeing?
For urgent issues, contact 24/7 support at support@cloudtech.com"

intent api_documentation
keywords: API documentation integration developer :
response "API Documentation:
📘 REST API: docs.cloudtech.com/api
📙 Webhooks: docs.cloudtech.com/webhooks
📕 SDKs: Python, JavaScript, Java, Ruby
🔑 API Keys: Dashboard → Settings → API
Rate limits: 1000 requests/hour for Professional plan"

intent account_billing
keywords: billing invoice payment receipt subscription :
response "Billing & Account Management:
💳 Update payment method: Dashboard → Billing
📄 Download invoices: Dashboard → History
⚙️ Cancel subscription: Dashboard → Settings
✉️ Billing questions: billing@cloudtech.com
Next billing date: Check your dashboard"

intent features
keywords: features capabilities what can do :
response "Key Features:
✨ Real-time analytics dashboard
✨ Automated reporting
✨ Team collaboration tools
✨ 99.9% uptime guarantee
✨ SOC2 Type II compliant
✨ 24/7 monitoring
✨ Custom integrations
✨ Mobile apps (iOS/Android)"

intent security
keywords: security encryption compliance GDPR SOC :
response "Security & Compliance:
🔒 End-to-end encryption (AES-256)
🔐 Two-factor authentication (2FA)
📋 SOC2 Type II certified
🌍 GDPR compliant
🏥 HIPAA available for Enterprise
✅ Regular security audits
🌐 Private cloud options available"

lead_capture name email company_name

fallback "I couldn't find an answer to your question. Would you like to:
1️⃣ Talk to our support team
2️⃣ Check our knowledge base at help.cloudtech.com
3️⃣ Schedule a demo with sales
Please reply with 1, 2, or 3"