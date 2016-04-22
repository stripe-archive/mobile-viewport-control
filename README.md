# Mobile Viewport Control

On mobile browsers, Apple set a non-standardized precedent of controlling the
viewport with one or more meta tags:

```html
<meta name="viewport" content="name=value,name=value,...">
```

_(See the excellent [Meta viewport @ quirksmode] for full context on expected behavior.)_

[Meta viewport @ quirksmode]:http://www.quirksmode.org/mobile/metaviewport/

The goal of this project is to measure the degree at which different mobile
browsers are receptive to _dynamically modifying_ the viewport at runtime, and
to pursue a universal method for doing so.

