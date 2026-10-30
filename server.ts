import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// API route for AI Receptionist Chat
app.post('/api/assistant/chat', async (req, res) => {
  const { message, history, criteria, properties } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.json({
      reply: null,
      fallback: true,
      notice: 'Server GEMINI_API_KEY not set; using deterministic local intelligence engine.',
    });
  }

  try {
    const ai = new GoogleGenAI();

    const systemInstruction = `You are the virtual AI Receptionist for GNS Real Estate LLC, Dubai (an established luxury property advisory).
Your role is to warmly greet prospective clients, understand their requirements, and provide accurate, grounded assistance.

VERIFIED GNS PROPERTY INVENTORY:
${JSON.stringify(properties || [], null, 2)}

CURRENT VISITOR CONTEXT:
${JSON.stringify(criteria || {}, null, 2)}

STRICT OPERATIONAL GUIDELINES:
1. Grounding: You must ONLY reference the properties listed above. Never invent projects, prices, or developer terms.
2. Pricing: When asked about pricing or availability, state that pricing and allocation are available upon request through GNS developer allocations. Never invent AED amounts.
3. Rentals: If the client mentions renting, clarify if their budget is annual or monthly (in Dubai, residential leases are standardly annual with 1–4 cheques).
4. Viewings: If the client expresses interest in seeing a property, invite them to request an in-person or virtual viewing with an advisor.
5. Legal/Visa/Tax: Do not give formal legal or immigration advice; explain that GNS licensed advisors coordinate with certified legal partners during consultation.
6. Restraint: Maintain a polite, polished, architectural editorial tone. Keep responses under 60 words. No emojis or pushy sales tactics.`;

    const formattedHistory = Array.isArray(history)
      ? history.slice(-6).map((h: { role: string; text: string }) => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.text }],
        }))
      : [];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }] },
      ],
      config: {
        systemInstruction,
        temperature: 0.3,
        maxOutputTokens: 200,
      },
    });

    const replyText = response.text?.trim() || '';

    return res.json({
      reply: replyText,
      fallback: false,
    });
  } catch (error) {
    console.warn('Gemini API call failed, falling back to local intelligence:', error);
    return res.json({
      reply: null,
      fallback: true,
    });
  }
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GNS Real Estate server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
