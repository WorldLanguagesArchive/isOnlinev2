window.onload = function(){
    document.getElementById("permissions").onclick = function() {
        chrome.permissions.request({
            permissions: ['notifications'],
        });
    };
};
