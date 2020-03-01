var path = require('path');



var express = require('express'); //including express   
var app = new express(); // Creating instance   
var port = 3000; // setting port for the application   
//Following function is starts sockets and start listen from particular port. In following code I have given call back which contains err. So when port willbe start and listen function will be fire then this function will be execute.   
app.listen(port, function(err) {  
    if (typeof(err) == "undefined") {  
        console.log('Your application is running on : ' + port + ' port');  
    }  
});  

app.use(express.static(__dirname + '/assets')); 
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/assets/index.html'));
});

app.get('/identity/', function(req, res){
    res.sendFile(path.join(__dirname + '/assets/identity.html'));
    //encrypt make a post request to teh adcb server and then decrypt the response
});

