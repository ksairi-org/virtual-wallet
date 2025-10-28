import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPEN_AI_API_KEY,
});

const prompt = async (query: string) => {
  try {
    const response = await openai.responses.create({
      model: "gpt-5-nano",
      input: query,
      store: true,
    });
    return response.output_text;
  } catch (e) {
    console.error("OpenAI prompt error:", e);
    return "Error fetching response from OpenAI.";
  }
};

export { prompt };
