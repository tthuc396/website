# Asina Global Website

Static marketing website for Asina Global, covering cabinets, countertops, furniture, design help, and related blog content.

## Stack

- Plain HTML, CSS, and JavaScript
- No build step required
- Asset-heavy catalog site with product imagery under `assets/`

## Project Structure

- `index.html` and top-level `*.html`: main marketing and catalog pages
- `blog/`: blog index and article pages
- `styles/site.css`: global site styling
- `scripts/site.js`: navigation, reveal effects, catalog UI helpers, and lightweight form behavior
- `assets/`: brand, catalog, and furniture imagery

## Local Preview

Serve the repository with any static file server from the project root. For example:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Notes

- This repository is intentionally static. There is no backend service, CMS, or deployment configuration included here.
- Contact flows in the current codebase are frontend-only and should be connected to a real form endpoint or email workflow if full submission handling is required.
- The repository includes large image assets, so clones and pushes will be noticeably heavier than a typical static site repository.
