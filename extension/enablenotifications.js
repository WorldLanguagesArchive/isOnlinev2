window.onload = function() {

    Notification.requestPermission();

    if(Notification.permission==="denied"){
        document.getElementById("message").innerHTML = "Whoops, you already rejected notifications so we can't actually do anything. Unblock us from notifications and refresh.";
    }


	done = 0;
    setInterval(function(){check();},100);
    var check = function(){if(done===1){return;}
		if(Notification.permission==="granted"){
		localStorage.setItem("iOnotifications","1");
        document.getElementById("message").innerHTML = "You're done! Click in the isOnline icon to discover new notification settings :)";done=1;
    }
                          };

};