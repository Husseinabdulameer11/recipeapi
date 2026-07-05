// Recipe API for the Web Development book capstone project.
// Zero dependencies — plain Node.js. Read-only, no auth, CORS open.
//
//   GET /api/recipes                 -> all recipes (summary fields only)
//   GET /api/recipes?search=lemon    -> filter by title/description/ingredient
//   GET /api/recipes?category=mains  -> filter by category
//   GET /api/recipes/:id             -> one full recipe (ingredients + steps)
//   GET /api/categories              -> list of category names

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const recipes = JSON.parse(
  fs.readFileSync(path.join(__dirname, "recipes.json"), "utf8")
);

// Summary shape for list endpoints: everything except ingredients/steps.
function toSummary(recipe) {
  const { ingredients, steps, ...summary } = recipe;
  return summary;
}

function sendJSON(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "public, max-age=300",
  });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const parts = url.pathname.split("/").filter(Boolean); // e.g. ["api","recipes","3"]

  if (req.method === "OPTIONS") {
    return sendJSON(res, 204, null);
  }
  if (req.method !== "GET") {
    return sendJSON(res, 405, { error: "Only GET requests are supported." });
  }

  // GET / — friendly root so the URL works in a browser
  if (parts.length === 0) {
    return sendJSON(res, 200, {
      name: "Web Dev Book Recipe API",
      endpoints: [
        "/api/recipes",
        "/api/recipes?search=lemon",
        "/api/recipes?category=mains",
        "/api/recipes/:id",
        "/api/categories",
      ],
    });
  }

  // GET /api/categories
  if (parts[0] === "api" && parts[1] === "categories" && parts.length === 2) {
    const categories = [...new Set(recipes.map((r) => r.category))];
    return sendJSON(res, 200, categories);
  }

  // GET /api/recipes and /api/recipes/:id
  if (parts[0] === "api" && parts[1] === "recipes") {
    if (parts.length === 2) {
      let results = recipes;

      const category = url.searchParams.get("category");
      if (category) {
        results = results.filter(
          (r) => r.category === category.toLowerCase()
        );
      }

      const search = url.searchParams.get("search");
      if (search) {
        const term = search.toLowerCase();
        results = results.filter(
          (r) =>
            r.title.toLowerCase().includes(term) ||
            r.description.toLowerCase().includes(term) ||
            r.ingredients.some((i) => i.toLowerCase().includes(term))
        );
      }

      return sendJSON(res, 200, results.map(toSummary));
    }

    if (parts.length === 3) {
      const id = Number(parts[2]);
      const recipe = recipes.find((r) => r.id === id);
      if (!recipe) {
        return sendJSON(res, 404, {
          error: `No recipe with id ${parts[2]}.`,
        });
      }
      return sendJSON(res, 200, recipe);
    }
  }

  sendJSON(res, 404, { error: "Not found. Try /api/recipes" });
});

server.listen(PORT, () => {
  console.log(`Recipe API listening on port ${PORT}`);
});
