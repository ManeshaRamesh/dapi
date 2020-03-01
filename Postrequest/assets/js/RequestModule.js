var Cryptography = require('./Cryptography')
const Global = require('./Constants.js');
var Helper = require('./Helper.js');



module.exports = RequestModule = function(m, g, f, l, h, a, b){
    var moduleObj = this;
    this.isAlertReq = h;
    this.serviceID = m;
    this.divID = a;
    this.loadDiv =  Helper.generateRandId(m);
    this.inSuccessCallback = f;
    this.inErrorCallback = l;
    this.tag = {};
    this.params = {};
    this.isForceReq = false;
    this.perfItem = null;
    this.parameters = g;
    this.isSetToCache = false;
    this.doFetchFromLocal = false;

    if (b == Global.Constants.AUTH_STEP.POST_AUTH) {
        if (g.menuId == null || g.menuId == "") {
            console.log("No Menu Id passed for service  " + m)
        } else {
            if (g.menuId == "-1") {
                console.log("Menu Id passed as -1  for service " + m)
            }
        }
    }
    //encryption happens here
    this.mkey = Cryptography.generateAuthKey(m, b);
    this.params.data = Cryptography.Encrypt(JSON.stringify(g), Cryptography.generateAuthKey(m, b));
    
    console.log("The encrypted data: ",this.params.data)
    //adds headers to the request
    this.invokeServer = function(){
        var o = {};
        var p = false;
        // try {
            o.serviceID = moduleObj.serviceID;
            o.AppID = Global.Constants.CONSTANT_APP_ID;
            o.httpheaders = {};
            o.httpconfig = {
                timeout: Global.Vars.SERVICE_CALL_TIME_OUT
            };
            if (this.params != null) {
                for (var r in this.params) {
                    if (this.params.hasOwnProperty(r)) {
                        var n = "" + r;
                        o[n] = this.params[r]
                    }
                }
            }

            console.log("Need to add HTTP headers", o)
            //check if network is available

            var s = addHTTPHeaders(o, moduleObj.callFnback)
    // }


}

this.callFnback = function(r, D) {
    var C = "We are unable to carry out your instructions currently. Please try later."
    var p = "";
    var q = {};
    var s = {};
    var v = {};
    var y = Cryptography.generateAuthKey(m, b);
    if (r == 400) {
        // NetworkQueueObj.getInstance().removeFromQueue(e);
        console.log(">>>>>>>> result for service " + m + " : " + JSON.stringify(D));
        if (D.hasOwnProperty("header")) {
            var o = D.header;
            if (o != null && o.length > 0) {
                if (o[0] != null && o[0].hasOwnProperty("returnCode")) {
                    var n = o[0]["returnCode"];
                    if (n != null && n != "0") {
                        // e.showNetworkLoadingHandler(false);
                        console.log("Return code Non zero");
                        return
                    }
                }
            }
        }
        if (moduleObj.serviceID == Global.Constants.ServiceID.SERVICE_CUSTOMER_INFO) {
            Global.Vars.accSumLoadInProgress = false
        } else {
            if (moduleObj.serviceID == Global.Constants.ServiceID.SERVICE_INSURANCE_PORTFOLIO_ACCTS_REQUEST) {
                Global.Vars.accSumBancAssurance = false
            }
        }
        var text = "";
        var title = " <div class = 'col' >XHR response <br>"; 
        if (D.opstatus !=null){
            if (D.opstatus == 0){
                if (D.results != null && D.results.length > 0 && D.results[0]["data"] != null) {
                    q = Cryptography.Decrypt(D.results[0]["data"], y);
                    // try {
                        q = JSON.parse(q)
                        
                        text = title + JSON.stringify(q)
                        var element = document.getElementById("wrapper")
                        element.style.visibility = "visible";
                        element.style['overflow-wrap'] =  "break-word";
                        element.innerHTML = text + "</div>";
                        moduleObj.sCallback(q, m, moduleObj)
                }

            }
            else {
                if (D.opstatus == 3){
                    if (D.results != null && D.results.length > 0 && D.results[0]["data"] != null) {
                        q = Cryptography.Decrypt(D.results[0]["data"], y);
                        // try {
                            q = JSON.parse(q)
                            
                            text = title + JSON.stringify(q)
                            var element = document.getElementById("wrapper")
                            element.style.visibility = "visible";
                            element.style['overflow-wrap'] =  "break-word";

                            element.innerHTML = text + "</div>";
                            moduleObj.sCallback(q, m, moduleObj)
                    }

                }
                text = title + JSON.stringify(D);
                
                var element = document.getElementById("wrapper");
                element.style.visibility = "visible";
                element.style['overflow-wrap'] =  "break-word";
                element.innerHTML = text + "</div>";
            }
        }
    } else {
        if (r == 300) {
            // NetworkQueueObj.getInstance().removeFromQueue(e);
            // e.showNetworkLoadingHandler(false);
            // logoutIfReqOrHandleError(q, e, D, C, y);
            return
        }
    }
}
this.sCallback = function(n, o){
    if (moduleObj.inSuccessCallback != null) {
        moduleObj.inSuccessCallback(n, o, moduleObj)
    }  
}

}

sethttpheaders =  function(data_object, header) {
    var d = [], e, a = 0;
    for (var b in header) {
        if (header.hasOwnProperty(b) && header[b]) {
            e = header[b] ? header[b] : "";
            d.push(b);
            console.log("sethttpheaders: key: " + b + "value: " + e);
            data_object.setRequestHeader(b, e)
        }
    }
    return d
}

//adds more headers
addHTTPHeaders = function(requestObject, callback){ //appmiddlewaresecureinvokerasync
    var serverUrl = Global.appConfig.secureurl;
    requestObject.appID = Global.appConfig.appId;
    requestObject.appver = Global.appConfig.appVersion;
    requestObject.channel = "wap";
    requestObject.platform =  Global.Constants.PLATFORM;
    requestObject["JSESSIONID"] = Global.Constants.SESSIONID;

    console.log("added http headers", requestObject)
    var e = invokeServiceAsync(serverUrl, requestObject, callback);
    return e
}

//the encodes the body of the request
encodedataparams =  function(d) {
    var b = "", c;
    console.log()
    for (var a in d) {
        if (d.hasOwnProperty(a) && a != "httpheaders") {
            c = d[a];
            console.log("postdataparams:key  = " + a + "  value  =  " + c);
            b += a + "=" + encodeURIComponent(c);
            b += "&"
        }
    }
    return b
}

//takes care of making the post request
invokeServiceAsync =  function(s, u, g, r, c, j) {
    var o = 0;
    var m = null;
    var t = j || 60000;
    var v = window.location.protocol + "//" + window.location.host;
    var l = "";
    var a = "";
    var b = 1;

    var url = Global.Constants.CORS_PROXY + Global.Constants.URL; //adding cors proxy to adde cross-origin access
    var f= "middleware";
    u.rcid = "spadesktopweb"
    // }
    var p = u && u.httpheaders;
    var encodedData = encodedataparams(u);
    console.log("invokeServiceAsync: URL: " + s); //
    console.log("invokeServiceAsync: Args are: " + encodedData);
    console.log("middleware origin: " + a);
    console.log("location origin: " + v);
 
    var timeoutObj = u && u.httpconfig;
    if (timeoutObj && timeoutObj.timeout && !isNaN(timeoutObj.timeout)) {
        t = parseInt(timeoutObj.timeout) * 1000
    }

    //object with relevent details of teh request
    var d = {
        type: "POST",
        url: url, //important
        timeout: t,
        paramstr: encodedData, //important
        callback: g,
        info: r || null
    };
    if (c && typeof c != "undefined" && "GET".toLowerCase() === c.toLowerCase()) {
        d.type = "GET";
        d.url = d.url + "?" + e
    }
    console.log("invokeServiceAsync: options: " + d);
    // kony.system.activity.increment();
    return (function n() {
        function i(C, z, A, B) {
        }

        //craetes xhr request
        var x = false;
        var w = new XMLHttpRequest();
        w.open(d.type, d.url, true);
        w.onLoaded = function() {
            if (this.userCancelled) {
                console.log(" onLoaded: on Abort Mission");
                this.onAbort()
            } else {
                i(d.callback, 100, null)
            }
        }
        ;
        w.onInteractive = function() {
            if (this.userCancelled) {
                console.log(" onInteractive: on Abort Mission");
                this.onAbort()
            } else {
                if (!this.firstByte) {
                    this.firstByte = true;
                    i(d.callback, 200, null)
                }
            }
        }
        ;
        w.onAbort = function(z) {
            console.log(" onInteractive: <- Abort Mission");
            if (this.userCancelled) {
                this.userCancelled = false;
                this.ignoreCallback = true;
                m = {
                    opstatus: 1,
                    errcode: 1022,
                    errmsg: "Request cancelled by user"
                };
                i(d.callback, 300, m);
                console.log(" onInteractive: Abort Mission Success")
            }
            console.log(" onInteractive: -> Abort Mission")
        }
        ;
        w.onTimeout = function() {
            if (w.userCancelled) {
                w.onAbort()
            } else {
                x = true;
                m = {
                    opstatus: 1,
                    errcode: 1014,
                    errmsg: "Request timed out"
                };
                i(d.callback, 400, m)
            }
        }
        ;
        w.onreadystatechange = function() {
            switch (!this.ignoreCallback && w.readyState) {
            case 1:
                console.log("onreadystatechange: ReadyState 1");
                w.onLoaded(w);
                break;
            case 2:
                console.log("onreadystatechange: ReadyState 2");
                w.onInteractive(w);
                break;
            case 3:
                console.log("onreadystatechange: ReadyState 3");
                w.onAbort(w);
                break;
            case 4:
                console.log("onreadystatechange: ReadyState 4");
                if (!x) {
                    w.onComplete(w);
                    w = null
                }
                break;
            default:
                console.log("onreadystatechange: ReadyState Invalid: " + w.readyState)
            }
        }
        ;

        //after response is received
        w.onComplete = function(A) {
            window.clearTimeout(A.timeoutid);
            console.log("status: " + A.status + "readystate: " + A.readyState + "res: " + A.response);
            this.firstByte = false;
            if (this.userCancelled) {
                console.log(" onComplete: on Abort Mission");
                this.onAbort();
                return
            }
            if (A.status == 200) { //if post requets is succesful
                if (A.responseText && A.responseText.length > 0) {
                    m = A.responseText;
                    try {
                        // if (IndexJL == 1) {
                        //     m = $KU.convertjsontoluaobject(m)
                        // } else {
                            m = JSON.parse(m)
                        // }
                    } catch (z) {
                        console.log("errcode: 1013, Invalid JSON string - Unable to parse the returned JSON from server");
                        m = {
                            opstatus: "1",
                            errcode: "1013",
                            errmsg: "Middleware returned invalid JSON string",
                            response: m
                        }
                    }
                } else {
                    console.log("errcode: 1013, Invalid JSON string");
                    m = {
                        opstatus: "1",
                        errcode: "1013",
                        errmsg: "Middleware returned invalid JSON string"
                    }
                }
            } else {
                if (A.status == 0 || A.status == 12200 || (/5+/.test(A.status.toString()) == true)) {
                    if (typeof navigator.onLine !== "undefined" && !navigator.onLine) {
                        console.log("errcode: 1011, Device has no WIFI or mobile connectivity. Please try the operation after establishing connectivity.");
                        m = {
                            opstatus: 1,
                            errcode: "1011",
                            errmsg: "Device has no WIFI or mobile connectivity. Please try the operation after establishing connectivity."
                        }
                    } else {
                        console.log("errcode: 1012, Request Failed");
                        m = {
                            opstatus: 1,
                            errcode: "1012",
                            errmsg: "Request Failed"
                        }
                    }
                } else {
                    if (/4+/.test(A.status.toString()) == true) {
                        console.log("errcode: 1015, Cannot find host");
                        m = {
                            opstatus: 1,
                            errcode: "1015",
                            errmsg: "Cannot find host"
                        }
                    } else {
                        if (A.responseText != "") {
                            console.log("Status != 200 but response exists");
                            m = A.responseText
                        } else {
                            console.log("Empty response received.")
                        }
                    }
                }
            }
            d.callback( 400, m, d.info);
        }
        ;
        w.timeoutid = setTimeout(w.onTimeout, d.timeout);
        //add more headesr
        if (typeof (p) == "object") {
            if (d.url.indexOf("/spa") > 0) {
                w.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                var y = p["Content-Type"];
                if (typeof y != "undefined") {
                    delete p["Content-Type"]
                }
            } else {
                if (typeof p["Content-Type"] == "undefined") {
                    p["Content-Type"] = "application/x-www-form-urlencoded"
                }
            }
            d.httpheaders = sethttpheaders(w, p);
            if (d.httpheaders.length > 0 && d.url.indexOf("/spa") > 0) {
                if (typeof y != "undefined") {
                    d.httpheaders["Content-Type"] = y
                }
                d.paramstr = d.paramstr + "kCustomHeaders=" + d.httpheaders
            }
        }
        if ("POST".toLowerCase() === (d.type).toLowerCase()) {
            w.send(d.paramstr) //make that post request
        } else {
            w.send()
        }
        return w
    }
    )();
}