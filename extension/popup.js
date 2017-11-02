window.onload = function() {

    // Localization

    document.getElementById("help").innerHTML=chrome.i18n.getMessage("help");
    document.getElementById("friendlist").innerHTML=chrome.i18n.getMessage("friendlist");
    document.getElementById("friendsettings").innerHTML=chrome.i18n.getMessage("friendsettings");
    document.getElementById("notifyawayonline").innerHTML=chrome.i18n.getMessage("notifyawayonline");
    document.getElementById("soundnotiftext").innerHTML=chrome.i18n.getMessage("soundnotiftext");
    document.getElementById("notifyofflineonline").innerHTML=chrome.i18n.getMessage("notifyofflineonline");
    document.getElementById("translationcredits").innerHTML=chrome.i18n.getMessage("translationcredits");
    isenglish = chrome.i18n.getUILanguage().startsWith("en");
    //

    protips = ['Easily get someone\'s status by right-clicking their profile link/picture and choosing "click to get status".', '<a href="http://ison.ga/sync" target="_blank">Sync your computers</a> to avoid reverifying.', 'Add the discuss button to the nav bar on <a href="https://scratch.mit.edu/users/DiscussButton" target="_blank">@DiscussButton</a>', 'Want to know more about something? Hover the info icon!', 'Don\'t want people to know you\'re online? Use the ghost status', 'Friend notifications won\'t disturb you if you aren\'t on Scratch', 'Have any suggestion for isOnline? Post it <a href="http://scratch.mit.edu/discuss/topic/253147" target="_blank">here</a>', 'Want a crown in your profile? Check <a href="https://scratch.mit.edu/projects/158291459/" target="_blank">how to get one</a>'];
    document.getElementById("protiptext").innerHTML=protips[Math.floor(Math.random() * protips.length)];
    if(!isenglish) {
        document.getElementById("protip").remove();
        document.getElementById("protiptext").remove();
    }

    getmessage = new XMLHttpRequest();
    getmessage.open("GET", "https://scratchtools.tk/api/getmessage.php", true);
    getmessage.send();
    getmessage.onreadystatechange = function() {if (getmessage.readyState === 4){
        if (getmessage.status === 200) {
            if(JSON.parse(getmessage.responseText).message){
                document.getElementById("getmessage").innerText = JSON.parse(getmessage.responseText).message;}
        }}};

    if(chrome.permissions===undefined){
        document.getElementsByClassName("a")[0].remove();
        document.getElementById("friendsnote").innerHTML=chrome.i18n.getMessage("friendsnotcompatible");
        return;
    }

    /*document.getElementById("enablefriendlist").onclick = function() {
        if(document.getElementById("enablefriendlist").checked) {
            localStorage.setItem("iOfriendlistenabled",1);chrome.storage.sync.set({iOfriendsenabled : "1"},function(){chrome.runtime.sendMessage({friendlist: "refresh"});location.reload();});}
        else {
            chrome.browserAction.getBadgeText({}, function(result) {if(result!==" "){chrome.browserAction.setBadgeText({text: ""});}});localStorage.setItem("iOfriendlistenabled",0);chrome.storage.sync.set({iOfriendsenabled : "0"},function(){chrome.runtime.sendMessage({friendlist: "refresh"});location.reload();});}
    };*/

    document.getElementById("offlinetoonline").onclick = function() {
        chrome.permissions.contains({
            permissions: ['notifications'],
        }, function(result) {
            if (result) {
                if(document.getElementById("offlinetoonline").checked) {
                    localStorage.setItem("iOnotifications","1");
                    document.getElementById("awaytoonlinediv").style.display = 'block';
                    document.getElementById("soundnotifdiv").style.display = 'block';
                }
                else {
                    localStorage.setItem("iOnotifications","0");
                    document.getElementById("awaytoonlinediv").style.display = 'none';
                    document.getElementById("soundnotifdiv").style.display = 'none';}
            } else { // If there's no permission
                chrome.runtime.sendMessage({notifications: "enable"});
                chrome.permissions.request({
                    permissions: ['notifications'],
                });
            }
        }
                                   );
    };

    if(localStorage.getItem("iOnotifications")==="1") {
        document.getElementById("offlinetoonline").checked = true;
        document.getElementById("awaytoonlinediv").style.display = 'block';
        document.getElementById("soundnotifdiv").style.display = 'block';
    }

    document.getElementById("soundnotif").onclick = function() {
        audio = new Audio('sound.mp3');audio.play();
        localStorage.setItem("iOfriendlistsound",document.getElementById("soundnotif").checked ? 1 : 0);};

    if(localStorage.getItem("iOfriendsawaytoonline")==1) {
        document.getElementById("awaytoonline").checked = true;
    }

    document.getElementById("awaytoonline").onclick = function(){
        localStorage.setItem("iOfriendsawaytoonline", document.getElementById("awaytoonline").checked ? 1 : 0);};

    if(localStorage.getItem("iOfriendlistsound")!=="0") {
        document.getElementById("soundnotif").checked = true;
    }

    if(localStorage.getItem("iOfriendsempty")!=="0"){document.getElementById("divonlinefriends").innerHTML+='<b>'+chrome.i18n.getMessage("nofriendshelp")+'</b>';return;}

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
                        var list = document.createElement('span');
                        list.innerHTML = "<li class='onlinefriends'><img style='vertical-align:middle;' height='15' width='15' id='"+id+"'src='"+image+"'/>&nbsp;<a class='linktouser' href='https://scratch.mit.edu/users/"+username+"/'target='_blank'>"+username+"</a><span id='buttons'><a href='https://scratch.mit.edu/users/"+username+"/?comments' target='blank'><img height='14' src='commenticon.png' title='"+chrome.i18n.getMessage("gotocomments")+"'></a>&nbsp;&nbsp;<a &nbsp;&nbsp;<a style='cursor:pointer' id='remove "+username+"'><img src='removeicon.png' height='14' title='"+chrome.i18n.getMessage("removefromfriends")+"'></a></li><hr style='border: 0;height: 1px;background-image: linear-gradient(to right, rgb(159, 166, 173), rgba(0, 0, 0, 0))'></span>";
                        document.getElementById('onlinefriends').appendChild(list);
                        document.getElementById(id).src=image;
                        document.getElementById("remove "+username).onclick = function(){
                            chrome.runtime.sendMessage({removefriend: this.id.substring(7)});
                            getStatuses();
                        };
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
                        var list = document.createElement('span');
                        list.innerHTML = "<li class='awayfriends'><img style='vertical-align:middle;' height='15' width='15' id='"+id+"'src='"+image+"'/>&nbsp;<a class='linktouser' href='https://scratch.mit.edu/users/"+username+"/'target='_blank'>"+username+"</a><span id='buttons'><a href='https://scratch.mit.edu/users/"+username+"/?comments' target='blank'><img height='14' src='commenticon.png' title='"+chrome.i18n.getMessage("gotocomments")+"'></a>&nbsp;&nbsp;<a style='cursor:pointer' id='remove "+username+"'><img src='removeicon.png' height='14' title='"+chrome.i18n.getMessage("removefromfriends")+"'></a></li><hr style='border: 0;height: 1px;background-image: linear-gradient(to right, rgb(159, 166, 173), rgba(0, 0, 0, 0))'></span>";
                        document.getElementById('awayfriends').appendChild(list);
                        document.getElementById(id).src=image;
                        document.getElementById("remove "+username).onclick = function(){
                            chrome.runtime.sendMessage({removefriend: this.id.substring(7)});
                            getStatuses();
                        };
                    }
                };
                xhttp.open("GET", "https://api.scratch.mit.edu/users/" +response.thelist[i], true);
                xhttp.send();
            }
        });

        chrome.runtime.sendMessage({getfriendsbystatus: "Offline"}, function (response){
            if(JSON.stringify(response.thelist)===offlineresponse){return;}
            offlineresponse = JSON.stringify(response.thelist);
            if(response.thelist==="error"){document.getElementById("errorMessage").innerHTML=chrome.i18n.getMessage("friendserror");return;}
            document.getElementById("errorMessage").innerHTML="";
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
                        var list = document.createElement('span');
                        list.innerHTML = "<li class='offlinefriends'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img style='vertical-align:middle;'height='15' width='15' id='"+id+"'src='"+image+"'/>&nbsp;&nbsp;<a class='linktouser' href='https://scratch.mit.edu/users/"+username+"/'target='_blank'>"+username+"</a><span id='buttons'><a href='https://scratch.mit.edu/users/"+username+"/?comments' target='blank'><img height='14' src='commenticon.png' title='"+chrome.i18n.getMessage("gotocomments")+"'></a>&nbsp;&nbsp;<a style='cursor:pointer' id='remove "+username+"'><img src='removeicon.png' height='14' title='"+chrome.i18n.getMessage("removefromfriends")+"'></a></li><hr style='border: 0;height: 1px;background-image: linear-gradient(to right, rgb(159, 166, 173), rgba(0, 0, 0, 0))'></span>";
                        document.getElementById('offlinefriends').appendChild(list);
                        document.getElementById(id).src=image;
                        document.getElementById("remove "+username).onclick = function(){
                            chrome.runtime.sendMessage({removefriend: this.id.substring(7)});
                            getStatuses();
                        };
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
                        var list = document.createElement('span');
                        list.innerHTML = "<li class='unknownfriends'><img style='vertical-align:middle;' height='15' width='15' id='"+id+"'src='"+image+"'/>&nbsp;<a class='linktouser' href='https://scratch.mit.edu/users/"+username+"/'target='_blank'>"+username+"</a><span id='buttons'><a href='https://scratch.mit.edu/users/"+username+"/?comments' target='blank'><img height='14' src='commenticon.png' title='"+chrome.i18n.getMessage("gotocomments")+"'></a>&nbsp;&nbsp;<a style='cursor:pointer' id='remove "+username+"'><img src='removeicon.png' height='14' title='"+chrome.i18n.getMessage("removefromfriends")+"'></a></li><hr style='border: 0;height: 1px;background-image: linear-gradient(to right, rgb(159, 166, 173), rgba(0, 0, 0, 0))'></span>";
                        document.getElementById('unknownfriends').appendChild(list);
                        document.getElementById(id).src=image;
                        document.getElementById("remove "+username).onclick = function(){
                            chrome.runtime.sendMessage({removefriend: this.id.substring(7)});
                            getStatuses();
                        };
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





    // Easter egg



    function onKonamiCode(cb) {
        var input = '';
        var key = '38384040373937396665';
        document.addEventListener('keydown', function (e) {
            input += ("" + e.keyCode);
            if (input === key) {
                return cb();
            }
            if (!key.indexOf(input)) return;
            input = ("" + e.keyCode);
        });
    }

    onKonamiCode(function () {
        if(document.getElementById("titleonlinefriends").innerHTML=="" || document.getElementById("onlinefriends").innerHTML.includes("kaj")){return;}
        document.getElementById("onlinefriends").innerHTML = '<li class="onlinefriends"><img style="vertical-align:middle;" height="15" width="15" src="https://cdn2.scratch.mit.edu/get_image/user/1_60x60.png">&nbsp;<a class="linktouser">kaj</a></li><hr style="border: 0;height: 1px;background-image: linear-gradient(to right, rgb(159, 166, 173), rgba(0, 0, 0, 0))">' + document.getElementById("onlinefriends").innerHTML;
    });













}; //onload
