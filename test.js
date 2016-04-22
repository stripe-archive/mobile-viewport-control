function assert(test) {
  var success = test.actual === test.expected;
  window.testResult = success;
  document.body.style.background = success ? "#0F0" : "#F00";

  if (success) {
    result.innerHTML = [
      "&#x2714; "+test.name+" is "+test.expected
    ].join("<br>");
  }
  else {
    result.innerHTML = [
      "&#x2718; "+test.name,
      "<b>expected</b>: "+test.expected,
      "<b>actual</b>: "+test.actual,
    ].join("<br>");
  }
}
