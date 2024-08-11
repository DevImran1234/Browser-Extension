document.addEventListener("DOMContentLoaded", function () {
    var ch = document.querySelector("#ch");
    ch.addEventListener("click", chpwd);

    var addLockBtn = document.getElementById("addLock");
    var removeLockBtn = document.getElementById("removeLock");

    addLockBtn.addEventListener("click", addLock);
    removeLockBtn.addEventListener("click", removeLock);

    function chpwd() {
        var lspwd = localStorage.getItem("pwd");
        var oldpwd = document.querySelector("#oldpwd").value;
        var newpwd = document.querySelector("#newpwd").value;
        if (oldpwd === lspwd) {
            if (newpwd !== "" && newpwd !== null) {
                localStorage.setItem("pwd", newpwd);
                alert("Password Changed !!!");
            } else {
                alert("New Password can't be Empty !!!");
            }
        } else {
            alert("Incorrect old password !!!");
        }
        document.getElementById("cp").reset();
    }

    function addLock() {
        var websiteUrl = document.getElementById("websiteUrl").value;
        var lockedWebsites = JSON.parse(localStorage.getItem("lockedWebsites")) || [];
        if (websiteUrl.trim() !== "") {
            if (!lockedWebsites.includes(websiteUrl)) {
                lockedWebsites.push(websiteUrl);
                localStorage.setItem("lockedWebsites", JSON.stringify(lockedWebsites));
                alert("Website Locked: " + websiteUrl);
            } else {
                alert("Website is already locked.");
            }
        } else {
            alert("Please enter a valid website URL.");
        }
    }

    function removeLock() {
        var websiteUrl = document.getElementById("websiteUrl").value;
        var lockedWebsites = JSON.parse(localStorage.getItem("lockedWebsites")) || [];
        var index = lockedWebsites.indexOf(websiteUrl);
        if (index !== -1) {
            lockedWebsites.splice(index, 1);
            localStorage.setItem("lockedWebsites", JSON.stringify(lockedWebsites));
            alert("Website Unlocked: " + websiteUrl);
        } else {
            alert("Website is not locked.");
        }
    }
    
});

