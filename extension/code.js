iOlog("isOnline started");

opt = [{"name": "Online",          "value" : "online",  "color": "green"},
       {"name": "Away",            "value" : "absent",  "color": "orange"},
       {"name": "Offline (ghost)", "value" : "offline", "color": "grey"}];
isOwnAccount = false;
stop = 0;
try {localuser = document.documentElement.innerHTML.substring(document.documentElement.innerHTML.search("username")+10,document.documentElement.innerHTML.search("username")+100).match(/\'(.*)\'/).pop();main();}
catch(err) {document.onreadystatechange = function(){localuser = document.getElementsByClassName("profile-name")[0].innerHTML;main();}}

if(location.href.toLowerCase().startsWith("https://scratch.mit.edu/search/") && /\?q=the(%20|\+)best\1extension/i) location.href = "https://scratch.mit.edu/users/isOnlineV2/"; // easter egg!

function main() {

    /* One line account key validation */ if (window.location.href.startsWith("https://scratch.mit.edu/isonline-extension/verify")){stop = "On verification page";document.documentElement.innerHTML = "<center><h1 style='font-family:verdana';>Validating...</h1></center>";test = new XMLHttpRequest();test.open("GET", ' https://scratchtools.tk/isonline/api/v1/' + localuser + '/' + location.hash.substring(1) + "/test/", true);test.send();test.onreadystatechange = function() {if (test.readyState === 4 && test.status === 200  && test.responseText == '{"valid":true}') {localStorage.setItem("iOuser", localuser);localStorage.setItem("iOkey", location.hash.substring(1));document.documentElement.innerHTML = "<center><h1 style='font-family:verdana; color:green'>Successfully validated your Scratch account. isOnline is now working. <br>You can close this tab.</h1></center>";}else {document.documentElement.innerHTML = "<center><h1 style='font-family:verdana; color:red'>An error occurred. Please contact <a href='https://scratch.mit.edu/users/chooper100#comments'>@chooper100</a> if you come from isOnline account validation.</h1></center>";}}}

    if (localStorage.getItem("iOuser") === null) {
        stop = "User didn't validate any account.";
        isError();
        didntValidate();}

    if (localuser != localStorage.getItem("iOuser") && localStorage.getItem("iOuser") !== null) {
        stop = "User validated another account.";
        isError();
        unvalidatedAcc();}

    if(stop!==0){console.error("isOnline error: "+stop);return;}

    url = window.location.href;
    user = window.location.href.substring(30,100).substring(0, window.location.href.substring(30,100).indexOf('/'));
    key = localStorage.getItem("iOkey");
    iOlog("Profile: " + user);
    iOlog("Local username: " + localuser);


    if (time()-localStorage.getItem("iOlastOn") > 10 && localstatus() == "online") {setOnline();}

    /* Manage statuses */ update(); setInterval(update, 3000);

    if (url.substring(24,29) == 'users' && (url.match(/\//g) || []).length == 5) {
        iOlog("Detected user is in a profile");
        /* Add status box next to location */ document.getElementsByClassName("location")[0].innerHTML += ' | <span style="display:inline" id="iOstatus">Loading status...</span>';
        if (localuser.toUpperCase() == user.toUpperCase()) {iOlog("Detected user is their own profile");isOwn();} else {status();}}

} // main function
























































function update() {
    if (stop !== 0) {return;}
    if (localstatus() == "online") {
        updateStatus("");
        if (time()-localStorage.getItem("iOlastOn") > 240 && time()-localStorage.getItem("iOlastAbs") > 120) {
            absentrequest = new XMLHttpRequest();
            absentrequest.open("POST", 'https://scratchtools.tk/isonline/api/v1/' + localuser + '/' + key + '/set/absent', true);
            absentrequest.send();
            localStorage.setItem("iOlastAbs", time());
            iOlog("Sent away request");}}
    if (localstatus() == "absent"){
        updateStatus("orange");
        if (time()-localStorage.getItem("iOlastAbs") > 120) {
            absentrequest = new XMLHttpRequest();
            absentrequest.open("POST", 'https://scratchtools.tk/isonline/api/v1/' + localuser + '/' + key + '/set/absent', true);
            absentrequest.send();
            localStorage.setItem("iOlastAbs", time());
            iOlog("Sent away request");}}
    if (localstatus() == "offline") {
        updateStatus("grey");}
}



function status() {

    if(stop!==0){return;}

    iOlog("Started status scan");

    getstatus = new XMLHttpRequest();getstatus.open("GET", ' https://scratchtools.tk/isonline/api/v1/' + localuser + '/' + key + "/get/" + user, true);getstatus.send();

    getstatus.onreadystatechange = function() {
        if (getstatus.readyState === 4 && getstatus.status === 200) {

            response  = getstatus.responseText;
            timestamp = JSON.parse(response).timestamp;
            var status = JSON.parse(response).status;

            if (status == "online") {
                if (time() - timestamp < 300) {isOnline();} else{isOffline();}}

            if (status == "absent") {
                if (time() - timestamp < 180) {isAbsent();} else{isOffline();}}

        } // if 200

        if (getstatus.readyState === 4 && getstatus.status === 404) {noiO();}

        if (getstatus.readyState === 4 && getstatus.status === 403) {
            isError();
            var status = JSON.parse(getstatus.responseText).status;
            if (status=="incorrect key") {stop = "Key was changed";keyWasChanged();}
            if (status=="bot") {stop = "User is a bot";isBot();}
        }

        if (getstatus.readyState === 4 && getstatus.status === 500) {isError();}


    } // on ready

}

function isOwn(){
    isOwnAccount = true;
    document.getElementById("iOstatus").innerHTML = '<img id="iostatusimage" src="https://scratchtools.tk/isonline/assets/' + (localstatus() === "ghost" ? "offline" : localstatus()) + '.svg" height="12" width="12">';
    document.getElementById("iOstatus").innerHTML += " <select id='ioselect' style='font-weight: bold; color: " + opt.find(k => localstatus() === k.value).color + "; width: 120px; padding:0px; font-size:13px; height:23px; margin:0px;' onchange='this.style.color=opt[this.selectedIndex].color;localStorage.setItem(\"iOstatus\", opt[this.selectedIndex].value);document.getElementById(\"iostatusimage\").src=\"https://scratchtools.tk/isonline/assets/\" +opt[this.selectedIndex].value+\".svg\"'>" + opt.map(k => "<option style='background-color: " + k.color + "; color: white;' " + (k.value === localstatus() ? "selected" : "") +">" + k.name + "</option>") + "</select>";
    iOcrown();
}

function isOnline() {
    iOlog("Detected that the user is online");
    document.getElementById("iOstatus").innerHTML = '<img src="https://scratchtools.tk/isonline/assets/online.svg" height="12" width="12"> <span id="iOstatustext" style="color:green">Online</span>';iOcrown();}

function isOffline() {
    iOlog("Detected that the user is offline");
    document.getElementById("iOstatus").innerHTML = '<img src="https://scratchtools.tk/isonline/assets/offline.svg" height="12" width="12"> <span id="iOstatustext" style="color:red">Offline</span>';iOcrown();}

function isAbsent() {
    iOlog("Detected that the user is away");
    document.getElementById("iOstatus").innerHTML = '<img src="https://scratchtools.tk/isonline/assets/absent.svg" height="12" width="12"> <span id="iOstatustext" title="The user has open inactive Scratch tabs" style="color:orange">Away</span>';iOcrown();}

function noiO() {
    iOlog("Detected that the user didn't install isOnline");
    document.getElementById("iOstatus").innerHTML = '<span title="This user has to install isOnline in order to show their status">Not iO user</span>';}

function isError() { try{
    try { document.getElementById("iOstatus").innerHTML = '<span title="Error getting the status. Read the orange box above">Error</span>';} catch(err){
        document.getElementsByClassName("location")[0].innerHTML = document.getElementsByClassName("location")[0].innerHTML + ' | <span title="Error getting the status. Read the orange box above">Error</span>';}}catch(err){}}

function didntValidate() { try{
    document.getElementById("alert-view").innerHTML="<div class='alert fade in alert-success' style='display: block;'><span class='close' onclick='document.getElementById(\"alert-view\").style.display=\"none\";'>×</span>Whoops! Looks like you didn't validate your account on isOnline. isOnline won't work until you <a href='https://scratchtools.tk/isonline/register' target='blank' >validate your account</a>.</span> It takes around 20 seconds.</div>";}catch(err){}}

function unvalidatedAcc() { if(window.location.href.includes("users")){
    document.getElementById("alert-view").innerHTML="<div class='alert fade in alert-success' style='display: block;'><span class='close' onclick='document.getElementById(\"alert-view\").style.display=\"none\";'>×</span>Whoops! Looks like you didn\'t validate isOnline on the account you are using now, so it's not working. If needed, login to " + localStorage.getItem("iOuser") + ", or unregister it by <a href='https://scratchtools.tk/isonline/register' target='blank'>registering " + localuser + " instead</a>.</div>";}}

function keyWasChanged() {
    console.error("isOnline error: Key was changed");
    document.getElementById("alert-view").innerHTML="<div class='alert fade in alert-success' style='display: block;'><span class='close' onclick='document.getElementById(\"alert-view\").style.display=\"none\";'>×</span>Whoops! isOnline isn't working. This may ocurr if you installed iO on another computer. iO can only work at one computer at the same time. You can use isOnline on this computer by <a href='https://scratchtools.tk/isonline/register' target='blank'>re-validating</a>.</div>";}

function isBot() {
    console.error("isOnline error: User has been marked as a bot");
    document.getElementById("alert-view").innerHTML="<div class='alert fade in alert-success' style='display: block;'><span class='close' onclick='document.getElementById(\"alert-view\").style.display=\"none\";'>×</span>Whoops! It looks like you've been marked as a bot by the isOnline server. isOnline isn't working. Please contact <a href='https://scratch.mit.edu/users/chooper100/#comments' target='blank'>chooper100</a> to unblock your account.</div>";}

function iOlog(x) {
    if (localStorage.getItem("isonline_logs") === undefined) {return;}
    console.log("isOnline log @ " + new Date().toLocaleTimeString() + ": " + x);}

function setOnline() {
    iOlog("Sent online request");
    onlinerequest = new XMLHttpRequest();
    onlinerequest.open("POST", 'https://scratchtools.tk/isonline/api/v1/' + localuser + '/' + key + '/set/online', true);
    onlinerequest.send();
    localStorage.setItem("iOlastOn", time());}

function updateStatus(color) {
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

function iOcrown() {try{if(document.getElementsByClassName("overview")[0].innerHTML.toLowerCase().includes("isonline.tk") || document.getElementsByClassName("overview")[1].innerHTML.toLowerCase().includes("isonline.tk")) {document.getElementsByClassName("header-text")[0].innerHTML = document.getElementsByClassName("header-text")[0].innerHTML.replace('</h2>', ' <a href="https://scratch.mit.edu/projects/158291459/" target="_blank" title="isOnline crown">👑</a></h2>').replace('<h2>', '<h2 style="color:white;">');document.getElementsByClassName("box-head")[0].style.backgroundColor="black";document.getElementsByClassName("header-text")[0].style.backgroundColor="black";document.getElementsByClassName("group")[0].style.color="white";document.getElementsByClassName("profile-details")[0].style.color="white";document.getElementById("iOstatustext").style.color="white";}}catch(err) {if (document.getElementById("user-details").innerHTML.toLowerCase().includes("isonline.tk")) {document.getElementsByClassName("header-text")[0].innerHTML = document.getElementsByClassName("header-text")[0].innerHTML.replace('</h2>', ' <a href="https://scratch.mit.edu/projects/158291459/" target="_blank" title="isOnline crown">👑</a></h2>').replace('<h2>', '<h2 style="color:white;">');document.getElementsByClassName("box-head")[0].style.backgroundColor="black";document.getElementsByClassName("header-text")[0].style.backgroundColor="black";document.getElementsByClassName("group")[0].style.color="white";document.getElementsByClassName("profile-details")[0].style.color="white";document.getElementById("iOstatustext").style.color="white";}}}

var openregister = false;
if (!localStorage['iO.was.installed']) {openregister = true; localStorage['iO.was.installed'] = '1'; localStorage['iO.version'] = "1.1";}
if (openregister) window.location="https://scratchtools.tk/isonline/register";

var openupdate = false;
if (localStorage['iO.version'] !== "1.1" && localStorage['iO.was.installed']!==null) {openupdate = true; localStorage['iO.version'] = "1.1";}
if (openupdate) window.location="https://isonlineupdate.blogspot.com";
