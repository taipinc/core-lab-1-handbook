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
- Pages may set an optional Lucide `icon` in frontmatter using its lowercase, hyphenated name, such as `icon: camera` or `icon: sliders-horizontal`. Browse names at https://lucide.dev/icons/. `.vitepress/icons.mjs` reads SVGs from the `lucide-static` dependency at build time and validates names. Icons appear in sidebar/top navigation, `<ChildPages />` cards, and homepage feature cards linked to those pages. Omit `icon` for text-only entries. Preserve Lucide's bundled license notices; navigation icon sizing lives in `.vitepress/theme/style.css`. Restart the development server after changing icon metadata.
- The adjustment pages use custom SVG icons in `.vitepress/theme/icons/photoshop/`, selected with names such as `icon: photoshop:curves`. These are original redrawings based on the Photoshop controls shown in `content/photoshop/adjustments/images/0-adjustments.png`, not official Adobe assets. Use the existing 24×24 view box and `currentColor` for consistent sizing and light/dark theme support. See that icon folder's README for the full set and reference information.
- Reusable Vue components live in `.vitepress/theme/components/` and are registered globally in the theme. `WebsiteEmbed` accepts `src`, `title`, an optional CSS `height`, an optional `external-url` for its external link (defaults to `src`), and an opt-in `expandable` lightbox. The lightbox uses a native dialog with a separate iframe instance.
- Add `<ChildPages />` to a parent page to display its immediate child pages as a responsive card gallery using the homepage's VitePress card component. It reads the generated menu, following `menuTitle`/`title`, `order`, and `menu: false`, including nested sections. No manual card data is needed. It renders nothing on pages without visible children. The component and its layout styles live in `.vitepress/theme/components/ChildPages.vue`; menu lookup lives in `.vitepress/theme/child-pages.mjs`.
- Reusable placeholder examples live in `content/_includes/component-examples.md` and are included in parent and child pages using VitePress Markdown includes. The include directory is excluded from standalone page generation.
- Keep navigation and internal links aligned with content changes.
- Use `createSectionSidebars` throughout the website, at every navigation depth. Expand a sidebar group when the user is on its parent overview page or any descendant page; collapse it when the user leaves that section. Keep ancestor groups expanded so the active page remains visible. Preserve manual toggles while navigating within a section. Apply this behavior automatically to new sections and nested pages.
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
