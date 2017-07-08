chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        chrome.tabs.create({url:"https://scratchtools.tk/isonline/register/"});}
    if(details.reason == "update"){
        //chrome.tabs.create({url: "https://isonlineupdate.blogspot.com/"});
		}
});

(function(){
    chrome.tabs.query({url:"https://scratch.mit.edu/*"}, function(tabs) {
        if (tabs.length===0){chrome.browserAction.setBadgeText({text: ""});}
    });
    setTimeout(arguments.callee, 10000);
})();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request);
        if (request.status == "") {
            chrome.browserAction.setBadgeText({text: ""});}
        if (request.status == "orange") {
            badge("#FFA500");}
        if (request.status == "grey") {
            badge("#808080");}
        if (request.action == "reload") {
            location.reload();}
		if (request.setuninstallurl != null) {
		chrome.runtime.setUninstallURL("https://scratchtools.tk/isonline/uninstall/?user="+request.setuninstallurl.name+"&key="+request.setuninstallurl.key);}
    });


function badge(thecolor) {
    chrome.browserAction.setBadgeText({text: " "});
    chrome.browserAction.setBadgeBackgroundColor({color: thecolor});
}