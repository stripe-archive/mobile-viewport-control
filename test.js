var globalTest = { success: true, cases: [] };

function assert(test) {
  test.success = test.actual === test.expected;

  globalTest.success &= test.success;
  globalTest.cases.push(test);

  document.body.style.background = globalTest.success ? "#0F0" : "#F00";

  if (test.success) {
    resultDiv.innerHTML += (
      "<div>"+
      "&#x2714; "+test.name+" is "+test.expected+
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
