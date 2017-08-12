window.onload = function() {
	
	// Localization
	
	document.getElementById("help").innerHTML=chrome.i18n.getMessage("help");
	document.getElementById("friendlist").innerHTML=chrome.i18n.getMessage("friendlist");
	document.getElementById("friendsettings").innerHTML=chrome.i18n.getMessage("friendsettings");
	document.getElementById("notifyawayonline").innerHTML=chrome.i18n.getMessage("notifyawayonline");
	document.getElementById("soundnotiftext").innerHTML=chrome.i18n.getMessage("soundnotiftext");
	document.getElementById("friendsnote").innerHTML=chrome.i18n.getMessage("friendsnote");

	//
	
	if(chrome.permissions===undefined){
	document.getElementsByClassName("a")[0].remove();
	document.getElementById("friendsnote").innerHTML=chrome.i18n.getMessage("friendsnotcompatible");
	return;
}

    document.getElementById("enablefriendlist").onclick = function() {
        chrome.permissions.contains({
            permissions: ['notifications'],
        }, function(result) {
            if (result) {
                if(document.getElementById("enablefriendlist").checked) {
                    localStorage.setItem("iOfriendlistenabled",1);chrome.storage.sync.set({iOfriendsenabled : "1"},function(){chrome.runtime.sendMessage({friendlist: "refresh"});location.reload();});}
                else {
                    chrome.browserAction.getBadgeText({}, function(result) {if(result!==" "){chrome.browserAction.setBadgeText({text: ""});}});localStorage.setItem("iOfriendlistenabled",0);chrome.storage.sync.set({iOfriendsenabled : "0"},function(){chrome.runtime.sendMessage({friendlist: "refresh"});location.reload();});}
            } else { // If there's no permission
			    chrome.runtime.sendMessage({friendlist: "enable"});
                chrome.permissions.request({
                    permissions: ['notifications'],
                });
            }
        }
                                   );
    };


    document.getElementById("soundnotif").onclick = function() {
        audio = new Audio('sound.mp3');audio.play();
        localStorage.setItem("iOfriendlistsound",document.getElementById("soundnotif").checked ? 1 : 0);};

    if(localStorage.getItem("iOfriendsawaytoonline")==1) {
        document.getElementById("awaytoonline").checked = true;
    }

    document.getElementById("awaytoonline").onclick = function(){
        localStorage.setItem("iOfriendsawaytoonline", document.getElementById("awaytoonline").checked ? 1 : 0);};

    if(localStorage.getItem("iOfriendlistsound")!=0) {
        document.getElementById("soundnotif").checked = true;
    }

    if(localStorage.getItem("iOfriendlistenabled")==1) {
        document.getElementById("enablefriendlist").checked = true;
    }
    else{document.getElementById("settings").remove();document.getElementById("friendstatuseslist").remove();document.getElementById("friendsnote").innerHTML=chrome.i18n.getMessage("friendlistdescription");document.getElementById("newlines").remove();return;}

    if(localStorage.getItem("iOfriendsempty")!=0){document.getElementById("divonlinefriends").innerHTML+='<b>'+chrome.i18n.getMessage("nofriendshelp")+'</b>';return;}

    onlineresponse = {"thelist":"0"};
    awayresponse = {"thelist":"0"};
    offlineresponse = {"thelist":"0"};
    unknownresponse = {"thelist":"0"};
    onlineList();setInterval(onlineList, 2000);

    function getStatuses(){
        chrome.runtime.sendMessage({getfriendsbystatus: "Online"}, function (response){
            if(JSON.stringify(response.thelist)===onlineresponse){return;}
            onlineresponse = JSON.stringify(response.thelist);
            if(response.thelist==="error"){document.getElementById("errorMessage").innerHTML=chrome.i18n.getMessage("friendserror");return;}
            document.getElementById("onlinefriends").innerHTML = "";
            document.getElementById("titleonlinefriends").innerHTML = "";
            for (i = 0; i < response.thelist.length; i++) {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        var str = this.responseText;
                        id = str.substring(6, str.indexOf("username")-2);
                        username = str.substring(str.indexOf("username")+11,str.indexOf("history")-3);
                        if(document.getElementById("titleonlinefriends").innerHTML === ""){document.getElementById("titleonlinefriends").innerHTML = '<img id="iostatusimage" src="online.svg" height="16" width="16"> <span id="iOstatustext" style="color:green;font-size:18px;">'+chrome.i18n.getMessage("online")+' ('+response.thelist.length+')</span><hr  style="border: 1px solid green;">';}
                        var image = "https://cdn2.scratch.mit.edu/get_image/user/"+id+"_60x60.png";
                        document.getElementById("onlinefriends").innerHTML += "<li class='onlinefriends'><img style='vertical-align:middle;' height='15' width='15' id='"+id+"'src='"+image+"'/>&nbsp;<a class='linktouser' href='https://scratch.mit.edu/users/"+username+"/'target='_blank'>"+username+"</a></li><hr style='border: 0;height: 1px;background-image: linear-gradient(to right, rgb(159, 166, 173), rgba(0, 0, 0, 0))'>";
                        document.getElementById(id).src=image;
                    }
                };
                xhttp.open("GET", "https://api.scratch.mit.edu/users/" +response.thelist[i], true);
                xhttp.send();
            }
        });

        chrome.runtime.sendMessage({getfriendsbystatus: "Away"}, function (response){
            if(JSON.stringify(response.thelist)===awayresponse){return;}
            awayresponse = JSON.stringify(response.thelist);
            if(response.thelist==="error"){document.getElementById("errorMessage").innerHTML=chrome.i18n.getMessage("friendserror");return;}
            document.getElementById("awayfriends").innerHTML = "";
            document.getElementById("titleawayfriends").innerHTML = "";
            for (i = 0; i < response.thelist.length; i++) {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        var str = this.responseText;
                        id = str.substring(6, str.indexOf("username")-2);
                        username = str.substring(str.indexOf("username")+11,str.indexOf("history")-3);
                        if(document.getElementById("titleawayfriends").innerHTML === ""){document.getElementById("titleawayfriends").innerHTML = '<img id="iostatusimage" src="absent.svg" height="16" width="16"> <span id="iOstatustext" style="color:orange;font-size:18px;">'+chrome.i18n.getMessage("absent")+' ('+response.thelist.length+')</span><hr style="border: 1px solid orange;">';}
                        var image = "https://cdn2.scratch.mit.edu/get_image/user/"+id+"_60x60.png";
                        document.getElementById("awayfriends").innerHTML += "<li class='awayfriends'><img style='vertical-align:middle;' height='15' width='15' id='"+id+"'src='"+image+"'/>&nbsp;<a class='linktouser' href='https://scratch.mit.edu/users/"+username+"/' target='_blank'>"+username+"</a></li><hr style='border: 0;height: 1px;background-image: linear-gradient(to right, rgb(159, 166, 173), rgba(0, 0, 0, 0))'>";
                        document.getElementById(id).src=image;
                    }
                };
                xhttp.open("GET", "https://api.scratch.mit.edu/users/" +response.thelist[i], true);
                xhttp.send();
            };
        });

        chrome.runtime.sendMessage({getfriendsbystatus: "Offline"}, function (response){
            if(JSON.stringify(response.thelist)===offlineresponse){return;}
            offlineresponse = JSON.stringify(response.thelist);
            if(response.thelist==="error"){document.getElementById("errorMessage").innerHTML=chrome.i18n.getMessage("friendserror");return;}
            document.getElementById("offlinefriends").innerHTML = '<hr style="border: 1px solid red;">';
            document.getElementById("titleofflinefriends").innerHTML = "";
            document.getElementById("divofflinefriends").style.display = "none";
            for (i = 0; i < response.thelist.length; i++) {
                document.getElementById("divofflinefriends").style.display = "block";
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        var str = this.responseText;
                        id = str.substring(6, str.indexOf("username")-2);
                        username = str.substring(str.indexOf("username")+11,str.indexOf("history")-3);
                        if(document.getElementById("offlinefriends").innerHTML == '<hr style="border: 1px solid red;">'){document.getElementById("offlinefriends").innerHTML += '<summary id="iOstatustext" style="color:red;font-size:18px;"><img id="iostatusimage" src="offline.svg" height="16" width="16"> '+chrome.i18n.getMessage("offline")+' ('+response.thelist.length+')</summary>';}
                        var image = "https://cdn2.scratch.mit.edu/get_image/user/"+id+"_60x60.png";
                        document.getElementById("offlinefriends").innerHTML += "<li class='offlinefriends'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img style='vertical-align:middle;'height='15' width='15' id='"+id+"'src='"+image+"'/>&nbsp;<a class='linktouser' href='https://scratch.mit.edu/users/"+username+"/'target='_blank'>"+username+"</a><hr align='right' width='88%' style='border: 0;height: 1px;background-image: linear-gradient(to right, rgb(159, 166, 173), rgba(0, 0, 0, 0))'></li>";
                        document.getElementById(id).src=image;
                    }
                };
                xhttp.open("GET", "https://api.scratch.mit.edu/users/" +response.thelist[i], true);
                xhttp.send();
            }

        });

        chrome.runtime.sendMessage({getfriendsbystatus: "Unknown"}, function (response){
            if(JSON.stringify(response.thelist)===unknownresponse){return;}
            unknownresponse = JSON.stringify(response.thelist);
            if(response.thelist==="error"){document.getElementById("errorMessage").innerHTML=chrome.i18n.getMessage("friendserror");return;}
            document.getElementById("unknownfriends").innerHTML = "";
            document.getElementById("titleunknownfriends").innerHTML = "";
            for (i = 0; i < response.thelist.length; i++) {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        var str = this.responseText;
                        id = str.substring(6, str.indexOf("username")-2);
                        username = str.substring(str.indexOf("username")+11,str.indexOf("history")-3);
                        if(document.getElementById("titleunknownfriends").innerHTML === ""){document.getElementById("titleunknownfriends").innerHTML = '<br><span id="iOstatustext" style="color:gray;font-size:18px;">'+chrome.i18n.getMessage("loadingstatusesfrom")+'</span><hr>';}
                        var image = "https://cdn2.scratch.mit.edu/get_image/user/"+id+"_60x60.png";
                        document.getElementById("unknownfriends").innerHTML += "<li class='unknownfriends'><img style='vertical-align:middle;' height='15' width='15' id='"+id+"'src='"+image+"'/>&nbsp;<a class='linktouser' href='https://scratch.mit.edu/users/"+username+"/'target='_blank'>"+username+"</a></li><hr style='border: 0;height: 1px;background-image: linear-gradient(to right, rgb(159, 166, 173), rgba(0, 0, 0, 0))'>";
                        document.getElementById(id).src=image;
                    }
                };
                xhttp.open("GET", "https://api.scratch.mit.edu/users/" +response.thelist[i], true);
                xhttp.send();
            }

        });

    }

    function onlineList() {
        chrome.tabs.query({url:"https://scratch.mit.edu/*"}, function(tabs) {
            if (tabs.length!==0){getStatuses();}
            else {
                document.getElementById("errorMessage").innerHTML=chrome.i18n.getMessage("onetabopen");
            }
        });
    }


}; //onload