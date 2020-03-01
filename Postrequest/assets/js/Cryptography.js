var AesUtil = require('./Aesutil.js');
var CryptoJS = require('crypto-js');
var Helper = require('./Helper')
// const Login = require('./Login.js');

var SHA512 = require("crypto-js/sha512");
var SHA1 = require("crypto-js/sha1");
var MD5 = require("crypto-js/md5");
var SHA256 = require("crypto-js/sha256");


module.exports = {
    Encrypt : function(object, authentication_hashed){
        if (Global.Constants.IS_ENCRYPT_REQ) {
            var object = object;
           console.log("beforEncryption:::::::::PassPhrase" + authentication_hashed + " ::::: PlainText " + object);
            var AesutilModule = new AesUtil(Global.Constants.ENCRYPT_KEY_SIZE,Global.Constants.ENCRYPT_ITER_COUNT);
            var a = Global.Vars.enc_salt;
            var h = a.length;
            var encrypted_result = "";
            if (h % 2 != 0) {
                a = "0" + a
            }
            encrypted_result = AesutilModule.encrypt(a, Global.Constants.ENCRYPT_IV, authentication_hashed, object);
            console.log("after Encryption:::::::::" + encrypted_result);
            return encrypted_result
        } else {
            return object
        }

    }, 
    Decrypt : function (h, f){
        if (Global.Constants.IS_ENCRYPT_REQ) {
            try {
                console.log("beforDEcryption:::::::::" + h);
                //uses the aesutil library for encryption and decryption
                var g = new AesUtil(Global.Constants.ENCRYPT_KEY_SIZE,Global.Constants.ENCRYPT_ITER_COUNT);
                var a = Global.Vars.enc_salt;
                var l = a.length;
                var b = "";
                if (l % 2 != 0) {
                    a = "0" + a
                }
                b = g.decrypt(a, Global.Constants.ENCRYPT_IV, f, h);
                console.log("after DEcryption:::::::::" + b);
                return b
            } catch (e) {
                console.log("Exception while Decrypting the data : " + e)
            }
        } else {
            return h
        }

    }, 
    //generates authentication key
    generateAuthKey : function(e, a){
        var b = "";
        var f = "";
        if (a == Global.Constants.AUTH_STEP.PRE_AUTH) {
            f = Global.Constants.CONSTANT_APP_ID.toUpperCase() + e
        } else {
                if (a == Global.Constants.AUTH_STEP.POST_AUTH) {
                    f = Global.Vars.enc_key + e
                }
           
        }
        //encryption algorithm sha512
        b = (""+ createHash("SHA512",f)).toUpperCase();
        console.log("Cryptography: ## " + e + " key is " + b);
        return b
    }, 
    //encrypts the username and password for the second post request
    calculateX :  function() {
        var e = document.getElementById("username").value.trim();
        // if (kony.string.equalsIgnoreCase("N", frmLogin.radbtnUserIdType.selectedKey)) {
        //     e = e.toUpperCase()
        // }
        var g = document.getElementById("password").value.trim();
        var m = ("" + createHash("md5", g)).toUpperCase();
        var b = ("" + createHash("sha512", m)).toUpperCase();
        var h = ("" + createHash("sha512",(e + ":" + b))).toUpperCase() ;
        var l = Global.Vars.gSalt + h;
        var a = "";
        a = ("" + createHash("sha512", l)).toUpperCase();;
        var f = Helper.parseBigInt(a, 16);
        if (f.compareTo(Global.Constants.SRP_N_VAL) < 0) {
            a = f
        } else {
            a = f.mod(Global.Constants.SRP_N_VAL.subtract(Global.Constants.SRP_ONE_VAL))
        }
        // console.log("CalculateX returns", a)
        return a
    }
    

}


createHash = function(type, target){
    var encryptedtarget;
    var d;
    if (typeof (target) != "string") {
        console.log("Cryptography Error: target must be a string")
    }
    try {
        switch (type.toLowerCase()) {
        case "md5":
            encryptedtarget = MD5(target);
            break;
        case "sha256":
            encryptedtarget = SHA256(target);
            break;
        case "sha1":
            encryptedtarget = SHA1(target);
            break;
        case "sha512":
            encryptedtarget = SHA512(target);
            break;
        default:
            encryptedtarget = {
                errcode: 101,
                errmessage: "unsupported encryption algorithm"
            };
            break
        }
        return encryptedtarget
    } catch (c) {
        return {
            errcode: 102,
            errmessage: "unknown  error"
        }
    }

}


calculateS = function(e, m, b, h) {
    var l = m;
    var f = b;
    var a = h;
    var g = "";
    g = srp_compute_client_S(l, a, f, Global.Vars.a_srp_val, Global.Constants.SRP_K_VAL);
    console.log("## S value is " + g);
    Global.Vars.K_srp_val = ("" + createHash("sha512",g.toString())).toUpperCase() ;
    calculateM1(e, l)
}


srp_compute_client_S = function(m, b, g, e, f) {
    var l = "";
    var h = "";
    if (m != null && b != null && g != null && e != null && f != null) {
        l = Global.Constants.SRP_G_VAL.modPow(b, Global.Constants.SRP_N_VAL);
        h = m.add(Global.Constants.SRP_N_VAL.multiply(f)).subtract(l.multiply(f)).mod(Global.Constants.SRP_N_VAL);
        return h.modPow(b.multiply(g).add(e), Global.Constants.SRP_N_VAL)
    }
}

calculateM1 = function(a, e) {
    var b = Global.Vars.A.toString() + e.toString() + Global.Vars.K_srp_val;
    Global.Vars.M1_srp_val = ("" + createHash("sha512",b)).toUpperCase() ;
    updateM1toServer(a)
}

updateM1toServer  =  function(e) {
    var f = {};
    var b = "";
    var a = null;
    f.clientTime = "" + getClientTimeWithDiff();
    f.M1 = "" + Global.Vars.M1_srp_val;
    f.step = "2";
    b = "frmLogin_hbxLgnEntryBlck";
    a = new RequestModule(Global.Constants.SERVICE_ID,f,updateM1Callback,null,Global.Constants.ALERT_INACTIVE,b,Global.Constants.AUTH_STEP.PRE_AUTH);
    a.loadDiv = e;

    console.log("HERE HERE HERE")
    a.invokeServer()
}

updateM1Callback  =  function(){
    return null;
}

getClientTimeWithDiff = function(){
    var f = "";
    var a = serverTimeDiffValue;
    var e = new Date();
    var b = e.getTime();
    if (b != null && b != "" && a != null && a != "") {
        f = parseInt(b) + parseInt(a)
    }
    return f
    
    }