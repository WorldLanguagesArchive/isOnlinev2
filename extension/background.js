/*
Every 10 seconds the next item in the queue.
It checks if the user is online, and compares this with what
it recieved last time. The queue is passed to the background
script through.

To avoid adding an extra "storage" permission, we will use message passing
and local storage.

If a content script wants to send a message, it should do so in the following format:

{
  "command" : "new_friend"|"del_friend",
  "name"    : "username_of_friend"
}

the response will be

{
  "success" : true|false, //was an error encountered
  "code"    : "<error code>"|null, //null if success
  "reason"  : "<human readable error message>"|null //null if success
}

*/

var index = 0; // the initial position in the queue

if(localStorage.getItem("iOfriends") === null) localStorage.setItem("iOfriends", []);

chrome.runtime.onMessage.addListener(
  function(request, s, response) {
    var friends = localStorage.getItem("iOfriends");
    if(request.command === "new_friend") { 
      if(friends.length < 10){ // verify there is enough space
        localStorage.setItem("iOfriends", friends.concat({"name" : request.name, "last_known_status" : "unknown"}));
        response.send({"success" : true, "code" : null, "reason" : null});
      } else {
        response.send({"success" : false, "code" : "LIMIT", "reason" : "10 person limit exceeded"})
      }
    }
    
    if(request.command === "del_friend") {
      var i = friends.findIndex(k => k.name === request.name);
      if(i === -1) {
        response.send({"success" : false, code : "NOTFOUND", "reason" : "That person wasn't in the list, so couldn't be removed"});
      } else {
        localStorage.setItem("iOfriends", friends.filter((e, ind) => ind !== i));
        response.send({"success" : true, "code": null, "reason" : null});
      }
    }
  }
);

function check_next_person() {
  var internet_request = new XMLHttpRequest();
  internet_requuest.open("GET", "")
}
