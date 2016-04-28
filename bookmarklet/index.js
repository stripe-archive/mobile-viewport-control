// Just export to window object for bookmarklet
(function (root, factory) {
  root.mobileViewportControl = factory();
}(this, function() {

// Getting/Setting Scroll position

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

// Calculating current scale
// simplified from: http://menacingcloud.com/?c=viewportScale

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

// A unique ID of the meta-viewport tag we must create
// to hook into and control the viewport.
var hookID = '__mobileViewportControl_hook__';

// An empirical guess for the maximum time that we have to
// wait before we are confident a viewport change has registered.
var refreshDelay = 200;

// Original viewport state before freezing.
var originalScale;
var originalScroll;

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

// Freeze the viewport to a given scale.
function freeze(scale, onDone) {
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

return {
  version: '0.1.1',
  getInitialViewport: getInitialViewport,
  getScale: getScale,
  freeze: freeze,
  thaw: thaw
};

})); // end module scope
