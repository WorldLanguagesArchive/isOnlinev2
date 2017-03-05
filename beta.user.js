// ==UserScript==
// @name         isOnline TESTING V2
// @namespace    http://isonline.cf/
// @version      0.1.0
// @description  Know who is online on Scratch!
// @author       @World_Languages with help from @JuegOStrower and alpha testers
// @match        https://scratch.mit.edu/*
// @icon         https://raw.githubusercontent.com/WorldLanguages/isOnline/master/green%20cat.png
// ==/UserScript==

console.log("Userscript started");

var url = window.location.href;
var user = window.location.href.substring(30,100).substring(0, window.location.href.substring(30,100).indexOf('/'));
var localuser = Scratch.INIT_DATA.LOGGED_IN_USER.model.username;
iOlog("Possible username: " + user);
iOlog("Local username: " + user);

if (localStorage.getItem("iOlastAbs") == null) {
    localStorage.setItem("iOlastAbs", 0);}

var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", 'https://scratchtools.tk/isonline/api/v1/' + localuser + '/set/online', true);
xmlhttp.send();
localStorage.setItem("iOlastOn", time());


setTimeout(function () {
    absent();
    setInterval(absent, 10000);
}, 24000);




window.addEventListener('load', function () {

    iOlog("Detected that page finished loading");


    if (url.substring(24,29) == 'users' && (url.match(/\//g) || []).length == 5 ) {
        iOlog("Detected user is in a profile");
        if (localuser.toUpperCase() == user.toUpperCase()) {
            iOlog("Detected user is their own profile");
            isOnline();}
        else {
            status();}}


});


















//FUNCTIONS

function status() {

    iOlog("Started status scan");

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {


        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {

            var response  = xmlhttp.responseText;
            var parsedData = JSON.parse(response);
            var timestamp = parsedData.timestamp;
            var status = parsedData.status;

            if (status == "online") {
                if (time() - timestamp < 300) {isOnline();} else{isOffline();}}

            if (status == "absent") {
                if (time() - timestamp < 180) {isAbsent();} else{isOffline();}}

        }

        if (xmlhttp.readyState === 4 && xmlhttp.status === 404) {noiO();}

    }

    xmlhttp.open("GET", 'https://scratchtools.tk/isonline/api/v1/' + user + '/get', true);
    xmlhttp.send();

}












function absent() {
    iOlog("absent() started");

    if (time()-localStorage.getItem("iOlastOn") > 240 && time()-localStorage.getItem("iOlastAbs") > 120) {
        iOlog("Sent absent request");
        var xmlHttp = new XMLHttpRequest();
        xmlhttp.open("GET", 'https://scratchtools.tk/isonline/api/v1/' + localuser + '/set/absent', true);
        xmlhttp.send();
        localStorage.setItem("iOlastAbs", time());
    }}






function isOnline() {
    iOlog("Detected that the user is online");
    document.getElementsByClassName("location")[0].innerHTML = document.getElementsByClassName("location")[0].innerHTML + " | " + '<img src="https://raw.githubusercontent.com/WorldLanguages/isOnline/master/online%20skype.png" height="16" width="16"> <h4><font color="green">Online</font></h4>';}

function isOffline() {
    iOlog("Detected that the user is offline");
    document.getElementsByClassName("location")[0].innerHTML = document.getElementsByClassName("location")[0].innerHTML + " | " + '<img src="https://raw.githubusercontent.com/WorldLanguages/isOnline/master/offline%20skype.png" height="16" width="16"> <h4><font color="red">Offline</font></h4>';}

function isAbsent() {
    iOlog("Detected that the user is absent");
    document.getElementsByClassName("location")[0].innerHTML = document.getElementsByClassName("location")[0].innerHTML + " | " + '<img src="https://raw.githubusercontent.com/WorldLanguages/isOnline/master/absent%20skype.png" height="16" width="16"> <h4><font color="Orange">Absent</font></h4>';}

function noiO() {
    iOlog("Detected that the user didn't install isOnline, stopped status finding until page is refreshed");
    document.getElementsByClassName("location")[0].innerHTML = document.getElementsByClassName("location")[0].innerHTML + " | " + document.getElementsByClassName("location")[0].innerHTML + ' | <span title="This user has to install isOnline in order to show their status">Not iO user</span>';}





function iOlog(x) {
    console.log(time() + ": " + x);}



function time() {
    return Math.floor(Date.now() / 1000);}
