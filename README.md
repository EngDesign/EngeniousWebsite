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
Open Source started from: https://www.cssscript.com/infinite-carousel-autoplay/, has been heavily customized for this theme.
This has been saved as the component "CTA Banner Carousel", delete/duplicate the "Hero Heading Left" divs to manage individual slides.

#### Testimonial Carousel
Slides instead of fades and has control arrows.
Delete/duplicate "carousel-item" divs to manage individual slides.

### Our Team
Filtering + Modal functionality

## jsdelivr tags
Add to Custom Code settings in Webflow. Replace `commit_hash` with actual number to cache bust, otherwise you can use `main`.
### Head
`<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/EngDesign/EngeniousWebsite@commit_hash/styles.css">`
`<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/EngDesign/EngeniousWebsite@commit_hash/vendor/ica/style.css">`
### Footer
`<script defer src="https://cdn.jsdelivr.net/gh/EngDesign/EngeniousWebsite@commit_hash/scripts.js"></script>`
`<script defer src="https://cdn.jsdelivr.net/gh/EngDesign/EngeniousWebsite@commit_hash/vendor/ica/script.js"></script>`

## Link Crawler
Python3 script to crawl the site for broken links. @TODO update from the webflow domain to the production domain.
`pip3 install requests beautifulsoup4` to install dependency
`python3 crawler.py` to crawl the site and generate a CSV that includes broken links and placeholder "#" links.
