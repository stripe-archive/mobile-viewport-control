(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  }
  else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  }
  else {
    root.mobileViewportControl = factory();
  }
}(this, function() {

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
  // to freeze the viewport.
  var tagID = '__viewportControl-master-ecbd7__';

  // An empirical guess for the maximum time that we have to
  // wait before we are confident a viewport change has registered.
  var refreshDelay = 200;

  // Original viewport state before freezing.
  var originalScale;
  var originalScroll;

  // Freeze the viewport to a given scale.
  function freeze(scale, doneCallback) {
    var element = document.getElementById(tagID);
    if (!element) {
      originalScale = getScale();
      originalScroll = {
        left: document.body.scrollLeft,
        top: document.body.scrollTop,
      };
      element = document.createElement('meta');
      element.id = tagID;
      element.name = 'viewport';
      document.head.appendChild(element);
    }
    element.setAttribute('content', [
      'user-scalable=no',
      'initial-scale='+scale,
      'minimum-scale='+scale,
      'maximum-scale='+scale
    ].join(','));

    if (doneCallback) {
      setTimeout(doneCallback, refreshDelay);
    }
  }

  // Thaw the viewport, restoring the scale and scroll to what it
  // was before freezing.
  function thaw(doneCallback) {
    var element = document.getElementById(tagID);
    if (!element) {
      return;
    }

    freeze(originalScale);

    var viewports = document.querySelectorAll('meta[name=viewport]');
    var i,v;
    for (i=0; i<viewports.length; i++) {
      v = viewports[i];
      if (v.id !== tagID) {
        v.setAttribute('content', v.getAttribute('content'));
      }
    }

    setTimeout(function() {
      document.head.removeChild(element);
      document.body.scrollLeft = originalScroll.left;
      document.body.scrollTop = originalScroll.top;
      if (doneCallback) {
        doneCallback();
      }
    }, refreshDelay);
  }

  return {
    getScale: getScale,
    freeze: freeze,
    thaw: thaw
  };
}));
