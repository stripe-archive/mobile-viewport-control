## Compatibility Testing

> __NOTE__: We do not test with Simulators, as iOS Simulator has been shown to
> produce different results than the real environment with regards to
> initial-scale.

Compatibility is measured with a combination of automatic/manual testing:

1. __[Measure Test]__ - verify that we can measure the current viewport scale.
1. __[Freeze Test]__ - verify that we can set and freeze the viewport scale.
  1. Manual step - pinch-zoom before starting the test
  1. Manual step - verify that you cannot pinch-zoom after the test
1. __[Thaw Test]__ - verify that we can restore the viewport scale and bounds.
  1. Manual step - pinch-zoom before starting the test
  1. Manual step - verify that you can still pinch-zoom after the test
1. __[Injection Method]__ - verify it works for any webpage by running a bookmarklet test to inject JS into the page

| Mobile Browser             | [Measure Test]\* | [Freeze Test] | [Thaw Test]        | [Injection Method]       |
|----------------------------|------------------|---------------|--------------------|--------------------------|
| iOS Safari                 | Y                | Y             | Y                  | devtools                 |
| iOS UIWebView              | Y                | Fails\*\*     | Y if freeze works. | xcode+devtools           |
| iOS WKWebView              | Y                | Y             | Y                  | xcode+devtools           |
| iOS SFSafariViewController | Y                | Y             | Y                  | MITM proxy               |
| iOS Chrome                 | Y                | Y             | Y                  | bookmarklet              |
| iOS Firefox                | Y                | Y             | Y                  | MITM proxy               |
| iOS Opera Mini             | Y                | Fails\*\*     | Y if freeze works. |                          |
| Android Browser (Stock)    | ?                | ?             | ?                  |                          |
| Android Chrome             | Y                | Y             | Y                  | devtools or bookmarklet  |
| Android WebView            | Y                | Y             | Y                  | devtools                 |
| Android Chrome Custom Tabs | Y                | Y             | Y                  | devtools                 |
| Android Firefox            | Y                | Fails         | Fails              | devtools or bookmarklet  |
| Android Opera Mini         | Fails            | Fails         | Fails              |                          |

_\* This test fails in the iOS Simulator because `initial-scale` is ignored
there for wide pages for some reason._

_\*\* Fails if user pinch-zooms before freezing. Pinch-zooming causes the
page's scale to change from its specified `initial-scale`.  This custom zoom
level is maintained across refreshes.  When opening in a new tab, the
`initial-scale` is resumed._

[Measure Test]:http://shaunstripe.github.io/mobile-viewport-control/test/01-measure.html
[Freeze Test]:http://shaunstripe.github.io/mobile-viewport-control/test/02-freeze.html
[Thaw Test]:http://shaunstripe.github.io/mobile-viewport-control/test/03-thaw.html
[Injection Method]:#injecting-into-existing-pages

### Injecting into Existing Pages

To allow us to quickly gauge compatibility for externally owned webpages
across several browsers, we must be able to inject our library code into
their running pages.

##### With Bookmarklet

Bookmarklets are URLs of the form `javascript:(function(){ ... }())` which some
browsers allow for evaluating JS in the context of the current page.  The
mobile browsers compatible are listed in the above table under the Injection
Method column.

The following bookmarklet will freeze the viewport scale, show a custom
isolated element, and allow you to press a button to restore the view.

```js
javascript:(function(){document.body.appendChild(document.createElement('script')).src='https://rawgit.com/shaunstripe/mobile-viewport-control/master/bookmarklet/index.js?'+Math.random();}())
```

##### With DevTools

Some mobile browsers allow you to connect to a Desktop DevTools environment
with a JS console for evaluating JS in the context of its page.  iOS Safari
supports connecting to Desktop Safari DevTools in this way.  Android
Chrome/webview can connect to Desktop Chrome DevTools.  Inside DevTools, we can
simply paste the body of the bookmarklet inside the JS console:

```js
document.body.appendChild(document.createElement('script')).src='https://rawgit.com/shaunstripe/mobile-viewport-control/master/bookmarklet/index.js?'+Math.random();
```

iOS webviews require an extra step: you must run an webview app from a live
XCode project on your mac.  Only then will Desktop Safari DevTools to connect
to its webview.

##### With Man-in-the-middle (MITM) Proxy

See [proxy/](proxy) directory for instructions on this last resort testing
method.

### Variables

We currently do not test all variables, but the test outcomes depend on the following:

- browser/platform
- page width (modify in `test.css`)
- screen orientation (portrait or landscape)
- refresh delay (for viewport changes to take effect)
- initial zoom, influenced by either of:
  - default zoom specified in initial-scale
  - manual zoom remembered before page refresh
  - manual zoom after page load and before test run
- initial zoom bounds (controlled by page's original viewport meta tags)

### Quirks when Dynamically Modifying Viewport

- iOS UIWebView does not allow scale adjustments after the user has manually adjusted it.
- Android does not register a new viewport meta tag if it is immediately removed after creation.
- Android will modify the scroll some time after a new viewport tag is registered.
- Android (at least in Chrome) will not freeze scale at 1.0, but will at 1.0±ε for some ε>0.
