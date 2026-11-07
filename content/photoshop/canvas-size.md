---
title: Canvas Size
menuTitle: Canvas Size
icon: square-dimensions
order: 7
---

# {{ $frontmatter.title }}

We can modify our image size using the `Image -> Image Size` dialog.
It is also available using the `option + command + i` keyboard shortcut.

The `Image Size` dialog changes its behavior based on whether `Resample` is checked or not.

## ☑ Resample (checked)

When `Resample` is checked, changes we make are will affect the actual pixel data of the images - increasing or reducing its resolution (in a process called "resampling").

This is useful in a couple of scenerios:
- Scaling down your digital image for internet use (creating website thumbnails, or smaller images to share quickly).
- Increasing resolution to acheieve artificially finer details.

This is useful if you wish to scale down your image for internet use, or increasing its resolution to acheive (artificial) finer details.

## ☐ Resample (unchecked)

When `Resample` is unchecked, the changes we make **do not** change the actual resolution or pixel information of the image. What we do change is the `resolution` value associated with out file, that translates our image's digital dimentions into physical dimentions.
