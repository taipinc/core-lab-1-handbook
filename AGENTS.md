# Core Lab 1 Handbook

## Purpose and audience

Build a student reference handbook for digital photography, from capture to fine art printing. It is intended for students’ present and future use and does not follow the course structure. Organize it by topic for easy lookup. Do not initiate discussions about course content unless requested.

## Content scope

- Basic photography and camera operation.
- File organization, importing, and photographic workflows in Lightroom.
- Moving photographs from Lightroom to Photoshop and back; editing and preparing files.
- Scanning, including film scanning where relevant.
- Color management, output preparation, and fine art printing.

Use Digital Images, Capture, Lightroom, Photoshop, Scanning, and Print as the main reference sections. Parent pages have their own content and link to child pages. Do not invent course policies, assignments, equipment, software editions, or lab-specific settings. Ask for these details when they affect the work.

## Writing and teaching

- Address students directly, using clear, concise language.
- Define technical terms when first introduced.
- Explain the purpose of a workflow before its steps, and describe how students can check the result.
- Use numbered lists for procedures and descriptive headings for reference material.
- Favor nondestructive workflows and make file-saving, backup, and overwrite consequences explicit where relevant.
- Distinguish general photographic principles from software-version and equipment-specific instructions. Verify current interface details against official documentation when writing them.
- Use meaningful image captions and alt text. Include credit and permission information for third-party images.

## Repository and development

- This is a VitePress site with npm and a committed `package-lock.json`.
- Handbook pages live in `content/`; the home page is `content/index.md`. VitePress uses `srcDir: 'content'`, so this folder name is not part of page URLs.
- Site configuration lives in `.vitepress/config.mts`. `.vitepress/navigation.mjs` generates menus from page frontmatter: `title`, optional `menuTitle` (falls back to `title`), and numeric `order`. Folder `index.md` files define parent pages. Use `menu: false` to omit a page or section from menus; ignore underscore-prefixed directories such as `_includes`. Keep page headings tied to `title` using `# {{ $frontmatter.title }}`. The homepage uses the home layout instead. Restart the development server after changing navigation metadata or adding, moving, or deleting pages.
- Theme customization lives in `.vitepress/theme/index.ts` and `.vitepress/theme/style.css`.
- Reusable Vue components live in `.vitepress/theme/components/` and are registered globally in the theme. `WebsiteEmbed` accepts `src`, `title`, an optional CSS `height`, an optional `external-url` for its external link (defaults to `src`), and an opt-in `expandable` lightbox. The lightbox uses a native dialog with a separate iframe instance.
- Reusable placeholder examples live in `content/_includes/component-examples.md` and are included in parent and child pages using VitePress Markdown includes. The include directory is excluded from standalone page generation.
- Keep navigation and internal links aligned with content changes.
- Use `createSectionSidebars` to open the active top-level sidebar group and collapse other groups when navigating between sections. Preserve manual toggles within a section.
- Do not edit `node_modules` or generated VitePress cache/build output.

## Commands and validation

- `npm run docs:dev` starts local development.
- `npm run docs:build` validates and builds the site. Run it after changes to content, configuration, or theme code, and address build errors and broken internal links.
- `npm run docs:preview` previews the production build.

## Deployment

- Deploy to GitHub Pages.
- The destination repository is `https://github.com/taipinc/core-lab-1-handbook.git`; the GitHub Pages project site uses `base: '/core-lab-1-handbook/'`.
- `.github/workflows/deploy.yml` builds and deploys on pushes to `main` and supports manual runs. Select GitHub Actions as the Pages source in repository settings.
- Publish the generated `.vitepress/dist` output; keep deployment configuration consistent with the npm lockfile and installed VitePress version.
- Git initialization and remote setup were blocked by session filesystem restrictions. Check Git status before assuming they have been completed.

## Open course decisions

The Lightroom edition, operating systems, equipment, and lab workflow have not yet been specified. Do not invent these details; defer questions until requested content requires them.
