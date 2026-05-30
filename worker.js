/**
 * Cloudflare Worker — serves the static WhereDidIGo site.
 *
 * The [assets] binding in wrangler.toml maps all files in this
 * directory as static assets. This worker simply forwards every
 * request to that binding.
 *
 * Deploy:
 *   npx wrangler deploy
 *
 * Dev (local preview):
 *   npx wrangler dev
 */

export default {
  /**
   * @param {Request} request
   * @param {{ ASSETS: { fetch: (r: Request) => Promise<Response> } }} env
   */
  async fetch(request, env) {
    // Let Cloudflare's asset pipeline serve index.html, styles.css,
    // script.js, visited.json, and everything under vendor/.
    return env.ASSETS.fetch(request);
  },
};
