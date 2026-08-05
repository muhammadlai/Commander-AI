import { GoogleGenAI } from '@google/genai';
import { UserSettings, ChatMessage, AIProvider, AIPersonality, ResponseLength } from '../types';

export interface GenerateOptions {
  userPrompt: string;
  conversationHistory?: ChatMessage[];
  systemInstruction?: string;
  settings: UserSettings;
  onChunk?: (chunkText: string) => void;
  signal?: AbortSignal;
}

export interface ProviderTestResult {
  success: boolean;
  message: string;
  provider: AIProvider;
  latencyMs: number;
}

class AIProviderService {
  /**
   * Constructs the full system instruction combining Commander persona,
   * active personality, response length, and CEO operating rules.
   */
  private buildSystemPrompt(settings: UserSettings, customInstruction?: string): string {
    const personalityGuide = {
      'Executive CEO': 'You are the authoritative, decisive, and visionary CEO of this AI Operating System. Speak with confidence, clarity, and executive foresight.',
      'Friendly Mentor': 'You are a supportive, insightful, and accessible AI CEO and mentor. Speak warmly, encouragingly, and clearly.',
      'Strategic Operations': 'You are a metric-driven, highly organized, and operationally rigorous AI CEO. Focus on efficiency, workflow execution, and measurable outcomes.',
      'Technical Architect': 'You are a precise, security-focused, and technically deep AI CEO and Chief Architect. Focus on system design, code quality, and technical trade-offs.'
    }[settings.aiPersonality || 'Executive CEO'];

    const lengthGuide = {
      'Concise': 'Keep your response brief, crisp, and directly to the point. Focus on essential key takeaways (1-2 short paragraphs).',
      'Balanced': 'Provide a well-structured response with executive summary, relevant details, and clear action items.',
      'Detailed': 'Provide a comprehensive analysis with step-by-step breakdowns, tactical recommendations, and full contextual depth.'
    }[settings.responseLength || 'Balanced'];

    return `
${personalityGuide}

CORE OPERATING DIRECTIVES:
1. You are COMMANDER, the supreme AI CEO of the AI Operating System.
2. Only YOU communicate with the user. You synthesize work done by your specialist agents (Atlas, Nova, Forge, Titan, Vault, Echo, Orbit, Sentinel) into one unified response.
3. ${lengthGuide}
4. ABSOLUTE HONESTY: Never pretend to perform actions or access third-party platforms (like Gmail, Google Calendar, GitHub, WhatsApp, etc.) that have not actually been completed or connected. If an action requires user approval or external integrations, state that clearly and transparently.
5. Provide actionable guidance, well-formulated strategy, or structured plans when requested.

${customInstruction ? `SPECIAL CONTEXT / INSTRUCTION: ${customInstruction}` : ''}
`.trim();
  }

  /**
   * Main entry point to generate a response from the active LLM Provider
   */
  public async generateResponse(
    optionsOrPrompt: GenerateOptions | string,
    settingsArg?: UserSettings,
    conversationHistoryArg?: ChatMessage[],
    onChunkArg?: (chunkText: string) => void
  ): Promise<string> {
    let options: GenerateOptions;

    if (typeof optionsOrPrompt === 'string') {
      if (!settingsArg) {
        throw new Error('UserSettings must be provided when calling generateResponse with string prompt.');
      }
      options = {
        userPrompt: optionsOrPrompt,
        settings: settingsArg,
        conversationHistory: conversationHistoryArg,
        onChunk: onChunkArg
      };
    } else {
      options = optionsOrPrompt;
    }

    const { settings, signal } = options;
    const provider = settings.aiProvider || 'gemini';

    try {
      if (provider === 'gemini') {
        return await this.generateGemini(options);
      } else if (provider === 'openai') {
        return await this.generateOpenAI(options);
      } else if (provider === 'anthropic') {
        return await this.generateAnthropic(options);
      } else {
        return await this.generateGemini(options);
      }
    } catch (err: any) {
      if (signal?.aborted) {
        throw new Error('Generation cancelled by user.');
      }
      return this.handleProviderError(err, provider);
    }
  }

  /**
   * Google Gemini Provider implementation
   */
  private async generateGemini(options: GenerateOptions): Promise<string> {
    const { userPrompt, conversationHistory = [], systemInstruction, settings, onChunk, signal } = options;
    
    // Check for API Key
    const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '') || '';
    const apiKey = settings.geminiApiKey?.trim() || envKey || '';
    
    // Model selection
    const modelName = settings.geminiModel || 'gemini-3.6-flash';

    if (!apiKey) {
      // Return clear error if key is not available
      throw new Error('MISSING_KEY: Gemini API Key is missing. Please set your Gemini API Key in Settings or check environment configuration.');
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const fullSystemPrompt = this.buildSystemPrompt(settings, systemInstruction);

    // Format chat contents
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Add conversation history
    conversationHistory.forEach(msg => {
      contents.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    });

    // Add current prompt
    contents.push({
      role: 'user',
      parts: [{ text: userPrompt }]
    });

    let fullText = '';

    if (settings.streamingEnabled && onChunk) {
      const responseStream = await ai.models.generateContentStream({
        model: modelName,
        contents,
        config: {
          systemInstruction: fullSystemPrompt,
          temperature: settings.temperature ?? 0.7,
          maxOutputTokens: settings.maxTokens ?? 2048,
        }
      });

      for await (const chunk of responseStream) {
        if (signal?.aborted) {
          throw new Error('Generation cancelled by user.');
        }
        const textChunk = chunk.text || '';
        fullText += textChunk;
        onChunk(textChunk);
      }
    } else {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction: fullSystemPrompt,
          temperature: settings.temperature ?? 0.7,
          maxOutputTokens: settings.maxTokens ?? 2048,
        }
      });

      fullText = response.text || '';
      if (onChunk && fullText) {
        onChunk(fullText);
      }
    }

    return fullText;
  }

  /**
   * OpenAI Provider implementation
   */
  private async generateOpenAI(options: GenerateOptions): Promise<string> {
    const { userPrompt, conversationHistory = [], systemInstruction, settings, onChunk, signal } = options;
    const apiKey = settings.openaiApiKey?.trim() || '';
    const model = settings.openaiModel || 'gpt-4o-mini';

    if (!apiKey) {
      throw new Error('MISSING_KEY: OpenAI API Key is missing. Please enter your OpenAI API Key in Settings.');
    }

    const fullSystemPrompt = this.buildSystemPrompt(settings, systemInstruction);

    const messages = [
      { role: 'system', content: fullSystemPrompt },
      ...conversationHistory.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      })),
      { role: 'user', content: userPrompt }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: settings.temperature ?? 0.7,
        max_tokens: settings.maxTokens ?? 2048,
        stream: settings.streamingEnabled && !!onChunk
      }),
      signal
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI Error (${response.status}): ${errData.error?.message || response.statusText}`);
    }

    if (settings.streamingEnabled && onChunk && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            if (dataStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(dataStr);
              const chunkContent = parsed.choices?.[0]?.delta?.content || '';
              if (chunkContent) {
                fullText += chunkContent;
                onChunk(chunkContent);
              }
            } catch {
              // ignore parse errors in stream
            }
          }
        }
      }
      return fullText;
    } else {
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';
      if (onChunk && text) onChunk(text);
      return text;
    }
  }

  /**
   * Anthropic Claude Provider implementation
   */
  private async generateAnthropic(options: GenerateOptions): Promise<string> {
    const { userPrompt, conversationHistory = [], systemInstruction, settings, onChunk, signal } = options;
    const apiKey = settings.anthropicApiKey?.trim() || '';
    const model = settings.anthropicModel || 'claude-3-5-sonnet-20241022';

    if (!apiKey) {
      throw new Error('MISSING_KEY: Anthropic API Key is missing. Please enter your Anthropic API Key in Settings.');
    }

    const fullSystemPrompt = this.buildSystemPrompt(settings, systemInstruction);

    const messages = [
      ...conversationHistory.map(m => ({
        role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: m.text
      })),
      { role: 'user' as const, content: userPrompt }
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'dangerously-allow-browser': 'true'
      },
      body: JSON.stringify({
        model,
        system: fullSystemPrompt,
        messages,
        max_tokens: settings.maxTokens ?? 2048,
        temperature: settings.temperature ?? 0.7,
        stream: settings.streamingEnabled && !!onChunk
      }),
      signal
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(`Anthropic Error (${response.status}): ${errData.error?.message || response.statusText}`);
    }

    if (settings.streamingEnabled && onChunk && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                const chunkContent = parsed.delta.text;
                fullText += chunkContent;
                onChunk(chunkContent);
              }
            } catch {
              // ignore
            }
          }
        }
      }
      return fullText;
    } else {
      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      if (onChunk && text) onChunk(text);
      return text;
    }
  }

  /**
   * Helper to format human-readable error messages for Provider failures
   */
  private handleProviderError(err: any, provider: AIProvider): string {
    const message = err.message || String(err);

    if (message.includes('MISSING_KEY')) {
      return `[API KEY REQUIRED] ${message.replace('MISSING_KEY: ', '')}`;
    }
    if (message.includes('401') || message.includes('Invalid API Key') || message.includes('authentication')) {
      return `[AUTHENTICATION ERROR] The API key configured for ${provider.toUpperCase()} is invalid or unauthorized. Please verify your API key in Settings.`;
    }
    if (message.includes('429') || message.includes('rate limit') || message.includes('quota')) {
      return `[RATE LIMIT EXCEEDED] Your ${provider.toUpperCase()} quota or rate limit has been reached. Please wait a moment or switch provider in Settings.`;
    }
    if (message.includes('Timeout') || message.includes('Failed to fetch') || message.includes('NetworkError')) {
      return `[NETWORK TIMEOUT] Unable to reach ${provider.toUpperCase()} servers. Please check your internet connection or network configuration.`;
    }

    return `[${provider.toUpperCase()} PROVIDER ERROR] ${message}`;
  }

  /**
   * Test API key & connectivity for a given provider
   */
  public async testProviderConnection(settings: UserSettings): Promise<ProviderTestResult> {
    const startTime = Date.now();
    const provider = settings.aiProvider;

    try {
      const testPrompt = 'Respond with "Commander CEO AI connection verified successfully."';
      const result = await this.generateResponse({
        userPrompt: testPrompt,
        settings,
      });

      const latencyMs = Date.now() - startTime;
      return {
        success: true,
        message: `Connection successful! (${latencyMs}ms latency)`,
        provider,
        latencyMs
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      return {
        success: false,
        message: err.message || 'Connection test failed.',
        provider,
        latencyMs
      };
    }
  }
}

export const aiProviderService = new AIProviderService();
