# Mobile Viewport Control

On mobile browsers, Apple set a non-standardized precedent of controlling the
viewport with one or more meta tags:

```html
<meta name="viewport" content="name=value,name=value,...">
```

The goal of this project is to measure the degree at which different mobile
browsers are receptive to us _modifying_ the viewport at runtime, and to pursue
a universal method for doing so.

## Background

Quirksmode offers full descriptions on what is known about mobile viewports:

- [quirksmode - A tale of two viewports - part two](http://www.quirksmode.org/mobile/viewports2.html)
- [quirksmode - Meta viewport](http://www.quirksmode.org/mobile/metaviewport/)

## Why?

Generally, it is helpful to understand undocumented browser capabilities to
help us design creative workflows.

Specifically, having a dynamically controlled viewport helps us make the best
use of limited screen space as the user navigates different parts of an SPA.  A
user will sometimes want flexibility to zoom/pan the page, but will also want
helpful defaults during some predetermined interactions-- modals, for example.

Mobile browsers already dynamically zoom into forms if they are too small to
see when typing.  And native mobile applications simply don't provide the
ability to zoom since they are optimally designed for your screen anyway.
Having dynamic control of the viewport on mobile webpages would allow us to
similarly optimize on these principles when appropriate.

## Testing

The `test/` directory contains html files for each test case.  The numbered
files represent unique methods for setting the viewport scale, not using the
library.  The `main.html` test case uses the library's current method for
setting the viewport scale.  That way, when browser behavior changes in the
future, we can have visibility on which specific methods are working.

The outcome of the tests will vary depending on the following.  Ideally, we
would crawl all combinations.

- browser/platform
- page width (modify in `test.css`)
- screen orientation (portrait or landscape)
- refresh delay (for viewport changes to take effect)
- initial zoom, influenced by either of:
  - default zoom specified in initial-scale
  - manual zoom remembered before page refresh
  - manual zoom after page load and before test run

## Target Browsers

- iOS
  - Web Views
    - UIWebView
    - WKWebView
    - SFSafariViewController
  - Mobile Safari
  - Chrome
  - Firefox
- Android
  - Web View
  - Chrome
  - Native Browser
  - Firefox
