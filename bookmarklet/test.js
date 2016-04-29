(function(){
  function test(viewport) {
    var initial = JSON.stringify(viewport.getInitialViewport());
    alert("About to freeze viewport for 5 seconds... Viewport is: "+initial);
    viewport.freeze(1, function(){
      setTimeout(viewport.thaw, 5000);
    });
  }
  var viewport = window.mobileViewportControl;
  if (viewport) {
    test(viewport);
  } else {
    require(['mobile-viewport-control'], test);
  }
}());
