// src/index.js
(function (global) {
  const DEFAULT_CONFIG = {
    pages: [],
    resumeUrl: '',
    selector: 'main',
    maxSentences: 2,
    title: 'Ask about this profile',
    subtitle: 'AI HTML Assistant',
    autoInit: true,
    welcome: 'Hi! Ask me anything about this Page.',
    analytics: false
  };

  let SENTENCES = [];
  let READY = false;
  let PROFILE = { phone: '', email: '', linkedinUrl: '' };

  function clean(s) {
    return (s || '').replace(/\s+/g, ' ').trim();
  }

  function extractFromHtml(html, selector = 'main') {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const root = doc.querySelector(selector) || doc.body;
    const linkedinA = doc.querySelector('a[href*="linkedin.com"]');
    const mailA = doc.querySelector('a[href^="mailto:"]');
    const telA = doc.querySelector('a[href^="tel:"]');

    PROFILE.linkedinUrl = linkedinA ? linkedinA.getAttribute('href') : '';
    PROFILE.email = mailA ? mailA.getAttribute('href').replace(/^mailto:/i, '') : '';
    PROFILE.phone = telA ? telA.getAttribute('href').replace(/^tel:/i, '') : '';

    root.querySelectorAll('script, style, nav, footer, header, img, svg, link, noscript')
      .forEach(n => n.remove());

    const text = clean(root.innerText || root.textContent || '');
    if (!PROFILE.phone) {
      const m = text.match(/(\+?\d[\d\s\-]{8,}\d)/);
      PROFILE.phone = m ? clean(m[1]) : '';
    }

    return text;
  }

  function splitIntoSentences(text) {
    return clean(text)
      .replace(/\u2022/g, '. ')
      .split(/(?<=[.?!])\s+|(?:\s*;\s*)/g)
      .map(s => s.trim())
      .filter(s => s.length > 20);
  }

  async function loadPages(pages, selector) {
    try {
      const texts = await Promise.all(pages.map(async url => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to load ${url}`);
        return extractFromHtml(await res.text(), selector);
      }));
      SENTENCES = splitIntoSentences(texts.join(' '));
      READY = true;
    } catch (err) {
      console.error('[HtmlAiChatWidget] Error loading pages:', err);
    }
  }

  function scoreSentence(words, sentence) {
    const t = sentence.toLowerCase();
    let score = 0;
    for (const w of words) {
      if (t.includes(w)) score += 2;
      if (t.includes(` ${w} `)) score += 1;
    }
    return score;
  }

  function keywords(q) {
    const STOP = new Set(['the', 'a', 'an', 'and', 'or', 'to', 'of', 'in', 'on', 'for', 'with', 'is', 'are', 'was']);
    return q.toLowerCase()
      .replace(/[^a-z0-9\s\-]/g, ' ')
      .split(/\s+/)
      .filter(w => w && w.length > 2 && !STOP.has(w));
  }

  function buildAnswer(q, maxSentences = 2) {
    if (!READY) return 'Loading content...';
    const words = keywords(q);
    if (!words.length) return 'Try asking about skills, education, or experience.';
    const ranked = SENTENCES
      .map(s => ({ s, sc: scoreSentence(words, s) }))
      .sort((a, b) => b.sc - a.sc)
      .filter(x => x.sc > 0)
      .slice(0, maxSentences);
    return ranked.map(x => x.s).join(' ');
  }

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `.resume-chat { position: fixed; bottom: 80px; right: 16px; z-index: 9999; }`;
    document.head.appendChild(style);
  }

  function createUI(cfg) {
    const container = document.createElement('div');
    container.className = 'resume-chat';
    container.innerHTML = `
      <button id="chat-toggle">💬</button>
      <div id="chat-box" style="display:none; background:#fff; width:300px; height:400px; overflow:auto;">
        <div style="padding:10px; font-weight:bold;">${cfg.title}</div>
        <div id="chat-log" style="padding:10px; font-size:14px;"></div>
        <input id="chat-input" style="width:calc(100% - 20px); margin:10px;" placeholder="Ask something...">
      </div>`;
    document.body.appendChild(container);

    const toggle = document.getElementById('chat-toggle');
    const box = document.getElementById('chat-box');
    const input = document.getElementById('chat-input');
    const log = document.getElementById('chat-log');

    toggle.onclick = () => box.style.display = box.style.display === 'none' ? 'block' : 'none';
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = input.value.trim();
        if (!q) return;
        const ans = buildAnswer(q, cfg.maxSentences);
        log.innerHTML += `<div><b>You:</b> ${q}</div><div><b>Bot:</b> ${ans}</div>`;
        input.value = '';
        log.scrollTop = log.scrollHeight;
      }
    });
    log.innerHTML = `<div><b>Bot:</b> ${cfg.welcome}</div>`;
  }

  function setup(config = {}) {
    const cfg = { ...DEFAULT_CONFIG, ...config };
    if (!cfg.pages.length) cfg.pages = [location.pathname];
    injectStyles();
    createUI(cfg);
    loadPages(cfg.pages, cfg.selector);
  }

  global.HtmlAiChatWidget = { setup };

})(window);
