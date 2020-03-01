
var Helper = require('./Helper.js');
var SHA512 = require("crypto-js/sha512");
const Global = require('./Constants.js');
const RequestModule = require('./RequestModule.js');
const Login = require('./Login.js');



var unknown = {
    b: "frmLogin_hbxLgnEntryBlck"
}


set_random_a = function() {
    Global.Vars.a_srp_val = Helper.randomBigInt(32);
     if (Global.Vars.a_srp_val.compareTo(Global.Constants.SRP_N_VAL) >= 0) {
         console.log("## a greater than GlobalConstants.SRP_N_VAL");
         Global.Vars.a_srp_val = Global.Vars.a_srp_val.mod(Global.Constants.SRP_N_VAL.subtract(Global.Constants.SRP_ONE_VAL))
     }
     if (Global.Vars.a_srp_val.compareTo(Global.Constants.SRP_TWO_VAL) < 0) {
        Global.Vars.a_srp_val = Global.Constants.SRP_TWO_VAL
     }
    //  return a_srp_val;
 }
 ;
 calculateA = function() {
    var A = null;
     set_random_a();
     if (Global.Vars.a_srp_val != null && Global.Vars.a_srp_val != 0) {
         A = Global.Constants.SRP_G_VAL.modPow(Global.Vars.a_srp_val, Global.Constants.SRP_N_VAL)
     }
     console.log("## a value is " + Global.Vars.a_srp_val.toString());
     console.log("## A value is " + A.toString())
     Global.Vars.A = A;
     return A;
 }

 usernamePassword = () =>{
    var userId = document.getElementById("username").value;
    var pass  = document.getElementById("password").value;

    if (userId.value === "" || pass===""){
        // console.log("username length", userId.length, userId)
        var element = document.createElement("div");
        element.innerHTML = "Please fill the fields.";
        var response = document.getElementById("wrapper")
        response.style.visibility = 'visible';
        response.classList.add("incorrectcredentials");
        response.appendChild(element);
    }
    else if (userId.length !=8 && userId.length !=6 ) {
        console.log("username length", userId.length, userId)
        var element = document.createElement("div");
        element.innerHTML = "ABCD CID must be 6 or 8 digits.";
        var response = document.getElementById("wrapper")
        response.style.visibility = 'visible';
        response.classList.add("incorrectcredentials");
        response.appendChild(element);
        return false;
    }
    
    else return true

}

//reoves the node taht displays messages under the form
removeNodes = async ()=>{
    var removeChild = document.getElementById('wrapper');
    if (removeChild.childNodes[0]){
        console.log("remove this child", removeChild.childNodes[0].className)
        removeChild.removeChild(removeChild.childNodes[0]);
        console.log("done")
    }
    var correct = await usernamePassword();
    return correct;

}

//the function that gets called upon submitting the username and password
 main = async function(){
    if (!await removeNodes()){return}

    console.log("execute main function")
    var object = {};
    object.userID = document.getElementById("username").value;
    object.appVersion = Global.appConfig.appVersion;
    object.A = ""+ calculateA();; //authentication key
    object.step = "1" // do you need it
    object.userIDType = "C";
    object.clientTime = ""+Helper.getCurrentTime();
    var b = Global.Constants.PRE_AUTH;
    var authkey = Global.appConfig.appId + Global.Constants.SERVICE_ID;
    //creates the module that contains the encryption
    var Module = new RequestModule(Global.Constants.SERVICE_ID, object,Login.updateUserCallback, Login.LoginErrCallback, Global.Constants.ALERT_INACTIVE,unknown.b, Global.Constants.AUTH_STEP.PRE_AUTH)
    //adds headers and then sends it to the servers
    Module.invokeServer();
}

//form submission calls teh function
var button = document.getElementById('form-submission'); // add id="my-button" into html
button.addEventListener('click',   ()=>{button.onsubmit = main()});
