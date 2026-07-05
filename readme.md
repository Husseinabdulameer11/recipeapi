# Web Dev Book — Recipe API

The read-only recipe API consumed by the book's capstone project (Part 4, "Recipe Finder").
Zero dependencies — plain Node.js, one file.

## Endpoints

| Endpoint | Returns |
|---|---|
| `GET /api/recipes` | All recipes (summary fields, no ingredients/steps) |
| `GET /api/recipes?search=lemon` | Recipes matching title, description, or an ingredient |
| `GET /api/recipes?category=mains` | Recipes in one category |
| `GET /api/recipes/:id` | One full recipe, including `ingredients` and `steps` |
| `GET /api/categories` | Array of category names |

Categories: `breakfast`, `mains`, `soups`, `dessert`, `snacks`.
CORS is open (`Access-Control-Allow-Origin: *`) so readers can call it from `file://` pages and Live Preview.

## Run locally

```bash
node server.js
# → http://localhost:3000/api/recipes
```

## Deploy (free) on Render

1. Push this `recipe-api/` folder to a GitHub repo (its own repo, or set the root directory below).
2. On https://render.com → New → Web Service → connect the repo.
3. Settings: Runtime **Node**, Build command **(leave empty)**, Start command **`node server.js`**.
   If the API lives in a subfolder of a bigger repo, set **Root Directory** to `recipe-api`.
4. Deploy. Render gives you a URL like `https://web-dev-book-api.onrender.com`.

**Important:** the book prints the base URL in Chapter 37 (`API_BASE` constant). If your deployed
URL differs from the one printed in the book, update the book source in
`chapters/part4_capstone.tex` (search for `onrender.com`) before publishing.

Note: on Render's free tier the service sleeps after 15 minutes of inactivity and the first
request afterwards takes ~30 seconds. The book warns readers about this in a tip box.

## Editing recipes

All data lives in `recipes.json`. Keep the field names stable — the book's code and prose
depend on them: `id`, `title`, `category`, `emoji`, `time`, `difficulty`, `servings`,
`description`, `ingredients[]`, `steps[]`.
