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
  var isExact = test.actual === test.expected;
  var isClose = Math.abs(test.actual - test.expected) < globalTest.epsilon;

  test.success = isClose;
  if (test.success) {
    globalTest.totalPass++;
  }

  globalTest.success &= test.success;
  globalTest.cases.push(test);

  document.body.style.background = globalTest.success ? "#0F0" : "#F00";

  if (test.success) {
    resultDiv.innerHTML += (
      "<div>"+
      "&#x2714; "+test.name+" is "+test.expected+
      (!isExact && isClose ? "~" : "")+
      "</div>"
    );
  }
  else {
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
