This placeholder page demonstrates built-in VitePress components and Markdown features.

## Website embed

<WebsiteEmbed
  src="https://taipinc.github.io/my-tools/tools/color-models/?menu=hidden"
  title="Interactive color models"
  height="700px"
/>

## Callouts

::: info
Use an information box for helpful context.
:::

::: tip Helpful tip
Use a tip to highlight a useful suggestion.
:::

::: warning
Use a warning to draw attention to something that needs care.
:::

::: danger
Use a danger box for an action with serious consequences.
:::

## Expandable details

::: details Show additional information
Place supporting explanations or optional steps inside an expandable details block.

1. Read the instructions.
2. Try the example.
3. Check the result.
:::

## Badges

<Badge type="info" text="Reference" /> <Badge type="tip" text="Tip" /> <Badge type="warning" text="Review" /> <Badge type="danger" text="Caution" />

## Code groups

::: code-group

```txt [Example A]
This is the first example.
Select another tab to compare examples.
```

```txt [Example B]
This is the second example.
Each tab can contain different content.
```

:::

## Highlighted code

```js{2}
const page = {
  title: 'Component examples',
  status: 'Placeholder'
}
```

## Tables

| Element | Example use |
| --- | --- |
| Information box | Supporting context |
| Details block | Optional explanation |
| Badge | Short status label |

## Lists and formatting

1. Start with a clear instruction.
2. Follow the steps in order.
3. Check the result before continuing.

- **Bold text** emphasizes a key term.
- *Italic text* adds emphasis.
- `Inline code` identifies a value or filename.

> A blockquote can highlight a short passage.
