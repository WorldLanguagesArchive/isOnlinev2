localStorage.setItem("iOlastrequestype","y");
isUserOnScratch();
setInterval(isUserOnScratch,150000);

function isUserOnScratch() {
    tabids = [];
    i = 0;
    chrome.tabs.query({}, function(tabs) {
        var check = function(){
            chrome.tabs.sendMessage(tabs[i].id, {ping: "background"}, function(response) {
                if(response){tabids.push(tabs[i].id);}i++;
                if(i===tabs.length){
                    chrome.tabs.query({active: true}, function(activetab){
                        userisonscratch = tabids.includes(activetab[0].id);
                        setStatus(userisonscratch);
                    });
                }
                else {check();}
            });};
        check();
    });
}

function setStatus(userisonscratch) {
    console.log(userisonscratch);
    if(tabids.length===0 || typeof(keyctx)==="undefined"){return;} // If there are no Scratch tabs open
    if(localStorage.getItem("iOstatus")==="online") {
        if(userisonscratch) {
            if(localStorage.getItem("iOlastrequestype")==="online"){localStorage.setItem("iOlastrequestype","x");return;}
            var request = new XMLHttpRequest();
            request.open("POST", "https://scratchtools.tk/isonline/api/v1/" + localuserctx + "/" + keyctx + "/set/online", true);
            request.send();
            checkResponse(request);
            localStorage.setItem("iOlastrequestype","online");
        } else {
            if(localStorage.getItem("iOlastrequestype")==="absent"){localStorage.setItem("iOlastrequestype","x");return;}
            var request = new XMLHttpRequest();
            request.open("POST", "https://scratchtools.tk/isonline/api/v1/" + localuserctx + "/" + keyctx + "/set/absent", true);
            request.send();
            checkResponse(request);			
            localStorage.setItem("iOlastrequestype","absent");
        }
    }
    if(localStorage.getItem("iOstatus")==="absent") {
        if(localStorage.getItem("iOlastrequestype")==="absent"){localStorage.setItem("iOlastrequestype","x");return;}
        var request = new XMLHttpRequest();
        request.open("POST", "https://scratchtools.tk/isonline/api/v1/" + localuserctx + "/" + keyctx + "/set/absent", true);
        request.send();
        checkResponse(request);
        localStorage.setItem("iOlastrequestype","absent");
    }
    if(localStorage.getItem("iOstatus")==="dnd") {
        if(localStorage.getItem("iOlastrequestype")==="dnd"){localStorage.setItem("iOlastrequestype","x");return;}
        var request = new XMLHttpRequest();
        request.open("POST", "https://scratchtools.tk/isonline/api/v1/" + localuserctx + "/" + keyctx + "/set/dnd", true);
        request.send();
        checkResponse(request);
        localStorage.setItem("iOlastrequestype","dnd");
    }
    if(localStorage.getItem("iOstatus")==="offline"){/*Do nothing*/}
}

function checkResponse(request) {
    request.onreadystatechange = function() {if (request.readyState === 4){
        if (request.status !== 200) {
            var result = JSON.parse(request.responseText).result;
            if (result=="incorrect key") {keyWasChanged();}
        }}};}