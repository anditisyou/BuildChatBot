bot TechFlowSupportBot
domain saas
tone helpful

welcome "Welcome to TechFlow Support. How can I help?"

intent reset_password
keywords: password reset change forgot login
response "To reset your password: Go to login, click Forgot Password, check your email for reset link"

intent billing_inquiry  
keywords: bill invoice payment subscription
response "View invoices at Account -> Billing. Update payment method in Account -> Payment Methods"

intent api_error
keywords: error api failed broken issue  
response "Check status at status.techflow.com. Verify your API key is active. Review error logs in dashboard"

intent help_setup
keywords: setup install integrate connect configure
response "Go to Dashboard -> Integrations. Select your platform, authorize, configure webhooks, then test"

intent pricing_plans
keywords: pricing plan cost price upgrade feature
response "Starter: $9/mo with 10k API calls. Pro: $49/mo with 100k calls. Enterprise: Custom pricing with unlimited calls"

fallback "I can't help with that. Visit help.techflow.com or email support@techflow.com"
