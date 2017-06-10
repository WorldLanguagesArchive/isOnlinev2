var friendList = [{"name": "World_Languages", "status": "offline"}];
var position   = -1;
var key        = "KEY GOES HERE",
var val    

var SECONDS    = 10; // Every X seconds a request to the iO server will be fired.

chrome.storage.sync.get["friendList", "key", "user"], val => {
	friendList = JSON.parse(val.friendList || []);

	// Okay, here we start iterating over the friendList.
	var checkForFriends = () => {
		
		position = (position + 1) % friendList.length;
		
		var http = new XMLHttpRequest();
			http . open("GET", "https://scratchtools.tk/isonline/api/v1/" + val.key + "/" + val.user + "/get/" + friendList[position].name + "/");
			http . onreadystatechange = function(){
				if(http.readyState !== 4 || http.status !== 200) return;
				
				var online = (new Date()) / 1000 - JSON.parse(http.responseText).timestamp < 300;
				
				switch(friendList[position].status){
					case "online":
						if(!online) friendList[position].status = "offline";
						break;
					
					case "offline":
						if(online) {
							friendList[position].status = "online";
							chrome.notifications.create("", {
								"type"        : "basic",
								"iconUrl"     : "icon.png",
								"title"       : "Somebody just went online on Scratch!",
								"message"     : "Hey, Scratch user @" + friendList[position].name + " just went online or absent! Click to visit their profile now.",
								"isClickable" : true
							}, function(id){notify = friendList[position].name)})
						}
						break;
				}
			}
	};
});

chrome.notifications.onClicked.addListener(function() {
  chrome.tabs.create({"url" : "https://scratch.mit.edu/users/" + notify + "/"})
});

chrome.storage.onChanged.addListener((changes, area) => {
	if(changes.friendList) friendList = changes.friendList;
});
