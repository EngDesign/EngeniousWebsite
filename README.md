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

### Carousel
Dependency: https://www.cssscript.com/infinite-carousel-autoplay/
This has been saved as the component "CTA Banner Carousel", delete/duplicate the "Hero Heading Left" divs to manage individual slides.

## jsdelivr tags
Add to Custom Code settings in Webflow
### Head
`<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/EngDesign/EngeniousWebsite@main/styles.css">`
`<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/EngDesign/EngeniousWebsite@main/vendor/ica/style.css">`
### Footer
`<script defer src="https://cdn.jsdelivr.net/gh/EngDesign/EngeniousWebsite@main/scripts.js"></script>`
`<script defer src="https://cdn.jsdelivr.net/gh/EngDesign/EngeniousWebsite@main/vendor/ica/script.js"></script>`

