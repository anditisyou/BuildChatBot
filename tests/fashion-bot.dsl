bot FashionStoreBot
domain ecommerce
tone friendly

welcome "Welcome to FashionHub! I'm here to help you find the perfect outfit. What are you looking for today?"

intent check_order
keywords: order status tracking delivery shipped
response "I can help you track your order! Please provide your order number (starts with 'FH-') and I'll check the status for you."

intent size_guide
keywords: size measurements fit chart guide
response "Size Guide:
Shirts: S(34-36), M(38-40), L(42-44), XL(46-48)
Pants: 28-32 (Small), 33-36 (Medium), 37-40 (Large)
Dresses: 0-2 (XS), 4-6 (S), 8-10 (M), 12-14 (L)
For exact measurements, visit: fashionhub.com/size-guide"

fallback "I'm sorry, I didn't understand that. Please try again."
