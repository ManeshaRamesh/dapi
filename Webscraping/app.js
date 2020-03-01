const readline = require('readline');
const puppeteer = require('puppeteer');
const Profile = require('./assets/Profile.js');
const Constants = require('./assets/Constants.js');
const Flag = require('./assets/Flags.js');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})


//function ot get username
const Username = () => {
  return new Promise((resolve, reject) => {
    rl.question('Username: ', (answer) => {
      resolve(answer)
    })
  })
}


//function to get password
const Password = () => {
  return new Promise((resolve, reject) => {
    rl.question('Password: ', (answer) => {
    //   console.log(${answer}`)
      resolve(answer)
    })
  })
}


//iterates over the keys of the virtual keyboard and stores the ids and the values in a javascript object
getVirtualKeyboardObject = () => {
  var buttons = [];

  var rows = [];
  var childNodeList = document.getElementById("frmLogin_vbox156810424052897").childNodes;
  //iterates over teh rows
  for (var i = 0; i < childNodeList.length; i++){
    
    var row = childNodeList[i.toString()].childNodes['0'].childNodes['0'];
    
    rows.push({
      id : row.id, 
      innerText: row.innerText
    }); 
    //for each key per ow
    for (var j = 0; j < row.childNodes.length; j++){
      // console.log("Key",j);
      var key = row.childNodes[j.toString()].childNodes['0'];
      // console.log("Key variable", key);
      if (key){
        if (key.value != " " || key.value !=undefined){ //only store if the key has a value
          //json object that stored the id the and teh value
          buttons.push({
            parent: row.id,
            id : key.id, 
            value: key.value
          });
        }
    }
    }
   
  }

  return buttons;  //return the object
}


const main = async () => {
//get username anf password and store it in profile

  await Username().then((username)=>{
        Profile.username =  username;
  })
  await Password().then((password)=>{
      Profile.password = password
  })
  rl.close()
  // console.log(Profile);

  

  let url = 'https://online.adcb.com/ADCBIB/kdw#_frmLogin'; //the url where you login
  let browser = await puppeteer.launch(
    {headless: false, slowMo: 10}
  );//launches browser
  let page = await browser.newPage(); //page obejct
  page.on('console', msg => console.log('PAGE LOG:', msg.text())); //for print statements


    await page.goto(url, {waitUntil:'networkidle2'});
    Object.assign(global, {browser, page});
    await page.waitForSelector(Constants.USERNAME_SELECTOR); //waits for the html element to load
    // console.log("HERE2");
    // await page.click(Constants.USERNAME_SELECTOR);
    // console.log("Entered username")
    // await page.keyboard.type(Profile.username);
    await page.type(Constants.USERNAME_SELECTOR, Profile.username) //enter username in the input box
    // await page.screenshot({path: 'EnteredUsername.png'}); //to debug
    await page.waitForSelector(Constants.PASSWORD_SELECTOR); //waits for the password selector to load
    await page.click(Constants.PASSWORD_SELECTOR); //to enable the virtual keyboard
    // await page.screenshot({path: 'EnteredPassword.png'});

    var hello = await page.evaluate(getVirtualKeyboardObject); //gets the ids and values from teh virtual keyboard

    var passwordCharArray = Profile.password.split(''); //converts the password input into a char array
    // console.log("array");
    for (var l = 0; l < passwordCharArray.length ; l++){
      if (passwordCharArray[l].toUpperCase() !== passwordCharArray[l].toLowerCase()){ //if it is a letter
        if (passwordCharArray[l] !== passwordCharArray[l].toUpperCase()){ //if not uppercase
          // console.log(passwordCharArray[l], "LOWERCASE")
          if (Flag.CAPSLOCK){ //if capslock is on, turn it off and load teh keyboard again
            await page.waitForSelector(Constants.VIRTUAL_KEYBOARD.CAPSLOCK_SELECTOR,  { visible: true });
            await page.click(Constants.VIRTUAL_KEYBOARD.CAPSLOCK_SELECTOR); //click on capslock 
            // await page.evaluate(()=>document.querySelector(Constants.VIRTUAL_KEYBOARD.CAPSLOCK_SELECTOR).click())
            Flag.CAPSLOCK = 0;
            hello = await page.evaluate(getVirtualKeyboardObject); //load new object
          }
          //search for the selector that has the correct value
          for (var ele = 0; ele < hello.length ; ele++){ //search through object and find letter
            if (hello[ele].value === passwordCharArray[l]){
              // console.log("The selector: ", hello[ele].id,  hello[ele].value, passwordCharArray[l] );
              await page.waitForSelector('#frmLogin_vbox156810424052897',  { opacity: 1});
              // console.log("yes")
              await page.waitForSelector('#'+hello[ele].id,  { visible: true });
              // console.log("yessss")

              await page.click('#'+hello[ele].id);
              break;
            }
          }
        }
        else{ //if letter is upper case
          // console.log(passwordCharArray[l], "UPPERCASE")
          if (!Flag.CAPSLOCK){
            await page.waitForSelector(Constants.VIRTUAL_KEYBOARD.CAPSLOCK_SELECTOR,  { visible: true });
            await page.click(Constants.VIRTUAL_KEYBOARD.CAPSLOCK_SELECTOR); //click on capslock 
            // await page.evaluate(()=>document.querySelector(Constants.VIRTUAL_KEYBOARD.CAPSLOCK_SELECTOR).click())
            Flag.CAPSLOCK = 1;
            hello = await page.evaluate(getVirtualKeyboardObject); //load new object

          }
          for (var ele = 0; ele < hello.length ; ele++){ //search through object and find letter
            if (hello[ele].value === passwordCharArray[l]){
              // console.log("The selector: ", hello[ele].id,  hello[ele].value, passwordCharArray[l] );
              await page.waitForSelector('#frmLogin_vbox156810424052897',  { opacity: 1});
              await page.waitForSelector('#'+hello[ele].id,  { visible: true });
              await page.click('#'+hello[ele].id); //click on teh button once found
              // await page.waitForNavigation();
              // await page.evaluate(()=>document.querySelector('#'+hello[ele].id).click())

              break;
            }
          }
        }
    }
    else{
      // console.log(passwordCharArray[l], "SPECIAL CHARACTER")

      for (var ele = 0; ele < hello.length ; ele++){ //search through object and find letter
        if (hello[ele].value === passwordCharArray[l]){
          // console.log("The selector: ", hello[ele].id,  hello[ele].value, passwordCharArray[l] );
          await page.waitForSelector('#frmLogin_vbox156810424052897',  { opacity: 1});
          await page.waitForSelector('#'+hello[ele].id);
          await page.click('#'+hello[ele].id); //click on teh button once found
          // await page.waitForNavigation();
          // await page.evaluate(()=>document.querySelector('#'+hello[ele].id).click())
          break;
        }
      }

    }
 
    }
    await page.waitForSelector(Constants.SUBMIT);

    await page.click(Constants.SUBMIT); //submit after entering username and password
 
    await page.waitForNavigation();
    // await page.waitForResponse(response => response.status() === 200);

    if (page.url() ==='https://online.adcb.com/ADCBIB/kdw#_frmLogout'){
      console.log("navigated")
      // await page.waitForSelector(Constants.INVLAID_CREDENTIALS_SELECTOR);

        // })
     }
    
    await page.screenshot({path: 'loggedIn.png'});

    await browser.close();
    console.log("close")

}

main()