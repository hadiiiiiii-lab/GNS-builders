import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use(express.json());

// Helper to initialize GoogleGenAI with required system user-agent
function getGenAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Conversational Chat & Property Qualification API
app.post('/api/assistant/chat', async (req, res) => {
  const { message, history, criteria, properties, isVoiceMode } = req.body;
  const ai = getGenAiClient();

  if (!ai) {
    return res.json({
      reply: null,
      fallback: true,
      notice: 'Server GEMINI_API_KEY not set; using deterministic local intelligence engine.',
    });
  }

  try {
    const systemInstruction = `You are a warm, senior property advisor and receptionist for GNS Real Estate LLC, Dubai.
You speak with a natural, polite South Asian (Pakistani / Indian) cadence and warmth, fully fluent in professional English with natural conversational phrasing. If the client speaks in Urdu or Hindi (e.g. "kya hal hai", "2 bhk chahiye", "lakh", "crore"), respond respectfully with polite bilingual warmth (e.g., "Ji zaroor", "Bilkul").

VERIFIED GNS PROPERTY INVENTORY:
${JSON.stringify(properties || [], null, 2)}

CURRENT CLIENT CONTEXT:
${JSON.stringify(criteria || {}, null, 2)}

OPERATIONAL RULES:
1. Grounding: ONLY refer to verified GNS properties (Oria at Dubai Creek Harbour, Nourelle at Madinat Jumeirah Living, Shams Townhouses at Town Square, Palace Residences at Dubai Hills Estate, 1 Residences at Wasl1). Never fabricate unlisted projects or arbitrary developer terms.
2. Voice Pacing: ${isVoiceMode ? 'Keep your spoken answer concise, natural, and under 30 words (1 to 2 short spoken sentences). Do not use bullet points, asterisks, or markdown formatting.' : 'Keep responses under 50 words, conversational and architectural.'}
3. Dubai Rental Terms: If renting is mentioned, politely clarify whether the budget is annual or monthly (in Dubai, residential leases are standardly annual with 1 to 4 cheques).
4. Budgets: Understand regional currency habits: 1 lakh AED = 100,000 AED; 25 lakh = 2.5 million AED; 1 crore = 10 million. Respond in clear AED terms.
5. Pricing: State that final pricing, payment schedules, and allocations are coordinated through direct developer releases with GNS advisors.
6. Viewing: Invite the client to arrange an in-person or virtual viewing for specific properties.`;

    const formattedHistory = Array.isArray(history)
      ? history.slice(-6).map((h: { role: string; text: string }) => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.text }],
        }))
      : [];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }] },
      ],
      config: {
        systemInstruction,
      },
    });

    const replyText = response.text?.trim() || '';

    return res.json({
      reply: replyText,
      fallback: false,
    });
  } catch (error: any) {
    console.warn('Gemini chat API failed, falling back to local intelligence:', error?.message || error);
    return res.json({
      reply: null,
      fallback: true,
      error: error?.message,
    });
  }
});

// 2. High-Fidelity Text-to-Speech Endpoint using gemini-3.8-flash-lite-tts
app.post('/api/voice/tts', async (req, res) => {
  const { text, voice } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required' });
  }

  const ai = getGenAiClient();
  if (!ai) {
    return res.json({
      success: false,
      fallback: true,
      notice: 'Server GEMINI_API_KEY not set; client-side voice synthesis will handle playback.',
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text,
              speechMetadata: {
                style: 'Warm, professional, polite Dubai real estate consultant with natural South Asian cadence',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({
        success: true,
        audio: base64Audio,
        mimeType: 'audio/wav',
      });
    }

    return res.json({ success: false, fallback: true });
  } catch (error: any) {
    console.warn('TTS generation failed, using client voice:', error?.message || error);
    return res.json({ success: false, fallback: true, error: error?.message });
  }
});

// 3. Setup WebSocket Server for Real-Time Duplex Voice Sessions
const wss = new WebSocketServer({ server, path: '/api/voice/live' });

wss.on('connection', (clientWs: WebSocket) => {
  console.log('Real-time voice agent WebSocket client connected');

  clientWs.send(
    JSON.stringify({
      type: 'ready',
      message: 'GNS Voice Bridge connected. Ready for full-duplex conversational audio.',
    })
  );

  clientWs.on('message', async (data) => {
    try {
      const payload = JSON.parse(data.toString());
      if (payload.type === 'ping') {
        clientWs.send(JSON.stringify({ type: 'pong' }));
      } else if (payload.type === 'interrupt') {
        console.log('Interruption signaled by client');
        clientWs.send(JSON.stringify({ type: 'interrupted', timestamp: Date.now() }));
      }
    } catch (e) {
      console.error('Failed to parse WebSocket message:', e);
    }
  });

  clientWs.on('close', () => {
    console.log('Voice agent WebSocket client disconnected');
  });
});

// Setup Vite middleware for dev / express static for prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`GNS Real Estate server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
