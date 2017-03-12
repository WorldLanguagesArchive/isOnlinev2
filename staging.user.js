// ==UserScript==
// @name         isOnline v2
// @namespace    http://aremyfriends.online
// @version      2.0
// @description  Know who is online on Scratch!
// @author       @World_Languages & @chooper100
// @match        https://scratch.mit.edu/*
// @icon         https://raw.githubusercontent.com/WorldLanguages/isOnlinev2/master/logo.png
// ==/UserScript==

console.log("isOnline log: Userscript started");
var stop = 0;
try {var localuser = Scratch.INIT_DATA.LOGGED_IN_USER.model.username;} catch(err) {var localuser = document.getElementsByClassName("profile-name")[0].innerHTML;}

if (window.location.href.startsWith("https://scratch.mit.edu/verify")) {
    document.documentElement.innerHTML = "<center><h1 style='font-family:verdana';>Validating...</h1></center>";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", ' http://staging.scratchtools.tk/isonline/api/v1/' + localuser + '/' + location.hash.substring(1) + "/test/", true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.responseText.includes("true")) {
            localStorage.setItem("iOuser", Scratch.INIT_DATA.LOGGED_IN_USER.model.username);
            localStorage.setItem("iOkey", location.hash.substring(1));
            document.documentElement.innerHTML = "<center><h1 style='font-family:verdana; color:green'>Successfully validated your Scratch account. isOnline is now working. <br>You can close this tab.</h1></center>";}
        else {
            document.documentElement.innerHTML = "<center><h1 style='font-family:verdana; color:red'>An error occurred. Please contact <a href='https://scratch.mit.edu/users/chooper100#comments'>@chooper100</a> if you come from isOnline account validation.</h1></center>";}}}


if (localStorage.getItem("iOuser") === null) {
    stop = "User didn't validate any account. Stopped script."; try { window.addEventListener('load', function () {
        isError();
        document.getElementsByClassName("confirm-email banner")[0].style.display = "block";
        document.getElementsByClassName("confirm-email banner")[0].innerHTML = "<span>Whoops! Looks like you didn't validate your account on isOnline. isOnline won't work until you <a href='https://scratchtools.tk/isonline/register' target='blank' >validate your account</a>.</span> It takes around 20 seconds.";});} catch(err){}
}

if (localuser != localStorage.getItem("iOuser") && window.location.href.includes("users") && localStorage.getItem("iOuser") !== null) {
    stop = "User validated another account. Stopped script.";
    window.addEventListener('load', function () {
        isError();
        document.getElementsByClassName("confirm-email banner")[0].style.display = "block";
        document.getElementsByClassName("confirm-email banner")[0].style.color = "black";
        document.getElementsByClassName("confirm-email banner")[0].innerHTML = "<span>Whoops! Looks like you didn't validate isOnline on the account you are using now, so it's not working. If needed, login to " + localStorage.getItem("iOuser") + ", or unregister it by <a href='https://scratchtools.tk/isonline/register' target='blank'>registering " + localuser + " instead</a>.  <a onclick='document.getElementsByClassName(\"confirm-email banner\")[0].style.display = \"none\";'>X</span>";});
}



if (stop === 0) {







    var url = window.location.href;
    var user = window.location.href.substring(30,100).substring(0, window.location.href.substring(30,100).indexOf('/'));
    var key = localStorage.getItem("iOkey");
    iOlog("Profile: " + user);
    iOlog("Local username: " + localuser);

    if (localStorage.getItem("iOlastAbs") === null) {localStorage.setItem("iOlastAbs", 0);}

    setTimeout(function () {
        absent();
        setInterval(absent, 10000);
    }, 240000);




    window.addEventListener('load', function () {

        iOlog("Detected that page finished loading");

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", 'http://staging.scratchtools.tk/isonline/api/v1/' + localuser + '/' + key + '/set/online', true);
        xmlhttp.send();
        localStorage.setItem("iOlastOn", time());
        iOlog("Sent online request");






        if (url.substring(24,29) == 'users' && (url.match(/\//g) || []).length == 5 ) {
            iOlog("Detected user is in a profile");

            document.getElementsByClassName("location")[0].innerHTML = document.getElementsByClassName("location")[0].innerHTML + ' | <p style="display:inline" id="iOstatus">Loading status...</p>';

            if (localuser.toUpperCase() == user.toUpperCase()) {
                iOlog("Detected user is their own profile");
                isOnline();}
            else {
                status();}}


        /*if (url == "https://scratch.mit.edu/accounts/settings/") {
            document.getElementById("main-content").innerHTML = document.getElementById("main-content").innerHTML + '<br><br><h4>isOnline settings</h4> <br><label>iO code</label><input type="text" id="isOnlinecode"> <br> <button type="ll">Change code</button> <br><br><br><br>';}*/

    });







} else {iOlog(stop);}





















//FUNCTIONS

function status() {

    iOlog("Started status scan");

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {

            response  = xmlhttp.responseText;
            var parsedData = JSON.parse(response);
            var timestamp = parsedData.timestamp;
            var status = parsedData.status;

            if (status == "online") {
                if (time() - timestamp < 300) {isOnline();} else{isOffline();}}

            if (status == "absent") {
                if (time() - timestamp < 180) {isAbsent();} else{isOffline();}}

        }

        if (xmlhttp.readyState === 4 && xmlhttp.status === 404) {noiO();}

        if (xmlhttp.readyState === 4 && xmlhttp.status === 0) {isError(); document.getElementsByClassName("confirm-email banner")[0].style.display = "block";document.getElementsByClassName("confirm-email banner")[0].style.color = "black";
        document.getElementsByClassName("confirm-email banner")[0].innerHTML = "<span>Whoops! There's an error with isOnline. This may ocurr if you installed iO on another computer. iO can only work at one computer at the same time. You can temporarily use isOnline on this computer by <a href='https://scratchtools.tk/isonline/register' target='blank'>re-validating</a>. <a onclick='document.getElementsByClassName(\"confirm-email banner\")[0].style.display = \"none\";'>X</span>";}


}

xmlhttp.open("GET", ' http://staging.scratchtools.tk/isonline/api/v1/' + localuser + '/' + key + "/get/" + user, true);
xmlhttp.send();

}












function absent() {
    if (time()-localStorage.getItem("iOlastOn") > 240 && time()-localStorage.getItem("iOlastAbs") > 120) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", 'http://staging.scratchtools.tk/isonline/api/v1/' + localuser + '/' + key + '/set/absent', true);
        xmlhttp.send();
        localStorage.setItem("iOlastAbs", time());
        iOlog("Sent absent request");
    }}






function isOnline() {
    iOlog("Detected that the user is online");
    document.getElementById("iOstatus").innerHTML = '<img src="https://raw.githubusercontent.com/WorldLanguages/isOnlinev2/master/Online.svg" height="14" width="14"> <h4 style="color: green">Online</h4>';}

function isOffline() {
    iOlog("Detected that the user is offline");
    document.getElementById("iOstatus").innerHTML = '<img src="https://raw.githubusercontent.com/WorldLanguages/isOnlinev2/master/Offline.svg" height="14" width="14"> <h4 style="color: red">Offline</h4>';}

function isAbsent() {
    iOlog("Detected that the user is absent");
    document.getElementById("iOstatus").innerHTML = '<img src="https://raw.githubusercontent.com/WorldLanguages/isOnlinev2/master/Absent.svg" height="14" width="14"> <h4 style="color: orange">Absent</h4>';}

function noiO() {
    iOlog("Detected that the user didn't install isOnline");
    document.getElementById("iOstatus").innerHTML = '<span title="This user has to install isOnline in order to show their status">Not iO user</span>';}

function isError() {
    try { document.getElementById("iOstatus").innerHTML = '<span title="Error getting the status. Read the orange box above">Error</span>';} catch(err){
    document.getElementsByClassName("location")[0].innerHTML = document.getElementsByClassName("location")[0].innerHTML + ' | <span title="Error getting the status. Read the orange box above">Error</span>';}}





function iOlog(x) {
    console.log("isOnline log @ " + new Date().toLocaleTimeString() + ": " + x);}



function time() {
    return Math.floor(Date.now() / 1000);}
