
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SYSTEM_PROMPT = Deno.env.get('AI_SYSTEM_PROMPT') || `You are a spotter for a small airplane pilot...`; // Fallback prompt if env var is not set

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    // Get AI response from OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error('OpenAI API error');
    }

    const openaiData = await openaiResponse.json();
    const aiResponse = JSON.parse(openaiData.choices[0].message.content);

    // Generate voice with ElevenLabs
    const voiceResponse = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': Deno.env.get('ELEVEN_LABS_API_KEY') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: aiResponse.message || "No threats detected",
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!voiceResponse.ok) {
      throw new Error('ElevenLabs API error');
    }

    // Convert audio to base64
    const audioBuffer = await voiceResponse.arrayBuffer();
    const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    return new Response(
      JSON.stringify({
        text: aiResponse.message,
        audio: `data:audio/mpeg;base64,${audioBase64}`,
        radarDots: aiResponse.radarDots || []
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
