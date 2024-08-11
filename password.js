document.getElementById("submit").addEventListener("click", function () {
  var password = document.getElementById("password").value;
  chrome.runtime.sendMessage(
    { action: "unlockBrowser", password: password },
    function (response) {
      if (response.success) {
        window.close();
      } else {
        document.getElementById("message").textContent = "Incorrect Password!";
      }
    }
  );
});
