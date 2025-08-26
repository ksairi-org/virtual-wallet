import fs from "fs";
import axios from "axios";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const downloadSpec = async () => {
  const specUrl = process.env.EXPO_PUBLIC_SUPABASE_OPENAPI_SPEC_URL;
  const apiKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY;

  if (!specUrl || !apiKey) {
    console.error(
      "❌ Missing required environment variables: EXPO_PUBLIC_SUPABASE_OPENAPI_SPEC_URL and EXPO_PUBLIC_SUPABASE_API_KEY",
    );
    process.exit(1);
  }

  try {
    console.log("🔄 Downloading Supabase OpenAPI spec...");

    const response = await axios.get(specUrl, {
      headers: {
        apikey: apiKey,
        Accept: "application/json",
      },
      timeout: 30000,
    });
    // Ensure the response is valid JSON
    if (typeof response !== "object" || response?.status !== 200) {
      throw new Error("Invalid OpenAPI specification received");
    }

    const specPath = path.join(__dirname, "supabase-spec.json");
    fs.writeFileSync(specPath, JSON.stringify(response.data, null, 2));

    console.log("✅ Supabase OpenAPI spec downloaded successfully");
    console.log(`📁 Saved to: ${specPath}`);
  } catch (error) {
    console.error(error);
    console.error("❌ Failed to download spec:");
    process.exit(1);
  }
};

downloadSpec();
