/* Embeddable Chat Widget (clean SaaS-ready)
 * - Reads optional `data-api-url` from the script tag
 * - Falls back to script src origin when not provided
 * - No use of window.location.origin to avoid embedding-site fallbacks
 */
(function(){
  'use strict';

  const script = document.currentScript || (function(){
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length-1];
  })();

  const botId = script && script.getAttribute('data-bot-id');
  const dataApiUrl = script && script.getAttribute('data-api-url');

  if (!botId) {
    console.error('Chat Widget Error: data-bot-id attribute is required');
    return;
  }

  // Resolve API URL with priority:
  // 1) data-api-url attribute
  // 2) origin of the widget script src (e.g. https://buildchatbot.onrender.com)
  // 3) explicit localhost fallback if script src cannot be parsed (development)
  let resolvedApiUrl = null;
  if (dataApiUrl && dataApiUrl.trim()) resolvedApiUrl = dataApiUrl.trim().replace(/\/+$/,'');

  if (!resolvedApiUrl) {
    try {
      const src = script && script.src;
      if (src) {
        const u = new URL(src, window.location.href);
        resolvedApiUrl = u.origin;
      }
    } catch (e) {
      // ignore
    }
  }

  if (!resolvedApiUrl) {
    // Last-resort: localhost (development)
    resolvedApiUrl = 'http://localhost:5000';
  }

  const config = {
    apiUrl: resolvedApiUrl,
    botId: botId,
    theme: {
      primaryColor: '#007bff',
      backgroundColor: '#ffffff',
      textColor: '#333333',
      userMessageColor: '#007bff',
      botMessageColor: '#f1f5f9'
    },
    position: 'right',
    offset: 20,
    width: 350,
    height: 500,
    title: 'Chat Assistant',
    greeting: 'Hello! How can I help you today?',
    placeholder: 'Type your message...'
  };

  let isOpen = false;
  let sessionId = 'session_' + Math.random().toString(36).substring(2,15);

  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'chat-widget-container';
  widgetContainer.style.cssText = `position: fixed; ${config.position}: ${config.offset}px; bottom: ${config.offset}px; z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;`;

  const chatButton = document.createElement('div');
  chatButton.id = 'chat-widget-button';
  chatButton.style.cssText = `width:60px;height:60px;border-radius:50%;background-color:${config.theme.primaryColor};color:white;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:transform .2s;font-size:24px;`;
  chatButton.innerHTML = '💬';
  chatButton.onmouseover = ()=> chatButton.style.transform = 'scale(1.1)';
  chatButton.onmouseout = ()=> chatButton.style.transform = 'scale(1)';

  const chatWindow = document.createElement('div');
  chatWindow.id = 'chat-widget-window';
  chatWindow.style.cssText = `position:absolute;bottom:70px;${config.position}:0;display:none;flex-direction:column;width:${config.width}px;height:${config.height}px;background:${config.theme.backgroundColor};border-radius:12px;box-shadow:0 5px 40px rgba(0,0,0,0.16);overflow:hidden;border:1px solid rgba(0,0,0,0.08);`;

  chatWindow.innerHTML = `
    <div style="background:${config.theme.primaryColor};color:#fff;padding:12px 16px;font-weight:600;display:flex;justify-content:space-between;align-items:center;">
      <span>${config.title}</span>
      <span id="chat-close" style="cursor:pointer;font-size:20px;">&times;</span>
    </div>
    <div id="chat-messages" style="flex:1;padding:16px;overflow-y:auto;background:#f8fafc;">
      <div style="display:flex;margin-bottom:12px;justify-content:flex-start;"><div style="background:${config.theme.botMessageColor};color:${config.theme.textColor};padding:10px 14px;border-radius:18px;max-width:80%;font-size:14px;">${config.greeting}</div></div>
    </div>
    <div style="padding:12px;background:#fff;border-top:1px solid #e6e6e6;display:flex;gap:8px;">
      <input id="chat-input" type="text" placeholder="${config.placeholder}" style="flex:1;padding:10px 14px;border:1px solid #e6e6e6;border-radius:24px;outline:none;font-size:14px;" />
      <button id="chat-send" style="background:${config.theme.primaryColor};color:#fff;border:none;border-radius:24px;padding:10px 16px;cursor:pointer;font-size:14px;font-weight:500;">Send</button>
    </div>
  `;

  widgetContainer.appendChild(chatWindow);
  widgetContainer.appendChild(chatButton);
  document.body.appendChild(widgetContainer);

  const messagesDiv = chatWindow.querySelector('#chat-messages');
  const input = chatWindow.querySelector('#chat-input');
  const sendBtn = chatWindow.querySelector('#chat-send');
  const closeBtn = chatWindow.querySelector('#chat-close');

  chatButton.onclick = ()=>{ isOpen = !isOpen; chatWindow.style.display = isOpen ? 'flex' : 'none'; if(isOpen) input.focus(); };
  closeBtn.onclick = ()=>{ isOpen = false; chatWindow.style.display = 'none'; };

  function addMessage(text, sender){
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `display:flex;margin-bottom:12px;justify-content:${sender==='user'?'flex-end':'flex-start'}`;
    const bubble = document.createElement('div');
    bubble.style.cssText = `background:${sender==='user'?config.theme.userMessageColor:config.theme.botMessageColor};color:${sender==='user'?'#fff':config.theme.textColor};padding:10px 14px;border-radius:18px;max-width:80%;font-size:14px;word-wrap:break-word;box-shadow:0 1px 2px rgba(0,0,0,0.05);`;
    bubble.textContent = text;
    messageDiv.appendChild(bubble);
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  async function sendMessage(){
    const message = input.value.trim(); if(!message) return; input.value=''; addMessage(message,'user');
    const typingDiv = document.createElement('div'); typingDiv.id='typing-indicator'; typingDiv.style.cssText='display:flex;margin-bottom:12px;justify-content:flex-start;'; typingDiv.innerHTML = `<div style="background:${config.theme.botMessageColor};color:${config.theme.textColor};padding:10px 14px;border-radius:18px;font-size:14px;">...</div>`; messagesDiv.appendChild(typingDiv); messagesDiv.scrollTop = messagesDiv.scrollHeight;

    try{
      const resp = await fetch(`${config.apiUrl.replace(/\/$/,'')}/api/chat/${config.botId}`, {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message, sessionId })
      });
      document.getElementById('typing-indicator')?.remove();
      if(!resp.ok){ addMessage('Sorry, I encountered an error. Please try again.','bot'); return; }
      const data = await resp.json();
      if(data && data.success && data.response) addMessage(data.response,'bot'); else if(data && data.response) addMessage(String(data.response),'bot'); else addMessage('Sorry, I had no reply.','bot');
    }catch(err){ document.getElementById('typing-indicator')?.remove(); console.error('Chat Error:',err); addMessage('Sorry, I\'m having trouble connecting. Please try again later.','bot'); }
  }

  sendBtn.onclick = sendMessage;
  input.addEventListener('keypress', (e)=>{ if(e.key==='Enter') sendMessage(); });

  const style = document.createElement('style');
  style.textContent = `@keyframes typing{0%,100%{opacity:.3}50%{opacity:1}} #chat-widget-button:hover{transform:scale(1.1)} #chat-send:hover{background:${config.theme.primaryColor}dd!important} #chat-input:focus{border-color:${config.theme.primaryColor}!important}`;
  document.head.appendChild(style);

  console.log(`Chat Widget initialized for bot: ${botId} (api: ${config.apiUrl})`);
})();
