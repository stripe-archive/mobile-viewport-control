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

  var tagID = '__viewportControl-master-ecbd7__';
  var refreshDelay = 100;

  /* Calculating current scale
   * simplified from: http://menacingcloud.com/?c=viewportScale
   */

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

  var originalScale;

  function setScale(scale, userScalable, doneCallback) {
    var element = document.getElementById(tagID);
    if (!element) {
      originalScale = getScale();
      element = document.createElement('meta');
      element.id = tagID;
      element.name = 'viewport';
      document.head.appendChild(element);
    }
    element.setAttribute('content', [
      'user-scalable='+(userScalable ? 'yes' : 'no'),
      'initial-scale='+scale,
      'minimum-scale='+scale,
      'maximum-scale='+scale
    ].join(','));

    if (doneCallback) {
      setTimeout(doneCallback, refreshDelay);
    }
  }

  function restoreScale(doneCallback) {
    var element = document.getElementById(tagID);
    if (!element) {
      return;
    }

    setScale(originalScale, true);

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
      if (doneCallback) {
        doneCallback();
      }
    }, refreshDelay);
  }

  return {
    getScale: getScale,
    setScale: setScale,
    restoreScale: restoreScale
  };
}));
