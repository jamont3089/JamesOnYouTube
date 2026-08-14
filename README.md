# James on YouTube

A bold, filterable video showcase for [James Montemagno's YouTube channel](https://youtube.com/jamesmontemagno). It is a static Vite + React site designed for GitHub Pages.

## Local development

```powershell
npm install
npm run dev
```

The committed catalog is a real static snapshot of the latest public channel uploads, so the site works without credentials.

## Video catalog refresh

The production catalog is created by `npm run sync:videos` and written to `src/data/videos.json`. Without credentials, it uses YouTube's public Atom feed for the 15 newest uploads. With `YOUTUBE_API_KEY`, it fetches up to the 100 newest uploads and includes video durations. Both paths automatically assign site tags from a central keyword taxonomy.

Optionally set `YOUTUBE_API_KEY` as a repository Actions secret for the richer 100-video catalog. The key is never exposed to the published site.

## Publishing

Enable **GitHub Pages** with **GitHub Actions** as its source. The publish workflow builds and deploys on pushes to `main`, can be triggered manually, and refreshes the catalog every Monday. GitHub Pages requires a project-site URL such as `https://jamont3089.github.io/JamesOnYouTube/`; Vite applies this base path automatically during Actions builds.