/**
 * Embeddable Chat Widget
 * Version 1.0.0
 * 
 * Usage:
 * <script src="https://yourdomain.com/widget.js" data-bot-id="bot_abc123_xyz"></script>
 */
(function() {
  'use strict';

  // Get bot ID from script tag
  const script = document.currentScript;
  const botId = script.getAttribute('data-bot-id');
  
  if (!botId) {
    console.error('Chat Widget Error: data-bot-id attribute is required');
    return;
  }

  // Configuration
  const config = {
    apiUrl: window.location.origin.includes('localhost') 
      ? 'http://localhost:5000' 
      : window.location.origin,
    botId: botId,
    theme: {
      primaryColor: '#007bff',
      secondaryColor: '#6c757d',
      backgroundColor: '#ffffff',
      textColor: '#333333',
      userMessageColor: '#007bff',
      botMessageColor: '#f8f9fa'
    },
    position: 'right', // 'right' or 'left'
    offset: 20, // pixels from edge
    width: 350,
    height: 500,
    title: 'Chat Assistant',
    greeting: 'Hello! How can I help you today?',
    placeholder: 'Type your message...'
  };

  // State
  let isOpen = false;
  let sessionId = generateSessionId();

  // Generate unique session ID
  function generateSessionId() {
    return 'session_' + Math.random().toString(36).substring(2, 15);
  }

  // Create widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'chat-widget-container';
  widgetContainer.style.cssText = `
    position: fixed;
    ${config.position}: ${config.offset}px;
    bottom: ${config.offset}px;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  `;

  // Create chat button
  const chatButton = document.createElement('div');
  chatButton.id = 'chat-widget-button';
  chatButton.style.cssText = `
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: ${config.theme.primaryColor};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: transform 0.2s;
    font-size: 24px;
    margin-left: ${config.position === 'right' ? 'auto' : '0'};
  `;
  chatButton.innerHTML = '💬';
  chatButton.onmouseover = () => { chatButton.style.transform = 'scale(1.1)'; };
  chatButton.onmouseout = () => { chatButton.style.transform = 'scale(1)'; };

  // Create chat window
  const chatWindow = document.createElement('div');
  chatWindow.id = 'chat-widget-window';
  chatWindow.style.cssText = `
    position: absolute;
    bottom: 70px;
    ${config.position}: 0;
    width: ${config.width}px;
    height: ${config.height}px;
    background: ${config.theme.backgroundColor};
    border-radius: 12px;
    box-shadow: 0 5px 40px rgba(0,0,0,0.16);
    display: none;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgba(0,0,0,0.1);
  `;

  // Chat window HTML structure
  chatWindow.innerHTML = `
    <div style="
      background: ${config.theme.primaryColor};
      color: white;
      padding: 16px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
    ">
      <span>${config.title}</span>
      <span id="chat-close" style="cursor: pointer; font-size: 20px;">&times;</span>
    </div>
    
    <div id="chat-messages" style="
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background: #f5f5f5;
    ">
      <div style="
        display: flex;
        margin-bottom: 12px;
        justify-content: flex-start;
      ">
        <div style="
          background: ${config.theme.botMessageColor};
          color: ${config.theme.textColor};
          padding: 10px 14px;
          border-radius: 18px;
          max-width: 80%;
          font-size: 14px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        ">
          ${config.greeting}
        </div>
      </div>
    </div>
    
    <div style="
      padding: 16px;
      background: white;
      border-top: 1px solid #e0e0e0;
      display: flex;
      gap: 8px;
    ">
      <input
        id="chat-input"
        type="text"
        placeholder="${config.placeholder}"
        style="
          flex: 1;
          padding: 10px 14px;
          border: 1px solid #e0e0e0;
          border-radius: 24px;
          outline: none;
          font-size: 14px;
        "
      />
      <button
        id="chat-send"
        style="
          background: ${config.theme.primaryColor};
          color: white;
          border: none;
          border-radius: 24px;
          padding: 10px 20px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s;
        "
      >Send</button>
    </div>
  `;

  // Assemble widget
  widgetContainer.appendChild(chatWindow);
  widgetContainer.appendChild(chatButton);
  document.body.appendChild(widgetContainer);

  // Get elements
  const messagesDiv = chatWindow.querySelector('#chat-messages');
  const input = chatWindow.querySelector('#chat-input');
  const sendBtn = chatWindow.querySelector('#chat-send');
  const closeBtn = chatWindow.querySelector('#chat-close');

  // Toggle chat window
  chatButton.onclick = () => {
    isOpen = !isOpen;
    chatWindow.style.display = isOpen ? 'flex' : 'none';
    if (isOpen) {
      input.focus();
    }
  };

  closeBtn.onclick = () => {
    isOpen = false;
    chatWindow.style.display = 'none';
  };

  // Add message to chat
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      display: flex;
      margin-bottom: 12px;
      justify-content: ${sender === 'user' ? 'flex-end' : 'flex-start'};
    `;

    const bubble = document.createElement('div');
    bubble.style.cssText = `
      background: ${sender === 'user' ? config.theme.userMessageColor : config.theme.botMessageColor};
      color: ${sender === 'user' ? 'white' : config.theme.textColor};
      padding: 10px 14px;
      border-radius: 18px;
      max-width: 80%;
      font-size: 14px;
      word-wrap: break-word;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    `;
    bubble.textContent = text;

    messageDiv.appendChild(bubble);
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // Send message to server
  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    // Clear input
    input.value = '';

    // Add user message to chat
    addMessage(message, 'user');

    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.style.cssText = `
      display: flex;
      margin-bottom: 12px;
      justify-content: flex-start;
    `;
    typingDiv.innerHTML = `
      <div style="
        background: ${config.theme.botMessageColor};
        color: ${config.theme.textColor};
        padding: 10px 14px;
        border-radius: 18px;
        font-size: 14px;
      ">
        <span>.</span><span style="animation: typing 1.4s infinite;">.</span><span style="animation: typing 1.4s infinite 0.2s;">.</span>
      </div>
    `;
    messagesDiv.appendChild(typingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    try {
      const response = await fetch(`${config.apiUrl}/api/chat/${config.botId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          sessionId: sessionId
        })
      });

      // Remove typing indicator
      document.getElementById('typing-indicator')?.remove();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        addMessage(data.response, 'bot');
      } else {
        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
      }

    } catch (error) {
      // Remove typing indicator
      document.getElementById('typing-indicator')?.remove();
      console.error('Chat Error:', error);
      addMessage('Sorry, I\'m having trouble connecting. Please try again later.', 'bot');
    }
  }

  // Event listeners
  sendBtn.onclick = sendMessage;
  
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes typing {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }
    #chat-widget-button:hover {
      transform: scale(1.1);
    }
    #chat-send:hover {
      background: ${config.theme.primaryColor}dd !important;
    }
    #chat-input:focus {
      border-color: ${config.theme.primaryColor} !important;
    }
  `;
  document.head.appendChild(style);

  console.log(`Chat Widget initialized for bot: ${botId}`);
})();