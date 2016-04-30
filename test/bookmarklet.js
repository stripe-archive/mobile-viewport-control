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
    var initial = JSON.stringify(viewport.getInitialViewport());
    alert("About to freeze viewport on a custom element... Viewport is: "+initial);
    viewport.freeze(1, isolated.id);
  }

  function createIsolatedElement() {
    var isolated = document.createElement('div');
    isolated.style.cssText = 'color: #000; text-align: left; font-size: 12px; padding: 20px;';
    isolated.id = 'myIsolatedElement';
    isolated.innerHTML = 'I should be the only visible thing, and you should not be able to pinch zoom or scroll.<br>';

    var btn = document.createElement('button');
    btn.innerHTML = 'Click me to restore!';
    btn.onclick = function() {
      document.body.removeChild(isolated);
      viewport.thaw();
    }
    isolated.appendChild(btn);

    document.body.appendChild(isolated);
    return isolated;
  }
}());
