(function(){
  alert("About to freeze viewport for 5 seconds... Viewport is: "+mobileViewportControl.getInitialViewport())
  mobileViewportControl.freeze(1, function(){
    setTimeout(mobileViewportControl.thaw, 5000);
  });
}())
