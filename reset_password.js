document.getElementById("reset").addEventListener("click", function () {
  var email = document.getElementById("email").value;
  if (email) {
    chrome.runtime.sendMessage(
      { action: "resetPassword", email: email },
      function (response) {
        if (response.success) {
          alert("A code has been sent to your email. Please check your inbox.");
          document.getElementById("email").style.display = "none";
          document.getElementById("reset").style.display = "none";
          document.getElementById("code").style.display = "block";
          document.getElementById("verify").style.display = "block";
        } else {
          alert("Failed to send reset code. Please try again. " + (response.error || ''));
        }
      }
    );
  } else {
    alert("Please enter your recovery email.");
  }
});

document.getElementById("verify").addEventListener("click", function () {
  var code = document.getElementById("code").value;
  chrome.storage.sync.get("randomString", function (data) {
    if (code === data.randomString) {
      document.getElementById("code").style.display = "none";
      document.getElementById("verify").style.display = "none";
      document.getElementById("newPassword").style.display = "block";
      document.getElementById("setNewPassword").style.display = "block";
    } else {
      alert("Incorrect code. Please try again.");
    }
  });
});

document
  .getElementById("setNewPassword")
  .addEventListener("click", function () {
    var newPassword = document.getElementById("newPassword").value;
    if (newPassword) {
      chrome.runtime.sendMessage(
        { action: "setNewPassword", password: newPassword },
        function (response) {
          if (response.success) {
            alert("Password reset successfully!");
            window.close();
          } else {
            alert("Failed to reset password.");
          }
        }
      );
    } else {
      alert("Password cannot be empty!");
    }
  });
