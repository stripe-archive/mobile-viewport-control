(function(){
  function test(viewport) {
    var isolated = document.createElement('div');
    isolated.id = 'myIsolatedElement';
    isolated.appendChild(document.createTextNode('I should be the only visible thing, but everything will be restored soon...'))
    document.body.appendChild(isolated);

    var initial = JSON.stringify(viewport.getInitialViewport());
    alert("About to freeze viewport for 5 seconds... Viewport is: "+initial);
    viewport.freeze(1, isolated.id, function(){
      setTimeout(function(){
        document.body.removeChild(isolated);
        viewport.thaw();
      }, 5000);
    });
  }
  var viewport = window.mobileViewportControl;
  if (viewport) {
    test(viewport);
  } else {
    require(['mobile-viewport-control'], test);
  }
}());
