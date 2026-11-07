# Photoshop adjustment icons

Original SVG redrawings for the handbook, based on the visual shapes shown in
the repository's Photoshop Adjustments panel screenshot:
`content/photoshop/adjustments/images/0-adjustments.png`.
These are not official Adobe icon files. Adobe Photoshop is an Adobe product;
the screenshot is a visual reference, not a claim of endorsement.

Use `icon: photoshop:<name>` in page frontmatter. Available names:

- `light`
- `color-and-vibrance`
- `clarity-and-dehaze`
- `levels`
- `curves`
- `exposure`
- `hue-saturation`
- `color-balance`
- `black-and-white`
- `selective-color`

SVGs use a 24×24 view box, `currentColor`, and no external assets or shared IDs.
The hue/saturation icon uses monochrome strips to remain legible at menu sizes.
Cards and navigation receive the same SVG through `.vitepress/icons.mjs`.
