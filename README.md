# 🚀 DSL Chatbot Platform

A production-ready chatbot platform that allows users to define chatbots using a custom Domain-Specific Language (DSL), compile them into optimized JSON configurations, and deploy them instantly with a beautiful embeddable widget.
https://buildchatbot.onrender.com

## ✨ Features

- **Custom DSL Compiler**: Define chatbots with a simple, intuitive DSL
- **MongoDB Storage**: Persistent storage with connection pooling
- **Runtime Engine**: Optimized message matching with multiple strategies
- **Embeddable Widget**: Beautiful, responsive chat widget for any website
- **Web Dashboard**: Compile and manage bots through a web interface
- **REST API**: Full CRUD operations for bot management
- **Production Ready**: Error handling, validation, rate limiting, and logging

## 🏗️ Architecture

```
DSL → Compiler → JSON → MongoDB
                    ↓
Widget ← API ← Runtime Engine
```

### Components

- **Compiler Pipeline**: Lexer → Parser → Semantic Analyzer → IR Generator
- **Runtime Engine**: Message matching with keyword indexing and trie-based search
- **API Layer**: RESTful endpoints with validation and error handling
- **Frontend**: Vanilla JS widget + HTML dashboard

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dsl-chatbot-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Copy and edit .env
   cp .env.example .env
   ```

   Edit `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/dsl_chatbot
   DB_NAME=dsl_chatbot
   PORT=5000
   NODE_ENV=production
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open the dashboard**
   ```
   http://localhost:5000
   ```

## 📝 DSL Syntax

Define your chatbot using our custom DSL:

```dsl
bot MyChatbot
domain ecommerce
tone friendly

welcome "Hello! How can I help you today?"

intent product_search
keywords: shirts pants dresses shoes
response "Great choice! What size are you looking for?"

intent order_status
keywords: order status tracking
response "Please provide your order number."

fallback "I'm sorry, I didn't understand. Can you rephrase?"
```

### DSL Reference

- `bot <name>`: Bot name
- `domain <type>`: ecommerce, education, saas
- `tone <style>`: friendly, formal, professional
- `welcome "<message>"`: Welcome message
- `intent <name>`: Define an intent
- `keywords: word1 word2`: Keywords for matching
- `response "<message>"`: Bot response
- `fallback "<message>"`: Default response

## 🔌 API Endpoints

### Compile DSL
```http
POST /api/compile
Content-Type: application/json

{
  "dsl": "bot MyBot\ndomain ecommerce..."
}
```

### Chat with Bot
```http
POST /api/chat/{botId}
Content-Type: application/json

{
  "message": "Hello"
}
```

### Get Bot Info
```http
GET /api/bot/{botId}
```

### List All Bots
```http
GET /api/bots
```

### Delete Bot
```http
DELETE /api/bot/{botId}
```

### Health Check
```http
GET /api/health
```

## 🎨 Embedding the Widget

Add this script tag to your website:

```html
<script src="https://yourdomain.com/widget.js" data-bot-id="bot_abc123"></script>
```

## 🧪 Testing

### Using the Web Interface

1. Visit `http://localhost:5000`
2. Paste DSL code in the left panel
3. Click "Compile Bot"
4. Copy the embed code and use the bot ID

### Using cURL

```bash
# Compile a bot
curl -X POST http://localhost:5000/api/compile \
  -H "Content-Type: application/json" \
  -d '{
    "dsl": "bot TestBot\ndomain ecommerce\ntone friendly\nwelcome \"Hello!\"\nintent greet\nkeywords: hello hi\nresponse \"Hi there!\"\nfallback \"Sorry\""
  }'

# Chat with the bot
  ## Deploying to Render
  Follow these steps to deploy on Render (https://render.com):

  1. Remove any committed secrets from the repository (run locally):

    ```bash
    git rm --cached .env || true
    git commit -m "Remove local .env from repo"
    ```

  2. Ensure `.env` is listed in `.gitignore` (already configured).

  3. Create a new Web Service on Render and connect your Git repository.

  4. In the Render service settings, set the following Environment variables:

    - `MONGODB_URI` : your MongoDB connection string
    - `DB_NAME` : database name (e.g. `dsl_chatbot`)
    - `NODE_ENV` : `production`
    - `JWT_SECRET` : a secure random string
    - `REDIS_URL` : (optional) Redis connection string

  5. Leave the build command as `npm install` and the start command as `npm start`, or use the provided `render.yaml` or `Dockerfile` for Docker-based deploys.

  6. Optional: Use the included `Dockerfile` for a containerized deployment on Render (recommended for consistent runtime).

  7. After deployment, check the health endpoint at `https://<your-service>.onrender.com/api/health`.

curl -X POST http://localhost:5000/api/chat/bot_abc123 \
  -H "Content-Type: application/json" \
  -d '{"message": "hello"}'
```

## 🏃 Development

```bash
# Development mode with auto-restart
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## 📁 Project Structure

```
├── src/
│   ├── compiler/          # DSL Compiler Pipeline
│   │   ├── index.js       # Compiler facade
│   │   ├── lexer.js       # Lexical analysis
│   │   ├── parser.js      # Syntax analysis
│   │   ├── semantic.js    # Semantic validation
│   │   └── ir.js          # IR generation
│   ├── engine/            # Runtime Engine
│   │   ├── runtime.js     # Runtime manager
│   │   └── matcher.js     # Message matching
│   ├── storage/           # Database Layer
│   │   ├── mongodb.repository.js  # MongoDB operations
│   │   ├── cache.js       # Runtime cache
│   │   └── initDb.js      # Database setup
│   ├── api/               # API Layer
│   │   ├── routes.js      # Route definitions
│   │   ├── controllers/   # Request handlers
│   │   └── middleware/    # Express middleware
│   ├── errors/            # Error classes
│   └── server.js          # Main server file
├── public/                # Static assets
│   ├── index.html         # DSL Editor UI
│   └── widget.js          # Chat widget
├── tests/                 # Test files and examples
├── templates/             # DSL templates
├── .env                   # Environment variables
├── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `DB_NAME`: Database name
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

### MongoDB Indexes

The system automatically creates optimized indexes:
- `{ user_id: 1, bot_id: 1 }` (unique)
- `{ user_id: 1, created_at: -1 }`

## 🚀 Deployment

### Docker

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Setup

For production:
- Set `NODE_ENV=production`
- Use a production MongoDB instance
- Configure proper logging
- Set up monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Author

Vaishnavi Khandelwal

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- Documentation: [Link]
- Issues: [GitHub Issues]
- Email: support@example.com

---

Built with ❤️ using Node.js, Express, MongoDB, and vanilla JavaScript.
