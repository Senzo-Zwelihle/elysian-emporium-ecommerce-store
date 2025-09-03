import { Search } from "@upstash/search";
import { env } from "@/env/server";

export const upstashSearch = new Search({
  url: env.UPSTASH_SEARCH_REST_URL,
  token: env.UPSTASH_SEARCH_REST_TOKEN,
});
