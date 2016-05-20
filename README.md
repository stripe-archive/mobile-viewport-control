# Mobile Viewport Control

This is a JavaScript library to freeze a mobile browser's viewport at some zoom
level then to thaw it back to its original state.  It will optionally hide all
but one element on the page when freezing, allowing you to create a modal
experience that can be dropped into any page regardless of its viewport
settings.

--

__Background.__ Defining the viewport is done through the _de facto_ standard
viewport meta tags.  See Quirksmode [1], [2] for definitive context on
viewports.

```html
<meta name="viewport" content="name=value,name=value,...">
```

[1]:http://www.quirksmode.org/mobile/viewports2.html
[2]:http://www.quirksmode.org/mobile/metaviewport/

__Modifying the Viewport.__ An undocumented feature allows us to modify the viewport
state at runtime by adding new viewport tags and carefully reapplying the
original viewport attributes to restore.

__Compatibility.__ This undocumented feature has been researched and tested on
multiple platforms, though we are currently focusing support for Mobile Safari
and WebViews on iOS 7,8,9. (See [Compatibility Testing](test/))

__Modals are the Use-Case.__ Viewport settings vary widely across different
webpages, making it hard to create drop-in modal experiences that work
everywhere (see [Stripe Checkout] and [Auth0 Lock]).  For browsers that cannot
create pop-up tabs and for pages where redirection is not an option, this
library can help fill in the gaps.

[Stripe Checkout]:https://stripe.com/checkout
[Auth0 Lock]:https://auth0.com/lock

## Usage

```
npm install mobile-viewport-control
```

```js
const viewport = require('mobile-viewport-control');
// ... or use `window.mobileViewportControl` if not used with package manager


// Freeze the viewport at a desired scale.
viewport.freeze(1.0, () => console.log('notified when frozen!'));

// Restore the viewport to what it was before freezing.
viewport.thaw(() => console.log('notified when thawed!'));
```

Additionally, to freeze the scroll area to a given element, you can pass an
element ID as the second argument.  We do this by temporarily hiding everything
else on the page.  Just make sure your element is a direct child of
`document.body`.

```js
viewport.freeze(1.0, 'myElementID');
```

## A Visual Guide

 <table>
  <tr>
    <td>[![scroll][scroll-gif]][scroll-gfy]</td>
    <td>[![zoom][zoom-gif]][zoom-gfy]</td>
  </tr>
  <tr>
    <td>__Figure 1.__ Scrolling</td>
    <td>__Figure 2.__ Zooming + Scrolling</td>
  </tr>
</table>

 <table>
  <tr>
    <td>[![freeze][freeze-gif]][freeze-gfy]</td>
    <td>[![isolate][isolate-gif]][isolate-gfy]</td>
  </tr>
  <tr>
    <td>__Figure 3.__ Freezing and Thawing</td>
    <td>__Figure 4.__ Isolating on Freeze (i.e. modal)</td>
  </tr>
 </table>

[scroll-gif]:https://zippy.gfycat.com/EnchantedPowerfulIndri.gif
[zoom-gif]:https://zippy.gfycat.com/InconsequentialImperturbableBuckeyebutterfly.gif
[freeze-gif]:https://fat.gfycat.com/YearlyBitesizedBangeltiger.gif
[isolate-gif]:https://fat.gfycat.com/MetallicFrighteningApisdorsatalaboriosa.gif

[scroll-gfy]:https://gfycat.com/EnchantedPowerfulIndri
[zoom-gfy]:https://gfycat.com/InconsequentialImperturbableBuckeyebutterfly
[freeze-gfy]:https://gfycat.com/YearlyBitesizedBangeltiger
[isolate-gfy]:https://gfycat.com/MetallicFrighteningApisdorsatalaboriosa

## License

[ISC License](LICENSE)
