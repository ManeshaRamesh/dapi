# PostRequest
Login using a postrequest.

#### In order to this application, run the following commands in order: 
1. npm install. 

2. npm run build

3. npm run start


#### On chrome navigate to https://localhost:3000/

#### NOTES:

In order to implement a login page for ADCB Personal Internet Banking, in teh code I send two postrequests. The first one encrypts the username. The second one encrypts the username and password. 
 
 The first postrequest successfully returns the an object with {opstatus: "0",  ...}. This indicates that the retrieval of information from teh server was successful. Infromation returned in teh first post request is then used to build the encrypted content of the second postrequest. However, for some reason the request always returns teh following object: {"opstatus: "1"}.

 I am confident that I encrypted everything correctly. I suspect that the proxy server (https://cors-anywhere.herokuapp.com/) that I am using to add the Access-Control-Allow-Origin headers to my requests could be causing issues. If that were indeed the case, then first posterequest should be causing problems as well. 

 Although the application is not complete and it does not return an identity object, it does successfully make post requests to the adcb servers. 


