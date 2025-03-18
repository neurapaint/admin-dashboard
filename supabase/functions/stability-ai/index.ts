import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const STABILITY_API_KEY = Deno.env.get("STABILITY_API_KEY");
const STABILITY_API_HOST = "https://api.stability.ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, x-client-info, apikey",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!STABILITY_API_KEY) {
      throw new Error("Missing Stability API key");
    }

    const { prompt, sketch, artStyle } = await req.json();

    if (!prompt && !sketch) {
      return new Response(
        JSON.stringify({ error: "Either prompt or sketch is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // For image-to-image (with sketch)
    if (sketch) {
      // Extract base64 data from the data URL
      const base64Data = sketch.split(",")[1];

      // Configure the style based on user selection
      let stylePreset = "photographic";
      if (artStyle === "anime") {
        stylePreset = "anime";
      } else if (artStyle === "digital-art") {
        stylePreset = "digital-art";
      } else if (artStyle === "oil-painting") {
        stylePreset = "enhance";
      } else if (artStyle === "watercolor") {
        stylePreset = "watercolor";
      }

      const response = await fetch(
        `${STABILITY_API_HOST}/v1/generation/stable-image-core/image-to-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${STABILITY_API_KEY}`,
          },
          body: JSON.stringify({
            text_prompts: [
              {
                text: prompt,
                weight: 1.0,
              },
            ],
            init_image_mode: "IMAGE_STRENGTH",
            image_strength: 0.35,
            init_image: base64Data,
            cfg_scale: 7,
            style_preset: stylePreset,
            samples: 1,
            steps: 30,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `Stability API error: ${error.message || response.statusText}`
        );
      }

      const data = await response.json();
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      // For text-to-image (no sketch)
      // Configure the style based on user selection
      let stylePreset = "photographic";
      if (artStyle === "anime") {
        stylePreset = "anime";
      } else if (artStyle === "digital-art") {
        stylePreset = "digital-art";
      } else if (artStyle === "oil-painting") {
        stylePreset = "enhance";
      } else if (artStyle === "watercolor") {
        stylePreset = "watercolor";
      }

      const response = await fetch(
        `${STABILITY_API_HOST}/v1/generation/stable-image-core/text-to-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${STABILITY_API_KEY}`,
          },
          body: JSON.stringify({
            text_prompts: [
              {
                text: prompt,
                weight: 1.0,
              },
            ],
            cfg_scale: 7,
            style_preset: stylePreset,
            samples: 1,
            steps: 30,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `Stability API error: ${error.message || response.statusText}`
        );
      }

      const data = await response.json();
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
