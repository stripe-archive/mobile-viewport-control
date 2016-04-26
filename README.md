# Mobile Viewport Control

On mobile browsers, Apple set a non-standardized precedent of controlling the
viewport with one or more meta tags:

```html
<meta name="viewport" content="name=value,name=value,...">
```

> See Quirksmode for more context: [1], [2]

[1]:http://www.quirksmode.org/mobile/viewports2.html
[2]:http://www.quirksmode.org/mobile/metaviewport/

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

| Mobile Browser             | [Measure?]\* | [Freeze?]                                 | [Thaw?]              |
|----------------------------|--------------|-------------------------------------------|----------------------|
| iOS Safari                 | Y            | Y                                         | Y                    |
| iOS UIWebView              | Y            | Fails if user manually zoomed beforehand. | Y if freeze succeeds |
| iOS WKWebView              | Y            | Y                                         | Y                    |
| iOS SFSafariViewController | Y            | Y                                         | Y                    |
| iOS Chrome                 | Y            |                                           |                      |
| iOS Firefox                | Y            |                                           |                      |
| iOS Opera Mini             | Y            |                                           |                      |
| Android Browser (Stock)    |              |                                           |                      |
| Android Chrome             |              |                                           |                      |
| Android WebView            |              |                                           |                      |
| Android Chrome Custom Tabs |              |                                           |                      |
| Android Firefox            |              |                                           |                      |
| Android Opera Mini         |              |                                           |                      |

_\* This test fails in the iOS Simulator because initial-scale is ignored there for wide pages for some reason._

[Measure?]:http://shaunstripe.github.io/mobileViewportControl/test/01-measure
[Freeze?]:http://shaunstripe.github.io/mobileViewportControl/test/02-freeze
[Thaw?]:http://shaunstripe.github.io/mobileViewportControl/test/03-thaw

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
- initial zoom bounds (controlled by page's original viewport meta tags)
