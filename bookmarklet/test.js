(function(){
  var viewport = JSON.stringify(mobileViewportControl.getInitialViewport());
  alert("About to freeze viewport for 5 seconds... Viewport is: "+viewport)
  mobileViewportControl.freeze(1, function(){
    setTimeout(mobileViewportControl.thaw, 5000);
  });
}())
