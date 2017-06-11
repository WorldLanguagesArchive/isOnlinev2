chrome.storage.local.get("iOversion", function(result) {
    var openregister = false;
    if (JSON.stringify(result)=="{}") {openregister = true; chrome.storage.local.set({"iOversion":"1.2"});}
    if (openregister) chrome.tabs.create({ url: "https://scratchtools.tk/isonline/register/" });
    if (result.iOversion !== "1.2" && JSON.stringify(result)=="{}") {x=0;
    if (x==1){return;}
    chrome.tabs.create({ url: "https://isonlineupdate.blogspot.com/"});x=1;
    chrome.storage.local.set({"iOversion":"1.2"});}
});

chrome.storage.sync.get("iOaccounts", function(result) {
    console.log(JSON.stringify(result));
    if (JSON.stringify(result) !== "{}") {

        (function(){
            chrome.tabs.query({url:"https://scratch.mit.edu/*"}, function(tabs) {
                if (tabs.length===0){badge("#FF0000");}
            });
            setTimeout(arguments.callee, 5000);
        })();

        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                if (request.status == "online") {
                    badge("#008000");}
                if (request.status == "absent") {
                    badge("#FFA500");}
                if (request.status == "ghost") {
                    badge("#808080");}
                if (request.action == "reload") {
                    location.reload();}
            });

    }});


function badge(thecolor) {
    console.log(thecolor);
    chrome.browserAction.setBadgeText({text: " "});
    chrome.browserAction.setBadgeBackgroundColor({color: thecolor});
}