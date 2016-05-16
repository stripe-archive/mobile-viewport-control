(function(){
  var viewport = window.mobileViewportControl;
  if (viewport) {
    test();
  } else {
    require(['mobile-viewport-control'], function(module) {
      viewport = module;
      test();
    });
  }

  function test() {
    var isolated = createIsolatedElement();
    var initial = viewport.getPrettyInitialViewport();
    alert("About to freeze viewport on a custom element... Viewport is:\n"+initial);
    viewport.freeze(1, isolated.id);
  }

  function createIsolatedElement() {
    var isolated = document.createElement('div');
    isolated.style.cssText = 'color: #000; text-align: left; font-size: 12px; padding: 20px;';
    isolated.id = 'myIsolatedElement';
    isolated.onclick = function() {
      document.body.removeChild(isolated);
      viewport.thaw();
    }
    isolated.innerHTML = 'I should be the only visible thing, and you should not be able to pinch zoom or scroll.<br>CLICK TO RESTORE.';

    document.body.appendChild(isolated);
    return isolated;
  }
}());
