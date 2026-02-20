bot FashionStoreBot
domain ecommerce
tone friendly

welcome "👋 Welcome to FashionHub! I'm here to help you find the perfect outfit. What are you looking for today?"

intent product_search
keywords: shirts pants dresses shoes jeans jacket hoodie :
response "Great choice! We have several options. Let me help you narrow it down:
👉 What size are you looking for? (S, M, L, XL)
👉 What's your budget range?
👉 Any specific color preference?"

intent check_order
keywords: order status tracking delivery shipped :
response "I can help you track your order! Please provide your order number (starts with 'FH-') and I'll check the status for you."

intent return_policy
keywords: return refund exchange policy :
response "Our return policy:
🔄 30-day free returns
🔄 Items must be unworn with tags
🔄 Free return shipping
🔄 Refund processed within 5-7 business days
Start a return at: fashionhub.com/returns"

intent size_guide
keywords: size measurements fit chart guide :
response "Size Guide:
👕 Shirts: S(34-36), M(38-40), L(42-44), XL(46-48)
👖 Pants: 28-32 (Small), 33-36 (Medium), 37-40 (Large)
👗 Dresses: 0-2 (XS), 4-6 (S), 8-10 (M), 12-14 (L)
For exact measurements, visit: fashionhub.com/size-guide"

intent payment_methods
keywords: payment pay credit card PayPal method :
response "We accept:
💳 All major credit cards (Visa, MasterCard, American Express)
🅿️ PayPal
🍎 Apple Pay
📱 Google Pay
🛍️ Afterpay (4 interest-free payments)
All payments are secure and encrypted!"

intent shipping_info
keywords: shipping delivery cost free express :
response "Shipping Options:
🚚 Standard (3-5 days): $4.99 or FREE on orders over $50
⚡ Express (1-2 days): $12.99
📦 Next Day: $24.99
International shipping available to 50+ countries!"

lead_capture name email

fallback "I'm not sure about that. Would you like to speak with a human representative? Type 'talk to agent' or visit our help center at fashionhub.com/help"