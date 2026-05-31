import { Firecrawl } from "firecrawl";
import { config } from "../config/config";

const firecrawl = new Firecrawl({ apiKey: config.FIRECRAWL_API_KEY });

export default firecrawl;
