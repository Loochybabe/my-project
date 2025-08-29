const fs = require("fs");
const axios = require("axios");

// Strapi settings
const STRAPI_URL = "http://localhost:1337/api/posts";
const STRAPI_TOKEN = "84b4525aef69f034425c69160ee09dc694fee06456112ffa44189e14750b83af76a95fdf846b7ac0d605bf35f0d64420a66645eaf6ac27d1b826a9c528956189b9f235e2eba0a3bfa3a0132484b9fd046f2241401a22e0e1f39e562fa02b5ca8d8294ac0d09795773b16c2f70863ee34860f60edecd384ec34205cd8a49d6aab"; // Replace with your API token

// Load WordPress export JSON
const posts = JSON.parse(fs.readFileSync("posts.json", "utf8"));

async function importPosts() {
  for (const post of posts) {
    try {
      // Basic slug fallback
      const slug =
        post.Slug ||
        post.Title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      // Import post into Strapi
      const res = await axios.post(
        STRAPI_URL,
        {
          data: {
            title: post.Title,
            slug: slug,
            content: post.Content,
            publishedAt: post.Date || new Date().toISOString(),
            // featuredImage handling would need a second step (upload API)
          },
        },
        {
          headers: {
            Authorization: `Bearer ${STRAPI_TOKEN}`,
          },
        }
      );

      console.log(`✅ Imported: ${post.Title}`);
    } catch (err) {
      console.error(`❌ Error importing ${post.Title}:`, err.response?.data || err.message);
    }
  }
}

importPosts();
