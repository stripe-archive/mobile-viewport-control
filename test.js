function runTest(test) {
  if (test()) {
    document.body.style.background = "#0F0";
    window.testResult = true;
  }
  else {
    document.body.style.background = "#F00";
    window.testResult = false;
  }
}
