# Core Lab 1 Handbook

A VitePress reference handbook for digital photography.

## Local development

Use Node.js 24 and npm:

```sh
npm ci
npm run docs:dev
```

Build with `npm run docs:build` and preview with `npm run docs:preview`.

## GitHub Pages

1. Open the repository's **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Push to `main`, or open **Actions → Deploy handbook to GitHub Pages → Run workflow**.

The workflow builds and deploys `.vitepress/dist`. The site address is:
https://taipinc.github.io/core-lab-1-handbook/

The VitePress base path is `/core-lab-1-handbook/`. Update it if the repository name or hosting address changes.

## Website embeds

`WebsiteEmbed` is registered globally and can be used in any Markdown page:

```vue
<WebsiteEmbed
  src="https://taipinc.github.io/my-tools/tools/color-models/?menu=hidden"
  title="Interactive color models"
  height="700px"
/>
```

`src` and an accessible `title` are required. `height` accepts a CSS length and defaults to `640px`. The frame fills the content width, loads lazily, and includes an external link. The shared placeholder pages include this example.

The target website must allow iframe embedding; a website's security headers can block it. Cross-origin embeds use an explicit height because the handbook cannot measure their content automatically.
