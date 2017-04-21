iOlog("isOnline started");
stop = 0;
try {localuser = document.documentElement.innerHTML.substring(document.documentElement.innerHTML.search("username")+10,document.documentElement.innerHTML.search("username")+100).match(/\'(.*)\'/).pop();main();}
catch(err) {document.onreadystatechange = function(){if(document.readyState === 'complete'){localuser = document.getElementsByClassName("profile-name")[0].innerHTML;main();}}}

function main() {

    if (window.location.href.startsWith("https://scratch.mit.edu/isonline-extension/verify")) {
        stop = 1;
        document.documentElement.innerHTML = "<center><h1 style='font-family:verdana';>Validating...</h1></center>";
        test = new XMLHttpRequest();test.open("GET", ' https://scratchtools.tk/isonline/api/v1/' + localuser + '/' + location.hash.substring(1) + "/test/", true);test.send();
        test.onreadystatechange = function() {
            if (test.readyState === 4 && test.responseText.includes("true")) {
                localStorage.setItem("iOuser", localuser);
                localStorage.setItem("iOkey", location.hash.substring(1));
                document.documentElement.innerHTML = "<center><h1 style='font-family:verdana; color:green'>Successfully validated your Scratch account. isOnline is now working. <br>You can close this tab.</h1></center>";}
            if (test.readyState === 4 && test.status === 404) {
                document.documentElement.innerHTML = "<center><h1 style='font-family:verdana; color:red'>An error occurred. Please contact <a href='https://scratch.mit.edu/users/chooper100#comments'>@chooper100</a> if you come from isOnline account validation.</h1></center>";}}}

    if (localStorage.getItem("iOuser") === null) {
        stop = "User didn't validate any account.";
        try{isError();}catch(err){}didntValidate();}

    if (localuser != localStorage.getItem("iOuser") && localStorage.getItem("iOuser") !== null) {
        stop = "User validated another account.";
        try{isError();}catch(err){}unvalidatedAcc();}

    if(stop!==0){console.error("isOnline error: "+stop);return;}

    url = window.location.href;
    user = window.location.href.substring(30,100).substring(0, window.location.href.substring(30,100).indexOf('/'));
    key = localStorage.getItem("iOkey");
    iOlog("Profile: " + user);
    iOlog("Local username: " + localuser);

    setTimeout(function () {
        absent();
        setInterval(absent, 10000);
    }, 240000);


    if (time()-localStorage.getItem("iOlastOn") > 10) {
        onlinerequest = new XMLHttpRequest();
        onlinerequest.open("POST", 'https://scratchtools.tk/isonline/api/v1/' + localuser + '/' + key + '/set/online', true);
        onlinerequest.send();
        localStorage.setItem("iOlastOn", time());
        iOlog("Sent online request");}


    if (url.substring(24,29) == 'users' && (url.match(/\//g) || []).length == 5 ) {
        iOlog("Detected user is in a profile");

        document.getElementsByClassName("location")[0].innerHTML = document.getElementsByClassName("location")[0].innerHTML + ' | <p style="display:inline" id="iOstatus">Loading status...</p>';

        if (localuser.toUpperCase() == user.toUpperCase()) {iOlog("Detected user is their own profile");isOnline();} else {status();}}




} // main function







































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
            var status = JSON.parse(response).status;
            if (status=="incorrect key") { stop = "Key was changed";keyWasChanged();}
            if (status=="bot") { stop = "User is a bot";isBot();}
        }

        if (getstatus.readyState === 4 && getstatus.status === 500) {isError();}


    } // on ready


}

function absent() {
    if (time()-localStorage.getItem("iOlastOn") > 240 && time()-localStorage.getItem("iOlastAbs") > 120 && stop == 0) {
        absentrequest = new XMLHttpRequest();
        absentrequest.open("POST", 'https://scratchtools.tk/isonline/api/v1/' + localuser + '/' + key + '/set/absent', true);
        absentrequest.send();
        localStorage.setItem("iOlastAbs", time());
        iOlog("Sent away request");
    }}

function isOnline() {
    iOlog("Detected that the user is online");
    document.getElementById("iOstatus").innerHTML = '<img src="https://scratchtools.tk/isonline/assets/online.svg" height="12" width="12"> <span style="color:green"> <b>Online</b></h5>';}

function isOffline() {
    iOlog("Detected that the user is offline");
    document.getElementById("iOstatus").innerHTML = '<img src="https://scratchtools.tk/isonline/assets/offline.svg" height="12" width="12"> <span style="color:red"> <b>Offline</b></span>';}

function isAbsent() {
    iOlog("Detected that the user is away");
    document.getElementById("iOstatus").innerHTML = '<img src="https://scratchtools.tk/isonline/assets/absent.svg" height="12" width="12"><span style="color:orange"> <b>Away</b></soan>';}

function noiO() {
    iOlog("Detected that the user didn't install isOnline");
    document.getElementById("iOstatus").innerHTML = '<span title="This user has to install isOnline in order to show their status">Not iO user</span>';}

function isError() {
    try { document.getElementById("iOstatus").innerHTML = '<span title="Error getting the status. Read the orange box above">Error</span>';} catch(err){
        document.getElementsByClassName("location")[0].innerHTML = document.getElementsByClassName("location")[0].innerHTML + ' | <span title="Error getting the status. Read the orange box above">Error</span>';}}

function didntValidate() { try{
    if(document.getElementsByClassName("confirm-email banner")[0].style.display!="none"){return;}
    document.getElementsByClassName("confirm-email banner")[0].style.display = "block";document.getElementsByClassName("confirm-email banner")[0].style.color = "black";
    document.getElementsByClassName("confirm-email banner")[0].innerHTML = "<span>Whoops! Looks like you didn't validate your account on isOnline. isOnline won't work until you <a href='https://scratchtools.tk/isonline/register' target='blank' >validate your account</a>.</span> It takes around 20 seconds.";}catch(err){}}

function unvalidatedAcc() { document.onreadystatechange = function(){if(document.readyState === 'complete'){if(window.location.href.includes("users")){
    if(document.getElementsByClassName("confirm-email banner")[0].style.display!="none"){return;}
    document.getElementsByClassName("confirm-email banner")[0].style.display = "block";document.getElementsByClassName("confirm-email banner")[0].style.color = "black";
    document.getElementsByClassName("confirm-email banner")[0].innerHTML = "<span>Whoops! Looks like you didn't validate isOnline on the account you are using now, so it's not working. If needed, login to " + localStorage.getItem("iOuser") + ", or unregister it by <a href='https://scratchtools.tk/isonline/register' target='blank'>registering " + localuser + " instead</a>.  <a onclick='document.getElementsByClassName(\"confirm-email banner\")[0].style.display = \"none\";'>X</span>";}}}}

function keyWasChanged() { document.onreadystatechange = function(){if(document.readyState === 'complete'){
    console.error("isOnline error: Key was changed");
    if(document.getElementsByClassName("confirm-email banner")[0].style.display!="none"){return;}
    document.getElementsByClassName("confirm-email banner")[0].style.display = "block";document.getElementsByClassName("confirm-email banner")[0].style.color = "black";
    document.getElementsByClassName("confirm-email banner")[0].innerHTML = "<span>Whoops! There's an error with isOnline. This may ocurr if you installed iO on another computer. iO can only work at one computer at the same time. You can use isOnline on this computer by <a href='https://scratchtools.tk/isonline/register' target='blank'>re-validating</a>. <a onclick='document.getElementsByClassName(\"confirm-email banner\")[0].style.display = \"none\";'>X</span>";}}}

function isBot() { document.onreadystatechange = function(){if(document.readyState === 'complete'){
    console.error("isOnline error: User is bot");
    if(document.getElementsByClassName("confirm-email banner")[0].style.display!="none"){return;}
    document.getElementsByClassName("confirm-email banner")[0].style.display = "block";document.getElementsByClassName("confirm-email banner")[0].style.color = "black";
    document.getElementsByClassName("confirm-email banner")[0].innerHTML = "<span>Whoops! It looks like you've been marked as a bot. Please contact <a href='https://scratch.mit.edu/users/chooper100/#comments' target='blank'>chooper100</a> to unblock your account. <a onclick='document.getElementsByClassName(&quot;confirm-email banner&quot;)[0].style.display = &quot;none&quot;;'>X</a></span>";}}}

function iOlog(x) {
    if (localStorage.getItem("isonline_logs") === undefined) {return;}
    console.log("isOnline log @ " + new Date().toLocaleTimeString() + ": " + x);}

function time() {return Math.floor(Date.now() / 1000);}

var openregister = false;
if (!localStorage['iO.was.installed']) {
    openregister = true;
    localStorage['iO.was.installed'] = '1';
}

if (openregister) window.open("https://scratchtools.tk/isonline/register");
