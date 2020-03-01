var SecureRandom = require('jsbn').SecureRandom;
var BigInteger = require('jsbn').BigInteger;
var Helper = function (){
    this.use_applet = false;
    this.is_ns4 = (navigator.appName == "Netscape" && navigator.appVersion < "5");
    this.rng = null;
};


Helper.randomBigInt = function(a) {
  if (this.use_applet) {
      if (this.rng == null) {
          window.status = "Initializing random number generator...";
          this.rng = document.applets.bigint.newSecureRandom();
          window.status = "Done"
      }
      return document.applets.bigint(8 * a, this.rng)
  } else {
      if (this.is_ns4) {
          var b = crypto.random(a);
          var f = "";
          for (var e = 0; e < a; ++e) {
              f += hex_byte(b.charCodeAt(e))
          }
          return new BigInteger(f,16)
      } else {
          if (this.rng == null) {
              this.rng = new SecureRandom()
          }
          return new BigInteger(8 * a,this.rng)
      }
  }
}
Helper.parseBigInt = function (b, a) {
  
  if (a == 64) {
      return parseBigInt(b64tob8(b), 8)
  }
  if (b.length == 0) {
      b = "0"
  }
  if (this.use_applet) {
      return document.applets.bigint.newBigInteger(b, a)
  } else {
      return new BigInteger(b,a)
  }
}
 Helper.getCurrentTime = function(){
   var time = new Date().getTime();
   if (time){
     return time;
   } 
   else {
     console.log("shit")
     return null
   }
 }

 Helper.generateRandId = function(a){
    return "ldCrcl" + a + getRandomInt(1, 100) + getCurrentTime()

 }

getCurrentTime = function() {
    var a = new Date().getTime();
    return a
}

getRandomInt = function(b, a) {
    return Math.floor(Math.random() * (a - b + 1)) + b
}



module.exports = Helper;

