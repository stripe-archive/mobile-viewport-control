var globalTest = {
  success: true,
  totalPass: 0,
  cases: [],
  waitLength: 100,
  epsilon: 0.002, // scale equality threshold
};

if (window.runBtn) {
  runBtn.onclick = function() {
    runBtn.parentElement.removeChild(runBtn);
    globalTest.run();
  }
} else {
  setTimeout(function() {
    globalTest.run();
  }, 1);
}

function assert(test) {
  globalTest.cases.push(test);

  var isExact = test.actual === test.expected;
  var isClose = Math.abs(test.actual - test.expected) < globalTest.epsilon;

  test.success = isClose;

  if (test.success) {
    globalTest.totalPass++;
    resultDiv.innerHTML += (
      "<div>"+
      "&#x2714; "+test.name+" is "+test.expected+
      (!isExact && isClose ? "~" : "")+
      "</div>"
    );
  }
  else {
    globalTest.success = false;
    document.body.style.background = "#F00";
    resultDiv.innerHTML += (
      "<div>"+
      "&#x2718; "+test.name+"<br>"+
      "<b>expected</b>: "+test.expected+"<br>"+
      "<b>actual</b>: "+test.actual+
      "</div>"
    );
  }
}

function log(msg) {
  resultDiv.innerHTML += (
    "<div>"+
    "&#9758; "+msg+
    "</div>"
  );
}

function finishTesting() {
  if (globalTest.success) {
    document.body.style.background = "#0F0";
  }
  resultDiv.innerHTML += (
    (globalTest.success ? "SUCCESS" : "FAILED") +
    " (" + globalTest.totalPass + "/" + globalTest.cases.length + " passed)"
  );
}

function testSequence(funcs) {
  if (funcs.length === 0) {
    finishTesting();
    return;
  }
  setTimeout(function(){
    funcs[0]();
    testSequence(funcs.slice(1));
  }, globalTest.waitLength);
}
