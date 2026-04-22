// app.js - externalized from index.html to satisfy CSP (no inline scripts)
(function() {
  // ---------- DOM elements ----------
  const dslEditor = document.getElementById('dsl-editor');
  const runBtn = document.getElementById('run-compile');
  const outputArea = document.getElementById('output-area');
  const botSuccessCard = document.getElementById('bot-success-card');
  const botIdSpan = document.getElementById('bot-id-display');
  const embedCodeSpan = document.getElementById('embed-code-text');
  const copyBtn = document.getElementById('copy-embed-btn');
  const resetExampleBtn = document.getElementById('reset-example');
  const demoInput = document.getElementById('demo-chat-input');
  const demoSend = document.getElementById('demo-chat-send');
  const demoBotMsgSpan = document.getElementById('demo-bot-message');
  const demoUserMsgSpan = document.getElementById('demo-user-message');
  const compileTimestamp = document.getElementById('compile-timestamp');

  let currentBotId = null;

  function setTimestamp() {
    if (compileTimestamp) {
      const now = new Date();
      compileTimestamp.innerText = `last run ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
    }
  }

  async function runCompilation() {
    const dsl = dslEditor.value.trim();
    if (!dsl) {
      outputArea.innerText = `⛔ compilation failed: DSL cannot be empty. Write some intents.`;
      botSuccessCard.classList.add('hidden');
      currentBotId = null;
      setTimestamp();
      return;
    }

    runBtn.disabled = true;
    const originalBtnText = runBtn.innerText;
    runBtn.innerText = 'compiling...';
    outputArea.innerText = `⚙️ sending DSL to backend...`;
    botSuccessCard.classList.add('hidden');
    currentBotId = null;

    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dsl })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || `Server error ${response.status}`);
      }

      currentBotId = data.bot_id;
      outputArea.innerText = `✓ compilation successful\n` +
        `──────────────────────────────\n` +
        `bot id        : ${data.bot_id}\n` +
        `intents       : ${data.stats.intents}\n` +
        `keywords      : ${data.stats.keywords}\n` +
        `tokens        : ${data.stats.tokens}\n` +
        `──────────────────────────────\n` +
        `embed code ready below.`;

      botIdSpan.innerText = data.bot_id;
      const origin = window.location.origin;
      const defaultEmbed = `<script src="${origin}/widget.js" data-bot-id="${data.bot_id}"><\/script>`;
      embedCodeSpan.innerText = data.embed_script
        ? data.embed_script.replace(/src="\/widget\.js"/, `src="${origin}/widget.js"`)
        : defaultEmbed;
      botSuccessCard.classList.remove('hidden');
    } catch (err) {
      outputArea.innerText = `⛔ compilation failed: ${err.message}`;
      botSuccessCard.classList.add('hidden');
      currentBotId = null;
    } finally {
      runBtn.disabled = false;
      runBtn.innerText = originalBtnText;
      setTimestamp();
    }
  }

  copyBtn.addEventListener('click', async () => {
    const code = embedCodeSpan.innerText;
    try {
      await navigator.clipboard.writeText(code);
      const original = copyBtn.innerText;
      copyBtn.innerText = 'copied!';
      setTimeout(() => { copyBtn.innerText = original; }, 1200);
    } catch (e) {
      alert('copy manually: ' + code);
    }
  });

  function resetToDemo() {
    dslEditor.value = `bot AdmissionsBot\ndomain education\ntone witty\n\nwelcome "Namaste 🙏 Mai Chintu hoon, pooch kya chahiye?"\n\nintent fees\nkeywords: fee tuition kitna paisa\nresponse "Simple hai bhai, 1.2 lakh 😎 full semester ka. EMI bhi hai, tension mat le!"\n\nintent courses\nkeywords: course program degree btech mba\nresponse "BCA, B.Tech CSE, MBA — sab hai. Zara website check kar ya mujhse puchh!"\n\nfallback "Arre, Chintu samjha nahi 😅 Fir se likh, ya contact admin kar!"`;
    outputArea.innerText = '💤 Ready. Write DSL and click "Run".';
    botSuccessCard.classList.add('hidden');
    currentBotId = null;
    setTimestamp();
  }

  async function sendBotMessage(userText) {
    if (!userText.trim()) return;

    demoUserMsgSpan.innerText = userText;
    demoInput.value = '';

    if (!currentBotId) {
      updateDemoChat(userText);
      return;
    }

    demoBotMsgSpan.innerText = 'Typing...';

    try {
      const response = await fetch(`/api/chat/${currentBotId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userText })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || `Server error ${response.status}`);
      }
      demoBotMsgSpan.innerText = data.response;
    } catch (err) {
      demoBotMsgSpan.innerText = 'Sorry, I could not reach the bot backend.';
      console.error(err);
    }
  }

  function updateDemoChat(userText) {
    const lower = userText.toLowerCase();
    if (lower.includes('fee') || lower.includes('paise') || lower.includes('kitna')) {
      demoBotMsgSpan.innerText = 'Simple hai bhai, 1.2 lakh 😎 EMI bhi available hai!';
    } else if (lower.includes('course') || lower.includes('program')) {
      demoBotMsgSpan.innerText = 'BCA, B.Tech, MBA, sab kuch hai bhai! Zara website dekh.';
    } else if (lower.includes('help') || lower.includes('assist')) {
      demoBotMsgSpan.innerText = 'Main Chintu hoon, DSL likh aur custom bot bana.';
    } else {
      demoBotMsgSpan.innerText = 'Arre, DSL likh ke apna bot bana, phir main asli jawab dunga 😜';
    }
  }

  demoSend.addEventListener('click', () => {
    if (demoInput.value.trim()) sendBotMessage(demoInput.value);
  });
  demoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (demoInput.value.trim()) sendBotMessage(demoInput.value);
    }
  });

  // attach listeners
  runBtn.addEventListener('click', runCompilation);
  resetExampleBtn.addEventListener('click', resetToDemo);
  
  // initial state: hide bot card, set timestamp
  botSuccessCard.classList.add('hidden');
  setTimestamp();
  
  // (Optional) Docs trigger just does nothing, no page scroll side-effects
  const docsTrigger = document.getElementById('docs-trigger');
  if (docsTrigger) docsTrigger.addEventListener('click', (e) => e.preventDefault());
  
  // micro console hint
  console.log("[chintu/bot] ready · clean mode · dsl playground");
})();
