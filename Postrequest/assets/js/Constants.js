var BigInteger = require('jsbn').BigInteger;
var Helper = require('./Helper.js');
module.exports = Global = {
  Constants : {
    ServiceID :{
      SERVICE_CUSTOMER_INFO: "InqCustInformationDetails_Oper"
    },
    SRP_N_VAL:  new BigInteger( "167609434410335061345139523764350090260135525329813904557420930309800865859473551531551523800013916573891864789934747039010546328480848979516637673776605610374669426214776197828492691384519453218253702788022233205683635831626913357154941914129985489522629902540768368409482248290641036967659389658897350067939"), 
    SRP_ONE_VAL: Helper.parseBigInt("1", 16),
    SRP_TWO_VAL: Helper.parseBigInt("2", 16),
    SRP_K_VAL: new BigInteger("-4174333886048273630600358811582879996793440717662458513923749301055011587842"),
    SRP_G_VAL: new BigInteger("2"),
    ENCRYPT_KEY_SIZE: 128,
    ENCRYPT_ITER_COUNT: 1,
    ServiceID :{
      SERVICE_CUSTOMER_INFO: "InqCustInformationDetails_Oper"
    },
    AUTH_SALT: "3FF2EC019C627B945225DEBAD71A01B6985FE84C95A70EB132882F88C0A59A44", 
    ENCRYPT_IV: "F27D5C9927726BCEFE7510B1BDD3D126",
    CONSTANT_APP_ID: "ADCBIB",
    IS_ENCRYPT_REQ: true, 
    ALERT_INACTIVE: 2,
    SERVICE_ID: "authService", 
    SESSIONID: "",
    PLATFORM: "thinclient",
    RCID :  "spadesktopweb",
    URL: "https://online.adcb.com:443/middleware/MWServlet",
    CORS_PROXY: "https://cors-anywhere.herokuapp.com/",
    AUTH_STEP: {
        PRE_AUTH: "pre_auth",
        REGISTER: "register",
        POST_AUTH: "post_auth"
    }
  },

  Vars : {
    SERVICE_CALL_TIME_OUT: 120, 
    enc_key: "",
    enc_salt: "3FF2EC019C627B945225DEBAD71A01B6985FE84C95A70EB132882F88C0A59A44",
    gSalt: null, 
    serverTimeDiffValue: null,
    a_srp_val: null, 
    A: null, 
    M1_srp_val: null

  },
  
  appConfig : {
      appId: "ADCBIB",
      appName: "ADCBIB",
      appVersion: "4.6.2",
      platformVersion: null,
      serverIp: "online.adcb.com",
      serverPort: null,
      secureServerPort: "443",
      url: "https://online.adcb.com/middleware/MWServlet",
      secureurl: "https://online.adcb.com:443/middleware/MWServlet",
      middlewareContext: "middleware"
  }
}
