
## PHASE 4.1 — Chat Engine (how to test)

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Optional: set provider keys via environment or Settings UI:

- VITE_GEMINI_API_KEY for Gemini
- Provide OpenAI or Anthropic keys in Settings if desired

4. Test cases:

- Send message "hello" (should return friendly response).
- Send a code-related message and confirm code blocks render with syntax highlight and a Copy button.
- While generating, press Stop to abort streaming.
- Use Regenerate on a Commander message to re-run the generation.
- Remove API key (or provide an invalid key) to trigger fallback to local mock responses.
- Create multiple conversations, switch between them, and reload page to confirm persistence.

