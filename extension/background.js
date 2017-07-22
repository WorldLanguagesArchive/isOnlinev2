chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        chrome.tabs.create({url:"https://scratchtools.tk/isonline/register/"});}
    if(details.reason == "update"){
        //chrome.tabs.create({url: "https://scratch.mit.edu/isonline-extension/update"});
		}
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
		console.log(request);
        if (request.action == "reload") {
            location.reload();}
		if (request.setuninstallurl != null) {
		chrome.runtime.setUninstallURL("https://scratchtools.tk/isonline/uninstall/?user="+request.setuninstallurl.name+"&key="+request.setuninstallurl.key);}
		
		if(request.color || request.color === ""){
		chrome.browserAction.getBadgeText({}, function(result) {
		if(result===" "){chrome.browserAction.setBadgeText({text: ""});}
		chrome.browserAction.setBadgeBackgroundColor({color: "#0000FF"});
		});
		}
        if (request.color == "orange") {
            badge("#FFA500");}
        if (request.color == "gray") {
            badge("#808080");}
    });
	
setInterval(function(){
    chrome.tabs.query({url:"https://scratch.mit.edu/*"}, function(tabs) {
        if (tabs.length===0){chrome.browserAction.setBadgeText({text: ""});}
    });
}, 10000);


function badge(thecolor) {
	chrome.browserAction.getBadgeText({}, function(result) {
	if(result===""){
    chrome.browserAction.setBadgeText({text: " "});}
	chrome.browserAction.setBadgeBackgroundColor({color: thecolor});
});
}