import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const defaultWebsiteConfigApiUpstream =
  // "https://fumesandflavoursapi.cylsysuat.com/api/WebsiteUrl/by-domain";
  "https://restaurents-api.cylsys.com/api/WebsiteUrl/by-domain";
const websiteConfigApiUpstream =
  process.env.NEXT_PUBLIC_WEBSITE_CONFIG_API_UPSTREAM?.trim() || defaultWebsiteConfigApiUpstream;
const parsedUpstream = new URL(websiteConfigApiUpstream);

if (
  !["http:", "https:"].includes(parsedUpstream.protocol) ||
  !parsedUpstream.hostname ||
  parsedUpstream.pathname === "/" ||
  parsedUpstream.username ||
  parsedUpstream.password ||
  parsedUpstream.search ||
  parsedUpstream.hash
) {
  throw new Error(
    "NEXT_PUBLIC_WEBSITE_CONFIG_API_UPSTREAM must be an absolute HTTP(S) API URL without credentials, query, or fragment.",
  );
}

const configPath = join(process.cwd(), "out", "web.config");
const webConfig = readFileSync(configPath, "utf8");
const placeholder = "__WEBSITE_CONFIG_API_UPSTREAM__";

if (!webConfig.includes(placeholder)) {
  throw new Error(`Could not find the website configuration API placeholder in ${configPath}.`);
}

const xmlSafeUpstream = websiteConfigApiUpstream.replace(/[&<>"']/g, (character) => {
  const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" };
  return entities[character];
});

writeFileSync(configPath, webConfig.replace(placeholder, xmlSafeUpstream));
