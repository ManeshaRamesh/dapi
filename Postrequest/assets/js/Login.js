var Cryptography = require('./Cryptography')
const Global = require('./Constants.js');
var BigInteger = require('jsbn').BigInteger;
const RequestModule = require('./RequestModule.js');

module.exports = {
 //this is teh callback function after the first post request and begins preparing the second post request
    updateUserCallback : function(b,g,f){ 
        var h = "";
        var e = "";
        var a = "";
        console.log("## login  service success for A update with response " + JSON.stringify(b));
        if (b != null && b != "" && b.s != null && b.s != "") {
            Global.Vars.gSalt = b.s;
            a = Cryptography.calculateX();
            if (b.timeDiffInMillis != null && b.timeDiffInMillis != "") {
                serverTimeDiffValue = b.timeDiffInMillis;
            }
            if (b.B != null && b.B != "") {
                h = new BigInteger(b.B)
            }
            if (b.u != null && b.u != "") {
                e = new BigInteger(b.u)
            }
            calculateS(f.loadDiv, h, e, a)
        } else {
            console.log("response does not have b")
        }
    }
    ,
    updateLoginErrCallback : function(){return}, 

   

    
}






