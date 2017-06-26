iOlog("isOnline started");

// Transition from v1.2 to v1.3
if (localStorage.getItem("iOaccounts") !== null) {
    chrome.storage.sync({"iOaccounts" : localStorage.getItem("iOaccounts")});
    localStorage.removeItem("iOaccounts");
    localStorage.removeItem("iO.version");
    localStorage.removeItem("iO.was.installed");
}

isOwnAccount = false;
stop = 0;
chrome.storage.sync.get("iOaccounts", function (data) {
    registeredUsers = JSON.stringify(data) === "{}" ? [] : JSON.parse(data.iOaccounts);
    try {nav=document.getElementsByClassName("user-nav")[0].innerHTML;nav=nav.substring(nav.search('<a href="/users/')+16); localuser=nav.substring(0, nav.search('/'));main();}
    catch(err) {if(!String(err).includes("Cannot read property 'innerHTML' of undefined")){console.error("isOnline error.\n" + err);}document.onreadystatechange = function(){localuser = document.getElementsByClassName("profile-name")[0].innerHTML;main();};}
});

/* Easter egg */      if(location.href.toLowerCase().startsWith("https://scratch.mit.edu/search/") && /\?q=the(%20|\+)best\1extension/i.test(location.search)) window.location = "https://scratch.mit.edu/users/isOnlineV2/";
/* Redirect to verification */ if(location.href.toLowerCase().startsWith("https://scratch.mit.edu/isonline-extension/register")) {window.location = "https://scratchtools.tk/isonline/register/";}

function main() {

    // Account validation
    if (window.location.href.startsWith("https://scratch.mit.edu/isonline-extension/verify")) {
        stop = "On verification page";
        document.documentElement.innerHTML = "<!DOCTYPE html><html><head><style>body{background: #f0f0f0;margin: 0;}#vcenter{position: absolute;top: 50%;width: 100%;margin-top: -100px;}h1{text-align: center;font-family: trebuchet ms, courier new, sans-serif;font-size: 2em;}#loader,#loader:before,#loader:after{border-radius: 50%;width: 2.5em;height: 2.5em;-webkit-animation-fill-mode: both;animation-fill-mode: both;-webkit-animation: load7 1.8s infinite ease-in-out;animation: load7 1.8s infinite ease-in-out;}#loader{color: #098e8b;font-size: 10px;margin: 80px auto;position: relative;text-indent: -9999em;-webkit-transform: translateZ(0);-ms-transform: translateZ(0);transform: translateZ(0);-webkit-animation-delay: -0.16s;animation-delay: -0.16s;}#loader:before,#loader:after{content: '';position: absolute;top: 0;}#loader:before{left: -3.5em;-webkit-animation-delay: -0.32s;animation-delay: -0.32s;}#loader:after{left: 3.5em;}@-webkit-keyframes load7{0%,80%,100%{box-shadow: 0 2.5em 0 -1.3em;}40%{box-shadow: 0 2.5em 0 0;}}@keyframes load7{0%,80%,100%{box-shadow: 0 2.5em 0 -1.3em;}40%{box-shadow: 0 2.5em 0 0;}}</style></head><body><div id='vcenter'><h1 id='header'>Validating isOnline account</h1><div id='loader'></div></div></body></html>";
        test = new XMLHttpRequest();
        test.open("GET", ' https://scratchtools.tk/isonline/api/v1/' + localuser + '/' + location.hash.substring(1) + "/test/", true);
        test.send();
        test.onreadystatechange = function() {
            if (test.readyState === 4 && test.status === 200 && test.responseText == '{"valid":true}') {
                if ((indx = registeredUsers.findIndex(k => k.name === localuser)) === -1) {
                    chrome.storage.sync.set({"iOaccounts" : JSON.stringify((registeredUsers === null ? [] : registeredUsers).concat({
                        "name": localuser,
                        "key": location.hash.substring(1)
                    }))});
                } else {
                    chrome.storage.sync.set({"iOaccounts" : JSON.stringify(registeredUsers.slice(0, indx).concat({
                        "name": localuser,
                        "key": location.hash.substring(1)
                    }).concat(registeredUsers.slice(indx + 1)))});
                }
                document.getElementById("loader").style.display = "none";
                document.getElementById("header").innerHTML = "<center><h3 style='color:green'>Successfully validated your Scratch account.<br>isOnline is now working. <br>You can close this tab.</h3></center>";
            } else {
                document.getElementById("loader").style.display = "none";
                document.getElementById("header").innerHTML = "<center><h3 style='color:red'>An error occured. Please contact <a href='https://scratch.mit.edu/users/chooper100#comments'>@chooper100</a> if you come from isOnline account validation.</h3></center>";
            }
        };
    }

    // Account data delete page
    if(location.href.toLowerCase().startsWith("https://scratch.mit.edu/isonline-extension/deletedata")) {
        document.documentElement.innerHTML = '<html><head><style>body{background: #f0f0f0;margin: 0;}#vcenter{position: absolute;top: 50%;width: 100%;margin-top: -100px;}h1{text-align: center;font-family: trebuchet ms, courier new, sans-serif;font-size: 2em;}</style></head><body><div id="vcenter"><h1 id="header"><center><h3 style="color:red">Delete isOnline account data?<br><br><a href="#" id="deletedata">OK</a></h3></center></h1></div></body></html>';
        document.getElementById("deletedata").onclick = function(){chrome.storage.sync.remove("iOaccounts");};
    }

    // Data for helping page
    if(location.href.toLowerCase().startsWith("https://scratch.mit.edu/isonline-extension/helpdata")) {document.documentElement.innerHTML = "<center><h2><b>Important: ONLY give this information to the official isOnline account, @isOnlineV2.</b></h2></center><br><br><small>" + JSON.stringify(localStorage)+JSON.stringify(registeredUsers)+JSON.stringify(chrome.runtime.getManifest()) + "</small>";}

    if (registeredUsers.length === 0) {
        stop = "User didn't validate any account.";
        isError();
        didntValidate();}

    if (registeredUsers.findIndex(user => user.name === localuser) === -1 && registeredUsers.length !== 0) {
        stop = "User validated another account.";
        try{document.getElementsByClassName("location")[0].innerHTML += ' | <small><a href="https://scratchtools.tk/isonline/register/" target="_blank">Validate this account </a> to use isOnline on it</small>';}catch(err){}
        unvalidatedAcc();}

    key = registeredUsers.find(user => user.name === localuser).key;
    if (key == "changed") {keyWasChanged("y");stop="Key was changed";}

    if(stop!==0){console.error("isOnline error: "+stop);return;}

    url = window.location.href;
    user = window.location.href.substring(30,100).substring(0, window.location.href.substring(30,100).indexOf('/'));
    iOlog("Profile: " + user);
    iOlog("Local username: " + localuser);

    if (time()-localStorage.getItem("iOlastOn") > 10 && localstatus() == "online") {setOnline();}

    /* Manage statuses */ window.addEventListener('load',function(){update();setInterval(update, 3000);});

    if (url.substring(24,29) == 'users' && (url.match(/\//g) || []).length == 5) {
        iOlog("Detected user is in a profile");
        /* Add status box next to location */ document.getElementsByClassName("location")[0].innerHTML += ' | <span style="display:inline" id="iOstatus"></span>';
        if (localuser.toUpperCase() == user.toUpperCase()) {iOlog("Detected user is their own profile");isOwn();} else {
            iOcrown();
            if(time()-localStorage.getItem("iOlastprofile")>5){status();}else{
                document.getElementById("iOstatus").innerHTML = "<a id='clickforstatus'>Click to get status</a>";
                document.getElementById("clickforstatus").onclick = status;}
            localStorage.setItem("iOlastprofile", time());
        }
    }

} // main function




















function update() {
    if (stop !== 0 || window.location.href.startsWith("https://scratch.mit.edu/isonline-extension")) {return;}
    if (localstatus() == "online") {
        updateStatus("");
        if (time()-localStorage.getItem("iOlastOn") > 240 && time()-localStorage.getItem("iOlastAbs") > 120) {
            chrome.runtime.sendMessage({status: "absent"});
            absentrequest = new XMLHttpRequest();
            absentrequest.open("POST", 'https://scratchtools.tk/isonline/api/v1/' + localuser + '/' + key + '/set/absent', true);
            absentrequest.send();
            checkResponse(absentrequest);
            localStorage.setItem("iOlastAbs", time());
            iOlog("Sent away request");}}
    if (localstatus() == "absent"){
        updateStatus("orange");
        if (time()-localStorage.getItem("iOlastAbs") > 120) {
            absentrequest = new XMLHttpRequest();
            absentrequest.open("POST", 'https://scratchtools.tk/isonline/api/v1/' + localuser + '/' + key + '/set/absent', true);
            absentrequest.send();
            checkResponse(absentrequest);
            localStorage.setItem("iOlastAbs", time());
            iOlog("Sent away request");}}
    if (localstatus() == "offline") {
        updateStatus("grey");}
}



function status() {

    if(stop!==0){return;}

    iOlog("Started status scan");

    document.getElementById("iOstatus").innerHTML="Loading status...";

    try{
        var a = document.getElementsByClassName("time")[0].innerText;
        var b=["0 minutes ago", "1 minute ago", "2 minutes ago", "3 minutes ago", "4 minutes ago", "5 minutes ago"];
        if(b.includes(a)){probablyOnline();}
        if(b.includes(a)){return;}
    }catch(err){}

    getstatus = new XMLHttpRequest();getstatus.open("GET", ' https://scratchtools.tk/isonline/api/v1/' + localuser + '/' + key + "/get/" + user, true);getstatus.send();

    getstatus.onreadystatechange = function() {
        if (getstatus.readyState === 4) {
            if (getstatus.status === 200) {

                response  = getstatus.responseText;
                timestamp = JSON.parse(response).timestamp;
                var status = JSON.parse(response).status;

                if (status == "online") {
                    if (time() - timestamp < 300) {isOnline();} else{isOffline();}}

                if (status == "absent") {
                    if (time() - timestamp < 180) {isAbsent();} else{isOffline();}}

                if (time()-timestamp>604800) {
                    if (a!==undefined){if (!(a.includes("week") || a.includes("month") || a.includes("year"))){isUnknown();}}}

            } // if 200

            if (getstatus.status === 404) {noiO();}

            if (getstatus.status === 403) {
                isError();
                var status = JSON.parse(getstatus.responseText).status;
                if (status=="incorrect key") {stop = "Key was changed";keyWasChanged("n");}
                if (status=="bot") {stop = "User is a bot";isBot();}
            }

            if (getstatus.status === 500) {isError();}


        }}; // on ready

}

function isOwn(){
    opt = [{"name": "Auto (Online)",   "value" : "online",  "color": "green"},
           {"name": "Away",            "value" : "absent",  "color": "orange"},
           {"name": "Offline (ghost)", "value" : "offline", "color": "grey"}];
    isOwnAccount = true;
    document.getElementById("iOstatus").innerHTML = '<img id="iostatusimage" src="https://scratchtools.tk/isonline/assets/' + (localstatus() === "ghost" ? "offline" : localstatus()) + '.svg" height="12" width="12">';
    document.getElementById("iOstatus").innerHTML += " <select id='ioselect' style='font-weight: color: " + opt.find(k => localstatus() === k.value).color + "; width: 105px; padding:0px; font-size:13px; height:23px; margin:0px;'>" + opt.map(k => "<option style='color:" + k.color + ";' " + (k.value === localstatus() ? "selected" : "") +">" + k.name + "</option>") + "</select>" + " <small><div id=\"ownstatushelp\" style=\"display:inline\" onmouseover=\"document.getElementById(\'ownstatushelp\').innerHTML=\'? You can choose your status to be automatically set to the correct one, or manually select to be seen as Away or Offline.'\" onmouseout=\"document.getElementById(\'ownstatushelp\').innerHTML=\'?\';\">?<\/div><\/small>";
    iOcrown();
    document.getElementById("ioselect").addEventListener("change", changed);
    console.log("test");
}

function isOnline() {
    iOlog("Detected that the user is online");
    document.getElementById("iOstatus").innerHTML = '<img src="https://scratchtools.tk/isonline/assets/online.svg" height="12" width="12"> <span id="iOstatustext" style="color:green">Online</span>' + " <small><div id=\"statushelp\" style=\"display:inline\" onmouseover=\"document.getElementById(\'statushelp\').innerHTML=\'? isOnline detected Scratch network activity from the last 5 minutes.'\" onmouseout=\"document.getElementById(\'statushelp\').innerHTML=\'?\';\">?<\/div><\/small>";}

function probablyOnline() {
    iOlog("Detected that the user is probably online");
    document.getElementById("iOstatus").innerHTML = '<img src="https://scratchtools.tk/isonline/assets/online.svg" height="12" width="12"> <span id="iOstatustext" style="color:green">Probably online</span>' + " <small><div id=\"statushelp\" style=\"display:inline\" onmouseover=\"document.getElementById(\'statushelp\').innerHTML=\'? This user shows activity on their What I\\'ve been doing from the last 5 minutes.'\" onmouseout=\"document.getElementById(\'statushelp\').innerHTML=\'?\';\">?<\/div><\/small>";}

function isOffline() {
    iOlog("Detected that the user is offline");
    document.getElementById("iOstatus").innerHTML = '<img src="https://scratchtools.tk/isonline/assets/offline.svg" height="12" width="12"> <span id="iOstatustext" style="color:red">Offline</span>' + " <small><div id=\"statushelp\" style=\"display:inline\" onmouseover=\"document.getElementById(\'statushelp\').innerHTML=\'? isOnline did not detect Scratch network activity from the last 5 minutes.'\" onmouseout=\"document.getElementById(\'statushelp\').innerHTML=\'?\';\">?<\/div><\/small>";}

function isAbsent() {
    iOlog("Detected that the user is away");
    document.getElementById("iOstatus").innerHTML = '<img src="https://scratchtools.tk/isonline/assets/absent.svg" height="12" width="12"> <span id="iOstatustext" style="color:orange">Away</span>' + " <small><div id=\"statushelp\" style=\"display:inline\" onmouseover=\"document.getElementById(\'statushelp\').innerHTML=\'? isOnline detected Scratch network activity recently but not interactions with Scratch tabs.'\" onmouseout=\"document.getElementById(\'statushelp\').innerHTML=\'?\';\">?<\/div><\/small>";}

function isUnknown() {
    iOlog("Detected that the user status is unknown");
    document.getElementById("iOstatus").innerHTML = 'Unknown' + " <small><div id=\"statushelp\" style=\"display:inline\" onmouseover=\"document.getElementById(\'statushelp\').innerHTML=\'? isOnline did not detect activity in the last week. This user may not use isOnline anymore.'\" onmouseout=\"document.getElementById(\'statushelp\').innerHTML=\'?\';\">?<\/div><\/small>";}

function noiO() {
    iOlog("Detected that the user didn't install isOnline");
    document.getElementById("iOstatus").innerHTML = 'Not iO user'+ " <small><div id=\"statushelp\" style=\"display:inline\" onmouseover=\"document.getElementById(\'statushelp\').innerHTML=\'? This user has to install isOnline in order to show their status.'\" onmouseout=\"document.getElementById(\'statushelp\').innerHTML=\'?\';\">?<\/div><\/small>";}

function isError() { try{
    try { document.getElementById("iOstatus").innerHTML = '<span title="Error: ' + stop + '">Error</span>';} catch(err){
        document.getElementsByClassName("location")[0].innerHTML += ' | <span title="Error: ' + stop + '">Error</span>';}}catch(err){}}

function didntValidate() {
    if(window.location.href=="https://scratch.mit.edu/projects/149841742/"){return;}
    try{ document.getElementById("alert-view").innerHTML="<div class='alert fade in alert-success' style='display: block;'><span class='close' onclick='document.getElementById(\"alert-view\").style.display=\"none\";'>×</span>Whoops! Looks like you didn't validate your account on isOnline. isOnline won't work until you <a href='https://scratchtools.tk/isonline/register/#"+localuser+"' target='blank' >validate your account</a>.</span> It takes around 20 seconds.</div>";}catch(err){}}

function unvalidatedAcc() {
    if (time()-localStorage.getItem("iObanner") < 86400) {return;}
    if(window.location.href.includes("users")){
        document.getElementById("alert-view").innerHTML="<div class='alert fade in alert-success' style='display: block;'><span class='close' onclick='document.getElementById(\"alert-view\").style.display=\"none\";localStorage.setItem(\"iObanner\"," + time() + ")'>×</span>Whoops! isOnline isn't working on this Scratch account because it isn\'t validated. Want to use isOnline on this account too? <a href='https://scratchtools.tk/isonline/register/#"+localuser+"' target='blank' >Validate an additional user</a>.</div>";}}

function keyWasChanged(stored) {
    if (stored == "n") {
        indx = registeredUsers.findIndex(k => k.name === localuser);
        chrome.storage.sync.set({"iOaccounts" : JSON.stringify(registeredUsers.slice(0, indx).concat({
            "name": localuser,
            "key": "changed"
        }).concat(registeredUsers.slice(indx + 1)))});}
    try{
        console.error("isOnline error: Key was changed");
        document.getElementById("alert-view").innerHTML="<div class='alert fade in alert-success' style='display: block;'><span class='close' onclick='document.getElementById(\"alert-view\").style.display=\"none\";'>×</span>Whoops! isOnline isn't working. This may occur if you installed iO on another computer. isOnline won't work with this Scratch account on this computer until you <a href='https://scratchtools.tk/isonline/register/#"+localuser+"' target='blank'>re-validate</a>.</div>";}catch(err){}}

function isBot() { try{
    console.error("isOnline error: User has been marked as a bot");
    document.getElementById("alert-view").innerHTML="<div class='alert fade in alert-success' style='display: block;'><span class='close' onclick='document.getElementById(\"alert-view\").style.display=\"none\";'>×</span>Whoops! It looks like you've been marked as a bot by the isOnline server. isOnline isn't working. Please contact <a href='https://scratch.mit.edu/users/chooper100/#comments' target='blank'>chooper100</a> to unblock your account.</div>";}catch(err){}}

function iOlog(x) {
    if (localStorage.getItem("isonline_logs") === undefined) {return;}
    console.log("isOnline log @ " + new Date().toLocaleTimeString() + ": " + x);}

function setOnline() {
    chrome.runtime.sendMessage({status: "online"});
    iOlog("Sent online request");
    onlinerequest = new XMLHttpRequest();
    onlinerequest.open("POST", 'https://scratchtools.tk/isonline/api/v1/' + localuser + '/' + key + '/set/online', true);
    onlinerequest.send();
    checkResponse(onlinerequest);
    localStorage.setItem("iOlastOn", time());}

function updateStatus(color) {
    chrome.runtime.sendMessage({status: color});
    try {document.getElementsByClassName("user-name dropdown-toggle")[0].style.backgroundColor=color;}
    catch(err) {document.getElementsByClassName("link right account-nav")[0].style.backgroundColor=color;}
    color = color === "" ? "green" : color;
    if(isOwnAccount && document.getElementById("ioselect").style.color !== color){
        document.getElementById("ioselect").selectedIndex = opt.findIndex(k => k.color === color);
        document.getElementById("ioselect").style.color = color;
        document.getElementById("iostatusimage").src = "https://scratchtools.tk/isonline/assets/" + opt.find(k => k.color === color).value + ".svg";}
}

function localstatus(){if(localStorage.getItem("iOstatus")!==null){return localStorage.getItem("iOstatus");}else{return "online";}}

function time() {return Math.floor(Date.now() / 1000);}

function iOcrown() { try { if (document.getElementsByClassName("overview")[0].innerHTML.toLowerCase().includes("isonline.tk") || document.getElementsByClassName("overview")[1].innerHTML.toLowerCase().includes("isonline.tk")) { document.getElementsByClassName("header-text")[0].innerHTML = document.getElementsByClassName("header-text")[0].innerHTML.replace('</h2>', ' <a href="https://scratch.mit.edu/projects/158291459/" target="_blank" title="isOnline crown">👑</a></h2>').replace('<h2>', '<h2 style="color:orange;text-shadow:none;">'); } } catch (err) { try { if (document.getElementById("user-details").innerHTML.toLowerCase().includes("isonline.tk")) { document.getElementsByClassName("header-text")[0].innerHTML = document.getElementsByClassName("header-text")[0].innerHTML.replace('</h2>', ' <a href="https://scratch.mit.edu/projects/158291459/" target="_blank" title="isOnline crown">👑</a></h2>').replace('<h2>', '<h2 style="color:orange;text-shadow:none;">'); } } catch (err) {} } } 

function changed() {document.getElementById("ioselect").style.color=opt[document.getElementById("ioselect").selectedIndex].color;localStorage.setItem("iOstatus", opt[document.getElementById("ioselect").selectedIndex].value);document.getElementById("iostatusimage").src="https://scratchtools.tk/isonline/assets/" +opt[document.getElementById("ioselect").selectedIndex].value+".svg";update();}

function checkResponse(request) {
    request.onreadystatechange = function() {if (request.readyState === 4){
        if (request.status !== 200) {
            result = JSON.parse(request.responseText).result;
            if (result=="incorrect key") {stop = "Key was changed";isError();keyWasChanged("n");}
            if (result=="bot") {stop = "User is a bot";isError();isBot();}
        }}};}