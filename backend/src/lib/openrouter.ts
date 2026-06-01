import OpenAI from "openai";
import { config } from "../config/config";

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: config.OPENROUTER_API_KEY,
});

export default openrouter;
