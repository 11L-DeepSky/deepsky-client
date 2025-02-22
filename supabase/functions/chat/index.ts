
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SYSTEM_PROMPT = `You are a spotter for a small airplane pilot. You will receive short video feeds from the forward view of the aircraft. Your job is to spot other aircraft and objects that could pose a potential threat. You must provide textual analysis, radar positioning data, and bounding box coordinates for detected objects.

For each object you detect, provide:
1. Distance (0-100, where 100 is the horizon)
2. Angle (-90 to 90 degrees, where 0 is straight ahead, negative values for left, positive values for right)
3. Bounding box coordinates (x1, y1, x2, y2 in percentage of image dimensions, where 0,0 is top-left and 100,100 is bottom-right)

IMPORTANT: Respond with raw JSON only. Do not include markdown formatting, code blocks, or any other text. Your entire response must be valid JSON in this exact format:
{
  "message": "<clear, concise message about what you see>",
  "radarDots": [
    {
      "distance": <number 0-100>,
      "angle": <number -90 to 90>,
      "size": <number 5-20>,
      "type": <"BIRD" | "SMALL_PLANE" | "BIG_PLANE">,
      "boundingBox": {
        "x1": <number 0-100>,
        "y1": <number 0-100>,
        "x2": <number 0-100>,
        "y2": <number 0-100>
      }
    }
  ]
}

Be as accurate as possible with all measurements based on the visual information. Never include + sign for positive numbers. Bounding boxes should tightly contain the detected objects.`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, imageUrl } = await req.json();

    console.log('Received message.');

    if (!imageUrl) {
      throw new Error('Image URL is required');
    }

    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    const elevenLabsKey = Deno.env.get('ELEVEN_LABS_API_KEY');

    if (!openaiKey || !elevenLabsKey) {
      throw new Error('Required API keys not found');
    }

    // Call OpenAI API with properly structured message
    const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: SYSTEM_PROMPT 
          },
          { 
            role: 'user', 
            content: [
              {
                type: "image_url",
                image_url: {
                  url: imageUrl.startsWith('data:') ? imageUrl : `data:image/jpeg;base64,${imageUrl}`
                }
              },
              { 
                type: "text", 
                text: message 
              }
            ]
          }
        ],
        max_tokens: 500
      }),
    });

    if (!chatResponse.ok) {
      const errorData = await chatResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const openaiData = await chatResponse.json();
    console.log('OpenAI response received');
    console.log('Raw response:', openaiData.choices[0].message.content);

    let aiResponse;
    try {
      // Clean the response by removing any markdown formatting
      const cleanedResponse = openaiData.choices[0].message.content
        .replace(/```json\n?/, '')  // Remove opening ```json
        .replace(/```\n?$/, '')     // Remove closing ```
        .trim();                    // Remove any extra whitespace
      
      aiResponse = JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error);
      console.error('Raw response:', openaiData.choices[0].message.content);
      throw new Error('Invalid response format from OpenAI');
    }

    // Convert radar coordinates from angle/distance to x/y coordinates
    const processedRadarDots = (aiResponse.radarDots || []).map(dot => ({
      x: 50 + (Math.sin(dot.angle * Math.PI / 180) * dot.distance / 2),
      y: 50 - (Math.cos(dot.angle * Math.PI / 180) * dot.distance / 2),
      size: dot.size,
      type: dot.type,
      boundingBox: dot.boundingBox
    }));

    // Generate voice with ElevenLabs using the specified voice ID
    const voiceResponse = await fetch('https://api.elevenlabs.io/v1/text-to-speech/RT891KKpfzMkFmWhzYui', {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': elevenLabsKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: aiResponse.message || "No threats detected",
        model_id: "eleven_flash_v2_5",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!voiceResponse.ok) {
      console.error('ElevenLabs API error:', await voiceResponse.text());
      throw new Error('ElevenLabs API error');
    }

    // Convert audio to base64
    const audioBuffer = await voiceResponse.arrayBuffer();
    const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    return new Response(
      JSON.stringify({
        text: aiResponse.message,
        audio: `data:audio/mpeg;base64,${audioBase64}`,
        radarDots: processedRadarDots
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
