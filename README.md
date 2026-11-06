# Core Lab 1 Handbook

A VitePress reference handbook for digital photography.

## Local development

Use Node.js 24 and npm:

```sh
npm ci
npm run docs:dev
```

Build with `npm run docs:build` and preview with `npm run docs:preview`.
Run the navigation checks with `node --test tests/navigation.test.mjs`.

## Editing pages and menus

- `content/index.md` is the homepage.
- `content/digital-images/`, `content/capture/`, `content/lightroom/`, `content/photoshop/`, `content/scanning/`, and `content/print/` contain the reference pages. Each section's `index.md` is its parent page.
- `content/_includes/component-examples.md` holds the shared placeholder examples.
- `.vitepress/config.mts` configures the site. `.vitepress/navigation.mjs` builds the menus from page frontmatter and folders.
- `.vitepress/theme/components/` contains reusable Vue components.

Each content page defines its own titles and position:

```md
---
title: Lightroom vs Lightroom Classic
menuTitle: Lightroom Versions
order: 1
---

# {{ $frontmatter.title }}

Page content goes here.
```

- `title` sets the browser title and, through the heading expression, the visible page heading.
- `menuTitle` is the menu label. Omit it to use `title`.
- `order` sorts siblings numerically, smallest first. Pages without it come last; ties use the file path alphabetically, with numeric filename sorting.
- `menu: false` hides a page from menus. On a folder's `index.md`, it hides the entire section from menus. The page remains accessible by URL.

A folder's `index.md` supplies its parent menu entry. Other Markdown files and subfolders become its children. Every content folder needs an `index.md`; underscore-prefixed files and folders such as `_includes` are ignored. The top menu lists Home and the top-level pages/sections; the sidebar shows the section hierarchy. Entering a section opens its group and collapses the others. You can still toggle any group manually; those choices persist while browsing within the same section and reset when you enter another section. Pages outside the reference sections start with all groups collapsed.

To add a page, create a Markdown file with frontmatter in the appropriate folder. To rename it, edit its frontmatter. To reorder it, change `order`. The homepage's `order` does not change its first position in the top menu. To change a URL, rename the file and update any content links to it; menu links update automatically. For example, `content/capture/child-page-1.md` retains `/capture/child-page-1`.

Menus are generated when VitePress starts or builds. Restart `npm run docs:dev` after changing navigation metadata or adding, moving, or deleting pages. Ordinary page content changes still reload automatically. The homepage hero and feature cards remain separately editable in `content/index.md`.

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
  external-url="https://taipinc.github.io/my-tools/tools/color-models/"
  title="Interactive color models"
  height="700px"
  expandable
/>
```

`src` and an accessible `title` are required. `height` accepts a CSS length and defaults to `640px`. The frame fills the content width, loads lazily, and includes an external link. The shared placeholder pages include this example.

Set optional `external-url` to choose a different destination for “Open in new tab.” If omitted or empty, the link uses `src`. Both the inline and expanded frames always use `src`. The external link appears before the expand button.

Add `expandable` to show an expand button. It opens a padded, browser-sized dialog with a close button, Escape dismissal, and backdrop dismissal. The browser keeps focus inside the dialog and returns it to the expand button when closed. The expanded view loads a separate instance of the website; changes made there are not synchronized with the inline embed. Omit `expandable` to keep only the inline view.

The target website must allow iframe embedding; a website's security headers can block it. Cross-origin embeds use an explicit height because the handbook cannot measure their content automatically.
