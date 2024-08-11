// chrome.webRequest.onBeforeRequest.addListener(
//   function (details) {
//     var lockedWebsites =
//       JSON.parse(localStorage.getItem("lockedWebsites")) || [];
//     var url = details.url;
//     if (lockedWebsites.includes(url) || isChromeShortcut(url)) {
//       return { cancel: true };
//     }
//   },
//   { urls: ["<all_urls>"] },
//   ["blocking"]
// );

// function isChromeShortcut(url) {
//   return url.startsWith("chrome://");
// }

// chrome.runtime.onInstalled.addListener(function () {
//   var recoveryEmail = localStorage.getItem("recoveryEmail");
//   if (!recoveryEmail) {
//     var email = prompt("Enter your recovery email to set up the extension:");
//     if (email === "" || email === null) {
//       alert("Recovery email can't be empty!");
//       return;
//     }
//     localStorage.setItem("recoveryEmail", email);
//     alert("Recovery email saved successfully!");
//   }
// });

// chrome.runtime.onStartup.addListener(function () {
//   var recoveryEmail = localStorage.getItem("recoveryEmail");
//   var lspwd = localStorage.getItem("pwd");
//   if (recoveryEmail == null) {
//     alert("Recovery email not set. Please reinstall the extension.");
//     return;
//   }
//   if (lspwd == null) {
//     setnewpwd();
//   } else {
//     var ask =
//       "Enter Password or type your Recovery Email to reset your password ";
//     if (ask === lspwd) {
//       console.log(lspwd);
//     } else if (ask === "" || ask === null) {
//       alert("Email or Password can't be Empty !");
//       clsbrw();
//     } else if (ask === recoveryEmail) {
//       resetPassword();
//       localStorage.setItem("ask", ask);
//     } else {
//       alert("Incorrect Password or Email!");
//       clsbrw();
//     }
//   }
// });

// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//   var lockedWebsites = JSON.parse(localStorage.getItem("lockedWebsites")) || [];
//   if (lockedWebsites.length > 0 && changeInfo.url) {
//     if (lockedWebsites.includes(changeInfo.url)) {
//       chrome.tabs.remove(tabId);
//     }
//   }
// });

// chrome.browserAction.onClicked.addListener(function () {
//   var recoveryEmail = localStorage.getItem("recoveryEmail");
//   var lspwd = localStorage.getItem("pwd");

//   var ask = prompt(
//     "Enter Password or type your Recovery Email to reset your password"
//   );

//   if (ask === lspwd) {
//     console.log(lspwd);
//   } else if (ask === "" || ask === null) {
//     alert("Email or Password can't be Empty!");
//     clsbrw();
//   } else if (ask === recoveryEmail) {
//     resetPassword();
//     localStorage.setItem("ask", ask);
//   } else {
//     alert("Incorrect Password or Email!");
//     clsbrw();
//   }
// });

// function setnewpwd() {
//   var pwd = prompt("Enter New Password to Protect Your Browser !");
//   if (pwd == "" || pwd == null) {
//     alert("Password can't be Empty !");
//     setnewpwd();
//   } else {
//     localStorage.setItem("pwd", pwd);
//     alert("Password Saved !");
//   }
// }

// function resetPassword() {
//   const uniqueRandomString = generateRandomNumberString();

//   chrome.storage.sync.set({ randomString: uniqueRandomString }, function () {
//     console.log("Value is set to " + uniqueRandomString);
//   });

//   const dataToSend = {
//     email: localStorage.getItem("recoveryEmail"),
//     code: uniqueRandomString,
//   };

//   const requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(dataToSend),
//   };

//   const apiUrl = "http://localhost/email/index.php";

//   fetch(apiUrl, requestOptions)
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//     })
//     .then((data) => {
//       console.log("Response from server:", data);
//       var emailCode = prompt("Enter the code received in email");
//       if (emailCode == uniqueRandomString) {
//         var newpwd = prompt("Enter new password");
//         localStorage.setItem("pwd", newpwd);
//       } else {
//         alert("Incorrect code");
//       }
//     })
//     .catch((error) => {
//       console.error("There was a problem with the fetch operation:", error);
//     });
// }

// function clsbrw() {
//   chrome.windows.getAll({}, function (window) {
//     for (var i = 0; i < window.length; i++) {
//       chrome.windows.remove(window[i].id);
//     }
//   });
// }

// function generateRandomNumberString() {
//   const characters = "0123456789";
//   let result = "";
//   for (let i = 0; i < 7; i++) {
//     result += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return result;
// }

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    try {
      var lockedWebsites = JSON.parse(localStorage.getItem("lockedWebsites")) || [];
      var url = details.url;
      if (lockedWebsites.includes(url) || isChromeShortcut(url)) {
        return { cancel: true };
      }
    } catch (error) {
      console.error("Error in onBeforeRequest listener:", error);
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

function isChromeShortcut(url) {
  return url.startsWith("chrome://");
}

chrome.runtime.onInstalled.addListener(function () {
  try {
    var recoveryEmail = localStorage.getItem("recoveryEmail");
    var password = localStorage.getItem("pwd");

    if (!recoveryEmail) {
      var email = prompt("Enter your recovery email to set up the extension:");
      if (email === "" || email === null) {
        alert("Recovery email can't be empty!");
        return;
      }
      localStorage.setItem("recoveryEmail", email);
      alert("Recovery email saved successfully!");
    }

    if (!password) {
      var pwd = prompt("Set a password to lock/unlock your browser:");
      if (pwd === "" || pwd === null) {
        alert("Password can't be empty!");
        return;
      }
      localStorage.setItem("pwd", pwd);
      alert("Password saved successfully!");
    }
  } catch (error) {
    console.error("Error during installation:", error);
  }
});

chrome.runtime.onStartup.addListener(lockBrowser);
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  try {
    if (request.action === "lockBrowser") {
      lockBrowser();
    } else if (request.action === "unlockBrowser") {
      unlockBrowser(request.password, sendResponse);
      return true; // Ensure the response is sent asynchronously
    } else if (request.action === "resetPassword") {
      resetPassword(request.email, sendResponse);
      return true; // Ensure the response is sent asynchronously
    } else if (request.action === "setNewPassword") {
      localStorage.setItem("pwd", request.password);
      sendResponse({ success: true });
    }
  } catch (error) {
    console.error("Error in onMessage listener:", error);
    sendResponse({ success: false, error: error.message });
  }
});

function lockBrowser() {
  try {
    chrome.tabs.query({}, function (tabs) {
      var openTabs = tabs.map(function (tab) {
        return { url: tab.url, windowId: tab.windowId };
      });
      localStorage.setItem("openTabs", JSON.stringify(openTabs));

      chrome.windows.getAll({}, function (windows) {
        windows.forEach(function (window) {
          chrome.windows.remove(window.id);
        });

        chrome.windows.create({
          url: "password.html",
          type: "popup",
          width: 500,
          height: 500,
        });
      });
    });
  } catch (error) {
    console.error("Error in lockBrowser:", error);
  }
}

function unlockBrowser(password, sendResponse) {
  try {
    var storedPassword = localStorage.getItem("pwd");
    if (password === storedPassword) {
      alert("Browser Unlocked!");
      restoreOpenTabs(sendResponse);
    } else {
      alert("Incorrect Password!");
      sendResponse({ success: false, error: "Incorrect Password" });
    }
  } catch (error) {
    console.error("Error in unlockBrowser:", error);
    sendResponse({ success: false, error: error.message });
  }
}

function restoreOpenTabs(sendResponse) {
  try {
    var openTabs = JSON.parse(localStorage.getItem("openTabs")) || [];
    if (openTabs.length > 0) {
      var windowTabsMap = openTabs.reduce((acc, tab) => {
        if (!acc[tab.windowId]) {
          acc[tab.windowId] = [];
        }
        acc[tab.windowId].push(tab.url);
        return acc;
      }, {});

      const windowIds = Object.keys(windowTabsMap);
      let windowsCreated = 0;

      windowIds.forEach((windowId) => {
        chrome.windows.create({ url: windowTabsMap[windowId] }, function (newWindow) {
          windowsCreated++;
          if (windowsCreated === windowIds.length) {
            localStorage.removeItem("openTabs");
            sendResponse({ success: true });
          }
        });
      });
    } else {
      sendResponse({ success: true });
    }
  } catch (error) {
    console.error("Error in restoreOpenTabs:", error);
    sendResponse({ success: false, error: error.message });
  }
}

function resetPassword(email, sendResponse) {
  try {
    var recoveryEmail = localStorage.getItem("recoveryEmail");
    if (email === recoveryEmail) {
      const uniqueRandomString = generateRandomNumberString();

      chrome.storage.sync.set({ randomString: uniqueRandomString }, function () {
        console.log("Value is set to " + uniqueRandomString);
      });

      const dataToSend = {
        email: recoveryEmail,
        code: uniqueRandomString,
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      };

      const apiUrl = "http://localhost/email/index.php";

      fetch(apiUrl, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Response from server:", data);
          sendResponse({ success: true, code: uniqueRandomString });
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          sendResponse({ success: false });
        });
    } else {
      sendResponse({ success: false });
    }
  } catch (error) {
    console.error("Error in resetPassword:", error);
    sendResponse({ success: false, error: error.message });
  }
}

function generateRandomNumberString() {
  const characters = "0123456789";
  let result = "";
  for (let i = 0; i < 7; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  try {
    var lockedWebsites = JSON.parse(localStorage.getItem("lockedWebsites")) || [];
    if (lockedWebsites.length > 0 && changeInfo.url) {
      if (lockedWebsites.includes(changeInfo.url)) {
        chrome.tabs.remove(tabId);
      }
    }
  } catch (error) {
    console.error("Error in tabs.onUpdated listener:", error);
  }
});