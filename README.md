# Mobile Viewport Control

On mobile browsers, Apple set a non-standardized precedent of controlling the
viewport with one or more meta tags:

```html
<meta name="viewport" content="name=value,name=value,...">
```

The goal of this project is to see if we can use these tags to dynamically
modify the viewport at runtime. Specifically, we want to freeze the viewport at
some zoom level, then restore the viewport later.

Generally, a user should be able to pinch-zoom a page.  But for things like
popup modals, the user experience is better if the viewport is preset like a
native app.

## Usage

```
npm install mobileViewportControl
```

```js
const viewport = require('mobileViewportControl');

// Freeze the viewport at a desired scale.
viewport.freeze(1.0, () => console.log("notified when frozen!"));

// Restore the viewport to what it was before freezing.
viewport.thaw(() => console.log("notified when thawed!"));
```

## Compatibility

| Mobile Browser             | Freeze?             | Thaw?               |
|----------------------------|---------------------|---------------------|
| iOS Safari                 |                     |                     |
| iOS UIWebView              |                     |                     |
| iOS WKWebView              |                     |                     |
| iOS SFSafariViewController |                     |                     |
| iOS Chrome                 |                     |                     |
| iOS Firefox                |                     |                     |
| Android Browser (Stock)    |                     |                     |
| Android Chrome             |                     |                     |
| Android WebView            |                     |                     |
| Android Chrome Custom Tabs |                     |                     |
| Android Firefox            |                     |                     |

## Background

Quirksmode offers full descriptions on what is known about mobile viewports:

- [quirksmode - A tale of two viewports - part two](http://www.quirksmode.org/mobile/viewports2.html)
- [quirksmode - Meta viewport](http://www.quirksmode.org/mobile/metaviewport/)

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

### Live Test Links

Open these in a mobile browser to test.

- [test 01](http://shaunstripe.github.io/mobileViewportControl/test/01)
- [test 02a](http://shaunstripe.github.io/mobileViewportControl/test/02a)
- [test 02b](http://shaunstripe.github.io/mobileViewportControl/test/02b)
- [test 02c](http://shaunstripe.github.io/mobileViewportControl/test/02c)
- [test 03a](http://shaunstripe.github.io/mobileViewportControl/test/03a)
- [test 03b](http://shaunstripe.github.io/mobileViewportControl/test/03b)
- [test 03c](http://shaunstripe.github.io/mobileViewportControl/test/03c)
- [test main](http://shaunstripe.github.io/mobileViewportControl/test/main)
