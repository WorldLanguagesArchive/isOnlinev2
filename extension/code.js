chrome.storage.sync.get(["iOaccounts","iOfriendlist"], function (data) {
    registeredUsers = data.iOaccounts === undefined ? [] : JSON.parse(data.iOaccounts);
    friendList = data.iOfriendlist;
    chrome.runtime.sendMessage({setuninstallurl: typeof(registeredUsers[0])==="undefined"?"undefined":registeredUsers[0]});
    if(location.href == "https://scratch.mit.edu/isonline-extension/update") {
        document.documentElement.innerHTML = "<!DOCTYPE html><html><head><style>body{background: #f0f0f0;margin: 0;}#vcenter{position: absolute;top: 50%;width: 100%;margin-top: -100px;}h1{text-align: center;font-family: trebuchet ms, courier new, sans-serif;font-size: 2em;}#loader,#loader:before,#loader:after{border-radius: 50%;width: 2.5em;height: 2.5em;-webkit-animation-fill-mode: both;animation-fill-mode: both;-webkit-animation: load7 1.8s infinite ease-in-out;animation: load7 1.8s infinite ease-in-out;}#loader{color: #098e8b;font-size: 10px;margin: 80px auto;position: relative;text-indent: -9999em;-webkit-transform: translateZ(0);-ms-transform: translateZ(0);transform: translateZ(0);-webkit-animation-delay: -0.16s;animation-delay: -0.16s;}#loader:before,#loader:after{content: '';position: absolute;top: 0;}#loader:before{left: -3.5em;-webkit-animation-delay: -0.32s;animation-delay: -0.32s;}#loader:after{left: 3.5em;}@-webkit-keyframes load7{0%,80%,100%{box-shadow: 0 2.5em 0 -1.3em;}40%{box-shadow: 0 2.5em 0 0;}}@keyframes load7{0%,80%,100%{box-shadow: 0 2.5em 0 -1.3em;}40%{box-shadow: 0 2.5em 0 0;}}</style></head><body><div id='vcenter'><h1 id='header'>Redirecting to isOnline update page... <br>(please don't close this tab)</h1><div id='loader'></div></div></body></html>";
        window.location="https://isonlineupdate.blogspot.com";
    } // Update
    else{start();}
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.ping) {
            sendResponse({respond: "contentscript"});}
    });

stop = 0;

// Discuss button button and profile
if (localStorage.getItem("iOdiscuss") === "1") {
    try {
        try {
            nav = document.getElementsByClassName("site-nav")[0].innerHTML;
            document.getElementsByClassName("site-nav")[0].innerHTML = nav.replace('<li class="last">', '<li><a href="/discuss">Discuss</a></li><li class="last">');
        } catch (err) {
            document.getElementsByClassName("link tips")[0].outerHTML += '<li class="link about"><a href="/discuss"><span>Discuss</span></a></li>';
        }
    } catch (err) {}
}

// @DiscussButton
if (window.location.href.substring(30, 100).substring(0, window.location.href.substring(30, 100).indexOf('/')).toLowerCase() == "discussbutton" && (location.href.match(/\//g) || []).length == 5) {
    document.getElementsByClassName("box slider-carousel-container prevent-select")[2].remove();
    document.getElementsByClassName("box slider-carousel-container prevent-select")[1].remove();
    document.getElementsByClassName("box slider-carousel-container prevent-select")[0].remove();
    document.getElementsByClassName("group")[0].innerText = "Scratcher (isOnline extra option)";
    stop = "Discuss button page";
    if (localStorage.getItem("iOdiscuss") !== "1") {
        document.getElementsByClassName("location")[0].innerHTML += " | <a id='discussbutton'>Enable</a>";
        document.getElementById("discussbutton").onclick = function() {
            localStorage.setItem("iOdiscuss", "1");
            location.reload();
        };
    } else {
        document.getElementsByClassName("location")[0].innerHTML += " | <a id='discussbutton'>Disable</a>";
        document.getElementById("discussbutton").onclick = function() {
            localStorage.removeItem("iOdiscuss");
            location.reload();
        };
    }
}

/* 'The best extension' easter egg */ if(location.href.toLowerCase().startsWith("https://scratch.mit.edu/search/") && /\?q=the(%20|\+)best\1extension/i.test(location.search)) window.location = "https://scratch.mit.edu/users/isOnlineV2/";

/* Account redirect */				  if(location.href.toLowerCase()==="https://scratch.mit.edu/users/isonline/"){window.location = "https://scratch.mit.edu/users/isOnlineV2/";}

/* Account redirect 2 */			  if(location.href.toLowerCase()==="https://scratch.mit.edu/users/isonline2/"){window.location = "https://scratch.mit.edu/users/isOnlineV2/";}

/* Redirect to comments*/			  if(location.href.substring(location.href.indexOf('?')+1)==="comments#iOc"){location.href=location.href.substring(0, location.href.length - 4);}

// isOnlineV2 profile comments FAQ
if(location.href.toLowerCase().startsWith("https://scratch.mit.edu/users/isonlinev2/")) {
    if(document.getElementById("comments")) {
        let faq = document.getElementById("comments").parentElement.parentElement.children[0];
        let br = document.createElement("BR");
        faq.appendChild(br);
        let br2 = document.createElement("BR");
        faq.appendChild(br2);
        let faqEl = document.createElement("DIV");
        faqEl.innerHTML = "<center>Hello, welcome to the isOnlineV2 comments section! Here, you can ask for help about the extension. Before commenting, please read through this brief FAQ section to ensure your question hasn't been previously addressed. Just click one of the questions below for an expanded answer. <br><br><b>If your question isn't answered below, please do ask in the comments! </b></center>";
        faqEl.style.backgroundColor = "#068dd1";
        faqEl.style.textShadow = "none";
        faqEl.style.color = "white";
        faqEl.style.padding = "10px";
        faqEl.style.borderRadius = "10px";
        faq.appendChild(faqEl);
        let br3 = document.createElement("BR");
        faq.appendChild(br3);
        let faqQuestions = {
            "What does the Do Not Disturb status do?" : "The status displays as a normal status, but from the friend list menu, other people seeing you will think you are Offline. Nobody will get friend list notifications about you when you are on Do Not Disturb.",
            "Can I get the status of somebody when I'm not on their profile?" : "Yes, you can. Right click a link to their profile anywhere on the page, and click 'Click to get status'.",
            "I don't want people knowing when I'm online!" : "You can visit your profile, and next to your location you will see a dropdown menu added by isOnline. Choose your status to be 'Offline' and nobody will find out that you're actually online until you change your status back to Automatic.",
            "I don't want isOnline anymore, how do I get rid of it?" : "We're sorry to see you go. You can uninstall the extension by right clicking on its icon in the top-right corner of the screen and clicking the option that says 'Remove'. You may get a popup asking if you're sure. Click remove.",
            "How do I enable the Discuss Button?" : "You can enable the Discuss button on <a href='https://scratch.mit.edu/users/DiscussButton'>@DiscussButton</a>.",
            "Who runs the account isOnlineV2?" : "<a href='https://scratch.mit.edu/users/World_Languages/'>@World_Languages</a> does, however you can trust a response if it has been done by an iO developer.",
            "Why can't I add people that are not following me to my friends?" : "It would be spammy for popular scratchers if anybody could add them into their friends. Also, if someone is your true friend, they are probably following you. If they aren't, just ask them to do so (;"
        };
        let qSelected = null;
        Object.keys(faqQuestions).forEach(question => {

            let qEl = document.createElement("DIV");
            let div = document.createElement("DIV");
            div.innerHTML = question;
            div.className = "faq-question";
            qEl.className = "faq-both";
            qEl.appendChild(div);
            faq.appendChild(qEl);
            qEl.addEventListener("click", function(e){
                if(e.target.className === "faq-answer") return;
                if(qSelected) qSelected.querySelector(".faq-answer").remove();
                if(qSelected && qSelected === qEl) {
                    qSelected = null;
                    return;
                }
                let answer = document.createElement("DIV");
                answer.className = "faq-answer";
                answer.innerHTML = faqQuestions[question];
                qEl.appendChild(answer);
                qSelected = qEl;
            });
        });
    }
}

// Put code in comment box (verification)
if(location.href.startsWith("https://scratch.mit.edu/studios/4100062/comments/")){

    var code = location.href.substring(location.href.indexOf('?')+1);
    var clickpost = function(){
        setTimeout(function(){document.getElementsByClassName("button small")[0].style.background='red';}, 1000);
        setTimeout(function(){document.getElementsByClassName("button small")[0].style.background='';clickpost();}, 2000);};
    var closetabwhenpost = function(){
        if(document.getElementsByClassName("highlighted")[0]===undefined){setTimeout(closetabwhenpost,100);return;}
        window.close();};

    if((code.length>-1&&code.length<7) && parseInt(code,16).toString(16) === code){
        document.getElementsByName("content")[0].value=code;
        clickpost();closetabwhenpost();
    }

}

let comments = document.getElementById("comments");
let emojis = {
    "online": '<img src="https://scratchtools.tk/isonline/assets/online.svg" alt="_online_" title="_online_" class="easter-egg">',
    "offline": '<img src="https://scratchtools.tk/isonline/assets/offline.svg" alt="_offline_" title="_offline_" class="easter-egg">',
    "dnd": '<img src="https://scratchtools.tk/isonline/assets/dnd.svg" alt="_dnd_" title="_dnd_" class="easter-egg">',
    "away": '<img src="https://scratchtools.tk/isonline/assets/absent.svg" alt="_away_" title="_away_" class="easter-egg">',
    "crown": '<span class="easter-egg" title="_crown_">&#x1F451;</span>',
    "cookie": '<span class="easter-egg" title="_cookie_">&#x1F36A;</span>'
};


trustedDevTeam = ["World_Languages","PackersRuleGoPack", "herohamp", "DatOneLefty"];

// Emojis & iOdev in @isOnlineV2
let handleEmojis = () => {
    Array.from(comments.querySelectorAll(".comment > .info > .content")).forEach(comment => Object.keys(emojis).forEach(emoji => comment.innerHTML = comment.innerHTML.replace(new RegExp("(\\s|^)_" + emoji + "_", "g"), `$1${emojis[emoji]}`)));
    Array.from(comments.querySelectorAll(".comment > .info > .name > a")).filter(user => trustedDevTeam.includes(user.innerHTML)).forEach(user => {
        if(location.href.toLowerCase().startsWith("https://scratch.mit.edu/users/isonlinev2") && user.children.length === 0) {
            let devProof = document.createElement("SPAN");
            devProof.innerHTML = "iO DEV";
            devProof.style.backgroundColor = "green";
            devProof.style.textShadow = "none";
            devProof.style.color = "white";
            devProof.style.padding = "2px";
            devProof.style.borderRadius = "3px";
            devProof.style.marginLeft = "4px";
            user.appendChild(devProof);
        }
    });
};
let domChange = function(records){
    if(records.filter(record => record.target.tagName === "UL" && (record.target.className === "comments" || record.target.className === "replies") && record.addedNodes).length){
        handleEmojis();
    }
};

if(comments) {
    let listenToComments = new MutationObserver(domChange);

    listenToComments.observe(comments, {subtree: true, childList: true});

    handleEmojis();
}

if(location.href.substring(location.href.indexOf('?')+1)==="comments"){
    document.getElementsByClassName("box slider-carousel-container prevent-select")[document.getElementsByClassName("box slider-carousel-container prevent-select").length-1].innerHTML += "<div id='iOc'></div>";
    var iOcomments = function(){if(document.getElementsByClassName("comment ").length>0){
        location.hash="iOc";
        document.getElementsByName("content")[0].focus();
        var shiftenterspan = document.createElement("span");
        shiftenterspan.innerHTML = " <b>"+chrome.i18n.getMessage("shiftenter")+"</b>";
        document.getElementById("main-post-form").getElementsByClassName("control-group")[0].getElementsByClassName("small-text")[0].appendChild(shiftenterspan);
        document.getElementById("main-post-form").getElementsByClassName("control-group")[0].getElementsByTagName("textarea")[0].addEventListener('keydown', function(event) {
            if(event.key==="Enter" && previouskey==="Shift"){
                document.getElementsByName("content")[0].blur();
                document.getElementById("main-post-form").getElementsByClassName("control-group")[1].getElementsByClassName("button small")[0].click();
            }
            previouskey = event.key;
            setTimeout(function(){
                if(previouskey===event.key){previouskey="";}
            },1000);
        });
    }else{setTimeout(iOcomments,100);}};
    iOcomments();
}

// Studio extra options
if(window.location.href.split("/")[5]==="curators" && (document.getElementsByTagName('head')[0].innerHTML.includes("curator: true,")||document.getElementById("show-add-curator"))) {

    studioid = window.location.href.split("/")[4];

    if(document.getElementById("curator-action-bar")) { // If user is a manager in the studio
        var addStudioFunctions = document.createElement("div");
        addStudioFunctions.innerHTML = '<br>&nbsp;&nbsp;&nbsp; <input type="text" style="width:125px" placeholder="Enter a username" id="iOusernameStudioTools"><br>&nbsp;&nbsp;&nbsp; <div class="button grey small" id="iOpromote"><span>Promote</span></div><div class="button grey small" id="iOremove"><span>Remove</span></div><div class="button grey small" id="iOinvite"><span>Invite</span></div> | <div class="button grey small" id="iOleave"><span>Leave studio</span></div><br>&nbsp;&nbsp;&nbsp; <small>Functions added by isOnline. Username isn\'t case sensitive. Actions taken here don\'t update the curator list below until you refresh.</small>';
        document.getElementsByClassName("action-bar white scroll")[0].appendChild(addStudioFunctions);

        document.getElementById("iOpromote").onclick = function(){
            var addscript = document.createElement('script');
            addscript.innerHTML = "var studioid="+studioid+";$.ajax({ type: \"PUT\", url: \"https:\/\/scratch.mit.edu\/site-api\/users\/curators-in\/\" + studioid + \"\/promote\/?usernames=\" + document.getElementById(\"iOusernameStudioTools\").value , }) .done(function(data) { document.getElementById(\"iOusernameStudioTools\").value = \"\"; if(data.length!==8) { document.getElementById(\"iOusernameStudioTools\").placeholder = \"Promoted\"; } else{ document.getElementById(\"iOusernameStudioTools\").placeholder = \"Could not promote\"; } }) .error(function(data) { document.getElementById(\"iOusernameStudioTools\").value = \"\"; document.getElementById(\"iOusernameStudioTools\").placeholder = \"Error\"; });";
            document.getElementsByTagName('body')[0].appendChild(addscript);
        }; //onclick

        document.getElementById("iOremove").onclick = function(){
            var addscript = document.createElement('script');
            addscript.innerHTML = "var studioid="+studioid+";$.ajax({ type: \"PUT\", url: \"https:\/\/scratch.mit.edu\/site-api\/users\/curators-in\/\" + studioid + \"\/remove\/?usernames=\" + document.getElementById(\"iOusernameStudioTools\").value , }) .done(function(data) { document.getElementById(\"iOusernameStudioTools\").value = \"\"; if(data.length!==8) { document.getElementById(\"iOusernameStudioTools\").placeholder = \"Removed\"; } else{ document.getElementById(\"iOusernameStudioTools\").placeholder = \"Could not remove\"; } }) .error(function(data) { document.getElementById(\"iOusernameStudioTools\").value = \"\"; document.getElementById(\"iOusernameStudioTools\").placeholder = \"Error\"; });";
            document.getElementsByTagName('body')[0].appendChild(addscript);
        }; //onclick

        document.getElementById("iOinvite").onclick = function(){
            var addscript = document.createElement('script');
            addscript.innerHTML = "var studioid="+studioid+";$.ajax({ type: \"PUT\", url: \"https:\/\/scratch.mit.edu\/site-api\/users\/curators-in\/\" + studioid + \"\/invite_curator\/?usernames=\" + document.getElementById(\"iOusernameStudioTools\").value , }) .done(function(data) { document.getElementById(\"iOusernameStudioTools\").value = \"\"; if(data.status===\"success\") { document.getElementById(\"iOusernameStudioTools\").placeholder = \"Invited\"; } else{ document.getElementById(\"iOusernameStudioTools\").placeholder = \"Could not invite\"; } }) .error(function(data) { document.getElementById(\"iOusernameStudioTools\").value = \"\"; document.getElementById(\"iOusernameStudioTools\").placeholder = \"Error\"; });";
            document.getElementsByTagName('body')[0].appendChild(addscript);
        }; //onclick

        document.getElementById("iOleave").onclick = function(){
            var addscript = document.createElement('script');
            addscript.innerHTML = "var studioid="+studioid+"; var localuser=\""+localuser+"\"; var leave = confirm(\"Are you sure you want to leave this studio?\"); if(leave===true){ $.ajax({ type: \"PUT\", url: \"https:\/\/scratch.mit.edu\/site-api\/users\/curators-in\/\" + studioid + \"\/remove\/?usernames=\" + localuser , }) .done(function(data) { location.reload(); }) .error(function(data) { document.getElementById(\"iOusernameStudioTools\").value = \"\"; document.getElementById(\"iOusernameStudioTools\").placeholder = \"Error\"; }); } "
            document.getElementsByTagName('body')[0].appendChild(addscript);
        }; //onclick

    } // If manager end

    else { // If user isn't a manager in the studio
        var addStudioFunctions = document.createElement("div");
        addStudioFunctions.innerHTML = '<br><br><div class="button grey small" id="iOleave"><span>Leave studio</span></div><br><small>Function added by isOnline.</small>';
        document.getElementById("tabs").appendChild(addStudioFunctions);

        document.getElementById("iOleave").onclick = function(){
            var addscript = document.createElement('script');
            addscript.innerHTML = "var studioid="+studioid+"; var localuser=\""+localuser+"\"; var leave = confirm(\"Are you sure you want to leave this studio?\"); if(leave===true){ $.ajax({ type: \"PUT\", url: \"https:\/\/scratch.mit.edu\/site-api\/users\/curators-in\/\" + studioid + \"\/remove\/?usernames=\" + localuser , }) .done(function(data) { location.reload(); }) .error(function(data) { document.getElementById(\"iOusernameStudioTools\").value = \"\"; document.getElementById(\"iOusernameStudioTools\").placeholder = \"Error\"; }); } "
            document.getElementsByTagName('body')[0].appendChild(addscript);
        }; //onclick
    }

} // Studio extra options


function main() {

    /* Data for helping page*/ if(location.href.toLowerCase().startsWith("https://scratch.mit.edu/isonline-extension/helpdata")) {stop="On data page";document.documentElement.innerHTML = "<center><h2><b>ONLY give this information to the official isOnline account, @isOnlineV2.</b></h2></center><br><br><small>" + JSON.stringify(localStorage)+ " / " + JSON.stringify(registeredUsers)+ " / " + navigator.userAgent + " / Version: "+JSON.stringify(chrome.runtime.getManifest().version) + "</small>";}

    /* Redirect to verification */ if(location.href.toLowerCase().startsWith("https://scratch.mit.edu/isonline-extension/register")) {window.location = "https://scratchtools.tk/isonline/register/#"+localuser;}

    url = window.location.href;
    user = "";
    onprofile = url.substring(24,29) == 'users' && (url.match(/\//g) || []).length == 5;
    if (onprofile){ user = document.getElementsByClassName("header-text")[0].getElementsByTagName("h2")[0].innerText;iOcrown();}

    if (window.location.href.startsWith("https://scratch.mit.edu/isonline-extension/verify")) {
        stop = "On verification page";
        validateAccount();} // Account validation

    if (registeredUsers.length === 0) {
        stop = "User didn't validate any account.";
        isError();
        showAlert("didnotvalidate");
    }

    if (registeredUsers.findIndex(user => user.name === localuser) === -1 && registeredUsers.length !== 0) {
        stop = "User validated another account.";
        if(user!=="") document.getElementsByClassName("location")[0].innerHTML += ' | <small><a href="https://scratchtools.tk/isonline/register/" target="_blank">'+chrome.i18n.getMessage("validateprofilelink")+'</small>';
        if(time()-localStorage.getItem("iObanner") > 86400){ showAlert("unvalidatedacc");localStorage.setItem("iObanner",time());}
    }

    if(registeredUsers.find(user => user.name === localuser)) {
        key = registeredUsers.find(user => user.name === localuser).key;
        if (key == "changed") {showAlert("keywaschanged");stop="Key was changed";}
    }

    if(stop!==0){console.error("isOnline was stopped: "+stop);return;}

    chrome.runtime.sendMessage({keyinfo: { key, localuser }});

    /* Manage statuses */ update();setInterval(update, 3000);

    if (onprofile) {
        /* Add status box next to location */ document.getElementsByClassName("location")[0].innerHTML += ' | <span style="display:inline" id="iOstatus"></span>';
        if (localuser.toUpperCase() == user.toUpperCase()) {isOwn();} else {
            if(time()-localStorage.getItem("iOlastprofile")>3){status();}else{
                document.getElementById("iOstatus").innerHTML = "<a id='clickforstatus'>"+chrome.i18n.getMessage("clickforstatus")+"</a>";
                document.getElementById("clickforstatus").onclick = status;}
            localStorage.setItem("iOlastprofile", time());
        }
    }

} // main function

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.ctxmenu) {
        iONotify[request.call](request.user, request.content, request.color);
    }
});

let iONotify = {
    setup: function() {
        document.body.appendChild(this.element = document.createElement("DIV"));
        this.element.style.cssText = `
position: fixed;
bottom: 50px;
right: 0px;
background-color: white;
padding: 25px;
color: black;
text-shadow: none;
box-shadow: 0px 0px 3px #333;
z-index: 1000;
font-size: 30px;
font-family: Arial;
`;
        this.user = ""; // Who are we trying to access?
        this.element.style.display = "none"; // no content .. no notification!
    },
    alert: function(user, text, color, autoClose = false) {
        if(this.user) {
            this.close();
        }
        this.element.style.display = "block";
        this.element.innerHTML = "<span style='color: grey;'>" + user + "</span> " + text;
        this.user = user;
        if(autoClose) {
            setTimeout(() => {
                if(this.user === user) {
                    this.close();
                }
            }, 4e3);
        }
    },
    update: function(user, text, color, autoClose = true) {
        if(user !== this.user) return; // Do not update a notification about another user.
        this.element.style.display = "block";
        this.element.innerHTML = user + " <span style='color: " + color + ";'>" + text + "</span>";
        this.user = user;
        if(autoClose) {
            setTimeout(() => {
                if(this.user === user) {
                    this.close();
                }
            }, 4e3);
        }
    },
    close: function(){
        this.user = "";
        this.element.innerHTML = "";
        this.element.style.display = "none";
    }
};

iONotify.setup();




function update() {
    if (stop !== 0 || window.location.href.startsWith("https://scratch.mit.edu/isonline-extension")) {return;}
    if (localstatus() == "online") {
        updateStatus("");}
    //
    if (localstatus() == "absent"){
        updateStatus("orange");}
    //
    if (localstatus() == "dnd") {
        updateStatus("gray");}
    //
    if (localstatus() == "offline") {
        updateStatus("red");}
}



function status() {

    if(stop!==0){return;}

    iOlog("Started status scan");

    document.getElementById("iOstatus").innerHTML=chrome.i18n.getMessage("loadingstatus");

    try{
        var a = document.getElementsByClassName("activity-stream")[0].getElementsByClassName("time")[0].innerText;
    }catch(err){a="notimestamp";}

    chrome.runtime.sendMessage({getstatus: [user,a]}, function (response){
        showStatus(response[0], response[1]);
    });



}

function isOwn(){
    opt = [{"name": chrome.i18n.getMessage("onlineauto"),   "value" : "online",  "color": "green"},
           {"name": chrome.i18n.getMessage("absent"),       "value" : "absent",  "color": "orange"},
           {"name": chrome.i18n.getMessage("dnd"),       "value" : "dnd",  "color": "gray"},
           {"name": chrome.i18n.getMessage("offlineghost"), "value" : "offline", "color": "red"}];

    document.getElementById("iOstatus").innerHTML = '<img id="iostatusimage" src="https://scratchtools.tk/isonline/assets/' + (localstatus() === "ghost" ? "offline" : localstatus()) + '.svg" height="12" width="12">';
    document.getElementById("iOstatus").innerHTML += "<select id='ioselect' style='color: " + opt.find(k => localstatus() === k.value).color + ";'>" + opt.map(k => "<option class='io-option' style='color:" + k.color + ";' " + (k.value === localstatus() ? "selected" : "") +">" + k.name + "</option>") + '</select>'+getInfoHTML(chrome.i18n.getMessage("ownstatushelp"));
    document.getElementById("ioselect").addEventListener("change", changed);
    document.getElementById("ioselect").getElementsByTagName("option")[2].outerHTML += '<optgroup class="io-option-info" label="'+chrome.i18n.getMessage("dndhelp1")+'"></optgroup><optgroup class="io-option-info" label="'+chrome.i18n.getMessage("dndhelp2")+'"></optgroup>';

}


function showStatus(name,color) {
    if(name==="online"||name==="offline"){
        document.getElementById("iOstatus").innerHTML = '<img src="https://scratchtools.tk/isonline/assets/'+name+'.svg" height="12" width="12"> <span id="iOstatustext" style="color:'+color+'">' + chrome.i18n.getMessage(name) + '</span>';}
    if(name==="absent"){
        document.getElementById("iOstatus").innerHTML = '<img src="https://scratchtools.tk/isonline/assets/absent.svg" height="12" width="12"> <span id="iOstatustext" style="color:orange">' + chrome.i18n.getMessage("absent") + '</span> ' + getInfoHTML(chrome.i18n.getMessage("absenthelp"));}
    if(name==="dnd"){
        document.getElementById("iOstatus").innerHTML = '<img src="https://scratchtools.tk/isonline/assets/dnd.svg" height="12" width="12"> <span id="iOstatustext" style="color:gray">' + "Do Not Disturb" + "</span> " + getInfoHTML(chrome.i18n.getMessage("dndotherhelp"));}
    if(name==="noiO"){
        document.getElementById("iOstatus").innerHTML = chrome.i18n.getMessage("notiouser") + " " + getInfoHTML(chrome.i18n.getMessage("noiohelp"));}
    if(name==="error"){
        isError();}
    if(name==="unknown"){
        document.getElementById("iOstatus").innerHTML = chrome.i18n.getMessage("unknown") + " " + getInfoHTML(chrome.i18n.getMessage("unknownhelp"));}
    if(name==="isbot"){
        showAlert("isbot");
        isError();
    }

}

function isError() { try{
    if (user==="DiscussButton") {return;}
    try { document.getElementById("iOstatus").innerHTML = '<span title="Error: ' + stop + '">' + chrome.i18n.getMessage("error") + '</span>';} catch(err){
        document.getElementsByClassName("location")[0].innerHTML += ' | <span title="Error: ' + stop + '">' + chrome.i18n.getMessage("error") + '</span>';}}catch(err){}}

function showAlert(name) {
    if (url.startsWith("https://scratch.mit.edu/isonline-extension") || url.startsWith("https://scratch.mit.edu/studios/4100062/comments/")) {return;}
    var alert = document.createElement("div");
    alert.style="font: 13px arial; z-index: 1; position: absolute; top: 60px; left: 70px; right: 70px; padding: 10px; background-color: #DFF0D8; color: #518847;border-radius: 10px;border: solid 0.5px #C2C7C0;";
    alert.id="iOalert";
    alert.innerHTML = '<span id="iOclosebutton" style="margin-left: 15px;color: black;font-weight: bold;float: right;font-size: 22px;line-height: 20px;cursor: pointer;" onclick="this.parentElement.style.display=\'none\';">&#xD7;</span>'+chrome.i18n.getMessage(name);
    document.body.insertBefore(alert,document.getElementById("pagewrapper"));
}

function iOlog(x) {
    /*console.log("isOnline log @ " + new Date().toLocaleTimeString() + ": " + x);*/}

function updateStatus(color) {
    chrome.runtime.sendMessage({color});
    try {document.getElementsByClassName("user-name dropdown-toggle")[0].style.color=color==="gray"?"lightgray":color;}
    catch(err) {try{document.getElementsByClassName("user-info")[0].style.color=color==="gray"?"lightgray":color;}catch(err){}}
    color = color === "" ? "green" : color;
    if(document.getElementById("ioselect")===null){return;}
    if(localuser===user && document.getElementById("ioselect").style.color !== color){
        document.getElementById("ioselect").selectedIndex = opt.findIndex(k => k.color === color);
        document.getElementById("ioselect").style.color = color;
        document.getElementById("iostatusimage").src = "https://scratchtools.tk/isonline/assets/" + opt.find(k => k.color === color).value + ".svg";}
}

function localstatus(){if(localStorage.getItem("iOstatus")!==null){return localStorage.getItem("iOstatus");}else{return "online";}}

function time() {return Math.floor(Date.now() / 1000);}

function iOcrown() {
    if(trustedDevTeam.findIndex(item => user.toLowerCase() === item.toLowerCase())!=-1 && user!=="isOnlineV2"){
        document.getElementsByClassName("header-text")[0].getElementsByTagName("h2")[0].innerHTML += ' <span title="isOnline team member"><img src="https://scratchtools.tk/isonline/isonline-logo.png" height="20" width="20"></span>';
    }
    if(localuser.toUpperCase() !== user.toUpperCase()) {
        if (document.getElementsByClassName("overview")[0].innerHTML.toLowerCase().includes("#lovecookies") || document.getElementsByClassName("overview")[1].innerHTML.toLowerCase().includes("#lovecookies")) {
            document.getElementsByClassName("header-text")[0].getElementsByTagName("h2")[0].innerHTML += ' <span title="isOnline cookie">🍪</a>';}
    } else {
        if (document.getElementById("bio").innerHTML.toLowerCase().includes("#lovecookies") || document.getElementById("status").innerHTML.toLowerCase().includes("#lovecookies")) {
            document.getElementsByClassName("header-text")[0].getElementsByTagName("h2")[0].innerHTML += ' <span title="isOnline cookie">🍪</a>';}
    }
}

function changed() {document.getElementById("ioselect").style.color=opt[document.getElementById("ioselect").selectedIndex].color;localStorage.setItem("iOstatus", opt[document.getElementById("ioselect").selectedIndex].value);document.getElementById("iostatusimage").src="https://scratchtools.tk/isonline/assets/" +opt[document.getElementById("ioselect").selectedIndex].value+".svg";update();}

function validateAccount(){
    document.documentElement.innerHTML = "<!DOCTYPE html><html><head><style>body{background: #f0f0f0;margin: 0;}#vcenter{position: absolute;top: 50%;width: 100%;margin-top: -100px;}h1{text-align: center;font-family: trebuchet ms, courier new, sans-serif;font-size: 2em;}#loader,#loader:before,#loader:after{border-radius: 50%;width: 2.5em;height: 2.5em;-webkit-animation-fill-mode: both;animation-fill-mode: both;-webkit-animation: load7 1.8s infinite ease-in-out;animation: load7 1.8s infinite ease-in-out;}#loader{color: #098e8b;font-size: 10px;margin: 80px auto;position: relative;text-indent: -9999em;-webkit-transform: translateZ(0);-ms-transform: translateZ(0);transform: translateZ(0);-webkit-animation-delay: -0.16s;animation-delay: -0.16s;}#loader:before,#loader:after{content: '';position: absolute;top: 0;}#loader:before{left: -3.5em;-webkit-animation-delay: -0.32s;animation-delay: -0.32s;}#loader:after{left: 3.5em;}@-webkit-keyframes load7{0%,80%,100%{box-shadow: 0 2.5em 0 -1.3em;}40%{box-shadow: 0 2.5em 0 0;}}@keyframes load7{0%,80%,100%{box-shadow: 0 2.5em 0 -1.3em;}40%{box-shadow: 0 2.5em 0 0;}}</style></head><body><div id='vcenter'><h1 id='header'>" + chrome.i18n.getMessage("validating") + "...</h1><div id='loader'></div></div></body></html>";
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
            document.getElementById("header").innerHTML = "<center><h3 style='color:green'>" + chrome.i18n.getMessage("success") + "</h3></center>";
        } else {
            document.getElementById("loader").style.display = "none";
            document.getElementById("header").innerHTML = "<center><h3 style='color:red'>"+chrome.i18n.getMessage("verifyerror")+"</h3></center>";
        }
        chrome.runtime.sendMessage({friendlist: "refresh"});
    };
}

function start() {
    if(location.href == "https://scratch.mit.edu/isonline-extension/update"){return;}
    if(document.getElementById("project-create")===null) {scratchwwwgetuser();}
    else{
        userget = document.createElement('a');
        userget.id="iOgetuser";
        document.getElementsByTagName('body')[0].appendChild(userget);
        document.getElementById("iOgetuser").style.display = 'none';

        usergetscript = document.createElement('script');
        usergetscript.id="iOgetuserscript";
        document.getElementsByTagName('body')[0].appendChild(usergetscript);
        document.getElementById("iOgetuserscript").innerHTML='document.getElementById("iOgetuser").innerText=Scratch.INIT_DATA.LOGGED_IN_USER.model.username;';

        localuser = document.getElementById("iOgetuser").innerText;
        document.getElementById("iOgetuser").remove();
        if(localuser===""){console.error("isOnline was stopped: logged out.");}else{main();}
    }
}

function scratchwwwgetuser() {
    if(document.getElementsByClassName("profile-name")[0] === undefined) {
        if(document.getElementsByClassName("link right login-item")[0]!==undefined) {
            console.error("isOnline was stopped: logged out.");} else {
                setTimeout(scratchwwwgetuser, 100);}
    } else {
        localuser = document.getElementsByClassName("profile-name")[0].innerText;
        main();}
}

function friendListButtons() {
    try {x = friendList.findIndex(item => user.toLowerCase() === item.toLowerCase());}catch(err){x=-2;}
    if(x===-2 || x===-1) {
        addFriendButton();
    }
    if(x!==-1 && x!==-2) {
        removeFriendButton();
    }

}

function addFriendButton(){
    document.getElementsByClassName("header-text")[0].getElementsByTagName("h2")[0].style.display="inline";
    document.getElementsByClassName("header-text")[0].getElementsByTagName("h2")[0].outerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="addfrienddiv" style="display:inline;vertical-align:top;"><a id="addfriend"><small>+ '+chrome.i18n.getMessage("friends")+'</small></a></span>';
    document.getElementById("addfriend").onclick = function(){
        document.getElementById("addfrienddiv").innerHTML="<small>"+chrome.i18n.getMessage("adding")+"</small>";
        chrome.runtime.sendMessage({addfriend: [user,localuser]}, function (response){
            console.log(response);
            if(response.result=="ok") {document.getElementById("addfrienddiv").remove();removeFriendButton();}
            if(response.result=="maxreached") {document.getElementById("addfrienddiv").innerHTML="<small>"+chrome.i18n.getMessage("maxreached");+"</small"}
            if(response.result=="onlyfollowing") {document.getElementById("addfrienddiv").innerHTML="<small>"+chrome.i18n.getMessage("onlyfollowing")+"</small>";}
        });
    };
}

function removeFriendButton() {
    document.getElementsByClassName("header-text")[0].getElementsByTagName("h2")[0].style.display="inline";
    document.getElementsByClassName("header-text")[0].getElementsByTagName("h2")[0].outerHTML += '<span id="removefrienddiv" style="display:inline;vertical-align:top;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id="removefriend"><small>x '+chrome.i18n.getMessage("friends")+'</small></a></span>';
    document.getElementById("removefriend").onclick = function(){
        chrome.runtime.sendMessage({removefriend: user}, function (response){
            if(response.result=="ok") {document.getElementById("removefriend").remove();addFriendButton();}
        });
    };
}

function getInfoHTML(string) {
    setTimeout(infoAnimation,1000);
    return '<div id="isonline-helpcontainer"><svg id="statushelp" title="'+string+'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path id="statushelp-path" d="M48 41.333C48 45.068 45.068 48 41.333 48H6.667C2.932 48 0 45.068 0 41.333V6.667C0 2.932 2.932 0 6.667 0h34.666C45.068 0 48 2.932 48 6.667z"/><path d="M26.667 36h-5.334V21.333h5.334zm.666-22c0-1.865-1.468-3.333-3.333-3.333-1.865 0-3.333 1.468-3.333 3.333 0 1.865 1.468 3.333 3.333 3.333 1.865 0 3.333-1.468 3.333-3.333" fill="#fff"/></svg><span  style="color:#e8e5e5" id="isonline-helptext"></span></div>';
}

function infoAnimation(){
    var statuscontainer = document.getElementById('isonline-helpcontainer');
    var statushelp = document.getElementById('statushelp');
    var statustext = document.getElementById('isonline-helptext');
    statushelp.onmouseenter = function() {
        // Enter
        statustext.innerText = statushelp.getAttribute('title');
        statustext.style.display = "inline-block";
    };
    statushelp.onmouseleave = function() {
        setTimeout(function() {
            statustext.innerText = "";
            statustext.style.display = "none";
        }, 300);
        // Leave
    };
}
