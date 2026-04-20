
        const dslInput = document.getElementById('dsl-input');
        const compileBtn = document.getElementById('compile-btn');
        const resultArea = document.getElementById('result-area');
        const botInfo = document.getElementById('bot-info');
        const botIdSpan = document.getElementById('bot-id');
        const embedCodeDiv = document.getElementById('embed-code');
        const exampleBtns = document.querySelectorAll('.example-btn');

        // Example DSL templates
        const examples = {
            ecommerce: `bot FashionStore
domain ecommerce
tone friendly

welcome "👋 Welcome to FashionHub! I'm here to help you find the perfect outfit. What are you looking for today?"

intent product_search
keywords: shirts pants dresses shoes jeans jacket hoodie
response "Great choice! We have several options. Let me help you narrow it down:
👉 What size are you looking for? (S, M, L, XL)
👉 What's your budget range?
👉 Any specific color preference?"

intent check_order
keywords: order status tracking delivery shipped
response "I can help you track your order! Please provide your order number (starts with 'FH-') and I'll check the status for you."

intent return_policy
keywords: return refund exchange policy
response "Our return policy allows returns within 30 days of purchase. Items must be unused with original tags. We'll process your refund within 5-7 business days after receiving the item."

fallback "I'm sorry, I didn't understand your request. You can ask me about products, orders, or our return policy. How else can I help you?"`,

            education: `bot AdmissionsBot
domain education
tone formal

welcome "Welcome to University Admissions! I'm here to help you with information about our programs and application process."

intent program_info
keywords: programs courses degrees majors
response "We offer Bachelor's and Master's degrees in Computer Science, Business, Engineering, and Liberal Arts. Which program interests you most?"

intent application_deadline
keywords: deadline apply application when
response "Our application deadlines are:
- Fall semester: March 15th
- Spring semester: November 1st
- Summer semester: April 1st

Don't miss out!"

intent tuition_fees
keywords: cost tuition fees price
response "Our tuition rates are:
- Undergraduate: $25,000 per year
- Graduate: $30,000 per year

Financial aid and scholarships are available for eligible students."

fallback "I'm sorry, I don't have information about that. Please contact our admissions office at admissions@university.edu or call (555) 123-4567."`,

            saas: `bot SupportBot
domain saas
tone professional

welcome "Hello! Welcome to TechCorp Support. How can I assist you with our platform today?"

intent account_setup
keywords: setup account create login register
response "To set up your account:
1. Visit app.techcorp.com/signup
2. Enter your email and create a password
3. Verify your email address
4. Complete your profile

Need help with any of these steps?"

intent billing_issue
keywords: bill payment charge invoice subscription
response "For billing questions:
- View invoices in your account dashboard
- Update payment methods in Settings > Billing
- Contact billing@techcorp.com for disputes

What specific billing issue are you experiencing?"

intent feature_request
keywords: feature request suggest improvement
response "We love hearing feature suggestions! Please submit them through:
- Our feedback form in the app
- Email: features@techcorp.com
- Our community forum

Your input helps us improve!"

fallback "I'm sorry, I don't have information about that. Please check our help center at help.techcorp.com or contact support@techcorp.com for assistance."`
        };

        // Load example DSL
        exampleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const example = btn.dataset.example;
                dslInput.value = examples[example];
            });
        });

        // Compile DSL
        compileBtn.addEventListener('click', async () => {
            const dsl = dslInput.value.trim();

            if (!dsl) {
                showResult('Please enter DSL code to compile.', 'error');
                return;
            }

            // Show loading state
            compileBtn.disabled = true;
            compileBtn.innerHTML = '<span class="loading"></span>Compiling...';

            try {
                const response = await fetch('/api/compile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ dsl })
                });

                const text = await response.text();
                let data;

                try {
                    data = text ? JSON.parse(text) : {};
                } catch (parseError) {
                    throw new Error(`Invalid JSON response from server: ${parseError.message}\n${text}`);
                }

                if (!response.ok) {
                    const errorMessage = data.error || `Server error ${response.status}`;
                    throw new Error(errorMessage);
                }

                if (data.success) {
                    showResult(`✅ Compilation successful!\n\n📊 Stats:\n- Tokens: ${data.stats.tokens}\n- Intents: ${data.stats.intents}\n- Keywords: ${data.stats.keywords}`, 'success');

                    // Show bot info
                    botIdSpan.textContent = data.bot_id;
                    embedCodeDiv.textContent = `<script src="/widget.js" data-bot-id="${data.bot_id}"><\/script>`;
                    botInfo.classList.add('show');
                } else {
                    showResult(`❌ Compilation failed:\n${data.error || 'Unknown error'}`, 'error');
                    botInfo.classList.remove('show');
                }

            } catch (error) {
                showResult(`❌ Request error: ${error.message}`, 'error');
                botInfo.classList.remove('show');
            } finally {
                // Reset button
                compileBtn.disabled = false;
                compileBtn.textContent = '⚡ Compile Bot';
            }
        });

        function showResult(message, type) {
            resultArea.textContent = message;
            resultArea.className = `result-area ${type}`;
        }

        // Auto-resize textarea
        dslInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    