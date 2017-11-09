chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        chrome.tabs.create({url:"https://scratchtools.tk/isonline/register/"});}
    if(details.reason == "update"){
        chrome.tabs.create({url: "https://scratch.mit.edu/isonline-extension/update"});
        chrome.storage.sync.get("iOfriendsenabled", function (data) {
            if(data.iOfriendsenabled==1){localStorage.setItem("iOnotifications","1");}});
        chrome.storage.sync.remove("iOfriendsenabled");
        localStorage.removeItem("iOfriendlistenabled");
    }
}
                                      );

let key, user;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "reload") {
            location.reload();}
        if (request.setuninstallurl) {
            chrome.runtime.setUninstallURL("https://scratchtools.tk/isonline/uninstall/?user="+request.setuninstallurl.name+"&key="+request.setuninstallurl.key);}
        if(request.color === ""){
			localStorage.setItem("iOtabtimestamp",Math.floor(Date.now() / 1000));
            localStorage.setItem("iOstatus","online");
            chrome.browserAction.getBadgeText({}, function(result) {
                if(result===" "){chrome.browserAction.setBadgeText({text: ""});}
                chrome.browserAction.setBadgeBackgroundColor({color: "#0000FF"});
            });
        }
        if (request.color == "orange") {
            localStorage.setItem("iOstatus","absent");
            badge("#FFA500");}
        if (request.color == "gray") {
            localStorage.setItem("iOstatus","dnd");
            badge("#808080");}
        if (request.color == "red") {
            localStorage.setItem("iOstatus","offline");
            badge("#FF0000");}

        if(request.keyinfo){
            console.log(request.keyinfo);
            keyctx = request.keyinfo.key;
            localuserctx = request.keyinfo.localuser;
        }
    });

setInterval(function(){
        if (Math.floor(Date.now() / 1000)-localStorage.getItem("iOtabtimestamp")>6){chrome.browserAction.setBadgeText({text: ""});}
}, 5000);


function badge(thecolor) {
	localStorage.setItem("iOtabtimestamp",Math.floor(Date.now() / 1000));
    chrome.browserAction.getBadgeText({}, function(result) {
        if(result===""){
            chrome.browserAction.setBadgeText({text: " "});}
        chrome.browserAction.setBadgeBackgroundColor({color: thecolor});
    });
}

chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
        title: chrome.i18n.getMessage("clickforstatus"),
        contexts: ["link"],
        targetUrlPatterns: ["*://scratch.mit.edu/users/*"],
        documentUrlPatterns: ["*://scratch.mit.edu/*"],
        onclick: function(info, tab){
            let offlineMsg = "<img src='https://scratchtools.tk/isonline/assets/offline.svg' height='20' width='20'/> " + chrome.i18n.getMessage("offline");
            let username = info.linkUrl.replace(/.+\/users\//, "").replace(/[^a-zA-Z0-9_-].*/, "");
            let internet = new XMLHttpRequest();
            internet.open("GET", "https://scratchtools.tk/isonline/api/v1/" + localuserctx + "/" + keyctx + "/get/" + username + "/");
            internet.onreadystatechange = function(){
                if(internet.readyState === 4){
                    if(internet.status === 200) {
                        let result = JSON.parse(internet.responseText);
                        switch(result.status){
                            case "online":
                                if(new Date().valueOf() / 1000 - result.timestamp < 300){
                                    chrome.tabs.sendMessage(tab.id, {
                                        ctxmenu: true,
                                        call: "update",
                                        user: username,
                                        content: "<img src='https://scratchtools.tk/isonline/assets/online.svg' height='20' width='20'/> " + chrome.i18n.getMessage("online"),
                                        color: "green"
                                    });
                                } else {
                                    chrome.tabs.sendMessage(tab.id, {
                                        ctxmenu: true,
                                        call: "update",
                                        user: username,
                                        content: offlineMsg,
                                        color: "red"
                                    });
                                }
                                break;
                            case "absent":
                                if(new Date().valueOf() / 1000 - result.timestamp < 180){
                                    chrome.tabs.sendMessage(tab.id, {
                                        ctxmenu: true,
                                        call: "update",
                                        user: username,
                                        content: "<img src='https://scratchtools.tk/isonline/assets/absent.svg' height='20' width='20'/> " + chrome.i18n.getMessage("absent"),
                                        color: "orange"
                                    });
                                } else {
                                    chrome.tabs.sendMessage(tab.id, {
                                        ctxmenu: true,
                                        call: "update",
                                        user: username,
                                        content: offlineMsg,
                                        color: "red"
                                    });
                                }
                                break;
                            case "dnd":
                                if(new Date().valueOf() / 1000 - result.timestamp < 180){
                                    chrome.tabs.sendMessage(tab.id, {
                                        ctxmenu: true,
                                        call: "update",
                                        user: username,
                                        content: "<img src='https://scratchtools.tk/isonline/assets/dnd.svg' height='20' width='20'/> " + chrome.i18n.getMessage("dnd"),
                                        color: "grey"
                                    });
                                } else {
                                    chrome.tabs.sendMessage(tab.id, {
                                        ctxmenu: true,
                                        call: "update",
                                        user: username,
                                        content: offlineMsg,
                                        color: "red"
                                    });
                                }
                                break;

                        }
                    } else if (internet.status === 404) {
                        if(internet.responseText){
                            try {
                                chrome.tabs.sendMessage(tab.id, {
                                    ctxmenu: true,
                                    call: "update",
                                    user: username,
                                    content: chrome.i18n.getMessage("notiouser"),
                                    color: "red"
                                });
                            } catch (e) {
                                chrome.tabs.sendMessage(tab.id, {
                                    ctxmenu: true,
                                    call: "update",
                                    user: username,
                                    content: chrome.i18n.getMessage("error"),
                                    color: "red"
                                });
                            }
                        }
                    } else {
                        chrome.tabs.sendMessage(tab.id, {
                            ctxmenu: true,
                            call: "update",
                            user: username,
                            content: chrome.i18n.getMessage("error"),
                            color: "red"
                        });
                    }
                }
            };
            chrome.tabs.sendMessage(tab.id, {ctxmenu: true, call: "alert", user: username, content: chrome.i18n.getMessage("loadingstatus"), color: "blue"});
            internet.send();
        }
    });
});