bot GraFestBot
domain saas
tone friendly

welcome "Welcome to GraFest support! I'm here to help you explore events and find the perfect program. What are you looking for this year?"

intent check_order
keywords: order status tracking delivery shipped
response "I can help you track your order! Please provide your order number (starts with 'GF-') and I'll check the status for you."

intent size_guide
keywords: size measurements fit chart guide
response "Merch Size Guide:
T-Shirts: S(34-36), M(38-40), L(42-44), XL(46-48)
Hoodies: S(36-38), M(40-42), L(44-46), XL(48-50)
Accessories: One Size Fits Most
For detailed sizing, visit: grafest.com/size-guide"

fallback "I'm sorry, I didn't understand that. Could you please rephrase or choose one of the available options?"