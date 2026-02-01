# HTML AI Chat Widget

A lightweight, plug-and-play JavaScript widget that adds a floating AI chat to any HTML page. It answers questions using only the content from specified local HTML files—no external APIs required.

## ✨ Features

- 🔍 Client-side fuzzy search (no server, no OpenAI key needed)
- 📄 Reads and indexes any list of HTML pages
- 💬 Friendly floating chat UI
- ⚙️ Configurable via one `setup()` call
- 📦 Works via script tag or NPM + CDN
- 📊 Optional GoatCounter analytics support (free, privacy-friendly)

---

## 🔧 Quick Start

### 📦 Option 1: Script Tag (CDN)

```html
<script src="https://cdn.jsdelivr.net/npm/html-ai-chat-widget@1.0.0/dist/chat-widget.min.js"></script>
<script>
  HtmlAiChatWidget.setup({
    pages: ["/resume.html"],
    title: "Ask about this page",
    subtitle: "AI Assistant",
    analytics: true // enables optional GoatCounter ping
  });
</script>
```

### 🛠 Option 2: NPM

```bash
npm install html-ai-chat-widget
```

```js
import { HtmlAiChatWidget } from 'html-ai-chat-widget';
HtmlAiChatWidget.setup({ pages: ["/about.html"], analytics: true });
```

---

## ⚙️ Configuration Options

| Option       | Type              | Default            | Description |
|--------------|-------------------|--------------------|-------------|
| `pages`      | `string[]`        | `[location.pathname]` | HTML paths to index as knowledge base |
| `selector`   | `string`          | `'main'`           | DOM selector to extract content from each page |
| `maxSentences` | `number`        | `2`                | How many matched sentences to return in a reply |
| `title`      | `string`          | `'Ask about this page'` | Chat window header |
| `subtitle`   | `string`          | `'AI Assistant'`   | Subheader in chat |
| `autoInit`   | `boolean`         | `true`             | Whether to auto-initialize on load |
| `welcome`    | `string`          | Welcome message    | First bot message shown |
| `analytics`  | `boolean`         | `false`            | If `true`, triggers a GoatCounter pageview ping for usage tracking |

---

## 🧠 How It Works

1. On page load, it fetches all specified HTML pages.
2. Extracts visible content using the given selector (defaults to `<main>`).
3. Splits text into sentences and stores them in memory.
4. User questions are matched against sentences using keyword scoring.
5. Top N sentences are shown as answers.

---

## 🖼 Demo

Want to see it in action? Try a live example with:

```html
<iframe src="https://yourdemo.com/about.html" width="400" height="600"></iframe>
```

---

## 📊 Tracking Usage

You can view public usage/download stats:

- **NPM Downloads:** [npmjs.com/package/html-ai-chat-widget](https://www.npmjs.com/package/html-ai-chat-widget)
- **CDN Loads:** [jsDelivr stats](https://data.jsdelivr.com/package/npm/html-ai-chat-widget)

### Optional: GoatCounter Analytics (Free)

To track actual page loads using this widget:

1. Create a free account at [https://www.goatcounter.com](https://www.goatcounter.com)
2. Use your site's GoatCounter ID, e.g., `mychat.goatcounter.com`
3. By default, this widget pings `https://mychat.goatcounter.com/count?p=/chatwidget`
4. No personal data collected; this is a free OSS-friendly analytics tool.

---

## 📄 License

MIT License. You’re free to use, modify, and distribute.

---

## 🙋 FAQ

**Q: Can I use this with my personal website?**  
A: Yes! Just add a `<script>` tag and point it to your own HTML page(s).

**Q: Does it use OpenAI or external AI services?**  
A: No. It's 100% client-side and works by matching text from your HTML files.

**Q: Can I index multiple pages?**  
A: Yes, just pass them in the `pages` array in your setup config.

**Q: What if setup isn’t called?**  
A: The widget logs a friendly reminder in the console but won’t crash your site.

---

## 🚀 Author & Attribution

Made by Siddharth Verma [Lead AI Engineer].

Want to build your own chatbot-enabled site? Start here!
