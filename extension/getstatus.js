chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.getstatus) {
            statusresult = 0;
            getStatus(request.getstatus[0],request.getstatus[1]);
            var waitforresponse = function(){
                if(statusresult!==0){sendResponse(statusresult);console.log("sent");}
                else{setTimeout(waitforresponse,100);}}
            waitforresponse();
            return true; 
        }
    });


function getStatus(user,lastactivity) {
    console.log(lastactivity);
    getstatus = new XMLHttpRequest();getstatus.open("GET", ' https://scratchtools.tk/isonline/api/v1/' + localuserctx + '/' + keyctx + "/get/" + user, true);getstatus.send();

    getstatus.onreadystatechange = function() {
        if (getstatus.readyState === 4) {
            if (getstatus.status === 200) {

                response  = getstatus.responseText;
                timestamp = JSON.parse(response).timestamp;
                var status = JSON.parse(response).status;

                if (status == "online") {
                    if (time() - timestamp < 270) {
                        statusresult = ["online,green"]} 
                    else{
                        statusresult = ["offline","red"];}
                }

                if (status == "absent") {
                    if (time() - timestamp < 270) {
                        statusresult = ["absent", "orange"];}
                    else{
                        statusresult = ["offline","red"];}
                }

                if (status == "dnd") {
                    if (time() - timestamp < 270) {statusresult = ["dnd", "gray"];} else{statusresult = ["offline","red"];}}

                if (time()-timestamp>604800) {
                    if (lastactivity !== "notimestamp" && !(lastactivity.includes("week") || lastactivity.includes("month") || lastactivity.includes("year"))){statusresult=["unknown"];}}

            } // if 200

            if (getstatus.status === 404) {statusresult = ["noiO"];}

            if (getstatus.status === 403) {
                var status = JSON.parse(getstatus.responseText).status;
                if (status=="incorrect key") {keyWasChanged("n");}
                if (status=="bot") {statusresult = ["isbot"];}
            }

            if (getstatus.status === 500) {/*isError();*/}

        }};

}

function keyWasChanged() {
    chrome.storage.sync.get("iOaccounts", function (data) {
        registeredUsers = data.iOaccounts === undefined ? [] : JSON.parse(data.iOaccounts);
        oldkey = JSON.parse(data.iOaccounts).find(user => user.name === localuserctx).key;
        if(oldkey==keyctx){
            indx = registeredUsers.findIndex(k => k.name === localuserctx);
            chrome.storage.sync.set({"iOaccounts" : JSON.stringify(registeredUsers.slice(0, indx).concat({
                "name": localuserctx,
                "key": "changed"
            }).concat(registeredUsers.slice(indx + 1)))});
        }
        else{location.reload();}
    });
}

function time() {return Math.floor(Date.now() / 1000);}
