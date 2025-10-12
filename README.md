# Engeious Custom Theme

Provides styling and JS for custom Webflow components.

## How To
1. Install Dependencies `pnpm install`.
2. Run `npm run watch` to compile scss to css.

`scripts.js` is used as is.

## Custom Components
- Accordions

## Library Components
See `/vendor` folder

### Accordion
There should be a corresponding number of images in the right column to match the accordion-item divs. The first item and image should both have the class "is-open".

### Carousel
Open Source started from: https://www.cssscript.com/infinite-carousel-autoplay/
This has been saved as the component "CTA Banner Carousel", delete/duplicate the "Hero Heading Left" divs to manage individual slides.

### Our Team
Filtering + Modal functionality

## jsdelivr tags
Add to Custom Code settings in Webflow
### Head
`<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/EngDesign/EngeniousWebsite@main/styles.css">`
`<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/EngDesign/EngeniousWebsite@main/vendor/ica/style.css">`
### Footer
`<script defer src="https://cdn.jsdelivr.net/gh/EngDesign/EngeniousWebsite@main/scripts.js"></script>`
`<script defer src="https://cdn.jsdelivr.net/gh/EngDesign/EngeniousWebsite@main/vendor/ica/script.js"></script>`

