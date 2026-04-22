(function() {
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
  const docsTrigger = document.getElementById('docs-trigger');

  const defaultDsl = `bot AdmissionsBot
domain education
tone witty

welcome "Namaste. Mai Chintu hoon. Pooch kya chahiye."

intent fees
keywords: fee tuition kitna paisa
response "Simple hai bhai, 1.2 lakh full semester ka. EMI bhi hai."

intent courses
keywords: course program degree btech mba
response "BCA, B.Tech CSE, MBA sab available hain. Specific option bol, detail de deta hoon."

fallback "Samjha nahi. Dobara likh ya ek clear keyword use kar."`;

  let currentBotId = null;

  function setTimestamp(label) {
    if (!compileTimestamp) return;

    if (label) {
      compileTimestamp.innerText = label;
      return;
    }

    const now = new Date();
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');
    const ss = now.getSeconds().toString().padStart(2, '0');
    compileTimestamp.innerText = `last run ${hh}:${mm}:${ss}`;
  }

  function setOutput(message, isReady) {
    if (!outputArea) return;

    outputArea.innerText = message;
    outputArea.classList.toggle('ready', Boolean(isReady));
  }

  function resetBotCard() {
    currentBotId = null;
    botSuccessCard.classList.add('hidden');
  }

  async function runCompilation() {
    const dsl = dslEditor.value.trim();
    if (!dsl) {
      setOutput('Compilation failed: DSL cannot be empty. Write some intents first.');
      resetBotCard();
      setTimestamp();
      return;
    }

    runBtn.disabled = true;
    const originalBtnText = runBtn.innerText;
    runBtn.innerText = 'Compiling...';
    setOutput('Sending DSL to backend...');
    resetBotCard();
    setTimestamp('running');

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
      setOutput(
        `Compilation successful
--------------------------------
bot id   : ${data.bot_id}
intents  : ${data.stats.intents}
keywords : ${data.stats.keywords}
tokens   : ${data.stats.tokens}
--------------------------------
Embed code is ready below.`
      );

      const origin = window.location.origin;
      const defaultEmbed = `<script src="${origin}/widget.js" data-bot-id="${data.bot_id}"><\/script>`;

      botIdSpan.innerText = data.bot_id;
      embedCodeSpan.innerText = data.embed_script
        ? data.embed_script.replace(/src="\/widget\.js"/, `src="${origin}/widget.js"`)
        : defaultEmbed;
      botSuccessCard.classList.remove('hidden');
    } catch (err) {
      setOutput(`Compilation failed: ${err.message}`);
      resetBotCard();
    } finally {
      runBtn.disabled = false;
      runBtn.innerText = originalBtnText;
      setTimestamp();
    }
  }

  async function copyEmbedCode() {
    const code = embedCodeSpan.innerText;

    try {
      await navigator.clipboard.writeText(code);
      const originalText = copyBtn.innerText;
      copyBtn.innerText = 'Copied';
      setTimeout(() => {
        copyBtn.innerText = originalText;
      }, 1200);
    } catch (error) {
      alert(`Copy manually:\n${code}`);
    }
  }

  function resetToDemo() {
    dslEditor.value = defaultDsl;
    setOutput('Ready. Write DSL and click Run.', true);
    resetBotCard();
    demoUserMsgSpan.innerText = 'What is the fee?';
    demoBotMsgSpan.innerText = 'Ready when you are. Ask about fees, courses, or anything from the sample DSL.';
    setTimestamp('ready');
  }

  function updateDemoChat(userText) {
    const lower = userText.toLowerCase();

    if (lower.includes('fee') || lower.includes('fees') || lower.includes('tuition') || lower.includes('paisa')) {
      demoBotMsgSpan.innerText = 'Simple hai bhai, 1.2 lakh full semester ka. EMI bhi available hai.';
      return;
    }

    if (lower.includes('course') || lower.includes('courses') || lower.includes('program') || lower.includes('degree')) {
      demoBotMsgSpan.innerText = 'BCA, B.Tech CSE, and MBA sab available hain. Specific course bol, detail de deta hoon.';
      return;
    }

    if (lower.includes('hello') || lower.includes('hi') || lower.includes('namaste')) {
      demoBotMsgSpan.innerText = 'Namaste. Mai Chintu hoon. Pooch kya chahiye.';
      return;
    }

    demoBotMsgSpan.innerText = 'Samjha nahi. Dobara likh ya pehle bot compile kar lo for real responses.';
  }

  async function sendBotMessage(userText) {
    const trimmedText = userText.trim();
    if (!trimmedText) return;

    demoUserMsgSpan.innerText = trimmedText;
    demoInput.value = '';

    if (!currentBotId) {
      updateDemoChat(trimmedText);
      return;
    }

    demoBotMsgSpan.innerText = 'Typing...';

    try {
      const response = await fetch(`/api/chat/${currentBotId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: trimmedText })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || `Server error ${response.status}`);
      }

      demoBotMsgSpan.innerText = data.response;
    } catch (error) {
      demoBotMsgSpan.innerText = 'Sorry, I could not reach the bot backend.';
      console.error(error);
    }
  }

  copyBtn.addEventListener('click', copyEmbedCode);
  runBtn.addEventListener('click', runCompilation);
  resetExampleBtn.addEventListener('click', resetToDemo);
  demoSend.addEventListener('click', () => sendBotMessage(demoInput.value));
  demoInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendBotMessage(demoInput.value);
    }
  });

  if (docsTrigger) {
    docsTrigger.addEventListener('click', (event) => {
      event.preventDefault();
    });
  }

  resetToDemo();
  console.log('[chintu/bot] ready | clean playground mode');
})();
