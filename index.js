//
// Mobile Viewport Control v0.2.0
//
// Copyright (c) 2016 Shaun Williams
// ISC License
//
// GitHub: https://github.com/shaunstripe/mobile-viewport-control
//

//---------------------------------------------------------------------------
// JS Module Boilerplate
//---------------------------------------------------------------------------

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define('mobile-viewport-control', [], factory);
  }
  else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  }
  else {
    root.mobileViewportControl = factory();
  }
}(this, function() {

//---------------------------------------------------------------------------
// Getting/Setting Scroll position
//---------------------------------------------------------------------------

function getScroll() {
  return {
    left: document.body.scrollLeft,
    top: document.body.scrollTop,
  };
}

function setScroll(scroll) {
  document.body.scrollLeft = scroll.left;
  document.body.scrollTop = scroll.top;
}

//---------------------------------------------------------------------------
// Getting Initial Viewport from <meta name='viewport'> tags
// but we also include implicit defaults.
//---------------------------------------------------------------------------

function getInitialViewport() {
  // These seem to be the defaults
  var viewport = {
    'user-scalable': 'yes',
    'minimum-scale': '0',
    'maximum-scale': '10'
  };
  var tags = document.querySelectorAll('meta[name=viewport]');
  var i,j,tag,content,keyvals,keyval;
  for (i=0; i<tags.length; i++) {
    tag = tags[i];
    content = tag.getAttribute('content');
    if (tag.id !== hookID && content) {
      keyvals = content.split(',');
      for (j=0; j<keyvals.length; j++) {
        keyval = keyvals[j].split('=');
        if (keyval.length === 2) {
          viewport[keyval[0].trim()] = keyval[1].trim();
        }
      }
    }
  }
  return viewport;
}

//---------------------------------------------------------------------------
// Calculating current viewport scale
// simplified from: http://menacingcloud.com/?c=viewportScale
//---------------------------------------------------------------------------

function getOrientation() {
  var degrees = window.orientation;
  var w = document.documentElement.clientWidth;
  var h = document.documentElement.clientHeight;
  if(degrees === undefined) {
    return (w > h) ? 'landscape' : 'portrait';
  }
  return (degrees % 180 === 0) ? 'portrait' : 'landscape';
}

function getOrientedScreenWidth() {
  var orientation = getOrientation();
  var sw = screen.width;
  var sh = screen.height;
  return (orientation === 'portrait') ? Math.min(sw,sh) : Math.max(sw,sh);
}

function getScale() {
  var visualViewportWidth = window.innerWidth;
  var screenWidth = getOrientedScreenWidth();
  return screenWidth / visualViewportWidth;
}

//---------------------------------------------------------------------------
// State and Constants
//---------------------------------------------------------------------------

// A unique ID of the meta-viewport tag we must create
// to hook into and control the viewport.
var hookID = '__mobileViewportControl_hook__';

// A unique ID of the CSS style tag we must create to
// add rules for hiding the body.
var styleID = '__mobileViewPortControl_style__';

// An empirical guess for the maximum time that we have to
// wait before we are confident a viewport change has registered.
var refreshDelay = 200;

// Original viewport state before freezing.
var originalScale;
var originalScroll;

// Classes we use to make our css selector specific enough
// to hopefully override all other selectors.
// (mvc__ = mobileViewportControl prefix for uniqueness)
var hiddenClasses = [
  'mvc__a',
  'mvc__lot',
  'mvc__of',
  'mvc__classes',
  'mvc__to',
  'mvc__increase',
  'mvc__the',
  'mvc__odds',
  'mvc__of',
  'mvc__winning',
  'mvc__specificity'
];

//---------------------------------------------------------------------------
// Isolating an Element
//---------------------------------------------------------------------------

function isolatedStyle(elementID) {
  var classes = hiddenClasses.join('.');
  return [
    // We effectively clear the <html> and <body> background
    // and sizing attributes.
    'html.' + classes + ',',
    'html.' + classes + ' > body {',
    '  background: #fff;',
    '  width: auto;',
    '  min-width: inherit;',
    '  max-width: inherit;',
    '  height: auto;',
    '  min-height: inherit;',
    '  max-height: inherit;',
    '  margin: 0;',
    '  padding: 0;',
    '  border: 0;',
    '}',
    // hide everything in the body...
    'html.' + classes + ' > body > * {',
    '  display: none !important;',
    '}',
    // ...except the given element ID
    'html.' + classes + ' > body > #' + elementID + ' {',
    '  display: block !important;',
    '}'
  ].join('\n');
}

function isolate(elementID) {
  // add classes to body tag to isolate all other elements
  var classes = hiddenClasses.join(' ');
  var html = document.documentElement;
  html.className += ' ' + classes;

  // add isolating style rules
  var style = document.createElement('style');
  style.id = styleID;
  style.type = 'text/css';
  style.appendChild(document.createTextNode(isolatedStyle(elementID)));
  document.head.appendChild(style);
}

function undoIsolate() {
  // remove isolating classes from body tag
  var classes = hiddenClasses.join(' ');
  var html = document.documentElement;
  html.className = html.className.replace(classes, '');

  // remove isolating style rules
  var style = document.getElementById(styleID);
  document.head.removeChild(style);
}

//---------------------------------------------------------------------------
// Freezing and Thawing
//---------------------------------------------------------------------------

// Freeze the viewport to a given scale.
function freeze(scale) {
  // optional arguments
  var isolateID, onDone;

  // get optional arguments using their type
  var args = Array.prototype.slice.call(arguments, 1);
  if (typeof args[0] === 'string') {
    isolateID = args[0];
    args.splice(0, 1);
  }
  if (typeof args[0] === 'function') {
    onDone = args[0];
  }

  // isolate element if needed
  if (isolateID) {
    isolate(isolateID);
  }

  // freeze viewport
  var hook = document.getElementById(hookID);
  if (!hook) {
    originalScale = getScale();
    originalScroll = getScroll();
    hook = document.createElement('meta');
    hook.id = hookID;
    hook.name = 'viewport';
    document.head.appendChild(hook);
  }
  hook.setAttribute('content', [
    'user-scalable=no',
    'initial-scale='+scale,
    'minimum-scale='+scale,
    'maximum-scale='+scale
  ].join(','));

  if (onDone) {
    setTimeout(onDone, refreshDelay);
  }
}

// Thaw the viewport, restoring the scale and scroll to what it
// was before freezing.
function thaw(onDone, testEvts) {
  // restore body visibility
  var style = document.getElementById(styleID);
  if (style) {
    undoIsolate();
  }

  // exit if there is nothing to thaw
  var hook = document.getElementById(hookID);
  if (!hook) {
    return;
  }

  var initial = getInitialViewport();

  // Restore the user's manual zoom.
  hook.setAttribute('content', [
    'initial-scale='+originalScale,
    'minimum-scale='+originalScale,
    'maximum-scale='+originalScale,
  ].join(','));

  setTimeout(function() {
    if (testEvts && testEvts.onRestoreScale)
      testEvts.onRestoreScale();

    // Restore the page's zoom bounds.
    hook.setAttribute('content', [
      (initial.width ? ('width=' + initial.width) : null),
      'user-scalable='+initial['user-scalable'],
      'initial-scale='+originalScale,
      'minimum-scale='+initial['minimum-scale'],
      'maximum-scale='+initial['maximum-scale']
    ].filter(Boolean).join(','));

    setTimeout(function(){
      if (testEvts && testEvts.onRestoreBounds)
        testEvts.onRestoreBounds();

      // Remove our meta viewport hook.
      document.head.removeChild(hook);

      // Updating the viewport can change scroll,
      // so we have to do this last.
      setScroll(originalScroll);

      if (testEvts && testEvts.onRestoreScroll)
        testEvts.onRestoreScroll();

      if (onDone)
        onDone();

    }, refreshDelay);
  }, refreshDelay);
}

//---------------------------------------------------------------------------
// Public API
//---------------------------------------------------------------------------

return {
  getInitialViewport: getInitialViewport,
  getScale: getScale,
  isolate: isolate,
  undoIsolate: undoIsolate,

  // stable
  version: '0.2.0',
  freeze: freeze,
  thaw: thaw
};

})); // end module scope
